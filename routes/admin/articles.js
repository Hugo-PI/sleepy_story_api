const  express = require('express');
const  router = express.Router();
const  {Article} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查找文章
 * @param {Object} req 
 */
async function getArticle(req) {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError(`ID: ${id}文章未找到`);
    }
    return article;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        title: req.body.title,
        content: req.body.content
    };
    return body;
}

/**
 * 查询文章列表
 * GET: /admin/articles
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
        const { rows, count } = await Article.findAndCountAll(condition);
        success(res, '', {
            articles: rows,
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
 * 创建文章
 * POST: /admin/articles
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        const article = await Article.create(body);
        success(res, '文章创建成功', { article }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除文章
 * DELETE: /admin/articles/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const article = await getArticle(req);
        if (article) {
            await article.destroy();
            success(res, '文章删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新文章
 * PUT: /admin/articles/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newArticle = filterBody(req);
        let article = await getArticle(req);
        if (article) {
            article = await article.update(newArticle);
            success(res, '文章更新成功', { article });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询文章详情
 * GET: /admin/articles/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const article = await getArticle(req);
        if (article) {
            success(res, '文章详情查询成功', { article });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
