

const e = require("express");
const materialService = require("../service/MaterialService.js")

class MaterialController {


    static async cadastraMaterial(req, res) { // c
        try {
            const material = req.body;
            const materialCadastrado = await materialService.criar(material);
            res.status(201).json({
                Message: 'material cadastrado com sucesso',
                material: materialCadastrado
            })

        } catch (error) {
            res.status(500).send(error.message);
        }
    }




    static async listarMaterial(req, res) {  // r
        try {
            const materiais = await materialService.getAll();
            if(materiais.length === 0){
                return res.status(404).json({
                    message: 'nenhum material cadastrado.'
                })
            }

            res.status(200).json({
                message: 'lista de materiais:',
                material: materiais
            })
        } catch (error) {
            throw error
        }
    }


    static async updateMaterial(req, res) {  // u
        const { id } = req.params;

        try {
            const dadosAtualizados = req.body;
            const foiAtualizado = await materialService.atualiza(Number(id), dadosAtualizados); // o number é pq os dados trafegam como string

            if (!foiAtualizado) {
                return res.status(400).json({
                    message: 'Registro nao foi atualizado!'
                })
            }

            return res.status(200).json({
                message: `id ${id} atualizado com sucesso!`
            })

        } catch (error) {
            return res.status(404).json({
                message: 'Material nao encontrado!'
            })
        }
    }


    static async deletarMaterial(req, res) {   // d
        try {
            const { id } = req.params;
            const deletado = await materialService.deletar(Number(id));

            if (deletado) {
                return res.status(200).json({
                    message: `${id} deletado com sucesso!`
                })
            }
        } catch (error) {
            return res.status(404).json({
                message: 'material não encontrado ou nenhum dado alterado.'
            });
        }
    }

    static async buscarMaterial(req, res) {
        const { material } = req.query;

        try {
            const materialBusca = await materialService.buscarPorMaterial(material);

            if (!materialBusca) {
                return res.status(404).json({ message: 'Material não encontrado' });
            }

            res.status(200).json({
                message: 'Material encontrado',
                material: materialBusca
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar material', error: error.message });
        }
    }


}


module.exports = MaterialController;