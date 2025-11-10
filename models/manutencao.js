'use strict';
const {
  Model
} = require('sequelize');
const { toDefaultValue } = require('sequelize/lib/utils');
module.exports = (sequelize, DataTypes) => {
  class Manutencao extends Model {
   
    static associate(models) {
   Manutencao.belongsTo(models.Motorista, {
    foreignKey: 'fk_motorista'
   }),

   Manutencao.belongsTo(models.Veiculo, {
    foreignKey: 'fk_veiculo'
   }),

   Manutencao.hasMany(models.Ordem_Servico, {
    foreignKey: 'manutencao_id'
   })
    }
  } 
  Manutencao.init({
    data_inicio: {
      type: DataTypes.DATEONLY,
      toDefaultValue: null
    },
 data_fim: {
      type: DataTypes.DATEONLY,
      toDefaultValue: null
    },

    fk_veiculo: {
     allowNull: false,
     type: DataTypes.STRING 
    },
  
  id_manutencao: {
    type: DataTypes.TINYINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },

    fk_motorista: {
      allowNull: false,
      type: DataTypes.TINYINT.UNSIGNED
    }
  

  },

  
  {
    sequelize,
    modelName: 'Manutencao',
    tableName: 'manutencoes',
    timestamps: false
  });
  return Manutencao;
};