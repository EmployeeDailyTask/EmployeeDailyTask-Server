function managerAuthorization (req, res, next) {
    if(req.loggedUser.level !== 'Manager') {
        next({
            statusCode: 401,
            message: 'Unauthorized Access'
        })
    } else {
        next()
    }
}

function HRAuthorization (req, res, next) {
    if(req.loggedUser.level !== 'Human Resources') {
        next({
            statusCode: 401,
            message: 'Unauthorized Access'
        })
    } else {
        next()
    }
}

module.exports = {
    managerAuthorization,
    HRAuthorization
}