import _isString from 'lodash/isString';
import _get from 'lodash/get';
import _orderBy from 'lodash/orderBy';
import _has from 'lodash/has';
import _isBoolean from 'lodash/isBoolean';

import {sortArrayValidator} from './validator';
import {OrderDirection} from 'app/containers/Layout/constants';

/**
 * Options
 * @typedef {Object} Options
 * @property {boolean} disableCaseSensitive=true
 */

/**
 * @param {Array} list
 * @param {String|Array} orderBy
 * @param {'asc'|'desc'} orderDirection
 * @param {Options|null} options
 * @returns {Array} - Sorted Array
 */
export const sortArray = (
    list,
    orderBy,
    orderDirection,
    options = {
        disableCaseSensitive: true,
        showEmptiesLastly: true,
    }
) => {
    if (orderBy && orderDirection) {
        sortArrayValidator(list, orderBy, orderDirection, options);

        const additionalOptions = options ? {...options} : {};

        if (_has(additionalOptions, 'disableCaseSensitive')) {
            if (!_isBoolean(additionalOptions.disableCaseSensitive)) {
                throw new Error('disableCaseSensitive property can be only boolean');
            }
        } else {
            additionalOptions.disableCaseSensitive = true;
        }

        if (_has(additionalOptions, 'showEmptiesLastly')) {
            if (!_isBoolean(additionalOptions.showEmptiesLastly)) {
                throw new Error('showEmptiesLastly property can be only boolean');
            }
        } else {
            additionalOptions.showEmptiesLastly = true;
        }

        const orderByList = _isString(orderBy) ? [orderBy] : orderBy;

        let finalOrderByList = orderByList;

        if (additionalOptions.disableCaseSensitive) {
            finalOrderByList = orderByList.map(orderBy => {
                return (i) => {
                    let item = _get(i, orderBy);

                    if (additionalOptions.showEmptiesLastly) {
                        if (orderDirection === OrderDirection.asc && item === '') {
                            item = null;
                        } else if (orderDirection === OrderDirection.desc && item === null) {
                            item = '';
                        }
                    }

                    return _isString(item) ? item.toLowerCase() : item;
                };
            });
        }

        return _orderBy(list, finalOrderByList, orderDirection);
    }
    return list;
};