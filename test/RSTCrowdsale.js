import ether from './helpers/ether';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import latestTime from './helpers/latestTime';
import EVMRevert from './helpers/EVMRevert';

const { BigNumber } = web3;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const RSTCrowdsale = artifacts.require('RSTCrowdsale');
const ResearchSpecificToken = artifacts.require('ResearchSpecificToken');

contract('RSTCrowdsale', ([owner, wallet, investor]) => {
  const RATE = new BigNumber(1000);
  const GOAL = ether(300);
  const CAP = ether(300);
  const DECIMAL_UNITS = 18;
  const TOKEN_NAME = 'ResearchSpecificTokenX';
  const TOKEN_SYMBOL = 'RSTX';

  before(async () => {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });

  beforeEach(async function() {
    this.openingTime = latestTime() + duration.minutes(1);
    this.closingTime = this.openingTime + duration.weeks(1);
    this.afterClosingTime = this.closingTime + duration.seconds(1);
    // Create the RST
    this.token = await ResearchSpecificToken.new(
      DECIMAL_UNITS,
      TOKEN_NAME,
      TOKEN_SYMBOL
    );

    // Create the crowdsale
    this.crowdsale = await RSTCrowdsale.new(
      this.openingTime,
      this.closingTime,
      RATE,
      wallet,
      CAP,
      this.token.address,
      GOAL
    );

    // Transfer the token ownership to the crowdsale
    await this.token.transferOwnership(this.crowdsale.address);
  });

  it('should create crowdsale with correct parameters', async function() {
    this.crowdsale.should.exist;
    this.token.should.exist;

    const openingTime = await this.crowdsale.openingTime();
    const closingTime = await this.crowdsale.closingTime();
    const rate = await this.crowdsale.rate();
    const walletAddress = await this.crowdsale.wallet();
    const goal = await this.crowdsale.goal();
    const cap = await this.crowdsale.cap();
    const tokenName = await this.token.name();
    const tokenSymbol = await this.token.symbol();
    const decimalUnits = await this.token.decimals();

    openingTime.should.be.bignumber.equal(this.openingTime);
    closingTime.should.be.bignumber.equal(this.closingTime);
    rate.should.be.bignumber.equal(RATE);
    walletAddress.should.be.equal(wallet);
    goal.should.be.bignumber.equal(GOAL);
    cap.should.be.bignumber.equal(CAP);
    tokenName.should.be.equal(TOKEN_NAME);
    tokenSymbol.should.be.equal(TOKEN_SYMBOL);
    decimalUnits.should.be.bignumber.equal(DECIMAL_UNITS);
  });

  it('should not accept payments before start', async function() {
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
    await this.crowdsale
      .buyTokens(investor, { from: investor, value: ether(1) })
      .should.be.rejectedWith(EVMRevert);
  });

  it('should accept payments during the sale', async function() {
    const investmentAmount = ether(1);
    const expectedTokenAmount = RATE.mul(investmentAmount);

    await increaseTimeTo(this.openingTime);
    await this.crowdsale.buyTokens(investor, {
      value: investmentAmount,
      from: investor,
    }).should.be.fulfilled;

    (await this.token.balanceOf(investor)).should.be.bignumber.equal(
      expectedTokenAmount
    );
    (await this.token.totalSupply()).should.be.bignumber.equal(
      expectedTokenAmount
    );
  });

  it('should reject payments after end', async function() {
    await increaseTimeTo(this.afterClosingTime);
    await this.crowdsale.send(ether(1)).should.be.rejectedWith(EVMRevert);
    await this.crowdsale
      .buyTokens(investor, { value: ether(1), from: investor })
      .should.be.rejectedWith(EVMRevert);
  });

  it('should reject payments over cap', async function() {
    await increaseTimeTo(this.openingTime);
    await this.crowdsale.send(CAP);
    await this.crowdsale.send(1).should.be.rejectedWith(EVMRevert);
  });

  it('should allow finalization and transfer funds to wallet if the goal is reached', async function() {
    await increaseTimeTo(this.openingTime);
    await this.crowdsale.send(GOAL);

    const beforeFinalization = web3.eth.getBalance(wallet);
    await increaseTimeTo(this.afterClosingTime);
    await this.crowdsale.finalize({ from: owner });
    const afterFinalization = web3.eth.getBalance(wallet);

    afterFinalization.minus(beforeFinalization).should.be.bignumber.equal(GOAL);
  });

  it('should allow refunds if the goal is not reached', async function() {
    const balanceBeforeInvestment = web3.eth.getBalance(investor);

    await increaseTimeTo(this.openingTime);
    await this.crowdsale.sendTransaction({
      value: ether(1),
      from: investor,
      gasPrice: 0,
    });
    await increaseTimeTo(this.afterClosingTime);

    await this.crowdsale.finalize({ from: owner });
    await this.crowdsale.claimRefund({ from: investor, gasPrice: 0 }).should.be
      .fulfilled;

    const balanceAfterRefund = web3.eth.getBalance(investor);
    balanceBeforeInvestment.should.be.bignumber.equal(balanceAfterRefund);
  });
});
