
const veiculoMotoristaService = require('../service/VeiculoMotoristaService.js');

class VeiculoMotoristaController {

    static async atribuirVeiculoMotorista(req, res) {
        try {
            const dados = req.body;
            const vinculo = await veiculoMotoristaService.atribuirVeiculoMotorista(dados);

            if (!vinculo) {
                return res.status(400).json({
                    message: 'Não foi possível criar. Verifique os dados informados.'
                });
            }

            return res.status(200).json({
                message: 'Veículo atribuído ao motorista com sucesso.',
                vinculo
            });

        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao atribuir veículo ao motorista.',
                error: error.message
            });
        }
    }

    static async listarVinculosAtivos(req, res) {
        try {
            const vinculos = await veiculoMotoristaService.listarAtivos();
            return res.status(200).json({
                message: 'Vínculos listados com sucesso.',
                vinculos
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erro ao listar vínculos.',
                error: error.message
            });
        }
    }

        static async listarVinculosInativos(req, res) { 
        try {
            const vinculos = await veiculoMotoristaService.listarInativos();
            return res.status(200).json({   
                message: 'Vínculos inativos listados com sucesso.',
                vinculos
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erro ao listar vínculos inativos.',

                error: error.message
            });
        }
    }


    static async dataFim(req, res) {
        try {
            const { veiculo_id, motorista_id, data_fim } = req.body;
            const finalizado = await veiculoMotoristaService.dataFimVinculo(veiculo_id, motorista_id, data_fim);
            if (!finalizado) {
                return res.status(404).json({
                    message: 'Vínculo não encontrado ou já finalizado.'
                });
            }

            return res.status(200).json({
                message: 'Vínculo finalizado com sucesso.',
                finalizado
            });
        }
        catch (error) {
            return res.status(500).json({
                message: 'Erro ao finalizar vínculo.',
                error: error.message
            });
        }
    }
    
     // criar metodo em vs ainda
    // static async listarVeiculosPorMotorista(req, res) {
    //     try {
    //         const { motoristaId } = req.params;
    //         const veiculos = await veiculoMotoristaService.listarVeiculosPorMotorista(Number(motoristaId));
    //         return res.status(200).json({
    //             message: 'Veículos do motorista listados com sucesso.',
    //             veiculos
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             message: 'Erro ao listar veículos do motorista.',
    //             error: error.message
    //         });
    //     }
    // }

    // criar metodo em vs ainda
    // static async listarMotoristasPorVeiculo(req, res) {
    //     try {
    //         const { veiculoId } = req.params;
    //         const motoristas = await veiculoMotoristaService.listarMotoristasPorVeiculo(Number(veiculoId));
    //         return res.status(200).json({
    //             message: 'Motoristas do veículo listados com sucesso.',
    //             motoristas
    //         });
    //     }
    //     catch (error) {
    //         return res.status(500).json({
    //             message: 'Erro ao listar motoristas do veículo.',
    //             error: error.message
    //         });
    //     }
    // }
    static async deletar(req, res) {
        try {
            const { veiculo_id, motorista_id } = req.body;
            const desvinculado = await veiculoMotoristaService.deletarVinculo(veiculo_id, motorista_id);

            if (!desvinculado) {
                return res.status(404).json({
                    message: 'Vínculo não encontrado.'
                });
            }
            return res.status(200).json({
                message: 'Vínculo removido com sucesso.'
            });
        }

        catch (error) {
            return res.status(500).json({
                message: 'Erro ao desvincular veículo do motorista.',
                error: error.message
            });
        }

    }


static async finalizarAtribuicao(req, res) {
    try {
        const { veiculo_id, motorista_id, data_fim } = req.body;
        const finalizado = await veiculoMotoristaService.dataFimVinculo(veiculo_id, motorista_id, data_fim);
        
        if (!finalizado) {
            return res.status(404).json({
                message: 'Vínculo não encontrado ou já finalizado.'
            });
        }

        return res.status(200).json({
            message: 'Vínculo finalizado com sucesso.',
            finalizado
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao finalizar vínculo.',
            error: error.message
        });
    }


}

static async atualizarAtribuicaoNewMotorista(req, res) {
    try {
        const { veiculo_id, motorista_id, newMotorista } = req.body;
        const atualizado = await veiculoMotoristaService.atualizarAtribuicaoMotorista(veiculo_id, motorista_id, newMotorista);
        if (!atualizado) {
            return res.status(404).json({
                message: 'Vínculo não encontrado ou nenhum dado alterado.'
            });
        }
        return res.status(200).json({
            message: 'Vínculo atualizado com sucesso.',
            atualizado
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar vínculo.',
            error: error.message
        });
    }

}

static async atualizarAtribuicaoNewVeiculo(req, res) {
    try {
        const { veiculo_errado, motorista_id, veiculo_correto } = req.body; 
        const atualizado = await veiculoMotoristaService.atualizarAtribuicaoVeiculo(veiculo_errado, motorista_id, veiculo_correto);
        if (!atualizado) {
            return res.status(404).json({
                message: 'Vínculo não encontrado ou nenhum dado alterado.'
            });
        }
        return res.status(200).json({
            message: 'Vínculo atualizado com sucesso.',
            atualizado
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar vínculo.',
            error: error.message
        });
    }

}

}

module.exports = VeiculoMotoristaController;