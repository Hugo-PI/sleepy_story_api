'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Story, { as: 'story' })
    }
  }
  Chapter.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    storyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        async isPresent(value) {
          const story = await sequelize.models.Story.findByPk(value);
          if (!story) {
            throw new Error(`ID:${value}故事不存在。`);
          }
        }
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        len: {
          args: [2, 255],
          msg: '名称长度必须在2到255个字符之间。'
        }
      },
    },
    content: {
      type: DataTypes.TEXT,
    },
    rank: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写。' },
        notEmpty: { msg: '排序不能为空。' },
        isInt: { msg: '排序必须是整数。' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须大于0。');
          }
        }
      }
    },
    audio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '音频文件必须填写。' },
        notEmpty: { msg: '音频文件不能为空。' },
        isUrl: { msg: '音频文件必须是URL。' }
      }
    },
    vedio: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '视频文件必须填写。' },
        notEmpty: { msg: '视频文件不能为空。' },
        isUrl: { msg: '视频文件必须是URL。' }
      }
    },
    prompt: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '提示词必须填写。' },
        notEmpty: { msg: '提示词不能为空。' },
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '图片地址必须填写。' },
        notEmpty: { msg: '图片地址不能为空。' },
        isUrl: { msg: '图片地址必须是URL。' }
      }
    }
  }, {
    sequelize,
    modelName: 'Chapter',
  });
  return Chapter;
};