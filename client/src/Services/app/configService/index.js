import {env} from './env';
import {questionTypes} from './questionTypes';
import {answerTypes} from './answerTypes';

const configService = new class {
    itemPerPage = 9
    env = env
    questionTypes = questionTypes
    answerTypes = answerTypes
}();

export {configService};