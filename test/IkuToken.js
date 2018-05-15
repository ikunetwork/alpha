import decodeLogs from './helpers/decodeLogs';

const IkuToken = artifacts.require('IkuToken');

contract('IkuToken', accounts => {
  let token;
  const creator = accounts[0];

  beforeEach(async () => {
    token = await IkuToken.new({ from: creator });
  });

  it('has a name (IkuToken)', async () => {
    const name = await token.name();
    assert.equal(name, 'IkuToken');
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

    const receipt = web3.eth.getTransactionReceipt(token.transactionHash);
    const logs = decodeLogs(receipt.logs, IkuToken, token.address);
    assert.equal(logs.length, 1);
    assert.equal(logs[0].event, 'Transfer');
    assert.equal(logs[0].args.from.valueOf(), 0x0);
    assert.equal(logs[0].args.to.valueOf(), creator);
    assert(logs[0].args.value.eq(totalSupply));
  });
});
