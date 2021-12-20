export const mediaListToTree = (path, mediaVideos, itemId) => {
    /**
     * @path the current path for tree node
     * @mediaVideos array of items in a tree
     **/
    let media = {};
    const item = mediaVideos.find(elem => (elem.path === path && elem.id === itemId));
    if (item && item.type === 'folder') {
        return media = {
            ...item,
            children: mediaVideos.filter(elem => elem.path === `${path}/${elem.module}`).map(folder => {
                return mediaListToTree(folder.path, mediaVideos, folder.id);
            }).sort((item1, item2) => item1.module.toLowerCase().localeCompare(item2.module.toLowerCase())).sort((item1, item2) => item1.leaf === item2.leaf ? 0 :item1.leaf ? 1 : -1 )
        };
    } else {
        return media = item;
    }
    return media;
};