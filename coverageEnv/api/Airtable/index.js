const sdk = require('airtable');

class Airtable {
  constructor() {
    return sdk.base(process.env.AIRTABLE_BASE_ID);
  }
}

module.exports = Airtable;
