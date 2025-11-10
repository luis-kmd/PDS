const database =  require('../models')
const procedimento = require('../service/ProcedimentoService.js');
const funcionario = require('../service/FuncionarioService.js');
// const os =  require('../service/')

class TrabalhaService{

    static async insert(dados){
        try {

            const{funcionario_id, id_os, procedimento_id} =  req.dados;

            const funcionarioExists = await funcionario.buscar(funcionario_id);
            const procedimentoExists =  await procedimento.buscarPorId(procedimento_id);
            

            const newTrabalha = await database.Trabalha.create(dados);

            if(newTrabalha !== null){
                return newTrabalha;
            } else{
                 throw new Error(`Erro ao cadastrar serviço: ${error.message}`);
            }
             
        } catch (error) {
              throw new Error(`Erro do servidor: ${error.message}`);
        }
    }
}

module.exports = TrabalhaService;