var express = require('express');
var router = express.Router();
const { User, Setting } = require('../models');
const { Op } = require('sequelize');
const { success, failure } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors')

/**
 * 查询系统信息
 * GET /settings
 */
router.get('/', async (req, res) => {
    try {
      const setting = await Setting.findOne();
      if (!setting) {
        throw new NotFoundError('系统信息不存在');
      }
      success(res, '查询系统信息成功', {
          setting
      });
    } catch (error) {
      failure(res, error);
    }
});

module.exports = router;