pragma solidity ^0.4.24;

import "./ResearchSpecificToken.sol";

contract ResearchSpecificToken_v2 is ResearchSpecificToken{

    bool public isInitialized = false;

	constructor(
        uint8 _decimalUnits,
        string _tokenName,
        string _tokenSymbol
    ) ResearchSpecificToken(_decimalUnits, _tokenName, _tokenSymbol) public{}

    /**
	 * @dev proxy initializer function
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
    	isInitialized = true;
    	owner = msg.sender;
        decimals = _decimalUnits;
        name = _tokenName;
        symbol = _tokenSymbol;
    }

    /**
     * @dev contract's version getter
    */
    function getContractVersion() public pure returns(uint){
        return 2;
    }
}