pragma solidity ^0.4.24;

import "./IkuToken.sol";

contract IkuToken_v2 is IkuToken{
	string public constant name = 'IkuToken_v2';

	function getContractVersion() public pure returns(uint){
		return 2;
	}
}