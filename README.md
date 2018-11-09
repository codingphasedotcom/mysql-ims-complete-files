# Inventory Management System with Node JS, Adonis Js, React, MYSQL

This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## How to run
* Run npm install to install all dependencies
```bash
npm install to install
```

* Make a copy of .env.example rename it to .env

* Generate the secret key
```bash
adonis key:generate
```

* Add all of your configuration to your database on the .env file

* Run migrations
```bash
adonis migration:run
```

* Start your server up
```bash
adonis serve --dev
```
