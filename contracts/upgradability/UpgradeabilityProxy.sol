pragma solidity ^0.4.24;

import './Proxy.sol';
import './IRegistry.sol';
import './UpgradeabilityStorage.sol';

/**
 * @title UpgradeabilityProxy
 * @dev This contract represents a proxy where the implementation address to which it will delegate can be upgraded
 */
contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {

  /**
  * @dev Constructor function
  */
  constructor(string _contractName, string _version) public {
    registry = IRegistry(msg.sender);
    upgradeTo(_contractName, _version);
  }

  /**
  * @dev Upgrades the implementation to the requested version
  * @param _contractName representing the name of one of the three contracts
  * @param _version representing the version name of the new implementation to be set
  */
  function upgradeTo(string _contractName, string _version) public {
    _implementation = registry.getVersion(_contractName, _version);
  }
}