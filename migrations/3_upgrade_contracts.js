const Registry = artifacts.require("Registry");
const IkuToken_v2 = artifacts.require("IkuToken_v2");
const ResearchSpecificToken_v2 = artifacts.require("ResearchSpecificToken_v2");
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

module.exports = (deployer) => {
	var registry;
	var ikuToken_v2, researchSpecificToken_v2;
	var ikuTokenProxy, researchSpecificTokenProxy;

	//deploy all version-2 contracts
	deployer.deploy(IkuToken_v2);
	deployer.deploy(
		ResearchSpecificToken_v2,
		18,
		'ResearchSpecificToken_v2',
		'RST2'
	);

	// step 1 : register deployed version-2 contracts with the registry contract
	deployer.then(() => {
		return Registry.deployed();
	}).then(instance => {
		registry = instance;
		return IkuToken_v2.deployed();
	}).then(instance => {
		ikuToken_v2 = instance;
		return ResearchSpecificToken_v2.deployed();
	}).then(instance => {
		researchSpecificToken_v2 = instance;
		return registry.addVersion('IkuToken', '2.0', ikuToken_v2.address);
	}).then(tx => {
		return registry.addVersion(
	      'ResearchSpecificToken',
	      '2.0',
	      researchSpecificToken_v2.address
    	);
	});

	// step 2 : fetch created proxies
	// step 3 : call upgradeTo function on proxies
	deployer.then(()=>{
		return registry.ProxyCreated({},{ fromBlock: 0, toBlock: 'latest' });
	}).then(filter => {
		return getLogs(filter);
	}).then(events => {
		ikuTokenProxy = events[0].args.proxy;
		researchSpecificTokenProxy = events[1].args.proxy;
		console.log("Upgrading ikuTokenProxy to reflect contract version 2 ...");
		return Proxy.at(ikuTokenProxy).upgradeTo('IkuToken', '2.0');
	}).then(tx => {
		console.log("Upgrading researchSpecificTokenProxy to reflect contract version 2 ...");
		return Proxy.at(researchSpecificTokenProxy).upgradeTo(
	      'ResearchSpecificToken',
	      '2.0'
	     );
	});
}