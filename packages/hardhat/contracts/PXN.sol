//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

/*
PXN.sol

Written by: Moodi
Dutch Auction style inspired by: 0xinuarashi and mousedev.eth

*/

contract PXN is Ownable, ERC721A {
    using ECDSA for bytes32;
    //Starting at 0.5 ether
    uint256 public DA_STARTING_PRICE = 2 ether;

    //Ending at 0.1 ether
    uint256 public DA_ENDING_PRICE = 0.1 ether;

    //Decrease by 0.05 every frequency.
    uint256 public DA_DECREMENT = 0.05 ether;

    //decrement price every 300 seconds (5 minutes).
    uint256 public DA_DECREMENT_FREQUENCY = 300; 

    //Starting DA time (seconds). To convert into readable time https://www.unixtimestamp.com/
    uint256 public DA_STARTING_TIMESTAMP = 1650405371; //please edit and remove comment

    //The final auction price.
    uint256 public DA_FINAL_PRICE;

    //The quantity for DA.
    uint256 public DA_QUANTITY = 4000;


    //How many publicWL have been minted
    uint16 public PUBLIC_WL_MINTED;

    bool public INITIAL_FUNDS_WITHDRAWN;
    bool public REMAINING_FUNDS_WITHDRAWN;

    address public FOUNDER_ADD = 0x0E861ddDA17f7C20996dC0868cAcc200bc1985c0; //please edit and remove comment
    address public DEV_FUND = 0xBC77EDd603bEf4004c47A831fDDa437cD906442E; //please edit and remove comment

    //+86400 so it takes place 24 hours after Dutch Auction
    uint256 public WL_STARTING_TIMESTAMP = DA_STARTING_TIMESTAMP + 86400;

    //Struct for storing batch price data.
    struct TokenBatchPriceData {
        uint128 pricePaid;
        uint8 quantityMinted;
    }

    //Token to token price data
    mapping(address => TokenBatchPriceData[]) public userToTokenBatchPriceData;

    mapping(address => bool) public userToHasMintedPublicWL;

    bool public REVEALED;
    string public BASE_URI;

    //WL variables
    address private wlSigner;

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    constructor() ERC721A("ProjectPXN", "PXN") {}

    function currentPrice() public view returns (uint256) {
        require(
            block.timestamp >= DA_STARTING_TIMESTAMP,
            "DA has not started!"
        );

        if (DA_FINAL_PRICE > 0) return DA_FINAL_PRICE;
        //Seconds since we started
        uint256 timeSinceStart = block.timestamp - DA_STARTING_TIMESTAMP;

        //How many decrements should've happened since that time
        uint256 decrementsSinceStart = timeSinceStart / DA_DECREMENT_FREQUENCY;

        //How much eth to remove
        uint256 totalDecrement = decrementsSinceStart * DA_DECREMENT;

        //If how much we want to reduce is greater or equal to the range, return the lowest value
        if (totalDecrement >= DA_STARTING_PRICE - DA_ENDING_PRICE) {
            return DA_ENDING_PRICE;
        }

        //If not, return the starting price minus the decrement.
        return DA_STARTING_PRICE - totalDecrement;
    }

    function mintDutchAuction(uint8 quantity) public payable callerIsUser {
        //Require DA started
        require(
            block.timestamp >= DA_STARTING_TIMESTAMP,
            "DA has not started!"
        );
        require(block.timestamp <= WL_STARTING_TIMESTAMP, "DA is finished");
        //Require max 5
        require(quantity > 0 && quantity < 3, "Can only mint max 2 NFTs!");

        uint256 _currentPrice = currentPrice();

        //Require enough ETH
        require(
            msg.value >= quantity * _currentPrice,
            "Did not send enough eth."
        );

        //Max supply
        require(
            totalSupply() + quantity <= DA_QUANTITY,
            "Max supply for DA reached!"
        );

        //This is the final price
        if (totalSupply() + quantity == DA_QUANTITY)
            DA_FINAL_PRICE = _currentPrice;

        userToTokenBatchPriceData[msg.sender].push(
            TokenBatchPriceData(uint128(msg.value), quantity)
        );

        //Mint the quantity
        _safeMint(msg.sender, quantity);
    }

    function mintWL(bytes calldata signature) public payable callerIsUser {
        require(DA_FINAL_PRICE > 0, "Dutch action must be over!");

        require(
            !userToHasMintedPublicWL[msg.sender],
            "Can only mint once during public WL!"
        );
        require(
            block.timestamp >= WL_STARTING_TIMESTAMP,
            "WL has not started yet!"
        ); 
        require(
            block.timestamp <= WL_STARTING_TIMESTAMP + 86400,
            "WL has finished!"
        );
        //Require max supply just in case.
        require(totalSupply() + 1 <= 6000, "Max supply of 6000!");

        require(
            wlSigner ==
                keccak256(
                    abi.encodePacked(
                        "\x19Ethereum Signed Message:\n32",
                        bytes32(uint256(uint160(msg.sender)))
                    )
                ).recover(signature),
            "Signer address mismatch."
        );

        uint256 WLprice = 0.35 ether;
        if (((DA_FINAL_PRICE / 100) * 50) < WLprice) {
            WLprice =((DA_FINAL_PRICE / 100) * 50);
        }
        console.log(DA_FINAL_PRICE);
        console.log((DA_FINAL_PRICE / 100) * 50);
        console.log(WLprice, "WL price");
        require(msg.value >= WLprice, "Must send enough eth for WL Mint");

        userToHasMintedPublicWL[msg.sender] = true;
        PUBLIC_WL_MINTED++;

        //Mint them
        _safeMint(msg.sender, 1);
    }

    //send remaining NFTs to walet
    function devMint() external onlyOwner {
        require(
            block.timestamp >= WL_STARTING_TIMESTAMP + 86400,
            "WL has finished!"
        ); 
        uint256 leftOver = 10000 - totalSupply();
        _safeMint(DEV_FUND, leftOver);
    }

    function userToTokenBatchLength(address user)
        public
        view
        returns (uint256)
    {
        return userToTokenBatchPriceData[user].length;
    }

    function refundExtraETH() public {
        require(DA_FINAL_PRICE > 0, "Dutch action must be over!");
        require(block.timestamp <= DA_STARTING_TIMESTAMP + 604800, "need to happen 1 week after Dutch Auction"); 
        uint256 totalRefund;

        for (
            uint256 i = userToTokenBatchPriceData[msg.sender].length;
            i > 0;
            i--
        ) {
            //This is what they should have paid if they bought at lowest price tier.
            uint256 expectedPrice = userToTokenBatchPriceData[msg.sender][i - 1]
                .quantityMinted * DA_FINAL_PRICE;

            //What they paid - what they should have paid = refund.
            uint256 refund = userToTokenBatchPriceData[msg.sender][i - 1]
                .pricePaid - expectedPrice;

            //Remove this tokenBatch
            userToTokenBatchPriceData[msg.sender].pop();

            //Send them their extra money.
            totalRefund += refund;
        }
        payable(msg.sender).transfer(totalRefund);
    }

    function withdrawFunds() public onlyOwner {
        //Require this is 1 weeks after DA Start.
        require(block.timestamp >= DA_STARTING_TIMESTAMP + 604800, "need to happen 1 week after Dutch Auction"); 

        uint256 finalFunds = address(this).balance;
        payable(FOUNDER_ADD).transfer((finalFunds * 5000) / 10000);
        payable(DEV_FUND).transfer((finalFunds * 5000) / 10000);
    }

    function setSigners(address signer) external onlyOwner {
        wlSigner = signer;
    }

    function setRevealData(bool _revealed) public onlyOwner {
        REVEALED = _revealed;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        BASE_URI = _baseURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (REVEALED) {
            return
                string(abi.encodePacked(BASE_URI, Strings.toString(_tokenId)));
        } else {
            return BASE_URI;
        }
    }
}