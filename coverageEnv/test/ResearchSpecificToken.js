const ResearchSpecificToken = artifacts.require('ResearchSpecificToken');

contract('ResearchSpecificToken', accounts => {
  let token;
  const creator = accounts[0];

  beforeEach(async () => {
    const decimalUnits = 18;
    const tokenName = 'ResearchSpecificToken';
    const tokenSymbol = 'RSTT';

    token = await ResearchSpecificToken.new(
      decimalUnits,
      tokenName,
      tokenSymbol,
      { from: creator }
    );
  });

  it('has a name', async () => {
    const name = await token.name();
    assert.equal(name, 'ResearchSpecificToken');
  });

  it('has a symbol', async () => {
    const symbol = await token.symbol();
    assert.equal(symbol, 'RSTT');
  });

  it('has 18 decimals', async () => {
    const decimals = await token.decimals();
    assert(decimals.eq(18));
  });
});
