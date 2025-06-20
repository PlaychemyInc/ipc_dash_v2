import { Container } from 'pixi.js';
import AssetLoader from '../core/AssetLoader';
import SceneManager from '../managers/SceneManager';

export interface Scene {
    container: Container;
    updateScreenSize?: () => void;
    destroy?: () => void;
}

export default class BasicScene {
  public container: Container;
  protected game: any;
  protected key: string;
  protected assets: any;

  constructor(game, key) {
    this.game = game;
    this.key = key;
    this.container = new Container();

    // DO NOT add to stage here — SceneManager will handle that!
    this.load().then(() => this.onLoadComplete());
    // this.load().then(this.onLoadComplete.bind(this));

  }

  /**
   * Load assets for this scene
   */
  protected async load(): Promise<void> {
    try {
      this.assets = await AssetLoader.loadBundle(this.key);
    } catch (error) {
      console.error(`Failed to load assets for scene "${this.key}"`, error);
    }
  }

  /**
   * Called when assets are loaded
   */
  protected onLoadComplete(): void {
    // Intended to be overridden by child scenes
  }

  /**
   * Add a display object to this scene
   */
  public add(object: Container): void {
    this.container.addChild(object);
  }

  /**
   * Request a scene change
   */
  public async setScene(key: string): Promise<void> {
    const sceneManager = SceneManager.getInstance();
    await sceneManager.setScene(key);
  }

  /**
   * Get screen width
   */
  public getScreenWidth(): number {
    return this.game.app.screen.width;
  }

  /**
   * Get screen height
   */
  public getScreenHeight(): number {
    return this.game.app.screen.height;
  }

  /**
   * Handle screen resize
   */
  public updateScreenSize(): void {
    // Intended to be overridden by child scenes
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.container.destroy({ children: true });
    this.assets = null;
  }


}