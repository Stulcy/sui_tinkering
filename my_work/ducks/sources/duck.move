module ducks::duck {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;

    struct Duck has key, store {
        id: UID,
        head: u8,
        body: u8,
        wings: u8
    }

    struct DuckMintCap has key { id: UID}

    fun init(ctx: &mut TxContext) {
        transfer::transfer(DuckMintCap {id: object::new(ctx)}, tx_context::sender(ctx));
    }

    public entry fun mint(_: &DuckMintCap, recipient: address, ctx: &mut TxContext) {
        let duck = Duck {
            id: object::new(ctx),
            head: 1,
            body: 1,
            wings: 1
        };
        transfer::public_transfer(duck, recipient);
    }

    public fun burn(duck: Duck) {
        let Duck { id, head: _, body: _, wings: _ } = duck;
        object::delete(id);
    }

    public entry fun transfer(duck: Duck, recipient: address) {
        transfer::public_transfer(duck, recipient);
    }
}