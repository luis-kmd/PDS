const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('transvicon', 'root', 'root', {
  host: 'localhost',    
  dialect: 'mysql',   
  logging: false    
});

async function connect() {
  try {
    await sequelize.authenticate(); 
  } catch (error) {
    console.error('Não foi possível conectar:', error);
  }

  return sequelize;
}

module.exports = connect;
