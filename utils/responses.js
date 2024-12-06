

/**
 * 封装成功响应
 * @param {Object} res 
 * @param {Array} message 
 * @param {Object} data 
 * @param {Number} code 
 */
function success(res, message, data, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data,
    });
}

/**
 * 封装失败响应
 * @param {Object} res
 * @param {Object} error
 */
function failure(res, error) {
    let code = 500;
    const status = false; // 错误状态
    const errName = error.name; // 错误名称
    let errors = [error.message];
    let message = '';
    console.log(status, error);
    switch(errName) {
        case "NotFoundError":
            message = '资源不存在';
            code = 404;
            break;
        case "SequelizeValidationError":
            message = '请求参数错误';
            if (error.errors) {
                errors = error.errors.map((err) => err.message);
            }
            code = 400;
            break;
        case "UnauthorizedError":
            message = '认证失败';
            code = 401;
            break;
        case "JsonWebTokenError":
            message = '认证失败';
            code = 401;
            errors = ['您提交的token错误，请重新登录'];
            break;
        case "TokenExpiredError":
            message = '认证失败';
            code = 401;
            errors = ['您的token已过期，请重新登录']
        default:
            message = '服务器错误'
            break;
    }
    
    return res.status(code).json({
        status,
        message,
        errors,
    });
}

module.exports = {
    success,
    failure,
}