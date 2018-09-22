const Registry = artifacts.require("Registry");
const IkuToken_v2 = artifacts.require("IkuToken_v2");
const Proxy = artifacts.require('UpgradeabilityProxy');

//helper function to fetch proxy addresses
function getLogs(filter) {
  return new Promise((resolve, reject) => {
    filter.get((error, events) => {
      if (error) return reject(error);
      resolve(events);
    });
  });
}

module.exports = (deployer, network, accounts) => {
	let registry;
	let ikuToken_v2, ikuTokenProxy;

	//deploy all version-2 contracts
	deployer.deploy(IkuToken_v2);

	// step 1 : register deployed version-2 contracts with the registry contract
	deployer.then(() => {
		return Registry.deployed();
	}).then(instance => {
		registry = instance;
		return IkuToken_v2.deployed();
	}).then(instance => {
		ikuToken_v2 = instance;
		return registry.addVersion('IkuToken', '2.0', ikuToken_v2.address);
	}).then(tx => {
		console.log("new version of IkuToken added to the registry.")
	})

	// step 2 : fetch created proxies
	// step 3 : call upgradeTo function on proxies
	deployer.then(()=>{
		return registry.ProxyCreated({},{ fromBlock: 0, toBlock: 'latest' });
	}).then(filter => {
		return getLogs(filter);
	}).then(events => {
		ikuTokenProxy = events[0].args.proxy;
		console.log("Upgrading ikuTokenProxy to reflect contract version 2 ...");
		return Proxy.at(ikuTokenProxy).upgradeTo('IkuToken', '2.0');
	}).then(tx => {
		console.log("Update Completed!");
	});

	//step 4 : call respective contract initializers
	deployer.then(()=>{
		console.log('initializing IkuToken_v2 ...');
		return IkuToken_v2.at(ikuTokenProxy).initialize(accounts[1], { from: accounts[1] });;
	}).then(tx => {
		console.log('IkuToken_v2 initialized!');
	});
}
