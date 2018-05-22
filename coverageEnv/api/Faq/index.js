const Airtable = require('../Airtable');

const api = new Airtable();
const TABLE_NAME = 'FAQ';

class Faq {
  static get(req) {
    return new Promise((resolve, reject) => {
      let items = [];

      const params = {
        maxRecords: 100,
        view: 'Grid view',
      };

      api(TABLE_NAME)
        .select(params)
        .eachPage(
          (records, fetchNextPage) => {
            items = items.concat(
              records.map(r => ({
                id: r.id,
                fields: r.fields,
                createdTime: r._rawJson.createdTime,
              }))
            );

            fetchNextPage();
          },
          err => {
            if (err) {
              reject(err);
            } else {
              resolve(items);
            }
          }
        );
    });
  }

  static post(data) {
    return new Promise((resolve, reject) => {
      api(TABLE_NAME).create(data, (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
  }
}

module.exports = Faq;
