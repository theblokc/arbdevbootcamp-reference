use alloy_primitives::Address;
use alloy_sol_types::{sol, SolError};
use core::marker::PhantomData;
use stylus_sdk::{alloy_primitives::U256,evm, msg, prelude::*};

// Solidity equivalent constructor properties are declared as a rust trait
pub trait ERC20Params { 
  const NAME: &'static str;
  const SYMBOL: &'static str;
}

// Define a solidity equivalent ERC20 here.
// Where T is a parameter of ERC20 Params which can be used later in our own token contracts
// Phantom Data is used as a temporary placements for our generic type to prevent compile time errors due to unused generic.
sol_storage! {
  pub struct ERC20<T: ERC20Params> {
    uint256 total_supply;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;
    PhantomData<T> phantom;
  }
}

// Declare solidity equivalent events and errors here
sol! {
  event Transfer(address indexed from, address indexed to, uint256 amount);
  event Approval(address indexed owner, address indexed spender, uint256 amount);

  error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed);error ERC20InvalidSender(address sender);
  error ERC20InvalidReceiver(address receiver);
  error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
  error ERC20InvalidApprover(address approver);
  error ERC20InvalidSpender(address spender);
}

// Declaration of Rust equivalent ERC20 Errors.
pub enum ERC20Error {
  ERC20InsufficientBalance(ERC20InsufficientBalance),
  ERC20InvalidSender(ERC20InvalidSender),
  ERC20InvalidReceiver(ERC20InvalidReceiver),
  ERC20InvalidApprover(ERC20InvalidApprover),
  ERC20InvalidSpender(ERC20InvalidSpender),
  ERC20InsufficientAllowance(ERC20InsufficientAllowance)
}

// We extend Vec<u8>, a standard for Rust Error Types to our ERC20 Errors.
// This will be used later on for our ERC20 methods which will have a Rust return type of Result<T, E> where T is a successful result value and E is our fired ERC20 Error
impl From<ERC20Error> for Vec<u8> {
  fn from(val: ERC20Error) -> Self {
      match val {
          ERC20Error::ERC20InsufficientBalance(err) => err.encode(),
          ERC20Error::ERC20InvalidSender(err) => err.encode(),
          ERC20Error::ERC20InvalidReceiver(err) => err.encode(),
          ERC20Error::ERC20InvalidApprover(err) => err.encode(),
          ERC20Error::ERC20InvalidSpender(err) => err.encode(),
          ERC20Error::ERC20InsufficientAllowance(err) => err.encode()
      }
  }
}

// Implementation of Solidity equivalent OpenZeppelin's ERC20 internal methods.
// Rust compiler can tell this is consists of internal methods because there is no #[external] attribute macro.
impl <T: ERC20Params> ERC20<T> {
  pub fn _transfer(&mut self, from: Address, to: Address, amount: U256) -> Result<(), ERC20Error> {
    if from == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidSender(
        ERC20InvalidSender { sender: Address::ZERO }
      ))
    }
    if to == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidReceiver(
        ERC20InvalidReceiver { receiver: Address::ZERO })
      )
    }

    let _ = self._update(from, to, amount);
    Ok(())
  }

  pub fn _update(&mut self, from: Address, to: Address, amount: U256) -> Result<(), ERC20Error> {
    if from == Address::ZERO {
      self.total_supply.set(self.total_supply.get() + amount)
    } else {
      let mut from_setter = self.balances.setter(from);
      let from_balance = from_setter.get();
      if from_balance < amount {
        return Err(ERC20Error::ERC20InsufficientBalance(
          ERC20InsufficientBalance { sender: from, balance: amount, needed: amount - from_balance}
        ))
      }
      from_setter.set(from_balance - amount);
    }

    if to == Address::ZERO {
      self.total_supply.set(self.total_supply.get() - amount);
    } else {
      let mut to_setter = self.balances.setter(to);
      let to_balance = to_setter.get();
      to_setter.set(to_balance + amount);
    }

    evm::log(
      Transfer {
        from,
        to,
        amount
      }
    );
    Ok(())
  }

  pub fn _mint(&mut self, account: Address, amount: U256) -> Result<(), ERC20Error> {
    if account == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidReceiver(
        ERC20InvalidReceiver { receiver: account }
      ));
    }
    let _ = self._update(Address::ZERO, account, amount);
    Ok(())
  }

  pub fn _burn(&mut self, account: Address, amount: U256) -> Result<(), ERC20Error> {
    if account == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidReceiver(
        ERC20InvalidReceiver { receiver: account }
      ));
    }

    let _ = self._update(account, Address::ZERO, amount);
    Ok(())
  }

  pub fn _approve(&mut self, owner: Address, spender: Address, amount: U256) -> Result<bool, ERC20Error> {
    if owner == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidApprover(
        ERC20InvalidApprover { approver: owner }
      ))
    }
    if spender == Address::ZERO {
      return Err(ERC20Error::ERC20InvalidSpender(
        ERC20InvalidSpender { spender }
      ))
    }
    self.allowances.setter(msg::sender()).insert(spender, amount);
    evm::log(
      Approval {
        owner,
        spender,
        amount
      }
    );
    Ok(true)
  }

  pub fn _spend_allowance(&mut self, owner: Address, spender: Address, amount: U256) -> Result<(), ERC20Error> {
    let current_allowance = self.allowances.getter(owner).get(spender);
    if current_allowance != U256::MAX {
      if current_allowance < amount {
        return Err(ERC20Error::ERC20InsufficientAllowance(
          ERC20InsufficientAllowance { 
            spender, 
            allowance: current_allowance, 
            needed: amount - current_allowance
          }
        ))
      }
      let _ = self._approve(owner, spender, amount);
    }
    Ok(())
  }
 }
 
 
// Implementation of Solidity equivalent OpenZeppelin's ERC20 internal methods.
// With #[external] macro declared for this impl, these methods are open to be inherited/used by other contracts
 #[external]
 impl <T: ERC20Params> ERC20<T> {
  pub fn name(&self) -> Result<String, Vec<u8>> {
    Ok(T::NAME.into())
  }

  pub fn symbol(&self) -> Result<String, Vec<u8>> {
    Ok(T::SYMBOL.into())
  }

  pub fn decimals(&self) -> Result<u32, Vec<u8>> {
    Ok(18)
  }

  pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
    Ok(self.total_supply.get())
  }

  pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, ERC20Error> {
    let _ = self._transfer(msg::sender(), to, amount);
    Ok(true)
  }
  pub fn transfer_from(&mut self, from: Address, to: Address, amount: U256) -> Result<bool, ERC20Error> {
    let _ = self._spend_allowance(from, msg::sender(), amount);
    let _ = self._transfer(from, to, amount);
    return Ok(true)
  }

  pub fn allowance(&self, owner: Address, spender: Address) -> Result<U256, Vec<u8>> {
    Ok(self.allowances.getter(owner).get(spender))
  }

  pub fn balance_of(&self, account: Address) -> Result<U256, Vec<u8>> {
    Ok(self.balances.get(account))
  }

  pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, ERC20Error> {
    let _ = self._approve(msg::sender(), spender, amount);
    Ok(true)
  }
 }