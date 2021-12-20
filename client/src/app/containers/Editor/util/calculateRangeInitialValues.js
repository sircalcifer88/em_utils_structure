export const calculateRangeInitialValues = (ranges, timelineClips, currentFrame, playlistDuration, fps) => {
    const twoSecondsInFrames = fps*2;
    ranges = JSON.parse(JSON.stringify(ranges));
    const rangeBeforeIndex = ranges.sort((a, b) => a.start - b.start)
        .findIndex((item, index, arr) => (item.end <= currentFrame) && (arr[index + 1] ? currentFrame < arr[index + 1].start : true));
    const rangeBefore = ranges[rangeBeforeIndex];
    const rangeAfter = ranges[rangeBeforeIndex + 1];

    let currentClip = timelineClips.find(clip => clip.start <= currentFrame && (playlistDuration === currentFrame ? currentFrame <= clip.end : currentFrame < clip.end));
    let start = currentClip && currentClip.start;
    let end = currentClip && currentClip.end;
    let changedByRange = false;
    if (rangeBefore && rangeBefore.end > start) {
        start = rangeBefore.end;
        changedByRange = true;
    }
    if (rangeAfter && rangeAfter.start < end) {
        end = rangeAfter.start;
        changedByRange = true;
    }

    let duration = end - start;
    if (timelineClips.length === 2 && !changedByRange && duration > twoSecondsInFrames) {
        start = currentFrame === playlistDuration ? currentClip.end - twoSecondsInFrames : currentFrame;
        duration = end - start < twoSecondsInFrames ? end - start : twoSecondsInFrames;
        end = start + duration;
    }
    return {start, duration, end};
};