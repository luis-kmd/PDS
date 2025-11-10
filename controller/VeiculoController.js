const veiculoService = require('../service/VeiculoService.js');



class VeiculoController {

    static async cadastrarVeiculo(req, res) {
        try {
            const dados = req.body;
            const veiculoNovo = await veiculoService.salvar(dados);

            if (veiculoNovo !== null) {
                res.status(200).json({
                    message: 'Veiculo criado com sucesso.',
                    veiculo: veiculoNovo
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: 'erro ao criar veiculoo',
                error
            })
        }
    }

    static async atualizaVeiculo(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;
            const atualizadoVeiculo = await veiculoService.atualizarVeiculo(Number(id), dados)

            if (!atualizadoVeiculo) {
                res.status(404).json({
                    message: 'Veiculo não encontrado e nenhuma linha atualizada'
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: 'erro ao atualizar veiculo',
                error
            })
        }
    }

    static async buscarVeiculo(req, res) {
        const { id } = req.params;

        try {
            const veiculo = await veiculoService.buscar(Number(id));
            res.status(200).json({
                message: 'Veiculo encontrado com sucesso.', veiculo
            })

        } catch (error) {
            res.status(500).json({
                message: 'erro ao buscar veiculo'
            })
        }
    }

    static async listarVeiculos(req, res) {
        try {
            const veiculos = await veiculoService.listar();
            res.status(200).json({
                message: 'Lista de Veiculos',
                veiculos: veiculos
            })
        }
        catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }
    }

    static async deletar(req, res) {
        try {
            const { id } = req.params;
            const deletado = await veiculoService.deletarVeiculo(Number(id));

            if (!deletado) {
                return res.status(404).json({
                    message: 'erro ao deletar veiculo, nenhuma linha atualizada',
                    error
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: 'erro ao acessar o banco',
                error
            })
        }
    }




}

module.exports = VeiculoController;