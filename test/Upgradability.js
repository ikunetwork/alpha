import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const { BigNumber } = web3;

const IkuToken = artifacts.require('IkuToken');
const ResearchSpecificToken = artifacts.require('ResearchSpecificToken');
const RSTCrowdsale = artifacts.require('RSTCrowdsale');

const IkuToken_v2 = artifacts.require('IkuToken_v2');
const ResearchSpecificToken_v2 = artifacts.require('ResearchSpecificToken_v2');
const RSTCrowdsale_v2 = artifacts.require('RSTCrowdsale_v2');

const Registry = artifacts.require('Registry');
const Proxy = artifacts.require('UpgradeabilityProxy');

contract('Upgradability', accounts => {
    const creator = accounts[0];

    const RATE = new BigNumber(1000);
    const GOAL = ether(300);
    const CAP = ether(300);

    let ikuToken_v1;
    let ikuToken_v2;
    let researchSpecificToken_v1;
    let researchSpecificToken_v2;
    let rstCrowdsale_v1;
    let rstCrowdsale_v2;

    let registry;

    let ikuTokenProxy;
    let researchSpecificTokenProxy;
    let rstCrowdsaleProxy;

    let tx;

    it("should be able to register initial contract versions & create proxies", async()=>{
        ikuToken_v1 = await IkuToken.new();

        researchSpecificToken_v1 = await ResearchSpecificToken.new(
            18,
            "ResearchSpecificToken",
            "RST1"
        );

        rstCrowdsale_v1 = await RSTCrowdsale.new(
          web3.eth.getBlock('latest').timestamp + 100,
          web3.eth.getBlock('latest').timestamp + 1000,
          RATE,
          creator,
          CAP,
          researchSpecificToken_v1.address,
          GOAL
        );

        registry = await Registry.new();

        await registry.addVersion("IkuToken", "1.0", ikuToken_v1.address);

        await registry.addVersion("ResearchSpecificToken", "1.0", researchSpecificToken_v1.address);

        await registry.addVersion("RSTCrowdsale", "1.0", rstCrowdsale_v1.address);

        //creating proxies & upgrading to initial version
        tx = await registry.createProxy("IkuToken", "1.0");
        ikuTokenProxy = tx.logs[0].args.proxy;

        tx = await registry.createProxy("ResearchSpecificToken", "1.0");
        researchSpecificTokenProxy = tx.logs[0].args.proxy;

        tx = await registry.createProxy("RSTCrowdsale", "1.0");
        rstCrowdsaleProxy = tx.logs[0].args.proxy;

        // console.log(ikuTokenProxy, researchSpecificTokenProxy, rstCrowdsaleProxy);
        assert.equal(await IkuToken.at(ikuTokenProxy).name(), 'IkuToken');
    });

    it("should be able to update contracts using created proxies", async()=>{
        ikuToken_v2 = await IkuToken_v2.new();

        researchSpecificToken_v2 = await ResearchSpecificToken_v2.new(
            18,
            "ResearchSpecificToken_v2",
            "RST2"
        );

        rstCrowdsale_v2 = await RSTCrowdsale.new(
          web3.eth.getBlock('latest').timestamp + 105,
          web3.eth.getBlock('latest').timestamp + 1005,
          RATE,
          creator,
          CAP,
          researchSpecificToken_v2.address,
          GOAL
        );

        await registry.addVersion("IkuToken", "2.0", ikuToken_v2.address);
        await registry.addVersion("ResearchSpecificToken", "2.0", researchSpecificToken_v2.address);
        await registry.addVersion("RSTCrowdsale", "2.0", rstCrowdsale_v2.address);

        await Proxy.at(ikuTokenProxy).upgradeTo("IkuToken", "2.0");
        await Proxy.at(researchSpecificTokenProxy).upgradeTo("ResearchSpecificToken", "2.0");
        await Proxy.at(rstCrowdsaleProxy).upgradeTo("RSTCrowdsale", "2.0");

        assert.equal(await IkuToken_v2.at(ikuTokenProxy).name(), 'IkuToken_v2');
        assert.equal(await IkuToken_v2.at(ikuTokenProxy).getContractVersion(), 2);
        assert.equal(await ResearchSpecificToken_v2.at(researchSpecificTokenProxy).getContractVersion(), 2);
        // the following getter call should fail because of "_preValidatePurchase"
        await RSTCrowdsale_v2.at(rstCrowdsaleProxy).getContractVersion().should.be.rejectedWith(EVMRevert);
    });
});