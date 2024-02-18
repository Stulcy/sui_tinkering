module car::car {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use car::car_admin::AdminCapability;

    struct Car has key {
        id: UID,
        speed: u8,
        acceleration: u8,
        handling: u8
    }

    fun new(speed: u8, acceleration: u8, handling: u8, ctx: &mut TxContext): Car {
        Car {
            id: object::new(ctx),
            speed,
            acceleration,
            handling
        }
    }

    public entry fun create(_: &AdminCapability, speed: u8, acceleration: u8, handling: u8, ctx: &mut TxContext) {
        let car =  new(speed, acceleration, handling, ctx);
        transfer::transfer(car, tx_context::sender(ctx));
    }

    public entry fun transfer(car: Car, recipient: address) {
        transfer::transfer(car, recipient);
    }

    public fun get_stats(self: &Car): (u8, u8, u8) {
        (self.speed, self.handling, self.acceleration)
    }

    public entry fun upgrade_speed(self: &mut Car, amount: u8) {
        self.speed = self.speed + amount;
    }
}