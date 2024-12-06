const  express = require('express');
const  router = express.Router();
const  {Story, Category, User, Chapter} = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

router.get('/sex', async function(req, res, next) {
    try {
        const male = await User.count({where: {sex: 1}});
        const female = await User.count({where: {sex: 0}});
        const unknown = await User.count({where: {sex: 2}});
        const data = [
            {name: '男', value: male},
            {name: '女', value: female},
            {name: '未知', value: unknown}
        ];
        success(res, '故事详情查询成功', { data });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;