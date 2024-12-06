'use strict';
// import { getRandomInt } from "../utils/lib";
const { getRandomInt } = require('../utils/lib');
const bcrypt = require('bcryptjs');
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
    const users = [];
    for (let i = 0; i < 100; i++) {
      users.push({
        email: `user${i}@163.com`,
        username: `user${i}`,
        // password: '123456',
        password: bcrypt.hashSync('123456', 10),
        nickname: `nickname${i}`,
        sex: getRandomInt(0, 2),
        avatar: '',
        introduce: '',
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
