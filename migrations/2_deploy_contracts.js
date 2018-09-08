const Registry = artifacts.require("Registry");
const IkuToken = artifacts.require("IkuToken");

module.exports = (deployer) => {
  var registry;
  var ikuToken, ikuTokenProxy;

  // only deploy registry contracts once
  deployer.deploy(Registry);

  //deploy all version-1 contracts
  deployer.deploy(IkuToken);

  // step 1 : register deployed version-1 contracts with the registry contract
  // step 2 : creating proxies
  // step 3 : fetch proxy addresses
  deployer.then(() => {
    return Registry.deployed();
  }).then(instance => {
    registry = instance;
    return IkuToken.deployed();
  }).then(instance => {
    ikuToken = instance;
    return registry.addVersion('IkuToken', '1.0', ikuToken.address);
  }).then(tx => {
    return registry.createProxy('IkuToken', '1.0');
  }).then(tx => {
    ikuTokenProxy = tx.logs[0].args.proxy;
    console.log('IkuToken proxy: ', ikuTokenProxy);
  });

  // step 4 : call any uncalled initializers
  // Note : there's no need to call initialize on Ikutoken because it's 
  //        automatically called by registry on proxy creation the first time.
}