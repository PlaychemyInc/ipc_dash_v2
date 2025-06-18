import { Container } from 'pixi.js';

export interface Scene {
    container: Container;
    updateScreenSize?: () => void;
    destroy?: () => void;
}
