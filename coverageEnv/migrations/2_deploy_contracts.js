const IkuToken = artifacts.require(`./IkuToken.sol`);
//const ResearchSpecificToken = artifacts.require(`./ResearchSpecificToken.sol`);
//const RSTCrowdsale = artifacts.require(`./RSTCrowdsale.sol`);

module.exports = (deployer) => {
  deployer.deploy(IkuToken)
  .then ( t  => {
  		//console.log("TOKEN DEPLOYED: ", t);
  		//const token = IkuToken.at(IkuToken.address);
  		//token.transferOwnership(web3.eth.accounts[0]);

  		/*
  		 *
		 * This is helpful for debugging but not used in production


  		const decimal_units = 18;
		const token_name = 'Research X';
		const token_symbol = 'RSX';

  		return deployer.deploy(ResearchSpecificToken, decimal_units, token_name, token_symbol).then( token =>{  
  			
  			const startTime = web3.eth.getBlock('latest').timestamp  + 60;
  			//10 minutes later
		  	const endTime = startTime + (60 * 10);

		  	const rate = new web3.BigNumber(1000);
		  	const goal = new web3.BigNumber(web3.toWei(300, 'ether'));
		  	const cap = new web3.BigNumber(web3.toWei(300, 'ether'));
		  	const wallet = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
		  	

  			return deployer.deploy(RSTCrowdsale, startTime, endTime, rate, goal, cap, wallet, ResearchSpecificToken.address).then(_ =>{
  				const token = ResearchSpecificToken.at(ResearchSpecificToken.address);
  				token.transferOwnership(RSTCrowdsale.address).then( __ =>{
  					console.log("Deployment complete!");
  				}).catch( e =>{
  					console.log("Cant transfer token ownership", e);
  				});

  				

  			 }).catch( e =>{
  				console.log("RSTCrowdsale Deployment failed", e);
  			});
  	     
  		 }).catch( e =>{
  			console.log("ResearchSpecificToken Deployment failed", e);
  		});
  		*/  		
  }).catch( e =>{
  		console.log("IkuToken Deployment failed", e);
  });
  
}
