const { Op } = require('sequelize');
const database = require('../models');
const setor = require('./SetorService.js')


class FuncionarioService {

    static async salvar(dados) {

        try {

            const { setor_id, cpf } = dados;
            const validaCpf = await this.#validacao(cpf);

            if (!validaCpf) {
                return null;
            }

            const setorId = await setor.buscarPeloId(setor_id)

            if (setorId === null) {
                return null
            }

            const func = await database.Funcionario.create(dados);
            const { data_demissao, ...novoFunc } = func.dataValues;
            return novoFunc;


        } catch (error) {
            throw new Error('Erro do servidorr')
        }

    }

    static async buscar(id) {
        const funcionario = await database.Funcionario.findByPk(id);

        if (funcionario !== null) {
            return funcionario;
        }
        return null;
    }

    static async listar(req) {

        let { limite = 5, paginas = 1, ordenacao = "id.DESC" } = req.query;
        limite = parseInt(limite);
        paginas = parseInt(paginas);

        let [campoOrdenado, ordem] = ordenacao.split(".");

        if (limite > 0 && paginas > 0) {

            const funcionarios = await database.Funcionario.findAll({
                order: [[campoOrdenado, ordem.toUpperCase() === 'DESC' ? "DESC" : "ASC"]],
                limit: limite,
                offset: (paginas - 1) * limite     // pagina = 2 --> 2 - 1 = 1 * 5 = 5 --> pula 5 
            })

            return funcionarios;
        }

        return null;
    }


    static async pesquisarFuncionario(nomeFuncionario) {

        const funcionario = await database.Funcionario.findOne({
            where: {
                nome: nomeFuncionario
            }
        });
        if (funcionario !== null) {
            return funcionario;
        } else {
            return null;
        }
    }



    static async update(dados) {
        const { id } = dados;

        const [funcAtualizado] = await database.Funcionario
            .update(dados, {
                where: { id: Number(id) }
            });

        return funcAtualizado > 0;

    }

    static async deletar(id) {

        const funcionarioExists = await database.Funcionario.findByPk(id);


        if (funcionarioExists !== null) {

            const funcionarioDeletado = await database.Funcionario.destroy({
                where: { id: id }
            });

            return funcionarioDeletado > 0;
        } else {
            return null;
        }


    }

    static async #validacao(cpf) {

        const funcionarioExists = await this.buscar(cpf);

        if (funcionarioExists !== null) {
            return false;
        }

        return true;

    }

    static async pesquisarPeloNome(req, nome) {
        try {
            const busca = {};
            let { paginas = 1, limite = 5, ordenacao = "id.asc" } = req.query

            let [campoOrdenado, ordem] = ordenacao.split(".")

            busca.nome = {
                [Op.like]: `%${nome}%`
            }

            const funcionarios = await database.Funcionario.findAll({
                where:busca,
                order: [[campoOrdenado, ordem.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
                limit: limite,
                offset: (paginas - 1) * limite
            }

            )
            return funcionarios;
        } catch (error) {
            throw new Error('funcionario nao encontrado');
        }
    }

}




module.exports = FuncionarioService;
