import {frameNumberToSecond} from '../../../util/frameCalculations';

export function calculateTotalElapsedTime(videoDomTag, currentVideo) {
    /**
     * Calculating total time for current playlist.
     * @param  {HTMLVideoTag} videoDomTag - Current video tag.
     * @param  {object} currentVideo - Media item metadata.
     */
    return !currentVideo.isTrimmingClip && currentVideo.timelineItemId ? (videoDomTag.currentTime - frameNumberToSecond(currentVideo.inPoint, currentVideo.fps)) +
        (frameNumberToSecond(currentVideo.start, currentVideo.fps) || 0) : videoDomTag.currentTime;
}


export function calculateCurrentVideoTime(currentTime, currentVideo) {
    /**
     * Calculating current media item time.
     * @param  {number} currentTime - Playlist total elapsed time.
     * @param  {object} currentVideo - Media item metadata.
     */
    return !currentVideo.isTrimmingClip && currentVideo.timelineItemId ?  (currentTime - (currentVideo.start || 0)) + currentVideo.inPoint : currentTime;
}

export function calculateCurrentVideoStartTime(currentVideo, videos) {
    /**
     * Calculating current media item time.
     * @param  {object} currentVideo - Media item metadata.
     * @param  {object} videos - TimeLine videos.
     */
        //TODO Solution should work if video track is 2. In case if tracks count is more, we need find new solution.
    const upperTrackMedias = videos.filter(media => (media.trackIndex === currentVideo.trackIndex + 1));
    const upperTrackCurrentMedia = upperTrackMedias.find(media => (media.end > currentVideo.start) && (media.end <= currentVideo.end));
    return !upperTrackCurrentMedia || upperTrackCurrentMedia.isDummy ? currentVideo.inPoint : currentVideo.inPoint + (upperTrackCurrentMedia.end - currentVideo.start);
}