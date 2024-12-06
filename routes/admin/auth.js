const  express = require('express');
const  router = express.Router();
const  {Story, Category, User, Chapter} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


/**
 * 后台管理员登录接口
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!user) {
            throw new NotFoundError('用户不存在，请重新登录');
        }
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误');
        }
        // 只有管理员能够登录
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限访问登录管理后台');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        // const token = jwt.sign({ userId: user.id }, 'hello', { expiresIn: '30d' });
        
        success(res, '登录成功', { token });
    } catch (error) {
        failure(res, error);
    }
})

module.exports = router;