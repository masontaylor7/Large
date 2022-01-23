'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
  return queryInterface.bulkInsert('Users', [
      {username: "demo", email: "demo@demo.com", hashedPassword: "$2a$10$sl5tNlZ5Ygn/bk4YvSANL.T9nG3rX/PSxKQYshOVn5Ww6svElMUkq", createdAt: new Date(), updatedAt: new Date()},
      {username: "jerry", email: "jerry@gmail.com", hashedPassword: "$2a$10$MYhHI2OyvEqoo/J95fP0A.SS0XntjQuf1KLv7Ru32s5b/GTV62ubK", createdAt: new Date(), updatedAt: new Date()},
      {username: "joanna", email: "joanna@hotmail.com", hashedPassword: "$2a$10$HDahVWzMOai0IGPNQjP8j.CAPHIZaLh0TQJzxPlOhQ5Uj32BB7LSO", createdAt: new Date(), updatedAt: new Date()}
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
  return queryInterface.bulkDelete('Users', null, {});
  }
};
