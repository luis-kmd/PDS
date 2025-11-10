'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Funcionario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  static associate(models) {

  Funcionario.belongsTo(models.Setor, {
    foreignKey: {
      name: 'setor_id',        
      allowNull: false        
    },
    onDelete: 'CASCADE'        
  });

  Funcionario.hasMany(models.Trabalha, {
    foreignKey: 'funcionario_id',
     onDelete: 'CASCADE',
  onUpdate: 'CASCADE' 
  })
}

  }
  Funcionario.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false,

    },

    cpf: {
      type: DataTypes.STRING,
      unique:true,
      allowNull: false
    },

    situacao:{
      type:  DataTypes.BOOLEAN,
      defaultValue: true
    },

    data_admissao: {
      type: DataTypes.DATEONLY,
    },

    data_demissao: {
      type:  DataTypes.DATEONLY,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Funcionario',
    tableName: 'funcionarios',
    timestamps: false
  });
  return Funcionario;
};