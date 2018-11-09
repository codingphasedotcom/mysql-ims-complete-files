'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateOrdersSchema extends Schema {
  up () {
    this.raw(
      `CREATE TABLE orders(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(200) NOT NULL,
        l_name VARCHAR(60) NOT NULL,
        address VARCHAR(100) NOT NULL,
        address_2 VARCHAR(100),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(60) NOT NULL,
        country VARCHAR(3) NOT NULL DEFAULT 'USA',
        payment_type VARCHAR(60) NOT NULL DEFAULT 'paypal',
        user_id INT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`)
  }

  down () {
    this.raw(`DROP TABLE ORDERS`)
  }
}

module.exports = CreateOrdersSchema
