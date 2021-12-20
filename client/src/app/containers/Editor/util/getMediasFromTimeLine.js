import _keys from 'lodash/keys';
export const getMediasFromTimeLine = (timeLine) => {
    /**
     * Getting medias list from current timeline.
     * @param  {object} timeline - Current time line object
     * @return {array} Timeline medias list.
     */
    let playlist = [];
    _keys(timeLine).forEach(key => {
        timeLine[key].tracks.forEach(track => {
            playlist = playlist.concat(track);
        });
    });

    return playlist.sort((a, b) => a.start - b.start);
};