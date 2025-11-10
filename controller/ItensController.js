const itensService = require('../service/ItensService.js');

class ItensController {

    static async cadastrarItem(req, res) {
        try {
            const dados = req.body;
            const newItem = await itensService.cadastrar(dados);

            if (newItem !== null) {
                res.status(200).json({
                    message: 'Associação criada com sucesso',
                    item: newItem
                })
            } else{
                res.status(400).json({
                    message: 'Erro ao criar relação, verifique os dados informados.',
                    item: newItem
                }) 
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro do servidor',
                error: error.message
            });
        }
    }

    static async atualizarPreco(req, res){
        try {
            const dados = req.body; 
            const atualizado = await itensService.atualizarPreco(dados);   // falta fazer
            if(atualizado){
                res.status(200).json({
                    message: 'Preco do item atualizada com sucesso.'
                })
            } else{
                res.status(400).json({
                    message: 'verifique a consistencia dos dados informados.'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'erro ao atualizar preço do item.'
            })
        }
    }

    static async atualizarQuantidade(req, res){
        try {
            const dados = req.body; 
            const atualizado = await itensService.atualizarQuantidade(dados);
            if(atualizado){
                res.status(200).json({
                    message: 'Quantidade do item atualizada com sucesso.'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'erro ao atualizar quantidade do item.'
            })
        }
    }

    static async listar(req, res){
        try {
            const itens = await itensService.listar();
            res.status(200).json({ 
                message: 'Lista de Itens',
                itens: itens
            })
        } catch (error) {
            res.status(500).json({
                message: 'erro ao listar Itens.'
            })
        }   

    }

  

    static async deletar(req, res){
        try {
            const {id} = req.params;
            const deletado = await itensService.deletar(Number(id));
            if(deletado){
                res.status(200).json({
                    message: `Item ${id} deletado com sucesso`
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'erro ao deletar Item.'
            })
        }
    }


   
}


module.exports = ItensController;