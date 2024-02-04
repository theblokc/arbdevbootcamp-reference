
![Image](./header.png)

# ERC 20 Stylus

Interpretation of OpenZeppelin's ERC-20 Standard in Arbitrum Stylus which does not include some if it's other features such as Access Control yet.

lib.rs
```js
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract RustStylus20Token is ERC20 {
    constructor(address initialOwner, uint256 initialSupply)
        ERC20("Rust Stylus ERC20 Token", "RSTSTYL20")
    {
        mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
```

## Running the code

To get the contract

```
cargo stylus export-abi
```