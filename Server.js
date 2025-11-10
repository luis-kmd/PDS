const connect = require('./ConexaoMysql.js'); 
const app = require("./App.js");
const database = require('./models')

const PORT = 3000;

async function iniciarApp() {
  try {
    const sequelize = await connect(); 
    await sequelize.authenticate(); 
    console.log(' Conexão com o banco realizda.');

    app.listen(PORT, () => {
      console.log(` Servidor escutando na porta ${PORT}`);
    });
    
  

  } catch (error) {
    console.error(' Erro ao conectar ao banco:', error);
    process.exit(1);
  }

 criaTabelas();
}


async  function criaTabelas(){
 await database.sequelize.sync();
}

iniciarApp();
