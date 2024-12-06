var express = require('express');
var router = express.Router();
const { Story, Category, User } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../utils/responses');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * 用户注册
 * POST /auth/sign_up
 */
router.post('/sign_up', async (req, res, next) => {
  try {
    const body = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex || 2,
        role: 0
    };
    const user = await User.create(body);
    delete user.dataValues.password;
    success(res, '注册成功', { user }, 201);
  } catch (error) {
    failure(res, error)
  }
})

/**
 * 用户登录
 * POST /auth/sign_in
 */
router.post('/sign_in', async (req, res, next) => {
    try {
        const { login, password } = req.body;
        if (!login) {
            throw new BadRequestError('用户名、邮箱必须填写');
        }
        if (!password) {
            throw new BadRequestError('密码必须填写');
        }
        const condition = {
            where: {
                [Op.or]: [
                    {email: login},
                    {username: login}
                ]
            }
        };
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用户不存在，请重新登录');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误');
        }
        
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        // const token = jwt.sign({ userId: user.id }, 'hello', { expiresIn: '30d' });
        
        success(res, '登录成功', { token });
    } catch (error) {
        failure(res, error)
    }
})

module.exports = router;