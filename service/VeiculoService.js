const database = require('../models');
const modeloService = require('./ModeloService.js');

class VeiculoService {


    static async salvar(dados) {
        try {
            const { modelo_id } = dados
            const modeloExists = await modeloService.buscarPorId(modelo_id);
            if (modeloExists !== null) {
                return await database.Veiculo.create(dados);
            } else {
                throw new Error(`modelo ${modelo_id} não existe.`);
            }
        } catch (error) {
            throw new Error(`Erro ao criar veiculo: ${error.message}`);
        }
    }


    static async buscar(id) {
        try {
            const veiculo = await database.Veiculo.findByPk(id);
            if (veiculo !== null) {
                return veiculo;
            } else {
                return null
            }
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }

    }

    static async atualizarVeiculo(id, dados) {
        try {
            const atualizado = await database.Veiculo.update(dados, {
                where: {
                    id: id
                }
            })
            if (!atualizado > 0) {
                throw new Error(`Erro ao atualizar o veiculo: ${error.message}`);
            }
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }

        return true;
    }

    static async deletarVeiculo(id) {
        try {
            const deletar = await database.Veiculo.destroy({
                where: {
                    id: id
                }
            })
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }

        return true;
    }

    static async listar() {
        try {
            const veiculos = await database.Veiculo.findAll({});
            return veiculos;
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
    }


}

module.exports = VeiculoService;