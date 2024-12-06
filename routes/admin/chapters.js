const  express = require('express');
const  router = express.Router();
const  {Chapter} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

function getCondition() {
    return {
        attributes: { exclude: ['StoryId'] },
        include: [{
            model: Story,
            as: 'story',
            attributes: ['id', 'name']
        }]
    }
}

/**
 * 查找章节
 * @param {Object} req 
 */
async function getChapter(req) {
    const { id } = req.params;
    const condition = getCondition();
    const chapter = await Chapter.findByPk(id, condition);
    if (!chapter) {
        throw new NotFoundError(`ID: ${id}章节未找到`);
    }
    return chapter;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const body = {
        storyId: req.body.storyId,
        title: req.body.title,
        content: req.body.content,
        rank: req.body.rank,
        audio: req.body.audio,
        vedio: req.body.vedio,
        prompt: req.body.prompt,
        image: req.body.image
    };
    return body;
}

/**
 * 查询章节列表
 * GET: /admin/chapters
 */
router.get('/', async function(req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        if (!query.storyId) {
            throw new Error('获取章节列表失败，课程ID不能为空。');
        }
        const condition = {
            ...getCondition(),
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
        };
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                },
            };
        }
        if (query.storyId) {
            condition.where = {
                storyId: {
                    [Op.eq]: query.storyId
                }
            };
        }
        const { rows, count } = await Chapter.findAndCountAll(condition);
        success(res, '', {
            chapters: rows,
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
 * 创建章节
 * POST: /admin/chapters
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        console.log('create chapter', body);
        const chapter = await Chapter.create(body);
        success(res, '章节创建成功', { chapter }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除章节
 * DELETE: /admin/chapters/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const chapter = await getChapter(req);
        if (chapter) {
            await chapter.destroy();
            success(res, '章节删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新章节
 * PUT: /admin/chapters/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newChapter = filterBody(req);
        let chapter = await getChapter(req);
        if (chapter) {
            chapter = await chapter.update(newChapter);
            success(res, '章节更新成功', { chapter });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询章节详情
 * GET: /admin/chapters/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const chapter = await getChapter(req);
        if (chapter) {
            success(res, '章节详情查询成功', { chapter });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
