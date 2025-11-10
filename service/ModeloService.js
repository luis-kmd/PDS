const database = require('../models');


class ModeloService{
 


    static async criar(dados) {
        try {
            const newModelo = await database.Modelo.create(dados);
            return newModelo;
        } catch (error) {
            throw new Error(`Erro ao criar modelo: ${error.message}`);
        }
    }       

    static async listar() {
        try {
            const procedimentos = await database.Modelo.findAll();
            return procedimentos;
        } catch (error) {
            throw new Error(`Erro ao listar modelos: ${error.message}`);
        }
    }
    static async buscarPorId(id) {
        try {
            const procedimento = await database.Modelo.findByPk(id);
            return procedimento;
        } catch (error) {
            throw new Error(`Erro ao buscar modelo: ${error.message}`);
        }
        
    }   
    static async atualizar(id, dadosAtualizados) {
        try {   
            const atualizado = await database.Modelo.update(dadosAtualizados, {
                where: {
                    id: id
                }
            });
            if (!atualizado > 0) {
                throw new Error(`Erro ao atualizar o modelo: ${error.message}`);
            }
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return true;
    }
    static async deletar(id) {
        try {
            const deletar = await database.Modelo.destroy({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return true;
    }

}   

module.exports = ModeloService;