'use strict'
const Database = use('Database')
const sanitize = use('sqlstring')

class OrderController {
  async index({view, request, response}){
    try {
      let allOrders = await Database.raw(`
        SELECT orders.id, concat(orders.f_name, ' ', orders.l_name) as customer,
        SUM(items.qty) as total_items,
        SUM(items.price * items.qty) as total_price, concat(orders.state, ' ', orders.country) as location,
        orders.payment_type, concat(users.f_name, ' ', users.l_name) as user
        FROM orders
        INNER JOIN items
        ON orders.id = items.order_id
        INNER JOIN users
        ON orders.user_id = users.id
        GROUP BY orders.id
      `)
      allOrders = allOrders[0]
      return view.render('admin/orders/all', {allOrders})
    } catch (error){
      console.log(error)
      return response.redirect('back')
    }

  }
  async store({request, response}){
    try {
      const post = request.post()
      const order = await Database.raw(`
        INSERT INTO orders (f_name, l_name, address, address_2, city, state, country, zipcode, payment_type,  user_id)
        Values(${sanitize.escape(post.form.f_name)}, ${sanitize.escape(post.form.l_name)},
        ${sanitize.escape(post.form.address)},
        ${sanitize.escape(post.form.address_2)},
        ${sanitize.escape(post.form.city)},
        ${sanitize.escape(post.form.state)},
        ${sanitize.escape(post.form.country)},
        ${sanitize.escape(post.form.zipcode)},
        ${sanitize.escape(post.form.payment_type)},
        ${parseInt(1)});
      `).then((order) =>{
        const order_id = order[0].insertId
        post.allItems.map((item) => {
          const insertItem = Database.raw(`
            INSERT INTO items (title, sku, price, material, description, brand_id, qty, size, order_id, user_id)
            Values(${sanitize.escape(item.productInfo.title)}, ${sanitize.escape(item.productInfo.sku)},
            ${sanitize.escape(item.productInfo.price)},
            ${sanitize.escape(item.productInfo.material)},
            ${sanitize.escape(item.productInfo.description)},
            ${sanitize.escape(item.productInfo.brand_id)},
            ${sanitize.escape(item.qtyBuying)},
            ${sanitize.escape(item.productInfo.size)},
            ${sanitize.escape(order_id)},
            ${parseInt(1)});
          `).then(() => {
            console.log('successfully saved item')
            /* --------------------- */
            const updtateProduct = Database.raw(`
              Update products
              SET qty = qty - ${item.qtyBuying}
              WHERE id = ${item.productInfo.id}
            `).then(() => {
              console.log('successfully updated product')
            }).catch((error) => {
              console.log(error)
              return {
                status: 'error',
                message: "Can't update product",
                error: error.sqlMessage
              }
            })
            /* --------------------- */
          }).catch((error) => {
            console.log(error)
            return {
              status: 'error',
              message: "Can't save item",
              error: error.sqlMessage
            }
          })
        })
      })

      return {
        status: 'success',
        message: "Saved Order"
      }
    } catch (error){
      console.log(error)
      return {
        status: 'error',
        message: "Can't save order",
        error: error.sqlMessage
      }
    }
  }
  async create({view, request, response}){
    // let brands = await Database.raw(`
    //   SELECT * FROM brands
    //   ORDER BY brands.title ASC
    // `)
    let brands = ''
    return view.render('admin/orders/create', {brands})
  }
  async show({view, request, response, params}){
    try {
      let order = await Database.raw(`
        SELECT orders.*, concat(users.f_name, ' ', users.l_name) as user FROM orders
        INNER JOIN users
        ON orders.user_id = users.id
        WHERE orders.id = ${params.id};
      `)
      order = order[0][0]
      let items = await Database.raw(`
        SELECT *, products.img_url FROM items
        INNER JOIN products
        ON items.title = products.title
        WHERE order_id = ${params.id};
      `)
      items = items[0]
      let total_price = await Database.raw(`
        SELECT orders.id,
        SUM(items.qty) as total_items,
        SUM(items.qty * items.price) as total_price
        FROM orders
        INNER JOIN items
        ON orders.id = items.order_id
        WHERE orders.id = ${params.id}
        GROUP BY orders.id;
      `)
      total_price = total_price[0][0].total_price
      let orderInfo = {
        order,
        items,
        total_price
      }
      // return orderInfo

      return view.render('admin/orders/show', {orderInfo})
    } catch (error){
      console.log(error)
      return response.redirect('back')
      // `<h1 style="color: red">there was an error</h1>
      // <h3>${error.sqlMessage}</h3>
      // `
    }
  }
  async edit({view, request, response, params}){
    try {
      let order = await Database.raw(`
        SELECT orders.id,
        orders.title, orders.sku, orders.img_url, orders.description, brands.title as brand,
        concat(users.f_name, ' ', users.l_name) as user,
        orders.material, orders.qty, orders.size,
        orders.user_id, orders.brand_id, orders.created_at
        FROM orders
        INNER JOIN brands
        ON orders.brand_id = brands.id
        INNER JOIN users
        ON orders.user_id = users.id
        WHERE orders.id = ${params.id}
        ORDER BY created_at ASC
        LIMIT 1
      `)
      order = order[0][0]

      let brands = await Database.raw(`
        SELECT * FROM brands
        ORDER BY brands.title ASC
      `)
      brands = brands[0]


      return view.render('admin/orders/edit', {order, brands})
    } catch (error){
      console.log(error)
      return response.redirect('back')
      // `<h1 style="color: red">there was an error</h1>
      // <h3>${error.sqlMessage}</h3>
      // `
    }
  }
  async update({request, response, params}){
    try {
      const id = params.id
      const post = request.post()
      await Database.raw(`
        UPDATE orders
        SET
        title = ${sanitize.escape(post.title)},
        sku = ${sanitize.escape(post.sku)},
        img_url = ${sanitize.escape(post.img_url)},
        material = ${sanitize.escape(post.material)},
        description = ${sanitize.escape(post.description)},
        brand_id = ${sanitize.escape(post.brand_id)},
        qty = ${sanitize.escape(post.qty)},
        size = ${sanitize.escape(post.size)},
        user_id = ${parseInt(1)}
        WHERE id = ${id}
      `)

      return response.redirect(`/admin/orders/${id}`)
    } catch (error){
      console.log(error)
      return response.redirect('back')
    }
  }

  async delete({request, response, params}){
    try {
      const order_id = params.id
      await Database.raw(`
        DELETE FROM items
        WHERE items.order_id = ${order_id}
      `)
      await Database.raw(`
        DELETE FROM orders
        WHERE orders.id = ${order_id}
      `)

      return response.redirect(`/admin/orders`)
    } catch (error){
      console.log(error)
      return response.redirect('back')
    }
  }
}

module.exports = OrderController
