/**
 * Find all the video items inside the current folder
 * Return an array containing found items
 **/
 export function getVideosForCurrentFolder(currentFolder, videos){
    /**
     * @currentFolder the current folder
     * @videos medias list
     **/
    return videos.filter(video => video.leaf && video.path.indexOf(`${currentFolder.path}/`) === 0);
}