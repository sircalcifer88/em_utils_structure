import {FRAME_DURATION} from '../../../constants';

export const calculateFrames = (time) => {
    const totalTimeCurrentFrames = ((time - Math.floor(time)) / FRAME_DURATION).toFixed(0);
    let framesCount = '00';
    if(totalTimeCurrentFrames < 10) {
        framesCount = '0' + totalTimeCurrentFrames;
    } else {
        framesCount = totalTimeCurrentFrames;
    }
    return framesCount;
};