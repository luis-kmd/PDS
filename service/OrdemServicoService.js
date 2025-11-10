
const database = require('../models');
const manutencaoRepository = require('../service/ManutencaoRepository.js');
const itensService = require('./ItensService.js')

class OrdemServicoService {

    static async cadastrar(dados) {

        const { manutencao_id, quilometragem_atual, problema, tipo, data_abertura, prioridade } = dados;
        const manutencaoExists = await manutencaoRepository.buscarPorId(manutencao_id);

        if (manutencaoExists == null) return null;

        const newOs = await database.Ordem_Servico.create({
            manutencao_id: manutencao_id,
            quilometragem_atual: quilometragem_atual,
            problema: problema,
            tipo: tipo,
            data_abertura: data_abertura,
            prioridade: prioridade,
        }
        )

        return newOs;
    }

    static async buscarPeloId(id) {
        const ordemServico = await database.Ordem_Servico.findByPk(id);
        if (ordemServico !== null) {
            return ordemServico;
        }
        return null;
    }


    static async atualizaStatusPelaManutencao(novoStatus, id_manutencao, data_fim) {
        const arrayUp = {};

        if (data_fim !== null) {
            arrayUp.data_fechamento = data_fim;
        }

        arrayUp.status = novoStatus;
        const [statusAtualizado] = await database.Ordem_Servico.update({
            ...arrayUp
        },
            {
                where: {
                    manutencao_id: id_manutencao
                }

            });

        return statusAtualizado > 0;

    }

    static async deletar(id) {
        try {

            const id_Os = await this.buscarPeloId(id);
            const deletar = await database.Ordem_Servico.destroy({
                where: {
                    id_Os: id
                }
            });
                if (deletar === 0) {
                return false;
            }
            const incrementarEmItensMaterial = await itensService.deletaEmItens(id_Os);

            

        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return true;

    }

    static async listar() {
        try {
            const ordensServico = await database.Ordem_Servico.findAll({});
            if (ordensServico.length === 0) {
                return null;
            }
            return ordensServico;
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
    }



    static async InserireAtualizarTotalItensPelaItemService(total, id_Os) {

        const { valor_total_itens } = await database.Ordem_Servico.findOne({
            where: {
                id_Os: id_Os
            }
        });

        const novoTotal = valor_total_itens + total;

        const [atualizado] = await database.Ordem_Servico.update(
            { valor_total_itens: novoTotal },
            {
                where: {
                    id_Os: id_Os
                }
            })

        if (!atualizado > 0) {
            throw new Error(`Erro ao atualizar o valor total dos itens`);
        }
        return true;

    }

    static async pesquisarPorStatus(status) {
        try {
            const ordensServico = await database.Ordem_Servico.findAll({ 
                where: {
                    status: status
                }
            });
            if (ordensServico.length === 0) {
                return null;
            }
            return ordensServico;
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
            
    }
    

    static async statusPrioridade(status, prioridade){ 
        try {
            const filtro = {};
            filtro.status = status;
            filtro.prioridade = prioridade
            const ordensServico = await database.Ordem_Servico.findAll({ 
                where: {
                    ...filtro
                }
            });
            
            if (ordensServico.length === 0) {
              throw new Error(`verifique os dados informados.`);
            }
            return ordensServico;
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
            
    }

}


module.exports = OrdemServicoService;