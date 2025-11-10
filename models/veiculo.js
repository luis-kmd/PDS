'use strict';
const {
  Model
} = require('sequelize');
const { path } = require('../App');
module.exports = (sequelize, DataTypes) => {
  class Veiculo extends Model {


    static associate(models) {
      Veiculo.belongsTo(models.Modelo, {
        foreignKey: {
          name: 'modelo_id',
          allowNull: false
        },
        onDelete: 'CASCADE',
      });

      Veiculo.hasMany(models.Veiculo_Motorista, {
        foreignKey: 'fk_veiculo'
      })

      Veiculo.hasMany(models.Manutencao, {
        foreignKey: 'fk_veiculo'
      })


    }
  }
  Veiculo.init({
    placa: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },


    chassi: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    tipo: {
      type: DataTypes.ENUM('Caminhão Refrigerado', 'Sider', 'Granaleiro'), 
      allowNull: false,
      validate: {
        validator: (valor) =>   valor !== "",
        message: ({path}) => `o campo ${path} está nulo`
      } 
    },

   
    cor: {
      type: DataTypes.STRING,
    },

    situacao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
modelo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
 },
 
   quilometragem: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    ano_fabricacao: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Veiculo',
    tableName: 'veiculos',
    timestamps: false
  });
  return Veiculo;
};