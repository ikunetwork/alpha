const { Client } = require('pg');

class Database {
  static query(query, values) {
    return new Promise((resolve, reject) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      client
        .connect()
        .then(_ => {
          const data = { text: query };
          if (values) {
            data.values = values;
          }
          client.query(data, (err, res) => {
            client
              .end()
              .then(__ => {
                if (err) {
                  reject({ message: err.message });
                } else {
                  resolve(res);
                }
              })
              .catch(e => {
                console.log('DB-ERROR :: error while closing db connection');
                reject({ message: e.message });
              });
          });
        })
        .catch(e => {
          console.log('DB-ERROR :: error while connecting to DB');
          reject({ message: e.message });
        });
    });
  }

  static insert(table, data) {
    const field_names = Object.keys(data).join(',');
    const field_values = Object.keys(data).map((key, i) => data[key]);
    return Database.query(
      `INSERT INTO "${table}"(${field_names}) VALUES(${field_values
        .map((m, i) => `$${i + 1}`)
        .join(',')}) RETURNING *`,
      field_values
    );
  }

  static update(table, data, id) {
    const fields_to_update = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(',');

    const field_values = Object.keys(data).map((key, i) => data[key]);

    return Database.query(
      `UPDATE "${table}" SET ${fields_to_update} WHERE id='${id}'  RETURNING *`,
      field_values
    );
  }

  static get(table, id) {
    return Database.query(`SELECT * FROM "${table}" WHERE id='${id}'`);
  }
}

module.exports = Database;
