'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
  return queryInterface.bulkInsert('Comments', [
    {content: "Good post!", userId:1, postId: 1, createdAt: new Date(), updatedAt: new Date()},
    {content: "Crazyyyy.", userId:3, postId: 1, createdAt: new Date(), updatedAt: new Date()},
    {content: "I disagree.", userId:2, postId: 1, createdAt: new Date(), updatedAt: new Date()},
    {content: "Good post!", userId:1, postId: 2, createdAt: new Date(), updatedAt: new Date()},
    {content: "Crazyyyy.", userId:3, postId: 2, createdAt: new Date(), updatedAt: new Date()},
    {content: "I disagree.", userId:2, postId: 2, createdAt: new Date(), updatedAt: new Date()},
    {content: "Good post!", userId:1, postId: 3, createdAt: new Date(), updatedAt: new Date()},
    {content: "Crazyyyy.", userId:3, postId: 3, createdAt: new Date(), updatedAt: new Date()},
    {content: "I disagree.", userId:2, postId: 3, createdAt: new Date(), updatedAt: new Date()},
    {content: "Good post!", userId:1, postId: 4, createdAt: new Date(), updatedAt: new Date()},
    {content: "Crazyyyy.", userId:3, postId: 4, createdAt: new Date(), updatedAt: new Date()},
    {content: "I disagree.", userId:2, postId: 4, createdAt: new Date(), updatedAt: new Date()},
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
  return queryInterface.bulkDelete('Comments', null, {});
  }
};
