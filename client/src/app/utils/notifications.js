import * as ERROR_TYPES from './errorTypes';

export const getErrorData = (type, msg) => {
    switch (type){
        case 400: {
            return {
                type: ERROR_TYPES.BAD_REQUEST,
                message: msg || 'Bad Request.'
            };
        }
        case 401: {
            return {
                type: ERROR_TYPES.UNAUTHORIZED_RESPONSE_ERROR,
                message: msg || 'Your session is expired.'
            };
        }
        case 403: {
            return {
                type: ERROR_TYPES.FORBIDDEN_ERROR,
                message: msg || 'You do not have sufficient privileges to access this resource.'
            };
        }
        case 404: {
            return {
                type: ERROR_TYPES.PAGE_NOT_FOUND_ERROR,
                message: msg || 'Page Not Found.'
            };
        }
        case 421: {
            return {
                type: ERROR_TYPES.MISDIRECTED_REQUEST,
                message: 'Wrong token.'
            };
        }
        case 423: {
            return {
                type: ERROR_TYPES.LOCKED_ERROR,
                message: 'The resource that is being accessed is locked.'
            };
        }
        case 502: {
            return {
                type: ERROR_TYPES.BAD_GATEWAY,
                message: 'Bad Gateway Error.'
            };
        }
        case 500:
        case 504: {
            return {
                type: ERROR_TYPES.SERVER_ERROR,
                message: 'Internal Server Error.'
            };
        }
        default:
            return {
                type: ERROR_TYPES.UNKNOWN_ERROR,
                message: 'Something went wrong. Try again later.'
            };
    }
};