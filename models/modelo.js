'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Modelo extends Model {
    
    static associate(models) {
    
  Modelo.hasMany(models.Veiculo, {
    foreignKey: 'modelo_id',
  });
}
  }

 
  Modelo.init({

    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    }

  }, {
    sequelize,
    modelName: 'Modelo',
    tableName: 'modelos',
    timestamps: false
  });
  return Modelo;
};