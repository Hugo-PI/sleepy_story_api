const  express = require('express');
const  router = express.Router();
const  {Like, User, Story} = require('../models');
const { Op } = require('sequelize');
const { NotFoundError, success, failure } = require('../utils/responses');

router.post('/', async (req, res, next) => {
    try {
        const userId = req.userId;
        const storyId = req.body.storyId;
        console.log(userId, storyId)
        const story = await Story.findByPk(storyId);
        if (!story) {
            throw new NotFoundError('故事不存在');
        }
        const like = await Like.findOne({
            where: {
                userId,
                storyId
            }
        });
        if (!like) {
            await Like.create({storyId, userId});
            await story.increment('likesCount');
            success(res, '点赞成功');
        } else {
            await like.destroy();
            await story.decrement('likesCount');
            success(res, '取消点赞成功');
        }
    } catch (err) {
        failure(res, err);
    }
});

router.get('/', async function (req, res) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const offset = (currentPage - 1) * pageSize;
        // 查询当前用户
        const user = await User.findByPk(req.userId);
        // 查询当前用户点赞过的故事
        const stories = await user.getLikeStories({
            joinTableAttributes: [],
            attributes: {
                exclude: ['CategoryId', 'UserId', 'content']
            },
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset,
        });
        // 查询当前用户点赞过的故事总数
        const total = await user.countLikeStories();
        success(res, '查询用户点赞的课程成功。', {
            stories,
            pagination: {
                currentPage,
                pageSize,
                total: total
            }

        });
    } catch (error) {
      failure(res, error);
    }
});

module.exports = router;