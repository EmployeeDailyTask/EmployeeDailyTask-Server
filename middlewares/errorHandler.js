module.exports = function(err, req, res, next) {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'
    res.status(statusCode).json(message)
}