import {FRAME_SIZE} from '../constants';
export const mousePositionChangeIndicator = (position, zoom) => {
    /**
     *
     * @param  {Number} position - Mouse change position.
     * @param  {Number} zoom - Zoom index.
     * @return {Number} Position and frame size remainder.
     */
    const change = (zoom !== 1 ? ((Math.floor(position * 100)/100)) : Math.floor(position))*100;
    const frameSize = ((Math.floor((FRAME_SIZE*zoom) * 100)/100))*100;
    return (change % frameSize)/100;
};