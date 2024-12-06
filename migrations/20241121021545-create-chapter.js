'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      storyId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      rank: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER.UNSIGNED
      },
      audio: {
        type: Sequelize.STRING
      },
      vedio: {
        type: Sequelize.STRING
      },
      prompt: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
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
    await queryInterface.addIndex('Chapters', {
      fields: ['storyId']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};