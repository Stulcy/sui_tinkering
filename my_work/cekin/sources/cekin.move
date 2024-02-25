module cekin::cekin {
    use std::option;
    use sui::transfer::{Self};
    use sui::coin::{Self};
    use sui::tx_context::{Self,TxContext};

    struct CEKIN has drop {}

    fun init(cekin: CEKIN, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(cekin, 9, b"CKN", b"Cekin", b"Store of value", option::none(), ctx);
        transfer::public_freeze_object(metadata);
        coin::mint_and_transfer(&mut treasury, 1000000000000, tx_context::sender(ctx), ctx);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }
}

