const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const  { sequelize, User } = require('../models');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const { success, failure } = require('../utils/responses');

module.exports = async function(req, res, next) {
    try {
        const token = req.headers.token
        // 判断token是否存在
        if (!token) {
            throw new UnauthorizedError('当前接口需要认证才能访问');
        }
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // 从jwt中解析出之前存入的userId
        const userId = decoded.userId;
        // 根据userId查询用户
        // console.log(sequelize.models);
        // const user = await User.findById(userId);
        const user = await sequelize.models.User.findByPk(userId);
        
        if (!user) {
            throw new UnauthorizedError('用户不存在');
        }
        // 验证当前用户是否是管理员
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限使用当前接口');
        }
        // 将user挂载到req上，方便后续中间件或路由使用
        req.user = user;
        next();

    } catch(error) {
        failure(res, error);
    }
}