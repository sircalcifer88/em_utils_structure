
// TODO - WARNING - this function is an alternative for existing anti-pattern functional. Don't use that.
const callAfterRender = (cb) => {
    Promise.resolve().then(() => {
        cb();
    });
};

export {callAfterRender};