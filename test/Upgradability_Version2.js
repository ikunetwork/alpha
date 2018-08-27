import ether from './helpers/ether';
import getLogs from './helpers/getLogs';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const { BigNumber } = web3;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const IkuToken = artifacts.require('IkuToken');
const ResearchSpecificToken = artifacts.require('ResearchSpecificToken');

const IkuToken_v2 = artifacts.require('IkuToken_v2');
const ResearchSpecificToken_v2 = artifacts.require('ResearchSpecificToken_v2');

const RSTCrowdsale = artifacts.require('RSTCrowdsale');

const Registry = artifacts.require('Registry');
const Proxy = artifacts.require('UpgradeabilityProxy');

contract('Upgradability for version-2 contracts', accounts => {
  const creator = accounts[0];

  const RATE = new BigNumber(1000);
  const GOAL = ether(300);
  const CAP = ether(300);

  let ikuToken_v1;
  let ikuToken_v2;
  let researchSpecificToken_v1;
  let researchSpecificToken_v2;

  let registry;
  let reg;

  let ikuTokenProxy;
  let researchSpecificTokenProxy;

  let tx;

  it('should be able to register initial contract versions & create proxies', async () => {
    ikuToken_v1 = await IkuToken.new();

    researchSpecificToken_v1 = await ResearchSpecificToken.new(
      18,
      'ResearchSpecificToken',
      'RST1'
    );

    registry = await Registry.new();

    await registry.addVersion('IkuToken', '1.0', ikuToken_v1.address);

    await registry.addVersion(
      'ResearchSpecificToken',
      '1.0',
      researchSpecificToken_v1.address
    );

    // creating proxies & upgrading to initial version
    tx = await registry.createProxy('IkuToken', '1.0');
    ikuTokenProxy = tx.logs[0].args.proxy;
    tx = await registry.createProxy('ResearchSpecificToken', '1.0');
    researchSpecificTokenProxy = tx.logs[0].args.proxy;


    assert.equal(
      await IkuToken.at(ikuTokenProxy).name(), 
      'IkuToken'
    );
    //the following resolves to true beacuse contract hasn't been initialized yet
    assert.equal(
      await ResearchSpecificToken.at(researchSpecificTokenProxy).name(),
      ''
    );
  });

  it('should be able to update contracts using created proxies', async () => {
    ikuToken_v2 = await IkuToken_v2.new({from: accounts[2]});

    researchSpecificToken_v2 = await ResearchSpecificToken_v2.new(
      18,
      'ResearchSpecificToken_v2',
      'RST2'
    );

    await registry.addVersion('IkuToken', '2.0', ikuToken_v2.address);
    await registry.addVersion(
      'ResearchSpecificToken',
      '2.0',
      researchSpecificToken_v2.address
    );

    await Proxy.at(ikuTokenProxy).upgradeTo('IkuToken', '2.0');
    await Proxy.at(researchSpecificTokenProxy).upgradeTo(
      'ResearchSpecificToken',
      '2.0'
    );

    assert.equal(await IkuToken_v2.at(ikuTokenProxy).name(), 'IkuToken_v2');
    assert.equal(await IkuToken_v2.at(ikuTokenProxy).getContractVersion(), 2);
    assert.equal(
      await ResearchSpecificToken_v2.at(
        researchSpecificTokenProxy
      ).getContractVersion(),
      2
    );
  });

  it('should emit ProxyCreated events for each of the two contracts', async()=>{
    const proxyFilter = await registry.ProxyCreated({}, { fromBlock: 0, toBlock: 'latest' });
    const events = await getLogs(proxyFilter);
    assert.equal(ikuTokenProxy, events[0].args.proxy);
    assert.equal(researchSpecificTokenProxy, events[1].args.proxy);
  });

  describe("deployed proxy contracts should pass all individual tests(version-2)", ()=>{
    describe("IkuToken_v2 proxy", ()=>{
      let token;

      before(async ()=>{
        token = IkuToken_v2.at(ikuTokenProxy);
        const isInitialized = await token.isInitialized();
        //make sure that contract has not been initialized yet
        assert.equal(isInitialized, false);
        //initialize the upgraded contract
        await token.initialize(accounts[2], {from: accounts[2]});
      });

      it('should be initialized with owner set correctly', async()=>{
        const isInitialized = await token.isInitialized();
        assert.equal(isInitialized, true);
        assert.equal(accounts[2], await token.owner());
      });

      it('has a name (IkuToken_v2)', async () => {
        const name = await token.name();
        assert.equal(name, 'IkuToken_v2');
      });

      it('has a symbol (IKU)', async () => {
        const symbol = await token.symbol();
        assert.equal(symbol, 'IKU');
      });

      it('has 18 decimals', async () => {
        const decimals = await token.decimals();
        assert(decimals.eq(18));
      });

      it('has an initial supply of 100000', async () => {
        const totalSupply = await token.totalSupply();
        assert(totalSupply.equals(100000 * 10 ** 18));
      });

      it('assigns the initial total supply to the creator', async () => {
        const totalSupply = await token.totalSupply();
        const creatorBalance = await token.balanceOf(creator);

        assert(creatorBalance.eq(totalSupply));
      });
    });

    describe("ResearchSpecificToken_v2 proxy", ()=>{
      let token;

      before(async ()=>{
        token = ResearchSpecificToken_v2.at(researchSpecificTokenProxy);
        const isInitialized = await token.isInitialized();
        //make sure that contract has not been initialized yet
        assert.equal(isInitialized, false);
        await token.initializeRSToken(
          18,
          'ResearchSpecificToken',
          'RST1'
        )
      });

      it('should be initialized with owner set correctly', async()=>{
        const isInitialized = await token.isInitialized();
        assert.equal(isInitialized, true);
        assert.equal(creator, await token.owner());
      });

      it('has a name', async () => {
        const name = await token.name();
        assert.equal(name, 'ResearchSpecificToken');
      });

      it('has a symbol', async () => {
        const symbol = await token.symbol();
        assert.equal(symbol, 'RST1');
      });

      it('has 18 decimals', async () => {
        const decimals = await token.decimals();
        assert(decimals.eq(18));
      });
    });

    describe("RSTCrowdsale contract with deployed ResearchSpecificToken proxy", ()=>{
      let token;
      let crowdsale;

      const owner = accounts[0];
      const wallet = accounts[8];
      const investor = accounts[7];
      let openingTime = latestTime() + duration.minutes(1); 
      let closingTime = openingTime + duration.weeks(1);
      let afterClosingTime = closingTime + duration.seconds(1);

      before(async ()=>{
        token = ResearchSpecificToken_v2.at(researchSpecificTokenProxy);
        const isInitialized = await token.isInitialized();
        assert.equal(isInitialized, true);
        assert.equal(creator, await token.owner());

        crowdsale = await RSTCrowdsale.new(
          openingTime,
          openingTime + duration.weeks(1),
          RATE,
          wallet,
          CAP,
          researchSpecificTokenProxy,
          GOAL
        );

        await token.transferOwnership(crowdsale.address);
      });

      it('should create crowdsale with correct parameters', async function() {
        crowdsale.should.exist;
        token.should.exist;

        const openingTime = await crowdsale.openingTime();
        const closingTime = await crowdsale.closingTime();
        const rate = await crowdsale.rate();
        const walletAddress = await crowdsale.wallet();
        const goal = await crowdsale.goal();
        const cap = await crowdsale.cap();
        const tokenName = await token.name();
        const tokenSymbol = await token.symbol();
        const decimalUnits = await token.decimals();

        openingTime.should.be.bignumber.equal(openingTime);
        closingTime.should.be.bignumber.equal(closingTime);
        rate.should.be.bignumber.equal(RATE);
        walletAddress.should.be.equal(wallet);
        goal.should.be.bignumber.equal(GOAL);
        cap.should.be.bignumber.equal(CAP);
        tokenName.should.be.equal('ResearchSpecificToken');
        tokenSymbol.should.be.equal('RST1');
        decimalUnits.should.be.bignumber.equal(18);
      });

      it('should not accept payments before start', async function() {
        await crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
        await crowdsale
          .buyTokens(investor, { from: investor, value: ether(1) })
          .should.be.rejectedWith(EVMRevert);
      });

      it('should accept payments during the sale', async function() {
        const investmentAmount = CAP;
        const expectedTokenAmount = RATE.mul(investmentAmount);

        await increaseTimeTo(openingTime);
        await crowdsale.buyTokens(investor, {
          value: investmentAmount,
          from: investor,
        }).should.be.fulfilled;

        (await token.balanceOf(investor)).should.be.bignumber.equal(
          expectedTokenAmount
        );
        (await token.totalSupply()).should.be.bignumber.equal(
          expectedTokenAmount
        );

        //should reject any payment above cap
        await crowdsale.send(1).should.be.rejectedWith(EVMRevert);
      });

      it('should reject payments after end', async function() {
        await increaseTimeTo(afterClosingTime);
        await crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
        await crowdsale
          .buyTokens(investor, { value: ether(1), from: investor })
          .should.be.rejectedWith(EVMRevert);
      });

      it('should allow finalization and transfer funds to wallet if the goal is reached', async function() {
        const beforeFinalization = web3.eth.getBalance(wallet);
        await crowdsale.finalize({ from: owner });
        const afterFinalization = web3.eth.getBalance(wallet);

        afterFinalization.minus(beforeFinalization).should.be.bignumber.equal(GOAL);
      });
    });
  });
});