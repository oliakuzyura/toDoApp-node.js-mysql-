const mysqlConnetion = require("../connection");

class Item {
  constructor(name) {
    this.name = name;
  }

  static insert(new_item) {
    return new Promise((resolve, reject) => {
        mysqlConnetion.query(`INSERT INTO items(name) VALUES('${new_item}')`, (err) => {
                if (!err) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
        });
    })
  }

  static getAll() {
      return new Promise((resolve, reject) => {
        mysqlConnetion.query("SELECT * from items", (err, rows, fields) => {
                if (!err) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
        });
    })
        
  }

  static update(id, Item) {
    return new Promise((resolve, reject) => {
      mysqlConnetion.query(`UPDATE items SET name='${Item}' WHERE id='${id}'`, (err, rows, fields) => {
              if (!err) {
                  resolve(rows);
              }
              else {
                  reject(err);
              }
      });
  })
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
        mysqlConnetion.query(`DELETE FROM items WHERE id="${id}"`, (err) => {
                if (!err) {
                    resolve(true);
                }
                else {
                    console.log(err);
                }
        });
    })
  }

  static console(){
    console.log('Olga');
  }
}
module.exports = Item;
