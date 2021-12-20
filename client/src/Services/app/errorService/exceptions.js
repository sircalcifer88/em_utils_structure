import _isEmpty from 'lodash/isEmpty';
import {parseStringTemplate} from 'Services/utils';
import {
    COMPONENT_HAS_ANY_PROPS,
} from './errorTemplates';

class exceptions {
    static ifComponentHasAnyProps = (props, componentName='') => {
        if(!_isEmpty(props)) {
            const errorMessage = parseStringTemplate(COMPONENT_HAS_ANY_PROPS, {
                componentName,
            });
            throw new TypeError(errorMessage);
        }
    }


}

export {exceptions};