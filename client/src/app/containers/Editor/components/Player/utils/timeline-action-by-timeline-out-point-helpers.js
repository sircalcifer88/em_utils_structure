import {INSERT_OVERWRITE_OPTION_TYPES} from '../../../constants';

export const getMediaClipInOutPoints = (timelineInOutMarkers, mediaClipInOutMarkers) => {
    /**
     * Return new in/out points for media clip if one of them is not set by user
     *
     * @param1  {Object} timelineInOutMarkers - Timeline in and out points
     * @param2  {Object} mediaClipInOutMarkers - Media clip in and out points
     * @return {Object} mediaClipInOutMarkers - Updated media clip points
     */
    mediaClipInOutMarkers = JSON.parse(JSON.stringify(mediaClipInOutMarkers));
    if (!timelineInOutMarkers.outPointSetByUser || mediaClipInOutMarkers.inPointSetByUser && mediaClipInOutMarkers.outPointSetByUser) {
        /**
         * return if there is no out point set on timeline or both media clip in and out points are set by user
         */
        return mediaClipInOutMarkers;
    }

    if (!mediaClipInOutMarkers.inPointSetByUser && mediaClipInOutMarkers.outPointSetByUser) {
        const newInPoint = mediaClipInOutMarkers.outPoint - (timelineInOutMarkers.outPoint - timelineInOutMarkers.inPoint);
        mediaClipInOutMarkers.inPoint = newInPoint < 0 ? 0 : newInPoint;
    } else {
        if (!timelineInOutMarkers.inPointSetByUser) {
            mediaClipInOutMarkers.outPointSetByUser = true;
            if (!mediaClipInOutMarkers.inPointSetByUser) {
                const newInPoint = mediaClipInOutMarkers.outPoint - (timelineInOutMarkers.outPoint - timelineInOutMarkers.inPoint);
                mediaClipInOutMarkers.inPoint = newInPoint < 0 ? 0 : newInPoint;
            }
        } else {
            const newOutPoint = mediaClipInOutMarkers.inPoint + (timelineInOutMarkers.outPoint - timelineInOutMarkers.inPoint);
            mediaClipInOutMarkers.outPoint = newOutPoint > mediaClipInOutMarkers.outPoint ? mediaClipInOutMarkers.outPoint : newOutPoint;
        }
    }
    return mediaClipInOutMarkers;
};

export const validateBeforeInsertOverwrite = (timelineInOutMarkers, mediaClipInOutMarkers, mediaClipDuration) => {
    /**
     * Return if by given in/out points on media/timeline, the action is valid
     * if not  valid, return also the options which can be ignored by user, to make te action valid
     *
     * @param1  {Object} timelineInOutMarkers - Timeline in and out points
     * @param2  {Object} mediaClipInOutMarkers - Media clip in and out points
     * @param3  {Number} mediaClipDuration - Media clip original duration without points specified
     * @return {Object} containing:
     *          @isValid {Boolean} - indicates if there would be need to ignore one of user set points to continue timeline action
     *          @disabledOptions {Array} - ignore options that should be disabled
     *          @message {Number} - 1 or -1, which indicates if media selected part is longer/shorter than timeline selected part
     */
    let validationData = {
        isValid: true,
        disabledOptions: [],
        messageType: null
    };
    /**
     * if there is no out point in timeline there cannot be special cases for validation
     */
    if (!timelineInOutMarkers.outPointSetByUser) {
        return validationData;
    }

    const {inPoint: timelineInPoint, outPoint: timelineOutPoint, inPointSetByUser: timelineInPointSetByUser} = timelineInOutMarkers;
    const {inPoint: clipInPoint, outPoint: clipOutPoint, inPointSetByUser: clipInPointSetByUser, outPointSetByUser: clipOutPointSetByUser} = mediaClipInOutMarkers;

    const durationOfTimeline = timelineOutPoint - timelineInPoint;
    const durationOfMediaClip = clipOutPoint - clipInPoint;
    if (!timelineInPointSetByUser) {
        /**
         * out  point in timeline, both in and out points in media clip
         */
        if (clipInPointSetByUser && (durationOfMediaClip > durationOfTimeline)) {
            validationData.isValid = false;
            validationData.messageType = 1;
        }
    } else {
        /**
         * out and in points in timeline, all other cases in media clip
         */
        const durationOfTimelineNotFilled = durationOfMediaClip < durationOfTimeline;
        if (durationOfTimelineNotFilled) {
            /**
             * indicates that media clip selected duration is shorter than timeline selected duration, which is invalid both for 3 and 4 point editing,
             * in case if there are both points set in timeline by user
             * @type {boolean}
             */
            validationData.isValid = false;
            validationData.messageType = -1;

            /**
             * get options which should be disabled, because ignoring them will not make the rest points valid
             */
            const clipDurationInPointIgnored = mediaClipInOutMarkers.outPoint;
            const clipDurationOutPointIgnored = mediaClipDuration - mediaClipInOutMarkers.inPoint;
            if (clipDurationInPointIgnored < durationOfTimeline) {
                validationData.disabledOptions.push(INSERT_OVERWRITE_OPTION_TYPES.sourceInPoint.id);
            }
            if (clipDurationOutPointIgnored < durationOfTimeline) {
                validationData.disabledOptions.push(INSERT_OVERWRITE_OPTION_TYPES.sourceOutPoint.id);
            }
        } else if (clipInPointSetByUser && clipOutPointSetByUser && durationOfMediaClip > durationOfTimeline) {
            validationData.isValid = false;
            validationData.messageType = 1;

            const timelineDurationInPointIgnored = timelineInOutMarkers.outPoint;
            if (durationOfMediaClip > timelineDurationInPointIgnored) {
                validationData.disabledOptions.push(INSERT_OVERWRITE_OPTION_TYPES.timelineInPoint.id);
            }
        }
    }
    return validationData;
};

