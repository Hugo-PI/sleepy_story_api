const  express = require('express');
const  router = express.Router();
const  {Story, Category, User, Chapter} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');
function getCondition() {
    return {
        attributes: {exclude: ['CategoryId', 'UserId']},
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ],
    }
}
/**
 * 查找故事
 * @param {Object} req 
 */
async function getStory(req) {
    const { id } = req.params;
    const story = await Story.findByPk(id, getCondition());
    if (!story) {
        throw new NotFoundError(`ID: ${id}故事未找到`);
    }
    return story;
}

async function getChapters(req) {
    const { id } = req.params;
    const chapters = await Chapter.findAndCountAll({
        where: {
            storyId: {
                [Op.eq]: id
            }
        }
    });
    return chapters;
}

/**
 * 白名单过滤
 * @param {Object} req 过滤请求里的字段
 * @returns 
 */
function filterBody(req) {
    const {
        categoryId, userId,
        name, image, recommended, content,
        linksCount, chaptersCount
    } = req.body;
    return {categoryId, userId,
        name, image, recommended, content,
        linksCount, chaptersCount
    };
}

/**
 * 查询故事列表
 * GET: /admin/stories
 */
router.get('/', async function(req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            // attributes: {exclude: ['CategoryId', 'UserId']},
            // include: [
            //     {
            //         model: Category,
            //         as: 'category',
            //         attributes: ['id', 'name']
            //     },
            //     {
            //         model: User,
            //         as: 'user',
            //         attributes: ['id', 'username', 'avatar']
            //     }
            // ],
            ...getCondition(),
            limit: pageSize,
            offset: offset,
            order: [['id', 'DESC']]
        };
        if (query.categoryId) {
            condition.where = {
                categoryId: {
                    [Op.eq]: query.categoryId
                }
            };
        }
        if (query.userId) {
            condition.where = {
                userId: {
                    [Op.eq]: query.userId
                }
            };
        }
        if (query.name) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.name}%`
                }
            };
        }
        if (query.recommended) {
            condition.where = {
                recommended: {
                    [Op.eq]: query.recommended === 'true'
                }
            };
        }
        const { rows, count } = await Story.findAndCountAll(condition);
        success(res, '', {
            stories: rows,
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
 * 创建故事
 * POST: /admin/stories
 */
router.post('/', async function(req, res, next) {
    try {
        // 白名单过滤
        const body = filterBody(req);
        body.userId = req.user.id; // 设置创建者
        console.log('create story', body);
        const story = await Story.create(body);
        success(res, '故事创建成功', { story }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除故事
 * DELETE: /admin/stories/:id
 */
router.delete('/:id', async function(req, res, next) {
    try {
        const story = await getStory(req);
        if (story) {
            await story.destroy();
            success(res, '故事删除成功');
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 更新故事
 * PUT: /admin/stories/:id
 */
router.put('/:id', async function(req, res, next) {
    try {
        const newStory = filterBody(req);
        let story = await getStory(req);
        if (story) {
            story = await story.update(newStory);
            success(res, '故事更新成功', { story });
        }
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询故事详情
 * GET: /admin/stories/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const story = await getStory(req);
        const chapters = await getChapters(req);
        if (story) {
            success(res, '故事详情查询成功', { story, chapters });
        }
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
