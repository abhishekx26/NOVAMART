const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'novamart',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected: ${process.env.MYSQL_HOST || 'localhost'}`);
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    return sequelize;
  } catch (error) {
    console.error(`Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
