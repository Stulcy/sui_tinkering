module onchain_rpg::hero {
    use sui::coin::{Self, Coin};
    use sui::event;
    use sui::object::{Self, ID, UID};
    use sui::math;
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::option::{Self, Option};

    const MAX_HP: u64 = 1000;
    const MAX_MAGIC: u64 = 10;
    const MIN_SWORD_COST: u64 = 100;
    const EBOAR_WON: u64 = 0;
    const EINSUFFICIENT_FUNDS: u64 = 3;
    const ENO_SWORD: u64 = 4;

    struct Hero has key, store {
        id: UID,
        hp: u64,
        experience: u64,
        sword: Option<Sword>,
        game_id: ID,
    }

    struct Sword has key, store {
        id: UID,
        magic: u64,
        strength: u64,
        game_id: ID,
    }

    struct Potion has key, store {
        id: UID,
        potency: u64,
        game_id: ID,
    }

    struct Boar has key {
        id: UID,
        hp: u64,
        strength: u64,
        game_id: ID,
    }

    struct GameInfo has key {
        id: UID,
        admin: address,
    }

    struct GameAdmin has key {
        id: UID,
        boars_created: u64,
        potions_created: u64,
        game_id: ID,
    }

    struct BoarSlainEvent has copy, drop {
        slayer_address: address,
        hero: ID,
        boar: ID,
        game_id: ID,
    }

    fun init(ctx: &mut TxContext) {
        create(ctx);
    }

    public entry fun new_game(ctx: &mut TxContext) {
        create(ctx);
    }

    fun create(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let game_id = object::uid_to_inner(&id);

        transfer::freeze_object(GameInfo {
            id,
            admin: sender
        });

        transfer::transfer(
            GameAdmin {
                game_id,
                id: object::new(ctx),
                boars_created: 0,
                potions_created: 0,
            }, sender
        )
    }

    public entry fun slay(
        game: &GameInfo, hero: &mut Hero, boar: Boar, ctx: &TxContext
    ) {
        check_id(game, hero.game_id);
        check_id(game, boar.game_id);

        let Boar { id: boar_id, strength: boar_strength, hp, game_id: _ } = boar;
        let hero_strength = hero_strength(hero);
        let boar_hp = hp;
        let hero_hp = hero.hp;

        while (boar_hp > hero_strength) {
            boar_hp = boar_hp - hero_strength;
            assert!(hero_hp >= boar_strength , EBOAR_WON);
            hero_hp = hero_hp - boar_strength;

        };

        hero.hp = hero_hp;
        hero.experience = hero.experience + hp;

        if (option::is_some(&hero.sword)) {
            level_up_sword(option::borrow_mut(&mut hero.sword), 1)
        };

        event::emit(BoarSlainEvent {
            slayer_address: tx_context::sender(ctx),
            hero: object::uid_to_inner(&hero.id),
            boar: object::uid_to_inner(&boar_id),
            game_id: id(game)
        });

        object::delete(boar_id);
    }

    public fun hero_strength(hero: &Hero): u64 {
        if (hero.hp == 0) {
            return 0
        };

        let sword_strength = if (option::is_some(&hero.sword)) {
            sword_strength(option::borrow(&hero.sword))
        } else {
            0
        };

        (hero.experience * hero.hp) + sword_strength
    }

    fun level_up_sword(sword: &mut Sword, amount: u64) {
        sword.strength = sword.strength + amount
    }

    public fun sword_strength(sword: &Sword): u64 {
        sword.magic + sword.strength
    }

    public fun heal(hero: &mut Hero, potion: Potion) {
        assert!(hero.game_id == potion.game_id, 403);
        let Potion { id, potency, game_id: _ } = potion;
        object::delete(id);
        let new_hp = hero.hp + potency;
        hero.hp = math::min(new_hp, MAX_HP)
    }

    public fun equip_sword(hero: &mut Hero, new_sword: Sword): Option<Sword> {
        option::swap_or_fill(&mut hero.sword, new_sword)
    }

    public fun remove_sword(hero: &mut Hero): Sword {
        assert!(option::is_some(&hero.sword), ENO_SWORD);
        option::extract(&mut hero.sword)
    }

    public fun create_sword(
        game: &GameInfo,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ): Sword {
        let value = coin::value(&payment);
        assert!(value >= MIN_SWORD_COST, EINSUFFICIENT_FUNDS);
        transfer::public_transfer(payment, game.admin);

        let magic = (value - MIN_SWORD_COST) / MIN_SWORD_COST;
        Sword {
            id: object::new(ctx),
            magic: math::min(magic, MAX_MAGIC),
            strength: 1,
            game_id: id(game)
        }
    }

    public entry fun acquire_hero(
        game: &GameInfo, payment: Coin<SUI>, ctx: &mut TxContext
    ) {
        let sword = create_sword(game, payment, ctx);
        let hero = create_hero(game, sword, ctx);
        transfer::transfer(hero, tx_context::sender(ctx))
    }

    public fun create_hero(
        game: &GameInfo, sword: Sword, ctx: &mut TxContext
    ): Hero {
        check_id(game, sword.game_id);
        Hero {
            id: object::new(ctx),
            hp: 100,
            experience: 0,
            sword: option::some(sword),
            game_id: id(game)
        }
    }

    public entry fun send_potion(
        game: &GameInfo,
        potency: u64,
        player: address,
        admin: &mut GameAdmin,
        ctx: &mut TxContext
    ) {
        check_id(game, admin.game_id);
        admin.potions_created = admin.potions_created + 1;

        transfer::transfer(
            Potion { id: object::new(ctx), potency, game_id: id(game) },
            player
        )
    }

    public entry fun send_boar(
        game: &GameInfo,
        admin: &mut GameAdmin,
        hp: u64,
        strength: u64,
        player: address,
        ctx: &mut TxContext
    ) {
        check_id(game, admin.game_id);
        admin.boars_created = admin.boars_created + 1;
        transfer::transfer(
            Boar { id: object::new(ctx), hp, strength, game_id: id(game) },
            player
        )
    }

    public fun check_id(game_info: &GameInfo, id: ID) {
        assert!(id(game_info) == id, 403);
    }

    public fun id(game_info: &GameInfo): ID {
        object::id(game_info)
    }
}