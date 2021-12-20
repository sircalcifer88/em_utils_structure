import _template from 'lodash/template';

const parseStringTemplate = (str, data) => {
    const template = _template(str);
    return template(data);
};

export {parseStringTemplate};