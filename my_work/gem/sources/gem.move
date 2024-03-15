module gem::gem {
    use sui::tx_context::{Self,TxContext};
    use sui::transfer::public_transfer;
    use sui::object::{UID, new};
    use sui::package::claim_and_keep;

    struct GEM has drop {}

    struct Gem has key, store {
        id: UID,
        weight: u64,
        rarity: u64
    }

    fun init(w: GEM, ctx: &mut TxContext) {
        claim_and_keep(w, ctx);
        public_transfer(Gem { id: new(ctx), weight: 120, rarity: 9000 }, tx_context::sender(ctx));
    }
}