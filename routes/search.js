var express = require('express');
var router = express.Router();
const { Story, Category, User } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');

/**
 * 搜索故事
 * GET /search
 */
router.get('/', async (req, res, next) => {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        const condition = {
            attributes: {
                exclude: ['content', 'CategoryId', 'UserId']
            },
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
            order: [['id', 'DESC']],
            limit: pageSize,
            offset
        };
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }
        const {count, rows} = await Story.findAndCountAll(condition);
        success(res, '查询故事成功', {
            stories: rows,
            pagination: {
                total: count,
                pageSize,
                currentPage
            }
        });
    } catch(error) {
        failure(res, error);
    }
})

module.exports = router;