export const getPointsAfterIgnore = (mediaClipInOutMarkers, timelineInOutMarkers, playlistDuration, ignoredOption) => {
    /**
     * Return new in/out points for media clip and timeline, depending which point is selected by user to be ignored
     *
     * @param1  {Object} timelineInOutMarkers - Timeline in and out points
     * @param2  {Object} mediaClipInOutMarkers - Media clip in and out points
     * @param3  {Number} playlistDuration - Duration of playlist
     * @param4  {String/Number} ignoredOption - id of point which is selected by user to be ignored
     * @return {Object} containing:
     *          @mediaClipInOutMarkers {Object} - updated media clip points after ignore
     *          @timelineInOutMarkers {Object} - updated timeline points after ignore
     */
    if (!timelineInOutMarkers.outPointSetByUser || !ignoredOption) {
        /**
         * return unchanged media clip and timeline points if there is no out point in timeline or there is no ignore option
         */
        return {
            mediaClipInOutMarkers,
            timelineInOutMarkers
        };
    }

    ignoredOption = parseInt(ignoredOption);
    timelineInOutMarkers = JSON.parse(JSON.stringify(timelineInOutMarkers));
    mediaClipInOutMarkers = JSON.parse(JSON.stringify(mediaClipInOutMarkers));
    if (ignoredOption === INSERT_OVERWRITE_OPTION_TYPES.sourceInPoint.id) {
        /**
         * ignore media clip in point
         */
        mediaClipInOutMarkers.inPoint = mediaClipInOutMarkers.outPoint - (timelineInOutMarkers.outPoint - timelineInOutMarkers.inPoint);
    } else if (ignoredOption === INSERT_OVERWRITE_OPTION_TYPES.sourceOutPoint.id) {
        /**
         * ignore media clip out point
         */
        mediaClipInOutMarkers.outPoint = mediaClipInOutMarkers.inPoint + (timelineInOutMarkers.outPoint - timelineInOutMarkers.inPoint);
    } else if (ignoredOption === INSERT_OVERWRITE_OPTION_TYPES.timelineInPoint.id) {
        /**
         * ignore timeline in point
         */
        timelineInOutMarkers.inPointSetByUser = false;
        timelineInOutMarkers.outPointSetByUser = true;
        timelineInOutMarkers.inPoint = 0;
    } else if (ignoredOption === INSERT_OVERWRITE_OPTION_TYPES.timelineOutpoint.id) {
        /**
         * ignore timeline out point
         */
        timelineInOutMarkers.outPointSetByUser = false;
        timelineInOutMarkers.inPointSetByUser = true;
        timelineInOutMarkers.outPoint = playlistDuration;
    }
    return {
        mediaClipInOutMarkers,
        timelineInOutMarkers
    };
};