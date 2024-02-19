module intro_df::intro_df {
    use sui::object::{UID};
    use sui::dynamic_field as field;
    use sui::dynamic_object_field as ofield;

    struct Parent has key {
        id: UID
    }

    struct DFChild has store {
        count: u64
    }

    struct DOFChild has key, store {
        id: UID,
        count: u64
    }

    public fun add_dfchild(parent: &mut Parent, child: DFChild, name: vector<u8>) {
        field::add(&mut parent.id, name, child);
    }

    public entry fun add_dofchild(parent: &mut Parent, child: DOFChild, name: vector<u8>) {
        ofield::add(&mut parent.id, name, child);
    }
}