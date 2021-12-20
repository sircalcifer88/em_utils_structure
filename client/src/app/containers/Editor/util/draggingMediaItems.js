import {MEDIA_AUDIO_TYPE, MEDIA_VIDEO_TYPE} from '../constants';

export const draggingMediaItems = (currentMedia, medias, tracksSources) => {
    /**
     *
     * @param  {Number} size - Clip outPoint minus inPoint.
     * @return {Number} Clip duration
     */
    let draggingMedias = {
        video: {
            tracks: [[], []]
        },
        audio: {
            tracks: [[], []]
        }
    };
    const tracksStatusFlag = (tracksSources && (tracksSources.videoSourcesEnabled || tracksSources.audioSourcesEnabled)) && medias.length !== 1;
    medias.forEach(mediaItem => {
        if(mediaItem.mediaType === MEDIA_VIDEO_TYPE) {
            if(tracksStatusFlag && tracksSources.videoSourcesEnabled || !tracksStatusFlag) {
                if(draggingMedias.video.tracks[mediaItem.trackIndex]) {
                    draggingMedias.video.tracks[mediaItem.trackIndex].push(mediaItem);
                } else {
                    draggingMedias.video.tracks[mediaItem.trackIndex] = [mediaItem];
                }
            }
        } else if(mediaItem.mediaType === MEDIA_AUDIO_TYPE) {
            if(tracksStatusFlag && tracksSources.audioSourcesEnabled || !tracksStatusFlag) {
                if(draggingMedias.audio.tracks[mediaItem.trackIndex]) {
                    draggingMedias.audio.tracks[mediaItem.trackIndex].push(mediaItem);
                } else {
                    draggingMedias.audio.tracks[mediaItem.trackIndex] = [mediaItem];
                }
            }
        }
    });
    return {
        ...draggingMedias,
        currentMedia: tracksStatusFlag && !tracksSources.videoSourcesEnabled ?
            medias.find(item => item.timelineItemId !== currentMedia.timelineItemId) : currentMedia
    };
};