'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
      return queryInterface.addColumn('Posts', 'title', {
        type: Sequelize.STRING(100),
        allowNull: false,
        // that the column references.
       });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.removeColumn('Posts', 'title');
  }
};
