const Registry = artifacts.require("Registry");
const IkuToken = artifacts.require("IkuToken");
const ResearchSpecificToken = artifacts.require("ResearchSpecificToken");

module.exports = (deployer) => {
	var registry;
	var ikuToken, researchSpecificToken;
	var ikuTokenProxy, researchSpecificTokenProxy;

	// only deploy registry contracts once
	deployer.deploy(Registry);

	//deploy all version-1 contracts
	deployer.deploy(IkuToken);
	deployer.deploy(
		ResearchSpecificToken,
		18,
		'ResearchSpecificToken',
		'RST1'
	);

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
		return ResearchSpecificToken.deployed();
	}).then(instance => {
		researchSpecificToken = instance;
		return registry.addVersion('IkuToken', '1.0', ikuToken.address);
	}).then(tx => {
		return registry.createProxy('IkuToken', '1.0');
	}).then(tx => {
		ikuTokenProxy = tx.logs[0].args.proxy;
		console.log('IkuToken proxy: ', ikuTokenProxy);
		return registry.addVersion(
	      'ResearchSpecificToken',
	      '1.0',
	      researchSpecificToken.address
	    );
	}).then(tx => {
		return registry.createProxy('ResearchSpecificToken', '1.0');
	}).then(tx => {
		researchSpecificTokenProxy = tx.logs[0].args.proxy;
		console.log('ResearchSpecificToken proxy: ', researchSpecificTokenProxy);
	});

	// step 4 : call any uncalled initializers
	// Note : there's no need to call initialize on Ikutoken because it's 
	//        automatically called by registry on proxy creation.
	deployer.then(()=>{
		return ResearchSpecificToken.at(researchSpecificTokenProxy);
	}).then((instance)=>{
		researchSpecificToken = instance;
		console.log('initializing ResearchSpecificToken ...');
		return researchSpecificToken.initializeRSToken(18, 'ResearchSpecificToken', 'RST')
	})
}