import { Application, Container } from 'pixi.js';
import TransitionOverlay from '../components/TransitionOverlay';
import { Scene } from '../types/Scene'; // We’ll define this type

type SceneConstructor = (game: any) => Promise<Scene> | Scene;

export default class SceneManager {
    private static instance: SceneManager | null = null;

    private game: any;
    private app: Application;
    private currentScene: Scene | null = null;
    private transition: TransitionOverlay;
    private sceneRegistry: Map<string, SceneConstructor> = new Map();

    private constructor(game: any) {
        this.game = game;
        this.app = game.app;
        this.transition = new TransitionOverlay(this.app, { duration: 500 });
    }

    /**
     * Get singleton instance
     */
    public static getInstance(game?: any): SceneManager {
        if (!SceneManager.instance) {
            if (!game || !game.app) {
                throw new Error('SceneManager requires a game object with app on first initialization.');
            }
            SceneManager.instance = new SceneManager(game);
        }
        return SceneManager.instance;
    }

    /**
     * Register a scene with a key
     */
    public registerScene(key: string, sceneConstructor: SceneConstructor): void {
        this.sceneRegistry.set(key, sceneConstructor);
    }

    /**
     * Set the current scene
     */
    public async setScene(key: string): Promise<Scene | null> {
        const sceneConstructor = this.sceneRegistry.get(key);

        if (!sceneConstructor) {
            console.warn(`Unknown scene key: ${key}`);
            return null;
        }

        await this.transition.fadeOut();

        if (this.currentScene) {
            if (typeof this.currentScene.destroy === 'function') {
                this.currentScene.destroy();
            }
            this.app.stage.removeChildren(0);
        }

        const newScene = await sceneConstructor(this.game);
        this.currentScene = newScene;

        if (newScene && (newScene as any).container instanceof Container) {
            this.app.stage.addChild((newScene as any).container);
        } else if (newScene instanceof Container) {
            this.app.stage.addChild(newScene);
        }

        await this.transition.fadeIn();

        return this.currentScene;
    }

    /**
     * Update screen size
     */
    public updateScreenSize(): void {
        if (this.currentScene && typeof this.currentScene.updateScreenSize === 'function') {
            this.currentScene.updateScreenSize();
        }
    }

    /**
     * Destroy SceneManager
     */
    public destroy(): void {
        if (this.currentScene && typeof this.currentScene.destroy === 'function') {
            this.currentScene.destroy();
        }
        this.currentScene = null;
        this.app = null!;
        this.game = null!;
        this.transition = null!;
        SceneManager.instance = null;
    }
}
