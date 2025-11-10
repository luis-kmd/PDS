'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Material.hasMany(models.Itens, {
        foreignKey: 'fk_material'
      })
    }
  }
  Material.init({
    valorUnitario: {
     type:  DataTypes.DECIMAL(6,2),
     allowNull: false
    },
    quantidadeEstoque: {
  type: DataTypes.INTEGER,
  allowNull: false
    },
    
    descricao: {
 type: DataTypes.STRING,
 allowNull: false

    }
  }, {
    sequelize,
    modelName: 'Material',
    tableName: 'materiais', 
    timestamps: false
  });
  return Material;
};