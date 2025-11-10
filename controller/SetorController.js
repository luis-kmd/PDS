


const setorService = require('../service/SetorService.js');

class SetorController {

  static async salvar(req, res) {
    try {
      const novoSetor = await setorService.salvarSetor(req.body);
      return res.status(201).json({
        message: 'Setor criado com sucesso',
        setor: novoSetor
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  
  static async buscarSetorPorNome(req, res) {
    try {
        const { nomeSetor } = req.params; 
        const setor = await setorService.buscarNomeSetor(nomeSetor);

        if (!setor) {
            return res.status(404).json({ message: 'Setor não encontrado' });
        }

        return res.status(200).json(setor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
}

  static async listar(req, res) {
    try {
      const listados = await setorService.listar();
      return res.status(200).json({
        message: 'Dados dos setores',
        setores: listados
      });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }


  static async buscarIdSetor(req, res) {
    try {
      const { id } = req.params
      const set = await setorService.buscarPeloId(Number(id));

      return res.status(200).json({
        message: 'setor encontrado:', set
      })
    } catch (error) {
      return res.status(500).json({
        message: 'setor não existe na empresa:'
      })
    }
  }

  static async atualizarSetor(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;
      const atualiza = await setorService.atualiza(Number(id), dadosAtualizados);

      if (!atualiza) {
        res.status(400).json({
          message: 'registro nao atualizado'
        })
        res.status(200).json({
          message: ` ${id} atualizado com sucesso`
        })

      }

    } catch (error) {
      res.status(400).json({
        message: 'registro ao conectar ao banco'
      })
    }
  }

  static async deletarSetor(req, res) {
    try {
      const { id } = req.params;

      const deletado = await setorService.deletarSetor(id);

      if (!deletado) {
        return res.status(404).json({
          message: 'erro ao deletar setor'
        })
      }

    } catch (error) {
      return res.status(500).json({
        message: 'erro ao conectar ao servidor'
      })
    }
  }

}

module.exports = SetorController;
