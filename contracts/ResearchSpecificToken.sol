pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import "./upgradability/Upgradeable.sol";

contract ResearchSpecificToken is Upgradeable, MintableToken {
    uint8 public  decimals;
    string public  name;
    string public  symbol;

    bool public isInitialized = false;
   
    constructor(
        uint8 _decimalUnits,
        string _tokenName,
        string _tokenSymbol
    ) public{
        decimals = _decimalUnits;
        name = _tokenName;
        symbol = _tokenSymbol; 
    }

    /**
     * @dev initializes the contract by re-setting variables not set by constructor
     * funtion owing to the proxy pattern architecture
     * @param _decimalUnits representing decimals for the ERC20 token
     * @param _tokenName representing name of the ERC20 token
     * @param _tokenSymbol representing the symbol for the ERC20 token 
    **/
    function initializeRSToken(
        uint8 _decimalUnits,
        string _tokenName,
        string _tokenSymbol
    ) public {
        require(!isInitialized, "already initialized");
        require(owner == address(0), "owner already set");
        isInitialized = true;
        owner = msg.sender;
        decimals = _decimalUnits;
        name = _tokenName;
        symbol = _tokenSymbol;
    }
}