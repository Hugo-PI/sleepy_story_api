'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Category.hasMany(models.Story, {
        as: 'stories'
      })
    }
  }
  Category.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: '名称已存在，请选择其他名称。' },
      validate: {
        notNull: { msg: '名称必须填写。' },
        notEmpty: { msg: '名称不能为空。' },
        len: { args: [2, 45], msg: '长度必须是2 ~ 45之间。' }
      }
    },
    rank: {
      type: DataTypes.INTEGER,
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
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};