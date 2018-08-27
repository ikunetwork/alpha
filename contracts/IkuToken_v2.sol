pragma solidity ^0.4.24;

import "./IkuToken.sol";

contract IkuToken_v2 is IkuToken{
	string public constant name = 'IkuToken_v2';
	bool public isInitialized = false;

	constructor() public{}

	function getContractVersion() public pure returns(uint){
		return 2;
	}

	/**
     * @dev initializes the contract by re-setting variables not set by constructor
     * funtion owing to the proxy pattern architecture
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