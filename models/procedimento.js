'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Procedimento extends Model {
 
    static associate(models) {
      Procedimento.belongsTo(models.Setor, {
        foreignKey: 'setor_id',
      }),

      Procedimento.hasMany(models.Trabalha, {
        foreignKey: 'procedimento_id'
      })
    }
  }
  Procedimento.init({
    descricao: {
      type: DataTypes.STRING,
    }, 
   
   valor_unitario: {
   type:  DataTypes.DOUBLE,
   allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Procedimento',
    tableName: 'procedimentos',
    timestamps: false
  });
  return Procedimento;
};