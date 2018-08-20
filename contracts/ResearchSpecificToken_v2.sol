pragma solidity ^0.4.24;

import "./ResearchSpecificToken.sol";

contract ResearchSpecificToken_v2 is ResearchSpecificToken{

	constructor(
        uint8 _decimalUnits,
        string _tokenName,
        string _tokenSymbol
    ) ResearchSpecificToken(_decimalUnits,_tokenName, _tokenSymbol) public{}

    function getContractVersion() public pure returns(uint){
        return 2;
    }
}