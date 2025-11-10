

const trabalhaService = require('../service/TrabalhaService.js');


class TrabalhaController{



    static async cadastrar(req, res){
        try {
            const newTrabalha = await trabalhaService.insert(req.dados);
        } catch (error) {
            
        }
    }
}