import _forEach from 'lodash/forEach';

const Video = (options) => {
    const video = document.createElement('video');
    _forEach(options, (value, key) => {
        video[key] = value;
    });

    video.destroy = () => {
        video.pause();
        video.removeAttribute('src');
        video.load();
    };

    return video;
};

export {Video};