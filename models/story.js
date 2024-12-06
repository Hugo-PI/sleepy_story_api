'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment');
moment.locale('zh-cn');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Story.belongsToMany(models.User, { through: models.Like, foreignKey: 'storyId', as: 'likeUsers' });
      models.Story.belongsTo(models.Category, { as: 'category' });
      models.Story.belongsTo(models.User, { as: 'user' });
      models.Story.hasMany(models.Chapter, { as: 'chapters' });

    }
  }
  Story.init({
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '分类ID必须填写。' },
        notEmpty: { msg: '分类ID不能为空。' },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value);
          if (!category) {
            throw new Error(`ID:${value}分类不存在。`);
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '用户ID必须填写。' },
        notEmpty: { msg: '用户ID不能为空。' },
        async isPresent(value) {
          const user = await sequelize.models.User.findByPk(value);
          if (!user) {
            throw new Error(`ID:${value}用户不存在。`);
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '故事名称必须填写。' },
        notEmpty: { msg: '故事名称不能为空。' },
        len: {
          args: [2, 255],
          msg: '故事名称长度必须在2到255之间。'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: { msg: '故事封面必须填写。' },
        // notEmpty: { msg: '故事封面不能为空。' },
        isUrl: { msg: '故事封面必须是一个有效的URL。' }
      }
    },
    recommended: {
      type: DataTypes.BOOLEAN,
      validate: {
        isIn: { args: [[true, false]], msg: '是否推荐的值必须是，推荐：true 不推荐：false。' }
      }
    },
    content: {
      type: DataTypes.TEXT,
    },
    likesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    chaptersCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '章节数必须填写。' },
        notEmpty: { msg: '章节数不能为空。' },
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('LL');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('LL');
      }
    }
  }, {
    sequelize,
    modelName: 'Story',
  });

  return Story;
};