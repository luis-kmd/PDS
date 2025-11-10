const database = require('../models');

async function buscarPorId(id) {
  try {
    
    const manutencao = await database.Manutencao.findByPk(id);
    return manutencao;
  } catch (error) {
    throw new Error(`Erro ao buscar manutenção: ${error.message}`);
  }
}

module.exports = { buscarPorId };
