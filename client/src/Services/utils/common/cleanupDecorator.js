
const cleanupDecorator = (func) => {
    let cleanupFunction = null;
    return (...args) => {
        cleanupFunction?.();
        cleanupFunction = func(...args);
    };
};

export {cleanupDecorator};