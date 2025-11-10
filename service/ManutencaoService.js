const veiculo = require('./VeiculoService.js');
const motorista = require('./MotoristaService.js');
const database = require('../models');
// const manutencao = require('../models/manutencao.js');
const { where } = require('sequelize');
const oS = require('../service/OrdemServicoService.js')

class ManutencaoService {



    static async create(dados) {

        const { motorista_id, veiculo_id } = dados;

        try {
            const motoristaExists = await motorista.pesquisarMotorista(motorista_id);
            const veiculoExists = await veiculo.buscar(veiculo_id);

            if (motoristaExists !== null && veiculoExists !== null) {

                const { data_inicio, data_fim, ...dados } = await database.Manutencao.create({
                    fk_motorista: motorista_id,
                    fk_veiculo: veiculo_id
                }
                );

                return dados;
            }

        } catch (error) {
            throw new Error(`Erro ao cadastrar manutencão: ${error.message}`);
        }

        return null;
    }

    static async listar() {
        try {
            const manutencoes = await database.Manutencao.findAll();
            if (manutencoes !== null) {
                return manutencoes;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Erro ao listar manutenções: ${error.message}`);
        }
    }


    static async buscarPorId(id) {
        try {
            const manutencao = await database.Manutencao.findByPk(id);

            if (manutencao === null) return null

            return manutencao;
        } catch (error) {
            throw new Error(`Erro do servidor: ${error.message}`);
        }

    }

    static async atualizarMotorista(manutencao_id, newMotorista) {
        try {

            if (newMotorista !== null) {
                const motoristaExists = await motorista.pesquisarMotorista(newMotorista);

                if (motoristaExists === null) {
                    throw new Error(`Motorista ${newMotorista} não encontrado.`);
                }
            }


            const manutencaoExists = await this.buscarPorId(manutencao_id);
            if (manutencaoExists === null) {
                return false
            }

            const [atualizado] = await database.Manutencao.update({
                fk_motorista: newMotorista
            }, {
                where: {
                    id_manutencao: manutencao_id
                }
            });

            if (!atualizado > 0) {
                throw new Error(`Erro ao atualizar a motorista da associação: ${error.message}`);
            }
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return true;

    }

    static async deletar(id) {
        try {
            const manutencaoExists = await this.buscarPorId(id);

            if (manutencaoExists === null) {
                return false;
            }
            const deletar = await database.Manutencao.destroy({
                where: {
                    id_manutencao: id
                }
            });
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return true;
    }


    static async atualizar(dadosAtualizados) {
        try {
            const { data_inicio, data_fim, fk_veiculo, id, fk_motorista } = dadosAtualizados;
            const listaUp = {};

            if (data_inicio !== null) {
                listaUp.data_inicio = data_inicio;
            }

            if (data_fim !== null) {
                listaUp.data_fim = data_fim;
            }

            if (fk_veiculo !== null) {
                const veiculoExists = await veiculo.buscar(fk_veiculo);

                if (veiculoExists === null) {
                    throw new Error(`Veículo ${fk_veiculo} não encontrado.`);
                }
                listaUp.fk_veiculo = fk_veiculo;
            }

            if (fk_motorista !== null) {
                const motoristaExists = await motorista.pesquisarMotorista(fk_motorista);
                if (motoristaExists !== null) {
                    listaUp.fk_motorista = fk_motorista
                } else {
                    throw new Error(`Veículo ${fk_motorista} não encontrado.`);
                }
            }


            const atualizado = await database.ManutencaoService.update({
                ...listaUp
            }, {
                where: {
                    id_manutencao: id
                }
            })

            if (!atualizado > 0) {
                throw new Error(`Erro ao atualizar a manutenção: ${error.message}`);
            }

        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }

        return true;
    }


    static async iniciar(manutencao_id, data_inicio) {
        try {
            const existsManutencao = await this.buscarPorId(manutencao_id);

            if (existsManutencao === null) return null;

            const [manutecInicio] = await database.Manutencao.update({
                data_inicio: data_inicio
            },
                {
                    where: {
                        id_manutencao: manutencao_id
                    }
                })

            if (manutecInicio > 0) {
                const status = 'Em andamento'
                const atualizaStatus = await this.#atualizaOs(status, manutencao_id);

                if (!atualizaStatus) {
                    throw new Error(`Erro ao atualizar status da Ordem de serviço`);
                }

            }

            const { data_fim, ...dados } = await this.buscarPorId(manutencao_id)
            return dados;

        } catch (error) {
            throw new Error(`Erro ao iniciar a manutenção: ${error.message}`);
        }

    }


    static async finalizar(manutencao_id, data_fim) {
        try {
            const existsManutencao = await this.buscarPorId(manutencao_id);

            if (existsManutencao === null) return null;

            const [manutecInicio] = await database.Manutencao.update({
                data_fim: data_fim
            },
                {
                    where: {
                        id_manutencao: manutencao_id
                    }
                })

            if (manutecInicio > 0) {
                const status = 'Finalizada'
                const atualizaStatus = await this.#atualizaOs(status, manutencao_id, data_fim);
                if (!atualizaStatus) {
                    throw new Error(`Erro ao atualizar status da Ordem de serviço`);
                }

            }

            const dados = await this.buscarPorId(manutencao_id)
            return dados;

        } catch (error) {
            throw new Error(`Erro ao iniciar a manutenção: ${error.message}`);
        }
        return null;
    }



    static async #atualizaOs(status, id, data_fim) {
        const statusAtualizado = await oS.atualizaStatusPelaManutencao(status, id, data_fim)
        if (statusAtualizado) {
            return true
        }
        return false
    }


}



module.exports = ManutencaoService;