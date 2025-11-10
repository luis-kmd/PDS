
const database = require("../models");


class MotoristaService {


    static async criar(req) {
        try {
            const motoristaCreate = await database.Motorista.create(req);
            return motoristaCreate;
        } catch (error) {
            throw new Error(`Erro ao criar motorista: ${error.message}`);
        }
    }


    static async pesquisarMotorista(id) {
        try {
            const motorista = await database.Motorista.findByPk(id);

            if (motorista !== null) {
                return motorista;
            } else {
                return null
            }

        } catch (error) {
            throw new Error(`Erro ao pesquisar motorista: ${error.message}`);
        }
    }


    static async atualizar(id, dados) {
        try {
            const motoristaUp = await database.Motorista.update(dados, {
                where: {
                    id: id
                }
            })

            if (motoristaUp > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new Error(`Erro ao atualizar motorista: ${error.message}`);
        }
    }


    static async deleta(id) {
        try {
            const motoristaDelete = await database.Motorista.destroy(
                {
                    where: {
                        id: id
                    }
                }
            )
        } catch (error) {
            throw new Error(`Erro ao deletar motorista: ${error.message}`);
        }

        return true;
    }
}

module.exports = MotoristaService;

