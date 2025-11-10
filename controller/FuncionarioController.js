

const funcionarioService = require('../service/FuncionarioService.js');



class FuncionarioController {

    static async cadastrar(req, res) {
        try {
            const dados = req.body

            const novoFuncionario = await funcionarioService.salvar(dados);

            if (novoFuncionario === null) {
                res.status(400).json({
                    message: 'verifique os dados informados.'
                })
            }

            res.status(200).json({
                message: 'funcionario cadastrado com sucesso.',
                novoFuncionario
            })
        } catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }
    }

    static async atualizar(req, res) {
        try {
            const dados = req.body;
            const updateFunc = await funcionarioService.update(dados);

            if (updateFunc) {
                res.status(200).json({
                    message: 'funcionario atualizado com sucesso.'
                })
            } else {
                res.status(404).json({
                    message: 'funcionario nao encontrado.'
                })
            }
        } catch (error) {
            console.error('Erro no controller de atualização:', error);

        }
    }

    static async listar(req, res) {
        try {

            const funcGetAll = await funcionarioService.listar(req)
            if (funcGetAll !== null) {
                res.status(200).json({
                    funcionarios: funcGetAll
                })
            }

        } catch (error) {
            res.status(404).json({
                message: 'Não há funcionarios'
            })
        }
    }

    static async deletar(req, res) {
        const { id } = req.params
        try {
            const deletado = await funcionarioService.deletar(Number(id))

            if (deletado) {
                res.status(200).json({
                    message: `funcionario ${id} deletado com sucesso`
                })
            } else {
                res.status(404).json({
                    message: `funcionario não encontrado`
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `erro do servidor`
            })
        }
    }

    static async pesquisarFuncionario(req, res) {
        try {
            const { nome } = req.body
            const funcionario = await funcionarioService.pesquisarPeloNome(req, nome);

            if (funcionario[0] !== null) {
                res.status(200).json({
                    message: 'funcionario encontrado',
                    funcionario: funcionario
                })
            }
        } catch (error) {
            res.status(404).json({
                message: 'funcionario nao encontrado.'
            })
        }
    }

}


module.exports = FuncionarioController;