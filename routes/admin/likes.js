const  express = require('express');
const  router = express.Router();
const  {Like} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查找点赞
 * @param {Object} req 
 */
async function getLike(req) {
    const { id } = req.params;
    const like = await Like.findByPk(id);
    if (!like) {
        throw new NotFoundError(`ID: ${id}点赞未找到`);
    }
    return like;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        storyId: req.body.storyId,
        userId: req.body.userId
    };
    return body;
}

/**
 * 查询点赞列表
 * GET: /admin/likes
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
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            };
        }
        if (query.storyId) {
            condition.where = {
                storyId: query.storyId
            };
        }
        if (query.userId) {
            condition.where = {
                userId: query.userId
            };
        }
        const { rows, count } = await Like.findAndCountAll(condition);
        success(res, '', {
            likes: rows,
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
 * 创建点赞
 * POST: /admin/likes
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        console.log('create like', body);
        const like = await Like.create(body);
        success(res, '点赞创建成功', { like }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除点赞
 * DELETE: /admin/likes/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const like = await getLike(req);
        if (like) {
            await like.destroy();
            success(res, '点赞删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新点赞
 * PUT: /admin/likes/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newLike = filterBody(req);
        let like = await getLike(req);
        if (like) {
            like = await like.update(newLike);
            success(res, '点赞更新成功', { like });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询点赞详情
 * GET: /admin/likes/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const like = await getLike(req);
        if (like) {
            success(res, '点赞详情查询成功', { like });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
