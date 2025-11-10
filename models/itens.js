'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Itens extends Model {
  
    static associate(models) {
      Itens.belongsTo(models.Material, {
        foreignKey: 'fk_material'
      });

    Itens.belongsTo(models.Ordem_Servico, {
      foreignKey: 'id_Os'
    })  
    }
  }
  Itens.init({
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

    fk_material: {
      primaryKey:true,
      type: DataTypes.INTEGER,
      foreignKey: true,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.DECIMAL,
      allowNull: false 
    },


  }, {
    sequelize,
    modelName: 'Itens',
    tableName: 'itens',
    timestamps: false
  });
  return Itens;
};