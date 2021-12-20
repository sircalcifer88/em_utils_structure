import { nanoid } from 'nanoid';
import {FRAME_RATE} from 'app/containers/Editor/constants';

const DUMMY_BACKGROUND = 'black';

/**
 * Fake video tag for time seeking
 */
export class DummyVideo {
    constructor(props) {
        this.currentTime = props.currentTime || 0;
        this.readyState = 4;
        this.isDummy = true;
        this.paused = true;
        this.fps = props.fps || FRAME_RATE;


        this.lastTimeChange = 0;
        this.then = null;
        this.now = null;
        this.startTime = null;
        this.elapsed = null;
        this.animationRequestId = null;
    }

    play = () => {
        if (!this.paused) {
            return false;
        }
        this.paused = false;
        this.startAnimating();
    }

    startAnimating = () => {
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }

    animate = () => {
        this.animationRequestId = requestAnimationFrame(this.animate);
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fps) {
            this.then = this.now - (this.elapsed % this.fps);
            const sinceStart = Math.round((this.now - this.startTime) / 1000 * 100) / 100;
            this.timUpdate(sinceStart - this.lastTimeChange);
            this.lastTimeChange = sinceStart;
        }
    }

    timUpdate = (sinceStart) => {
        this.currentTime += sinceStart;
    }

    componentWillUnmount = () => {
        if (this.animationRequestId) {
            window.cancelAnimationFrame(this.animationRequestId);
        }
        this.paused = true;
    }

    pause = () => {
        if (this.animationRequestId) {
            window.cancelAnimationFrame(this.animationRequestId);
        }
        this.paused = true;
        this.animationRequestId = null;
        this.lastTimeChange = 0;
        this.then = null;
        this.now = null;
        this.startTime = null;
        this.elapsed = null;
    }

    get duration() {
        throw new Error('Dummy duration is requested');
    }

    static id = nanoid();

    render = (canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = DUMMY_BACKGROUND;
        ctx.fill();
    }

    destroy = () => {
        this.pause();
    }
}