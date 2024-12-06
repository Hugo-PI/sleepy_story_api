const  express = require('express');
const  router = express.Router();
const  {Setting} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 查找系统设置
 * @param {Object} req 
 */
async function getSetting(req) {
    const { id } = req.params;
    const setting = await Setting.findByPk(id);
    if (!setting) {
        throw new NotFoundError(`ID: ${id}系统设置未找到`);
    }
    return setting;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        name: req.body.name,
        copyright: req.body.copyright,
        icp: req.body.icp
    };
    return body;
}

/**
 * 查询系统设置列表
 * GET: /admin/settings
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
        const { rows, count } = await Setting.findAndCountAll(condition);
        success(res, '', {
            settings: rows,
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
 * 创建系统设置
 * POST: /admin/settings
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        console.log('create setting', body);
        const setting = await Setting.create(body);
        success(res, '系统设置创建成功', { setting }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除系统设置
 * DELETE: /admin/settings/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const setting = await getSetting(req);
        if (setting) {
            await setting.destroy();
            success(res, '系统设置删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新系统设置
 * PUT: /admin/settings/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newSetting = filterBody(req);
        let setting = await getSetting(req);
        if (setting) {
            setting = await setting.update(newSetting);
            success(res, '系统设置更新成功', { setting });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询系统设置详情
 * GET: /admin/settings/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const setting = await getSetting(req);
        if (setting) {
            success(res, '系统设置详情查询成功', { setting });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
