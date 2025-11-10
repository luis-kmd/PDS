
const manutencaoService = require('../service/ManutencaoService');

class ManutencaoController {

    static async cadastrar(req, res) {
        try {
            const dados = req.body;
            const novaManutencao = await manutencaoService.create(dados);

            if (novaManutencao !== null) {
                res.status(200).json({
                    message: 'Manutencão cadastrada com sucesso.',
                    manutencao: novaManutencao
                })
            }

        } catch (error) {
            res.status(500).json({
                message: 'erro ao cadastrar manutenção.'
            })
        }
    }

    static async listar(req, res) {
        try {

            const manutencoes = await manutencaoService.listar();
            res.status(200).json({
                message: 'Lista de manutenções',
                manutencoes: manutencoes
            })
        } catch (error) {
            res.status(500).json({
                message: 'erro ao listar manutenções.'
            })
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const manutencao = await manutencaoService.buscarPorId(Number(id));
            res.status(200).json({
                message: 'Manutenção encontrada',
                manutencao: manutencao
            })
        }
        catch (error) {
            res.status(500).json({
                message: 'erro ao buscar manutenção.'
            })
        }
    }


    static async atualizar(req, res) {
        try {

            const { dadosAtualizados } = req.body;
            const { id } = dadosAtualizados;
            const manutencaoAtualizada = await manutencaoService.atualizar(dadosAtualizados);

            if (manutencaoAtualizada) {
                res.status(200).json({
                    message: 'Manutenção atualizada com sucesso.',
                    manutencao: manutencaoAtualizada
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'erro ao atualizar manutenção.'
            });
        }
    }

    static async iniciarManutencao(req, res) {
        try {
            const { id_manutencao, data_inicio } = req.body;
            const iniciar = await manutencaoService.iniciar(id_manutencao, data_inicio);
            if (iniciar === null) {
                res.status(400).json({
                    message: 'verifique os dados informados'
                })
            }

            res.status(200).json({
                message: 'Manutenção iniciada com sucesso.',
                manutencao: iniciar
            })
        } catch (error) {
            res.status(500).json({
                message: 'erro do servidor'
            })
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const deletado = await manutencaoService.deletar(Number(id));

            if (!deletado) {
                res.status(404).json({
                    message: 'Manutenção não encontrada.'
                });
            }
            res.status(200).json({
                message: `Manutenção ${id} deletada com sucesso`
            });
        } catch (error) {
            res.status(500).json({
                message: 'Erro interno ao deletar manutenção.',
                error: error.message
            });
        }
    }

    static async finalizarManutencao(req, res) {
        try {
            const { data_fim, id_manutencao } = req.body;
            const manutencaoFinalizada = await manutencaoService.finalizar(id_manutencao, data_fim);
            if (manutencaoFinalizada === null) {
                res.status(400).json({
                    message: 'verifique a validade dos dados informados'
                });
            }

            res.status(200).json({
                message: 'Manutenção finalizada com sucesso.',
                manutencao: manutencaoFinalizada
            });


        } catch (error) {
            res.status(500).json({
                message: 'erro do servidor',
                error: error.message
            })
        }
    }

}

module.exports = ManutencaoController