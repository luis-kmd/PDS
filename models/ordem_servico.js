'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ordem_Servico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ordem_Servico.hasMany(models.Itens, {
      foreignKey: 'id_Os'
      });

      Ordem_Servico.hasMany(models.Trabalha, { 
        foreignKey: 'id_Os' 
      });
      Ordem_Servico.belongsTo(models.Manutencao, {
        foreignKey: 'manutencao_id'
      })
    }
  }
  Ordem_Servico.init({
    quilometragem_atual: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },

    id_Os: {
        type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
       autoIncrement: true
    }
    ,
    problema: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.STRING,
      enum: {
        values: ["Aberta", "Em andamento", "Finalizada"]
      },
      defaultValue: 'Aberta'
    },

    tipo: {
      type: DataTypes.STRING,
      enum: {
        values: ["Preventiva", "Corretiva"],
        message: 'Tipo de Manutencao informada está incorreta'
      }
    }
    ,
    data_abertura: {
      type: DataTypes.DATEONLY
    },
    data_fechamento: {
      type: DataTypes.DATEONLY,
    },
    valor_total_itens: {
      type: DataTypes.DECIMAL,
    },
    valor_total_procedimento: {
      type: DataTypes.DECIMAL
    },

    prioridade: {
      type: DataTypes.STRING,
      enum: {
        values: ["Baixa", "Alta", "Media"],
        message: 'A prioridade informada não existe'
      }
    }
  }, {
    sequelize,
    modelName: 'Ordem_Servico',
    tableName: 'ordens_servicos',
    timestamps: false
  });
  return Ordem_Servico;
};

