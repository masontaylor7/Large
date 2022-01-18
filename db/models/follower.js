'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Follower.associate = function(models) {
    // associations can be defined here
  };
  return Follower;
};
