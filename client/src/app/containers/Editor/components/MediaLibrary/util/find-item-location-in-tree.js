export const findItemLocationInTree = function(object, value) {
    const item = object.children && object.children.find(item => item.id === value);
    if(item) {
        return object;
    } else {
        return object.children && object.children.reduce((acc, item) => {
            return findItemLocationInTree(item, value) || acc;
        }, null);
    }
};