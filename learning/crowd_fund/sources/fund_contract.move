module crowd_fund::fund_contract {
  use sui::object::{Self, UID, ID};
  use sui::transfer;
  use sui::tx_context::{Self, TxContext};
  use sui::coin::{Self, Coin};
  use sui::balance::{Self, Balance};
  use sui::sui::SUI;
  use sui::event;
  use SupraOracle::SupraSValueFeed::{get_price, OracleHolder};

  const ENotFundOwner: u64 = 0;

  struct Fund has key {
    id: UID,
    target: u64,
    raised: Balance<SUI>
  }

  struct Receipt has key {
    id: UID,
    amount_donated: u64,
  }

  struct FundOwnerCap has key {
    id: UID,
    fund_id: ID,
  }

  struct TargetReached has copy, drop {
    raised_amount_sui: u128,
  }

  public entry fun create_fund(target: u64, ctx: &mut TxContext) {
    let fund_uid = object::new(ctx);
    let fund_id: ID = object::uid_to_inner(&fund_uid);

    let fund = Fund {
        id: fund_id,
        target,
        raised: balance::zero(),
    };

    transfer::transfer(FundOwnerCap {
        id: object::new(ctx),
        fund_id: fund_id,
    }, tx_context::sender(ctx));

    transfer::share_object(fund);
  }
}