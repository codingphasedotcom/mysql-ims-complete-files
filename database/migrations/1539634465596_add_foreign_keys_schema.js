'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddForeignKeysSchema extends Schema {
  up () {
    this.raw(
      `ALTER TABLE brands
      ADD CONSTRAINT fk_user_id_brands
      FOREIGN KEY (user_id) REFERENCES users(id)
      `)
    this.raw(
      `ALTER TABLE orders
      ADD CONSTRAINT fk_user_id_orders
      FOREIGN KEY (user_id) REFERENCES users(id)
      `)
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_user_id_items
      FOREIGN KEY (user_id) REFERENCES users(id)
      `)
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_brand_id_items
      FOREIGN KEY (brand_id) REFERENCES brands(id)
      `)
    this.raw(
      `ALTER TABLE items
      ADD CONSTRAINT fk_order_id_items
      FOREIGN KEY (order_id) REFERENCES orders(id)
      `)
  }

  down () {
    this.raw(`
      ALTER TABLE brands
      DROP FOREIGN KEY fk_user_id_brands
      `)
    this.raw(`
      ALTER TABLE orders
      DROP FOREIGN KEY fk_user_id_orders
      `)
    this.raw(`
      ALTER TABLE items
      DROP FOREIGN KEY fk_user_id_items
      `)
    this.raw(`
      ALTER TABLE items
      DROP FOREIGN KEY fk_brand_id_items
      `)
    this.raw(`
      ALTER TABLE items
      DROP FOREIGN KEY fk_order_id_items
      `)
  }
}

module.exports = AddForeignKeysSchema
