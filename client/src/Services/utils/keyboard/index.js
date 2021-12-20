import hotkeys from 'hotkeys-js';

const isInputElement = (el) => {
    const tagName = el?.tagName;
    const isInput = /^(INPUT|TEXTAREA|SELECT)$/i.test(tagName);
    const isQlEditor = /ql-editor/.test(el.className);
    return isInput || isQlEditor;
};

const isVideoElement = (el) => {
    const tagName = el?.tagName;
    const isVideo = /^(VIDEO)$/i.test(tagName);
    return isVideo;
};

const isControlPressed = (event) => {
    const isCtrlKey = event.ctrlKey;
    const isCmdKey = event.metaKey; // for Mac OS
    return isCtrlKey || isCmdKey;
};

const isCtrl_S = (event) => {
    return isControlPressed(event) && event.code === 'KeyS';
};

const isSpace = (event) => {
    return event.code === 'Space';
};

hotkeys.filter = (event) => {
    const isInputTarget = isInputElement(event.target);
    const isVideoTarget = isVideoElement(event.target);

    const isSaveHotkey = isCtrl_S(event);
    const isSpaceHotkey = isSpace(event);

    if (isInputTarget) {
        return isSaveHotkey;
    }

    if (isVideoTarget) {
        return !isSpaceHotkey;
    }

    return true;
};

export const keyboard = new (class keyboard {
    hotkeys = hotkeys;
})();