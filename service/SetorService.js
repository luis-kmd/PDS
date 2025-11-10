const database = require('../models');

class SetorService {

  static async salvarSetor(dados) {
    try {
      const novoSetor = await database.Setor.create(dados);
      return novoSetor;
    } catch (error) {
      throw new Error('Erro ao salvar: ' + error.message);
    }
  }

  static async listar() {
    try {
      const setores = await database.Setor.findAll({});
      return setores;
    } catch (error) {
      throw new Error(`Erro ao acessar o banco: ${error.message}`);
    }
  }

  static async buscarPeloId(id) {
    try {

      const setorBusca = await database.Setor.findByPk(id);
      return setorBusca;

    } catch (error) {
      throw new Error(`Erro ao acessar o banco: ${error.message}`);
    }
  }

  static async atualiza(id, dados) {
    try {
      const dadosAtualizados = await database.Setor.update(dados, {
        where: {
          id: id
        }
      })

      if (!dadosAtualizados > 0) {
        return false;
      }
    } catch (error) {
      throw new Error(`Erro ao acessar o banco: ${error.message}`);
    }
    return true;
  }


  static async buscarNomeSetor(nomeSetor){
  
    const setor = await database.Setor.findOne({
      where: {
        nome: nomeSetor

      }
    })

    return setor;
  }


  static async deletarSetor(id) {
    try {
      const deletado = await database.Setor.destroy({
        where: {
          id: id
        }
      })

      if (!deletado > 0) {
        throw new Error(`Erro ao deletar Setor: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Erro ao conectar ao banco: ${error.message}`);
    }
    return true;
  }



}

module.exports = SetorService;
