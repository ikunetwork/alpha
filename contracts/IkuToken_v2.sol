pragma solidity ^0.4.24;

import "./IkuToken.sol";

contract IkuToken_v2 is IkuToken{
	string public constant name = 'IkuToken_v2';
	
	bool public isInitialized = false;

	/**
     * @dev contract's version getter
    */
	function getContractVersion() public pure returns(uint){
		return 2;
	}

	/**
     * @dev proxy initializer function
     * @param sender representing the original
    **/
	function initialize(address sender) public payable{
		require(!isInitialized, "already initialized");	
		isInitialized = true;
		owner = sender;
		totalSupply_ = INITIAL_SUPPLY;
	        balances[sender] = INITIAL_SUPPLY;
        	emit Transfer(0x0, sender, INITIAL_SUPPLY);
	}
}
