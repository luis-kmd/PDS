const modeloService = require('../service/ModeloService.js');

class ModeloController{   


    static async cadastrar(req, res) {
        try {
            const modelo = req.body;
                
            const modeloCriado = await modeloService.criar(modelo);
            res.status(201).json({
                message: 'Modelo  criado com sucesso',
                modelo: modeloCriado
            })
        } catch (error) {
            res.status(500).send(error.message); 
        }   
}
    static async listar(req, res) {
        try {
            const modelos = await modeloService.listar();   
            res.status(200).json({
                message: 'Lista de Modelos',
                modelosCV: modelos
            })
        }

            catch (error) {
            res.status(500).send(error.message);
        }
    }
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;  
            const newModelo = await modeloService.buscarPorId(Number(id));
            res.status(200).json({
                message: 'Modelo  encontrado',
                modelo: newModelo
            })
        } catch (error) {
            res.status(500).send(error.message);
        }

}
    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;  
            const foiAtualizado = await modeloService.atualizar(Number(id), dadosAtualizados);
            if (!foiAtualizado) {
                return res.status(404).json({
                    message: 'Modelo CV não encontrado ou nenhum dado alterado.'
                });
            }
            res.status(200).json({
                message: 'Modelo CV atualizado com sucesso.',
                foiAtualizado
            })
        } catch (error) {
            res.status(500).send(error.message);
        }
    }

}

module.exports = ModeloController;