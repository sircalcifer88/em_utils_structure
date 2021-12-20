import _isString from 'lodash/isString';
import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import {OrderDirection} from 'app/containers/Layout/constants';

export const sortArrayValidator = (
    list,
    orderBy,
    orderDirection,
    options
) => {
    if (!_isArray(list)) {
        throw new Error('list property can be only array');
    } else if (!_isArray(orderBy) && !_isString(orderBy)) {
        throw new Error('orderBy property can be only array or string');
    } else if (orderDirection !== OrderDirection.asc && orderDirection !== OrderDirection.desc) {
        throw new Error(`orderDirection property can be only ${OrderDirection.asc} or ${OrderDirection.desc}`);
    } else if (options && !_isObject(options)) {
        throw new Error('options property can be only object');
    }
};