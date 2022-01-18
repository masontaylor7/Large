'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  Post.associate = function (models) {
    // associations can be defined here
    Post.belongsTo(models.User, { foreignKey: 'userId' })
    Post.hasMany(models.Comment, { foreignKey: 'postId' })
    Post.hasMany(models.Like, { foreignKey: 'postId' })
  };
  return Post;
};
