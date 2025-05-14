'use client'

import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

import SceneManager from './SceneManager';

export default function PixiGame() {
    const pixiContainer = useRef(null);

    useEffect(() => {
        let app;

        (async () => {
            // Create the application
            const app = new Application();

            await app.init({ width: 800, height: 600 });

            pixiContainer.current.appendChild(app.canvas); 

            const sceneManager = new SceneManager(app);
            sceneManager.changeScene('menu');
        })();

        return () => {
            if (app) {
                app.destroy(true, { children: true });
            }
        };
    }, []);

    return <div ref={pixiContainer} />;
}
