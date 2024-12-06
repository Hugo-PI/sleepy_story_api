const express = require('express');
const router = express.Router();
const { User, Category, Story, Chapter, Article } = require('../models');
const { success, failure } = require('../utils/responses');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const bcrypt = require('bcryptjs');

/**
 * 查询当前用户详情
 * GET /users/me
 */
router.get('/me', async function(req, res, next) {
  try {
    const user = await getUser(req);
    success(res, '查询当前用户成功', { user });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 修改当前用户信息
 * PUT /users/info
 */
router.put('/info', async function(req, res, next) {
  try {
    const body = {
      nickname: req.body.nickname,
      sex: req.body.sex,
      introduce: req.body.introduce,
      avatar: req.body.avatar
    }
    const user = await getUser(req);
    await user.update(body);
    success(res, '修改用户信息成功', { user });
  } catch(error) {
    failure(res, error);
  }
});

/**
 * 更新账户信息
 * PUT /users/account
 */
router.put('/account', async function(req, res, next) {
  try {
    const body = {
      email: req.body.email,
      username: req.body.username,
      currentPassword: req.body.currentPassword,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm

    }
    if (!body.currentPassword) {
      throw new BadRequestError('请输入当前密码');
    }
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestError('两次输入的密码不一致');
    }
    const user = await getUser(req, true);
    const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError('当前密码不正确');
    }
    await user.update(body);
    delete user.dataValues.password;
    success(res, '修改账户信息成功', { user });

  } catch (error) {
    failure(res, error);
  }
});

async function getUser(req, showPassword = false) {
  const id = req.userId;
  let condition = {};
  if (!showPassword) {
    condition = {
      attributes: {
        exclude: ['password']
      }
    };
  }
  const user = await User.findByPk(id, condition);
  if (!user) {
    throw new NotFoundError('ID: ${id}用户不存在');
  }
  return user;
}

module.exports = router;
