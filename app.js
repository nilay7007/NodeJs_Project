const path = require('path');
const errorController=require('./controllers/error')
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//its a middleware whihc runs after sequelize statements(sync and all initialization)
//is done.so it will be executed after that(depends)
app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      //storing i n request-> req.user..
      req.user = user;
      // = user is an sequelize object not the js object
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
//user created product. onDelete: 'CASCADE'->if user is deleted then product shud also
//be deleted
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });


sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
    //return user;->promise as everything rteurned in promise is itself a promise
  })
  .then(user => {
    // console.log(user);
    return user.createCart();
  })
  .then(cart => {
    // console.log(user);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
//sync create a table into database from our model .and if table is there the relations

// sequelize
//   .sync()
//   .then(result => {
//     console.log(result);
//     app.listen(3000);
//   })
//   .catch(err => {
//     console.log(err);
//   }); 

  /*
  sequelize
  .sync()
  .then(result => {
    console.log(result);->>>>>>>>OUTPUT
  <ref *1> Sequelize {
  options: {
    dialect: 'mysql',
    dialectModule: null,
    dialectModulePath: null,
    host: 'localhost',
    protocol: 'tcp',
    define: {},
    query: {},
    sync: {},
    timezone: '+00:00',
    clientMinMessages: 'warning',
    standardConformingStrings: true,
    logging: [Function: log],
    omitNull: false,
    native: false,
    replication: false,
    ssl: undefined,
    pool: {},
    quoteIdentifiers: true,
    hooks: {},
    retry: { max: 5, match: [Array] },
    transactionType: 'DEFERRED',
    isolationLevel: null,
    databaseVersion: '8.0.23',
    typeValidation: false,
    benchmark: false,
    minifyAliases: false,
    logQueryParameters: false
  },
  config: {
    database: 'node-complete',
    username: 'root',
    password: 'abcdabcd',
    host: 'localhost',
    port: 3306,
    pool: {},
    protocol: 'tcp',
    native: false,
    ssl: undefined,
    replication: false,
    dialectModule: null,
    dialectModulePath: null,
    keepDefaultTimezone: undefined,
    dialectOptions: undefined
  },
  dialect: <ref *2> MysqlDialect {
    sequelize: [Circular *1],
    connectionManager: ConnectionManager {
      sequelize: [Circular *1],
      config: [Object],
      dialect: [Circular *2],
      versionPromise: null,
      dialectName: 'mysql',
      pool: [Pool],
      lib: [Object]
    },
  */
  