'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const articles = [];
    for (let i = 0; i < 100; i++) {
      const article = {
        title: `Article ${i}`,
        content: `Content of article ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      articles.push(article);
    }
    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
