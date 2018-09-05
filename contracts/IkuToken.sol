pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract IkuToken is StandardToken, Ownable {
    string public constant name = "IkuToken";
    string public constant symbol = "IKU";
    uint8 public constant decimals = 18;
    string public tokenURI;

    uint256 public constant INITIAL_SUPPLY = 100000 * (10 ** uint256(decimals));

    constructor() public{
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }

    function setTokenURI(string _tokenURI) public {
        tokenURI = _tokenURI;
    }
}