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
    const stories = [];
    for (let i = 1; i <= 10; i++) {
      stories.push({
        categoryId: i,
        userId: i,
        name: `Story ${i}`,
        image: `image_${i}`,
        recommended: 1,
        content: `Story content ${i}`,
        likesCount: 0,
        chaptersCount: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Stories', stories, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Stories', null, {});
  }
};
