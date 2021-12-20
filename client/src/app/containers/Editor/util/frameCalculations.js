import {FRAME_SIZE} from '../constants';

export const secondToFrameNumber = (time, frameRate) => {
    /**
     * Returns the current frame number
     * @param  {Number} fps-frameRate Per second rendered frames count
     * @return {Number} - Frame number in video
     */
    return Math.round(time.toFixed(5) * frameRate);
};

export const frameNumberToSecond = (frames, frameRate) => {
    /**
     * Converts a frame number to Seconds
     *
     * @param  {Number} frames - Frames count
     * @param  {Number} fps-frameRate Per second rendered frames count
     * @return {Number} Returns the Second count of a frames count
     */
    return ((1000 / frameRate) * (isNaN(frames) ? 0 : frames)/1000) + 0.001;
};

export const frameNumberToVisualSize = (frames, zoom) => {
    /**
     * Converts a frame number to visual size in 'px'
     *
     * @param  {Number} frames - Frames count
     * @param  {Number} zoom - Zoom index
     * @return {Number} Returns the frame number visual size
     */
    const frameSize = FRAME_SIZE*zoom;
    return frames*frameSize;
};

export const visualSizeToFrameNumber = (size, zoom) => {
    /**
     * Converts a visual size to frame number
     *
     * @param  {Number} size - Visual size
     * @param  {Number} zoom - Zoom index
     * @return {Number} Returns the frame number
     */
    const frameSize = FRAME_SIZE*zoom;
    return Math.round(size/frameSize);
};

export const frameNumberToPlayerTime = (frame, frameRate) => {
    /**
     * Returns the current SMPTE Time code in the video.
     * - Can be used as a conversion utility.
     *
     * @param  {Number} frame Frame number for conversion to it's equivalent SMPTE Time code.
     * @param  {Number} fps-frameRate Per second rendered frames count.
     * @return {String} Returns a SMPTE Time code in HH:MM:SS:FF format
     */
    function wrap(n) {
        return ((n < 10) ? '0' + n : n);
    }
    const frameNumber = Number(frame);
    const fps = frameRate;
    const hour = ((fps * 60) * 60);
    const minute = (fps * 60);
    const frameNumberToHours = frameNumber / hour;
    const hours = parseInt(frameNumberToHours);
    const minutes = (Number((frameNumber / minute).toString().split('.')[0]) % 60);
    const seconds = (Number((frameNumber / fps).toString().split('.')[0]) % 60);
    const SMPTE = (wrap(hours) + ':' + wrap(minutes) + ':' + wrap(seconds) + ':' + wrap(Math.round(frameNumber % fps)));
    return SMPTE;
};
