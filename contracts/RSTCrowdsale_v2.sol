pragma solidity ^0.4.24;

import "./RSTCrowdsale.sol";

contract RSTCrowdsale_v2 is RSTCrowdsale{

    constructor(
        uint256 _openingTime, 
        uint256 _closingTime, 
        uint256 _rate, 
        address _wallet,
        uint256 _cap, 
        MintableToken _token,
        uint256 _goal
    ) RSTCrowdsale(
        _openingTime,
        _closingTime,
        _rate,
        _wallet,
        _cap,
        _token,
        _goal
    ) public {}

    function getContractVersion() public pure returns(string){
        return '2.0';
    }
}