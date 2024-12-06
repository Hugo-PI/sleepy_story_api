var express = require('express');
var router = express.Router();
const { User, Category, Story, Chapter } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../utils/responses');

/**
 * 查询故事列表
 * GET /stories
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;
    if (!query.categoryId) {
        throw new Error('获取故事列表失败，分类ID不能为空。');
    }
    const condition = {
        attributes: {exclude: ['categoryId', 'userId', 'content']},
        where: { categoryId: query.categoryId },
        order: [['id', 'DESC']],
        limit: pageSize,
        offset,
    };
    const {count, rows} = await Story.findAndCountAll(condition);
    success(res, '查询故事列表成功', {
        stories: rows,
        pagination: {
            currentPage,
            pageSize,
            total: count,
        }
    });
  } catch (error) {
    failure(res, error);
  }
});

/**
 * 查询故事详情
 * GET /stories/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const condition = {
            attributes: {
                exclude: ['CategoryId', 'UserId']
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Chapter,
                    as: 'chapter',
                    attributes: ['id', 'title', 'rank', 'createdAt'],
                    order: [['rank', 'ASC'], ['id', 'DESC']]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'nickname', 'avatar']
                }
            ]
        }
        const story = await Story.findByPk(id, condition);
        if (!story) {
            throw new Error(`ID:${id}查询故事详情失败，故事不存在。`);
        }
        success(res, '查询故事详情成功', { story });
    } catch (error) {
        failure(res, error);
    }
});
module.exports = router;

