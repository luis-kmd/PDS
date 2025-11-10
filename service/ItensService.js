const database = require('../models');
const material = require('../service/MaterialService.js');
const ordemServico = require('../service/OrdemServicoService.js')


class ItensService {


    static async cadastrar(dados) {


        const { id_Os, fk_material, quantidade } = dados;
        const verifica = await this.#verificaExistencia(id_Os, fk_material);

        if (!verifica) return null;

        const { valorUnitario } = await material.buscarMaterialId(fk_material)

        const dadosValidos = {};
        dadosValidos.valor_unitario = valorUnitario;
        dadosValidos.quantidade = quantidade;
        dadosValidos.fk_material = fk_material;
        dadosValidos.id_Os = id_Os;

        const newVinculo = await database.Itens.create(dadosValidos)

        await this.#insereTotalOs(quantidade, valorUnitario, id_Os);
        await this.#decQuantidadeMaterial(quantidade, fk_material)

        return newVinculo;

    }

    static async listar() {
        const itens = await database.Itens.findAll();
         if (itens.length > 0) {
            return itens;
        }

        return null;
    }



    static async atualizarQuantidade(dados) {
        const { id_material, id_os, novaQuantidade } = dados; // novaQuantidade = 20

        const verifica = await this.#verificaExistencia(id_os, id_material);
        if (!verifica) return false;


        const material = await material.buscarMaterialId(id_material);
        const buscaItem = await this.buscaItem(id_material, id_os);
        const { quantidade } = buscaItem;   // 10
        const { quantidadeEstoque } = material;

        if (buscaItem === null) {
            return false;
        }

        const diferenca = novaQuantidade - quantidade;  // 20 - 10 == -10 usou mais material, tem q decrementar

        if (quantidadeEstoque < diferenca) {
            return false; 
            
        }

        if (diferenca > 0) {
            await this.#decQuantidadeMaterial(diferenca, id_material);
        } else {
            diferenca *= -1;
            await this.#incrQuantidadeMaterial(diferenca, id_material);
        }


        const [itemUpdate] = await database.Itens.update({
            quantidade: novaQuantidade

        },
            {
                where: {
                    fk_material: id_material,
                    fk_Os: id_os
                }
            });

        if (!itemUpdate > 0) {
            return false;
        }


        return itemUpdate > 0;
    }


    static async buscaItem(id_material, id_os) {
        try {
            const dados = await database.Itens.findOne(
                {
                    where: {
                        fk_material: id_material,
                        id_Os: id_os
                    }
                }
            );
            return dados;
        } catch (error) {
            throw new Error('erro ao buscar item')
        }

    }


    static async deletaEmItens(id_Os) {

        const listaItens = await database.Itens.findAll({
            where: {
                id_Os: id_Os
            }
        });

        if (listaItens === null) {
            return false;
        }

        for (let i = 0; i < listaItens.length; i++) {
            const { quantidade, fk_material } = listaItens[i];
            const incrementarEmMaterial = await this.#incrQuantidadeMaterial(quantidade, fk_material);

        }

        const relacaoDeletada = await database.Itens.destroy({
            where: {
                id_Os: id_Os
            }
        });

        if (relacaoDeletada === 0) {
            return false;
        }
        return true;

    }



    static async  #verificaExistencia(os_id, material_id) {
        try {

            const os_Exists = await ordemServico.buscarPeloId(os_id);
            const materialExist = await material.buscarMaterialId(material_id);

            if (os_Exists === null || materialExist === null) {
                return false;
            }
            return true;

        } catch (error) {
            throw new Error('erro ao buscar material ou ordem de serviço');
        }
    }


    static async #decQuantidadeMaterial(quantidade, fk_material) {
        const mat = await material.decrementarQuantidade(quantidade, fk_material);

        if (mat) {
            return true
        }

        return false;
    }


    static async #incrQuantidadeMaterial(quantidade, fk_material) {
        const mat = await material.incrementarEmMaterial(quantidade, fk_material);

        if (mat) {
            return true
        }

        return false;
    }

    static async #insereTotalOs(quantidade, valorUnitario, id_Os) {
        const total = quantidade * valorUnitario;
        await ordemServico.InserireAtualizarTotalItensPelaItemService(total, id_Os)
    }


    static async buscarItens(id_Os) {
        try {
            const item = await database.Itens.findOne({
                where: {
                    id_Os: id_Os
                }
            });
            return item;
        } catch (error) {
            throw new Error(`Erro ao acessar o banco: ${error.message}`);
        }
        return null;
    }

}


module.exports = ItensService;