pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import "./upgradability/Upgradeable.sol";

contract ResearchSpecificToken is Upgradeable, MintableToken {
    uint8 public  decimals;
    string public  name;
    string public  symbol;
   
    constructor(
        uint8 _decimalUnits,
        string _tokenName,
        string _tokenSymbol
    ) public{
        decimals = _decimalUnits;
        name = _tokenName;
        symbol = _tokenSymbol; 
    }
}