module event_emitter::event_emitter {
    use sui::event::{emit};

    struct EAllClear has copy, drop {}

    struct EDanger has copy, drop {}

    struct EDefenseMode has copy, drop {}

    public fun emitAllClear() {
        emit(EAllClear {});
    }

    public fun emitDanger() {
        emit(EDanger {});
    }

    public fun emitDefenseMode() {
        emit(EDefenseMode {});
    }
}