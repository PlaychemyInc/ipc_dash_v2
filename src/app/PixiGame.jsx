'use client'

import { Component, createRef } from 'react';
import { initDevtools } from '@pixi/devtools';
import PixiAppManager from './core/PixiAppManager';
import AssetLoader from './core/AssetLoader';

import SceneManager from './managers/SceneManager';

import InitScene from './scenes/InitScene';
import gameScene from './scenes/GameScene';

export default class PixiGame extends Component {
    constructor() {
        super();
        this.pixiContainer = createRef();
        this.appManager = null;
        this.sceneManager = null;

    }

    render() {
        return <div ref={this.pixiContainer} />;
    }

    async componentDidMount() {
        //listen for window resize
        window.addEventListener("resize", this.handleResize);

        // Wait for the app to be created
        this.appManager = new PixiAppManager(this.pixiContainer.current);
        await this.appManager.init();

        initDevtools({ app: this.appManager.app });

        await AssetLoader.init();

        // create once
        const sceneManager = SceneManager.getInstance(this.appManager);
        // Register scenes
        sceneManager.registerScene('init', async (game) => new InitScene(game));
        sceneManager.registerScene('game', async (game) => new gameScene(game));
        // Set scene
        await sceneManager.setScene('init');

    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        if (this.appManager) {
            this.appManager.destroy();
        }
        if (this.sceneManager) {
            this.sceneManager.destroy();
        }
    }

    handleResize = () => {
        SceneManager.getInstance().updateScreenSize();
    }
}
