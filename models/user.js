'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.Story, { through: models.Like, foreignKey: 'userId', as: 'likeStories' });
      models.User.hasMany(models.Story, { as: 'stories' });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户Email必须填写。' },
        notEmpty: { msg: '用户Email不能为空。' },
        isEmail: { msg: '用户Email格式不正确。' },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } });
          if (user) {
            throw new Error('用户Email已存在。');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户名称必须填写。' },
        notEmpty: { msg: '用户名称不能为空。' },
        len: {
          args: [2, 255],
          msg: '用户名称长度必须在2到255个字符之间。'
        },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } });
          if (user) {
            throw new Error('用户名称已存在。');
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户密码必须填写。' },
        notEmpty: { msg: '用户密码不能为空。' },
        len: {
          args: [6, 255],
          msg: '用户密码长度必须在6到255个字符之间。'
        }
      },
      set(value) {
        // 检查是否为空
        if (!value) {
          throw new Error('用户密码不能为空。');
        }
        // 检测密码长度必须在6~45之间
        if (value.length < 6 || value.length > 45) {
          throw new Error('用户密码长度必须在6到45个字符之间。');
        }
        // 加密密码
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户昵称必须填写。' },
        notEmpty: { msg: '用户昵称不能为空。' },
        len: {
          args: [2, 255],
          msg: '用户昵称长度必须在2到255个字符之间。'
        }
      }
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户性别必须填写。' },
        notEmpty: { msg: '用户性别不能为空。' },
        isIn: {
          args: [[0, 1, 2]],
          msg: '用户性别只能是0:女性，1：男性，2：未选择。'
        }
      }
    },
    introduce: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '用户头像必须是URL。' }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: { msg: '角色必须填写。' },
        notEmpty: { msg: '角色不能为空。' },
        isIn: {
          args: [[0, 100]],
          msg: '角色只能是0:普通用户，100：管理员。'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};