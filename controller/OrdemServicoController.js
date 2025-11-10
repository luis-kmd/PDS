const ordemService =  require('../service/OrdemServicoService.js');


class OrdemServicoController{

    static async cadastrarOs(req, res){
        try {
            const dados = req.body;
            const novaOS = await ordemService.cadastrar(dados);
            if(novaOS === null){
                return res.status(400).json({
                    message: 'verifique os dados informados.'
                })
            }
            return res.status(200).json({
                message: 'Ordem de serviço cadastrada com sucesso.',
                novaOS
            })
        }
        catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }

    }


    static async buscarPorId(req, res){ 
        try {
            const { id } = req.params;
            const osEncontrada = await ordemService.buscarPeloId(Number(id));
            if(osEncontrada === null){
                return res.status(404).json({
                    message: 'Ordem de serviço não encontrada.'
                })
            }
            return res.status(200).json({
                message: 'Ordem de serviço encontrada:',
                osEncontrada
            })
        } catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }
    }

    static async listarOs(req, res){
        try {
            const listaOS = await ordemService.listar();    
            if(listaOS.length === null){
                return  res.status(404).json({
                    message: 'nenhuma ordem de serviço cadastrada.'
                })
            }
            return res.status(200).json({
                message: 'lista de ordens de serviço:',
                listaOS
            })
        } catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }

    }

    static async deletar(req, res){
        try {
            const { id } = req.params;
            const foiDeletado = await ordemService.deletar(Number(id));
            if(!foiDeletado){
                return res.status(404).json({
                    message: 'Ordem de serviço não encontrada.'
                })
            }
            return res.status(200).json({
                message: `Ordem de serviço id ${id} deletada com sucesso.`
            })
        }
        catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }
    }

    static async pesquisarOsPorStatus(req, res){
        try {
            const { status } = req.params;  
            const osEncontrada = await ordemService.pesquisarPorStatus(status);
            if(osEncontrada === null){
                return res.status(404).json({
                    message: 'Nenhuma ordem de serviço encontrada com esse status.'
                })
            }
            return res.status(200).json({
                message: 'Ordem de serviço encontrada:',
                osEncontrada
            })
        } catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }

    }


     static async pesquisarOsPorStatusPrioridade(req, res){
        try {
            const { status, prioridade } = req.body;  
            const osEncontrada = await ordemService.statusPrioridade(status, prioridade);
            if(osEncontrada === null){
                return res.status(404).json({
                    message: 'Nenhuma ordem de serviço encontrada com esse status.'
                })
            }
            return res.status(200).json({
                message: 'Ordem de serviço encontrada:',
                osEncontrada
            })
        } catch (error) {
            res.status(500).json({
                message: 'Erro no servidor'
            })
        }


}
}
module.exports = OrdemServicoController;