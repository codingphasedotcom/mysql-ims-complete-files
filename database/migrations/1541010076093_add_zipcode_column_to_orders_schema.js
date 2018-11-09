'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddZipcodeColumnToOrdersSchema extends Schema {
  up () {
    this.raw(`
      ALTER TABLE orders
      ADD COLUMN zipcode INT AFTER state;
      `)
  }

  down () {
    this.raw(`
      ALTER TABLE orders
      DROP COLUMN zipcode;
      `)
  }
}

module.exports = AddZipcodeColumnToOrdersSchema
