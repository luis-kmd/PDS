'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Veiculo_Motorista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Veiculo_Motorista.belongsTo(models.Motorista, {
      foreignKey: 'fk_motorista',
      
      
     })

     Veiculo_Motorista.belongsTo(models.Veiculo, {
      foreignKey: 'fk_veiculo'
     })
    }
  }
  Veiculo_Motorista.init({
    data_inicio: {
      type: DataTypes.DATEONLY,
      primaryKey: true
    },
    data_fim:{
      type:  DataTypes.DATEONLY
    },

     fk_motorista: {
        type: DataTypes.TINYINT.UNSIGNED,
        primaryKey: true,
        allowNull: false
     },

     fk_veiculo: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
     }

  }, {
    sequelize,
    modelName: 'Veiculo_Motorista',
    tableName: 'veiculos_motoristas',
    timestamps: false
  });
  return Veiculo_Motorista;
};