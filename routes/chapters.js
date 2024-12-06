var express = require('express');
var router = express.Router();
const { User, Category, Story, Chapter } = require('../models');
const { success, failure } = require('../utils/responses');

/**
 * 查询章节详情
 * GET /chapters/:id
 */
router.get('/:id', async function(req, res, next) {
    try {
        const { id } = req.params;
        // 查询当前故事章节
        const chapter = await Chapter.findByPk(id, {
            attributes: {exclude: ['StoryId']}
        });
        if (!chapter) {
            throw new NotFoundError(`ID: ${ id }的章节未找到。`)
        }
        // 查询章节关联故事
        const story = await chapter.getStory({
            attributes: ['id', 'name', 'userId']
        });
        // 查询故事关联的用户
        const user = await story.getUser({
            attributes: ['id', 'username', 'nickname', 'avatar']
        });
        // 查询同属于一个故事的所有章节
        const chapters = await Chapter.findAll({
            attributes: {exclude: ['storyId', 'content']},
            where: {storyId: chapter.storyId},
            order: [['rank', 'ASC'], ['id', 'DESC']]
        })
        success(res, '查询章节成功', { chapter, story, user, chapters });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;