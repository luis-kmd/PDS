'use strict';
const { Types } = require('mysql2');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Setor extends Model {
   
    static associate(models) {

    Setor.hasMany(models.Funcionario, {
      foreignKey: 'setor_id'
    })

    Setor.hasMany(models.Procedimento, {
      foreignKey: 'setor_id'
    })
    }

  }
  Setor.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    } ,

    id: {
 type: DataTypes.TINYINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'Setor',
    tableName: 'setores',
   timestamps: false
  });
  return Setor;
};