const veiculo = require('./VeiculoService.js');
const motorista = require('./MotoristaService.js');
const database = require('../models');
const { where, Op } = require('sequelize');

class VeiculoMotoristaService {


    static async atribuirVeiculoMotorista(dados) {

        try {

            const { veiculo_id, motorista_id, data_inicio } = dados

            const verifica = await this.#verificaExistencia(veiculo_id, motorista_id);

            if (!verifica) {
                throw new Error("Motorista ou veículo não encontradoaa.");
            }

            const newVeiculoMotorista = await database.Veiculo_Motorista.create({
                data_inicio,
                fk_veiculo: veiculo_id,
                fk_motorista: motorista_id
            });


            const { data_fim, ...dadosSalvos } = newVeiculoMotorista.dataValues;

            return dadosSalvos;


        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }

    }

    static async atualizarAtribuicaoMotorista(veiculo_id, motorista_id, newMotorista) {
        try {
            const verifica = await this.#verificaExistencia(veiculo_id, motorista_id);

            if (!verifica) {
                throw new Error("Motorista ou veículo não encontrado.");
            }

            const [atualizado] = await database.Veiculo_Motorista.update({
                fk_motorista: newMotorista,

            }, {
                where: {
                    fk_veiculo: veiculo_id,
                    fk_motorista: motorista_id,
                    data_fim: null
                }
            });

            return atualizado > 0;
        }
        catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }
    }

    static async atualizarAtribuicaoVeiculo(veiculo_errado, motorista_id, veiculo_correto) {
        try {
            const verifica = await this.#verificaExistencia(veiculo_errado, motorista_id);

            if (!verifica) {
                throw new Error("Motorista ou veículo não encontrado.");
            }

            const [atualizado] = await database.Veiculo_Motorista.update({
                fk_veiculo: veiculo_correto,
            }, {
                where: {
                    fk_veiculo: veiculo_errado,
                    fk_motorista: motorista_id,
                    data_fim: null
                }
            });

            return atualizado > 0;
        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }
    }





    static async dataFimVinculo(dados) {
        try {
            const { veiculo_id, motorista_id, data_fim } = dados
            const verifica = await this.#verificaExistencia(veiculo_id, motorista_id);

            if (!verifica) {
                throw new Error("Motorista ou veículo não encontrado.");
            }


            if (veiculoExists !== null && motoristaExists !== null) {

                const [atribuicao] = await database.Veiculo_Motorista.update(
                    {
                        data_fim: data_fim
                    },
                    {
                        where: {
                            fk_veiculo: veiculo_id,
                            fk_motorista: motorista_id,
                            data_fim: null
                        }
                    });

                if (!atribuicao > 0) {
                    throw new Error(`Erro ao finalizar a atribuição: ${error.message}`);
                }
            } else {
                throw new Error("Motorista ou veículo não encontrado.");
            }

        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }


    }




    static async deletarVinculo(dados) {
        const { veiculo_id, motorista_id } = dados;
        try {

            const verifica = await this.#verificaExistencia(veiculo_id, motorista_id);
            if (!verifica) {
                throw new Error("Motorista ou veículo não encontrado.");
            }

            const vinculoDeletado = await database.Veiculo_Motorista.destroy({
                where: {
                    fk_veiculo: veiculo_id,
                    fk_motorista: motorista_id,
                    data_fim: null
                }
            })

            return vinculoDeletado > 0;

        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }
    }



    static async listarAtivos() {
        try {
            const vinculos = await database.Veiculo_Motorista.findAll({
                where: {
                    data_fim: null
                }
            });

            return vinculos || [];
        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }
    }

    static async listarInativos() {
        try {
            const vinculos = await database.Veiculo_Motorista.findAll({
                where: {
                    data_fim: {
                        [Op.ne]: null
                    }
                }
            });

            return vinculos || [];

        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }
    }

    static async #verificaExistencia(veiculo_id, motorista_id) {
        const motoristaExists = await motorista.pesquisarMotorista(motorista_id);
        const veiculoExists = await veiculo.buscar(veiculo_id);

        return motoristaExists !== null && veiculoExists !== null;

    }


}






module.exports = VeiculoMotoristaService;   