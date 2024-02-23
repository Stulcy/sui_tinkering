module hot_potato::kramper {
    use sui::tx_context::{TxContext};
    use sui::object::{Self, UID};
    use std::string::{Self, String};
    
    struct Kramper {}

    struct Reward has key {
        id: UID,
        message: String
    }

    public fun get_kramper(): Kramper {
        Kramper {}
    }

    public fun return_kramper(kramper: Kramper, ctx: &mut TxContext): Reward {
        Kramper {} = kramper;
        Reward {
            id: object::new(ctx),
            message: string::utf8(b"Kramper delivered.")
        }
    }

    #[test]
    public fun test_kramper_flip() {
        use sui::tx_context::{Self};
        use sui::transfer::{Self};

        let ctx = tx_context::dummy();
        let kramper = get_kramper();

        let reward = return_kramper(kramper, &mut ctx);
        
        std::debug::print(&reward.message);

        transfer::transfer(reward, @0xCAFE);
    }
}