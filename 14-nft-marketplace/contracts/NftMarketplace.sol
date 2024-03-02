// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarketplace is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public tokenPrice;
    mapping(uint256 => address) public tokenOwnerAddresses;

    constructor() ERC721("NftMarketplace", "NFTM") Ownable(msg.sender) {}

    function mint() external payable {
        if (msg.sender != owner()) {
            require(msg.value >= 100000000000000, "Insufficient fee"); // 0.0001 ether
            payable(owner()).transfer(msg.value);
        }

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        tokenOwnerAddresses[tokenId] = msg.sender;
        _setTokenURI(tokenId, string.concat("https://err404-metadata.theblokc.com/meta/", Strings.toString(tokenId)));
    }

    function buy(uint256 tokenId) external payable {
        require(tokenPrice[tokenId] > 0, "Token not for sale");
        require(msg.value >= tokenPrice[tokenId], "Insufficient payment");

        _transfer(address(this), msg.sender, tokenId);
        payable(tokenOwnerAddresses[tokenId]).transfer(msg.value);
        tokenOwnerAddresses[tokenId] = msg.sender;
        tokenPrice[tokenId] = 0;
    }

    function sell(uint256 tokenId, uint256 price) external {
        require(tokenOwnerAddresses[tokenId] == msg.sender, "Not the token owner");
        require(tokenPrice[tokenId] <= 0, "NFT is already for sale");
        
        _transfer(msg.sender, address(this), tokenId);
        tokenPrice[tokenId] = price;
    }
}