pragma solidity ^0.4.24;

import './IRegistry.sol';
import './Upgradeable.sol';
import './UpgradeabilityProxy.sol';

/**
 * @title Registry
 * @dev This contract works as a registry of versions, it holds the implementations for the registered versions.
 */
contract Registry is IRegistry {
  // Mapping of versions to implementations of different functions
  mapping (string => mapping (string => address)) internal versions;

  /**
  * @dev Registers a new version with its implementation address
  * @param contractName representing the name of one of the three contracts
  * @param version representing the version name of the new implementation to be registered
  * @param implementation representing the address of the new implementation to be registered
  */
  function addVersion(string contractName, string version, address implementation) external {
    require(versions[contractName][version] == 0x0, 'contract version address already exists');
    versions[contractName][version] = implementation;
    emit VersionAdded(contractName, version, implementation);
  }

  /**
  * @dev Tells the address of the implementation for a given version
  * @param contractName representing the name of one of the three contracts
  * @param version to query the implementation of
  * @return address of the implementation registered for the given version
  */
  function getVersion(string contractName, string version) external view returns (address) {
    return versions[contractName][version];
  }

  /**
  * @dev Creates an upgradeable proxy
  * @param contractName representing the name of one of the three contracts
  * @param version representing the first version to be set for the proxy
  * @return address of the new proxy created
  */
  function createProxy(string contractName, string version) public payable returns (UpgradeabilityProxy) {
    UpgradeabilityProxy proxy = new UpgradeabilityProxy(contractName, version);
    Upgradeable(proxy).initialize.value(msg.value)(msg.sender);
    emit ProxyCreated(proxy);
    return proxy;
  }
}