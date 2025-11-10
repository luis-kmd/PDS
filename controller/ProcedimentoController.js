
const procedimentoService = require('../service/ProcedimentoService.js');   
class ProcedimentoController{


    static async cadastrar(req, res) {
        try {
            const procedimento = req.body;
            const { setor_id } = req.body;

    if (!setor_id || isNaN(setor_id)) {
      return res.status(400).json({ erro: 'setor_id inválido ou não informado.' });
    }

            const procedimentoCriado = await procedimentoService.criar(procedimento, setor_id);
            res.status(201).json({
                message: 'Procedimento criado com sucesso',
                procedimento: procedimentoCriado
            })
        } catch (error) {
            res.status(500).send(error.message);
        }       
}

static async listar(req, res) {
    try {
        const procedimentos = await procedimentoService.listar();
        res.status(200).json({
            message: 'Lista de procedimentos',
            procedimentos: procedimentos
        })
    } catch (error) {
        res.status(500).send(error.message);
    }

} 
static async buscarPorId(req, res) {
    try {
        const { id } = req.params;  
        const procedimento = await procedimentoService.buscarPorId(Number(id));
        res.status(200).json({
            message: 'Procedimento encontrado',
            procedimento: procedimento
        })
    } catch (error) {
        res.status(500).send(error.message);

}
}
static async atualizar(req, res) {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        const foiAtualizado = await procedimentoService.atualizar(Number(id), dadosAtualizados);
        
        if (!foiAtualizado) {
            return res.status(404).json({
                message: 'Procedimento não encontrado ou nenhum dado alterado.'
            });
        }

        res.status(200).json({
            message: 'Procedimento atualizado com sucesso.',
            foiAtualizado
        })

    } catch (error) {
        res.status(500).send(error.message);
}

}

static async deletar(req, res) {
    try {
        const { id } = req.params;
        const deletado = await procedimentoService.deletar(Number(id));
        if (!deletado) {
            return res.status(404).json({
                message: 'Procedimento não encontrado'
            })
        }   
        return res.status(200).json({
            message: `Procedimento ${id} deletado com sucesso`
        })
    }
    catch (error) {
        res.status(500).send(error.message);
    }

}

}
module.exports = ProcedimentoController;