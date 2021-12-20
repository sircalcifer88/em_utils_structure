import {ServiceBase} from 'Libs/service-base-class';
import {PlaylistMaker} from './PlaylistMaker';

class EditorService extends ServiceBase {
    state = {
        playlist: [],
        playlistDuration: 0,
    };
    playlistMaker = new PlaylistMaker();
}

export const editorService = new EditorService();
