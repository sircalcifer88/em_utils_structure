
const onceDecorator = (fn) => {
    let t = false;
    return (...args) => {
        if (!t) {
            t = true;
            fn(...args);
        }
    };
};

export {onceDecorator};