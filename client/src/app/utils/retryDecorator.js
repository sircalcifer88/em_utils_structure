import {sleep} from './sleep';

export const retryDecorator = async (promise, maxCount= 10, interval=1000) => {
    while (true) {
        try {
            --maxCount;
            return await promise;
        } catch (err) {
            if (maxCount) {
                await sleep(interval);
            } else {
                throw err;
            }
        }
    }
};