import _forEach from 'lodash/forEach';

const Audio = (options) => {
    const audio = new window.Audio();
    _forEach(options, (value, key) => {
        audio[key] = value;
    });

    audio.destroy = () => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
    };

    return audio;
};

export {Audio};