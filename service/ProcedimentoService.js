

const  database = require('../models');
const setor = require('./SetorService.js');
class ProcedimentoService{

    static async criar(procedimento, setor_id){
        try{
               if(setor_id === null){
                throw new Error('Setor não encontrado para o procedimento');
            }
            
            const idSetor = await setor.buscarPeloId(setor_id);

            const novoProcedimento = await database.Procedimento.create(procedimento);
            return novoProcedimento;
        }catch(error){
            throw new Error(`Erro ao criar procedimento: ${error.message}`);
        }
    }       
    static async listar(){
        try{
            const procedimentos = await database.Procedimento.findAll();
            return procedimentos;
        }catch(error){
            throw new Error(`Erro ao listar procedimentos: ${error.message}`);
        }
    }
    static async buscarPorId(id){
        try{
            const procedimento = await database.Procedimento.findByPk(id);
            return procedimento;
        }catch(error){
            throw new Error(`Erro ao buscar procedimento: ${error.message}`);
        }
    }   
    static async atualizar(id, dadosAtualizados){
        try{
            const atualizado = await database.Procedimento.update(dadosAtualizados, {
                where: {
                    id: id
                }
            });
            if(!atualizado > 0){
                throw new Error(`Erro ao atualizar o procedimento: ${error.message}`);
            }
        }catch(error){
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
    }  
    static async deletar(id){
        try{
            const deletar = await database.Procedimento.destroy({
                where: {
                    id: id
                }
            });
        }catch(error){
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }

        return true;
    }
}

module.exports =  ProcedimentoService; 