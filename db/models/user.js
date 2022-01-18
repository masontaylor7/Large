'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.hasMany(models.Post, { foreignKey: 'userId' })
    User.hasMany(models.Comment, { foreignKey: 'userId' })
    User.hasMany(models.Like, { foreignKey: 'userId' })
    User.belongsToMany(models.User, {
      through: 'Follower',
      otherKey: 'followerId',
      foreignKey: 'followedId',
      as: 'followers'
    })
    User.belongsToMany(models.User, {
      through: 'Follower',
      otherKey: 'followedId',
      foreignKey: 'followerId',
      as: 'followeds'
    })
  };
  return User;
};
