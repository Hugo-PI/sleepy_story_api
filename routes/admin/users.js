const  express = require('express');
const  router = express.Router();
const  {User} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查找用户
 * @param {Object} req 
 */
async function getUser(req) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`ID: ${id}用户未找到`);
    }
    return user;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        nickname: req.body.nickname,
        sex: req.body.sex,
        avatar: req.body.avatar,
        role: req.body.role,
        introduce: req.body.introduce,
    };
    return body;
}

/**
 * 查询用户列表
 * GET: /admin/users
 */
router.get('/', async function(req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
        };
        if (query.email) {
            condition.where = {
                title: {
                    [Op.eq]: query.email
                }
            };
        }
        if (query.username) {
            condition.where = {
                title: {
                    [Op.eq]: query.username
                }
            };
        }
        if (query.nickname) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.nickname}%`
                }
            };
        }
        if (query.role) {
            condition.where = {
                title: {
                    [Op.eq]: query.role
                }
            };
        }
        const { rows, count } = await User.findAndCountAll(condition);
        success(res, '', {
            users: rows,
            pagination: {
                currentPage,
                pageSize,
                total: count
            }
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建用户
 * POST: /admin/users
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        console.log('create user', body);
        const user = await User.create(body);
        success(res, '用户创建成功', { user }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除用户
 * DELETE: /admin/users/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const user = await getUser(req);
        if (user) {
            await user.destroy();
            success(res, '用户删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新用户
 * PUT: /admin/users/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newUser = filterBody(req);
        let user = await getUser(req);
        if (user) {
            user = await user.update(newUser);
            success(res, '用户更新成功', { user });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询用户详情
 * GET: /admin/users/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const user = await getUser(req);
        if (user) {
            success(res, '用户详情查询成功', { user });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
