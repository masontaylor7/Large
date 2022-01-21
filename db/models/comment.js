'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users' }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {});
  Comment.associate = function (models) {
    // associations can be defined here
    Comment.belongsTo(models.Post, { foreignKey: 'postId' })
    Comment.belongsTo(models.User, { foreignKey: 'userId' })
    Comment.hasMany(models.Like, { foreignKey: 'commentId' })
  };
  return Comment;
};
