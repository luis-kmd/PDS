'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trabalha extends Model {
   
    static associate(models) {
      Trabalha.belongsTo(models.Funcionario, {
          foreignKey: 'funcionario_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Trabalha.belongsTo(models.Procedimento, {
        foreignKey: 'procedimento_id'
      });

      Trabalha.belongsTo(models.Ordem_Servico, {
        foreignKey: 'id_Os'
      })
    }
  }
  Trabalha.init({ 
    valor_unitario: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },

   id_Os:  {
      type: DataTypes.INTEGER,
      foreignKey: true,
      primaryKey: true,
      allowNull: false,
    },
    procedimento_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      foreignKey: true
    },
    funcionario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    }
    ,
    data_realizacao: {
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'Trabalha',
    tableName: 'trabalha',
    timestamps: false
  });
  return Trabalha;
};