var express = require('express');
var router = express.Router();
const { User, Category, Story } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询分类列表
 * GET /categories
 */
router.get('/categories', async function(req, res, next) {
    try {
        const categories = await Category.findAll({
            order: [['rank', 'ASC'], ['id', 'DESC']]
        });
        success(res, '查询分类成功', { categories });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;