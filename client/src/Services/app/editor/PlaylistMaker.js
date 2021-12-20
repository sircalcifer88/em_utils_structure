import { nanoid } from 'nanoid';
import {DummyVideo} from 'Services/utils';
import {
    MEDIA_AUDIO_TYPE,
    MEDIA_VIDEO_TYPE,
} from 'app/containers/Editor/constants';
import {getMediasFromTimeLine} from 'app/containers/Editor/util/getMediasFromTimeLine';


class PlaylistMaker {
    // PRIVATE VARIABLES
    #currentPlaylist;
    #currentFps;

    // PUBLIC API
    insertPlaylistDummies = (timelineData) => {
        const audioTracks = timelineData?.audio?.tracks;
        const videoTracks = timelineData?.video?.tracks;

        this.#resetPlaylist();

        // insert audio tracks dummies
        audioTracks.forEach((track) => {
            const trackWithDummies = this.#insertTrackDummies(track);
            this.#addAudioTrack(trackWithDummies);
        });

        // insert video tracks dummies
        videoTracks.forEach((track) => {
            const trackWithDummies = this.#insertTrackDummies(track);
            this.#addVideoTrack(trackWithDummies);
        });

        // insert final dummy
        this.#insertFinalDummy();


        const newTimeLineMediasArr = getMediasFromTimeLine(this.#currentPlaylist);
        return {
            timeline: this.#currentPlaylist,
            timeLineMediasArr: newTimeLineMediasArr
        };
    }


    // PRIVATE METHODS
    #getEmptyPlaylist = () => {
        return {
            [MEDIA_VIDEO_TYPE]: {
                tracks: []
            },
            [MEDIA_AUDIO_TYPE]: {
                tracks: []
            }
        };
    }
    #resetPlaylist = () => {
        this.#currentPlaylist = this.#getEmptyPlaylist();
        this.#currentFps = 0;
    }

    #addVideoTrack = (track) => {
        this.#currentPlaylist.video.tracks.push(track);
    }

    #addAudioTrack = (track) => {
        this.#currentPlaylist.audio.tracks.push(track);
    }

    #createDummyMedia = (options={}) => {
        const {
            fps=0,
            mediaType,
            trackIndex=0,
            start=0,
            end=0,
            duration=0,
            outPoint=0,
        } = options;

        return {
            id: DummyVideo.id,
            isDummy: true,
            inPoint: 0,
            timelineItemId: nanoid(),
            mediaType,
            trackIndex,
            start,
            end,
            duration,
            fps,
            outPoint,
        };
    }

    #insertTrackDummies = (track) => {
        const trackWithDummies = [];

        for (let i = 0; i < track.length; ++i) {
            const media = track[i];
            this.#currentFps = media.fps;
            const prevMedia = track[i - 1] || {start: 0, end: 0};
            const distance = media.start - prevMedia.end;

            if (distance) {
                const dummyMedia = this.#createDummyMedia({
                    fps: media.fps,
                    mediaType: media.mediaType,
                    trackIndex: media.trackIndex,
                    start: prevMedia.end,
                    end: media.start,
                    duration: distance,
                    outPoint: distance,
                });
                trackWithDummies.push(dummyMedia);
            }
            trackWithDummies.push(media);
        }

        return trackWithDummies;
    }

    #getMaxTrackDuration = (tracks) => {
        return tracks.reduce((max, track) => {
            const lastMedia = track[track.length - 1];
            const lastMediaEnd = lastMedia?.end || 0;
            return lastMediaEnd > max ? lastMediaEnd : max;
        }, 0);
    }

    #insertFinalDummy = () => {
        const audioTracks = this.#currentPlaylist.audio.tracks;
        const videoTracks = this.#currentPlaylist.video.tracks;
        const maxAudioTrackDuration = this.#getMaxTrackDuration(audioTracks);
        const maxVideoTrackDuration = this.#getMaxTrackDuration(videoTracks);

        if (maxAudioTrackDuration > maxVideoTrackDuration) {
            const firstVideoTrack =  videoTracks[0];
            const lastMedia = firstVideoTrack[firstVideoTrack.length - 1] || {start: 0, end: 0};
            const distance = maxAudioTrackDuration - lastMedia.end;

            const finalDummy = this.#createDummyMedia({
                fps: this.#currentFps,
                mediaType: MEDIA_VIDEO_TYPE,
                trackIndex: 0,
                start: lastMedia.end,
                end: maxAudioTrackDuration,
                duration: distance,
                outPoint: distance,
            });
            videoTracks[0].push(finalDummy);
        }
    }
}

export {PlaylistMaker};