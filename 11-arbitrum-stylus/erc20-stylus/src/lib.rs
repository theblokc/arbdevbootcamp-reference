// Only run this as a WASM if the export-abi feature is not set.
#![cfg_attr(not(feature = "export-abi"), no_main)]
mod erc20;

extern crate alloc;

/// Initializes a custom, global allocator for Rust programs compiled to WASM.
#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

use crate::erc20::ERC20;
use erc20::ERC20Params;
/// Import the Stylus SDK along with alloy primitive types for use in our program.
use stylus_sdk::{
    alloy_primitives::{
        U256,
        Address
    }, 
    msg, prelude::*
};

pub struct TokenParams;

impl ERC20Params for TokenParams {
    const NAME: &'static str = "Rust Stylus ERC20 Token";
    const SYMBOL: &'static str = "RSTSTYL20";
}

// Define the entrypoint as a Solidity storage object, in this case a struct
// called `RustStylus20Token` with a borrowed set of properties from erc20 struct. The sol_storage! macro
// will generate Rust-equivalent structs with all fields mapped to Solidity-equivalent
// storage slots and types.
sol_storage! {
    #[entrypoint]
    pub struct RustStylus20Token{
        #[borrow]
        ERC20<TokenParams> erc20;
    }
}

// Define methods for RustStylus20Token while inheriting properties and methods from ERC20 struct
#[external]
#[inherit(ERC20<TokenParams>)]
impl RustStylus20Token {
    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.erc20.total_supply().unwrap())
    }

    pub fn balance_of(&self) -> Result<U256, Vec<u8>> {
        Ok(self.erc20.balance_of(msg::sender()).unwrap())
    }

    pub fn mint(&mut self, to: Address, amount: u64) -> Result<bool, Vec<u8>> {
        let _ = self.erc20._mint(
            to, 
            U256::from(10*(amount).pow(self.erc20.decimals().unwrap())));
        Ok(true)
    }
}
