'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ordem_Servicos', {
      id_Os: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quilometragem_atual: {
        type: Sequelize.DECIMAL
      },
      problema: {
        type: Sequelize.STRING
      },
      data_abertura: {
        type: Sequelize.DATE
      },
      data_fechamento: {
        type: Sequelize.DATE
      },
      valor_total_itens: {
        type: Sequelize.DECIMAL
      },
      valor_total_procedimento: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ordem_Servicos');
  }
};