'use client'

import { useEffect, useRef, Component, createRef } from 'react';
import { Application, Assets, Sprite } from 'pixi.js';
import { initDevtools } from '@pixi/devtools';

import SceneManager from './SceneManager';

export default class PixiGame extends Component {
    constructor() {
        super();
        this.pixiContainer = createRef();
        this.app = null;
        this.assets = null;

    }
    render() {
        return <div ref={this.pixiContainer} />;
    }
    async componentDidMount() {
        // Wait for the app to be created
        var app = await this.createApp();
        this.app = app;
        initDevtools({ app });

        //Add app to HTML DOM
        this.pixiContainer.current.appendChild(this.app.canvas);

        await Assets.init({  manifest: '/manifest.json' });
        this.assets = Assets;

        this.sceneManager = new SceneManager(this);
        //Set Scene
        await this.sceneManager.setScene('init');

    }

    async createApp() {
        // Create the application
        const app = new Application();
        await app.init({
            resizeTo: window
           
        });

        

        return app;
    }
}
