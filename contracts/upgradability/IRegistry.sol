pragma solidity ^0.4.24;

/**
 * @title IRegistry
 * @dev This contract represents the interface of a registry contract
 */
interface IRegistry {
  /**
  * @dev This event will be emitted every time a new proxy is created
  * @param contractName representing the name of one of the three contracts
  * @param version representing the version name of the registered implementation
  * @param proxy representing the address of the proxy created
  */
  event ProxyCreated(string contractName, string version, address indexed proxy);

  /**
  * @dev This event will be emitted every time a new implementation is registered
  * @param contractName representing the name of one of the three contracts
  * @param version representing the version name of the registered implementation
  * @param implementation representing the address of the registered implementation
  */
  event VersionAdded(string contractName, string version, address indexed implementation);

  /**
  * @dev Registers a new version with its implementation address
  * @param contractName representing the name of one of the three contracts
  * @param version representing the version name of the new implementation to be registered
  * @param implementation representing the address of the new implementation to be registered
  */
  function addVersion(string contractName, string version, address implementation) external;

  /**
  * @dev Tells the address of the implementation for a given version
  * @param contractName representing the name of one of the three contracts
  * @param version to query the implementation of
  * @return address of the implementation registered for the given version
  */
  function getVersion(string contractName, string version) external view returns (address);
}