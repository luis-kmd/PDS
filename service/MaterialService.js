const { map } = require('../App');
const database = require('../models')

class MaterialService {


  static async criar(dados) {
    try {

      const { descricao } = dados;
      const materialExist = await this.buscarPorMaterial(descricao);

      if (materialExist !== null) {
        throw new Error('Material já cadastrado em nosso sistema')
      }
      const material = await database.Material.create(dados);
      return material;


    } catch (error) {
      throw new Error(`Erro ao cadastrar novo material: ${error.message}`);

    }
  }

  static async getAll() {
    try {
      const materiais = await database.Material.findAll();

      const lista = materiais.map(m => ({
        id: m.id,
        valor_unitario: parseFloat(m.valorUnitario),
        quantidadeEstoque: m.quantidadeEstoque,
        descricao: m.descricao
      }))


      return lista || [];
    } catch (error) {
      throw new Error(`Erro ao acessar o banco: ${error.message}`);
    }
  }

  static async atualizaQuantidade(dadosAtualizados) {

    const { quantidadeNova, id } = dadosAtualizados;
    const [listaMateriaisAtualizados] = database.Material.update({
      quantidadeEstoque: quantidadeNova
    }, {
      where: {
        id: id
      }
    });

    return listaMateriaisAtualizados = 0 ? false : true;
  }

  static async deletar(id) {
    try {
      const materialDeletado = await database.Material.destroy({
        where: {
          id: id
        }
      })

      return materialDeletado > 0 ? true : false;
    } catch (error) {
      throw new Error(`Erro ao deletar material: ${error.message}`);
    }
  }

  static async buscarPorMaterial(material) {
    try {
      const materialGet = await database.Material.findOne({
        where: {
          descricao: material
        }
      });

      return materialGet;
    } catch (error) {
      throw new Error('erro ao buscar por material')
    }
  }

  static async buscarMaterialId(id) {
    try {
      const materialExists = await database.Material.findByPk(id);

      if (materialExists !== null) {
        return materialExists
      }
      return false;
    } catch (error) {
      throw new Error('erro ao buscar por material', error.message);

    }
  }

  static async decrementarQuantidade(quantidade, fk_material,) {

    try {
      const { quantidadeEstoque } = await this.buscarMaterialId(fk_material);
      const novaQtd = quantidadeEstoque - quantidade;

      if (novaQtd < 0) {
        throw new Error(`Quantidade em estoque insuficiente para decrementar. 
            Apenas ${quantidadeEstoque} disponiveis no estoque`);
      }

      const [updateMaterial] = await database.Material.update({
        quantidadeEstoque: novaQtd
      }, {
        where: {
          id: fk_material
        }
      });

    } catch (error) {
      throw new Error('erro ao atualizar quantidade:', error.message)
    }
    return true
  }


  static async incrementarEmMaterial(quantidade, fk_material,) {

    try {
      const { quantidadeEstoque } = await this.buscarMaterialId(fk_material);
      const novaQtd = quantidadeEstoque + quantidade;

      if (novaQtd < 0) {
        throw new Error(`Quantidade em estoque insuficiente para decrementar. 
            Apenas ${quantidadeEstoque} disponiveis no estoque`);
      }

      const [updateMaterial] = await database.Material.update({
        quantidadeEstoque: novaQtd
      }, {
        where: {
          id: fk_material
        }
      });

      if (!updateMaterial > 0) {
        throw new Error(`Erro ao atualizar a quantidade do material: ${error.message}`);
      }

    } catch (error) {
      throw new Error('erro ao atualizar quantidade:', error.message)
    }
    return true
  }




}


module.exports = MaterialService;