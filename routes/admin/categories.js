const  express = require('express');
const  router = express.Router();
const  {Category} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查找分类
 * @param {Object} req 
 */
async function getCategory(req) {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
        throw new NotFoundError(`ID: ${id}分类未找到`);
    }
    return category;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        name: req.body.name,
        rank: req.body.rank
    };
    return body;
}

/**
 * 查询分类列表
 * GET: /admin/categories
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
        const { rows, count } = await Category.findAndCountAll(condition);
        success(res, '', {
            categories: rows,
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
 * 创建分类
 * POST: /admin/categories
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        console.log('create category', body);
        const category = await Category.create(body);
        success(res, '分类创建成功', { category }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除分类
 * DELETE: /admin/categories/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const category = await getCategory(req);
        if (category) {
            await category.destroy();
            success(res, '分类删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新分类
 * PUT: /admin/categories/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newCategory = filterBody(req);
        let category = await getCategory(req);
        if (category) {
            category = await category.update(newCategory);
            success(res, '分类更新成功', { category });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询分类详情
 * GET: /admin/categories/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const category = await getCategory(req);
        if (category) {
            success(res, '分类详情查询成功', { category });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
