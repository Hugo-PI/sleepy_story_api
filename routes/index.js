var express = require('express');
var router = express.Router();
const { User, Category, Story } = require('../models');
const { success, failure } = require('../utils/responses');

/* GET home page. */
router.get('/main', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
  try {
    // 焦点图，推荐的故事 
    const recommendedStories = await Story.findAll({
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
      where: { recommended: true },
      order: [['id', 'DESC']],
      limit: 10
    });
    // 人气故事
    const likesStories = await Story.findAll({
      attributes: {
        exclude: ['content', 'CategoryId', 'UserId']
      },
      order: [['likesCount', 'DESC'], ['id', 'DESC']],
      limit: 10
    });
    console.log(recommendedStories);
    success(res, '首页', {
      recommendedStories,
      likesStories
    });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
