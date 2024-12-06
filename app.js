const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const logger = require('morgan');
require('dotenv').config();
const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');


const indexRouter = require('./routes/index');
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminStoriesRouter = require('./routes/admin/stories');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminUsersRouter = require('./routes/admin/users');
const adminLikesRouter = require('./routes/admin/likes');
const adminChartsRouter = require('./routes/admin/charts');
const likesRouter = require('./routes/likes');
const adminAuthRouter = require('./routes/admin/auth');
const categoriesRouter = require('./routes/categories');
const storiesRouter = require('./routes/stories');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const chaptersRouter = require('./routes/chapters');

const app = express();
// CORS 跨域配置
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/articles', adminAuth, adminArticlesRouter);
app.use('/admin/categories', adminAuth, adminCategoriesRouter);
app.use('/admin/settings', adminAuth, adminSettingsRouter);
app.use('/admin/stories', adminAuth, adminStoriesRouter);
app.use('/admin/chapters', adminAuth, adminChaptersRouter);
app.use('/admin/users', adminAuth, adminUsersRouter);
app.use('/admin/likes', adminAuth, adminLikesRouter);
app.use('/admin/charts', adminAuth, adminChartsRouter);
app.use('/admin/auth', adminAuthRouter);
app.use('/likes', userAuth, likesRouter);
app.use('/categories', categoriesRouter);
app.use('/stories', storiesRouter);
app.use('/settings', settingsRouter);
app.use('/search', searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuth, usersRouter);
app.use('/chapters', userAuth, chaptersRouter);

module.exports = app;
