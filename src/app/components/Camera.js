import { Ticker } from 'pixi.js';

export default class Camera { 

    constructor(gameScene){
        this.camera = gameScene.scene;
        this.scene = gameScene;
    }

    startFollowIPC(fastestIPC, maxWidth, finalX){

        var speed = 0;
        // const camera = this.camera;

        const followIPC = (delta) => {
            // 
            if (fastestIPC.x + fastestIPC.sprite.width >=  maxWidth) {
                speed = fastestIPC.getSpeed()/5;
                // console.log(speed);
            }

            if (this.camera.pivot.x + maxWidth < finalX) {
                this.camera.pivot.x += speed;

                // Clamp if it overshoots
                if (this.camera.pivot.x + maxWidth > finalX) {
                    this.camera.pivot.x = finalX - maxWidth;
                }
            } else {
                // Stop the ticker function once the sprite reaches the target
                Ticker.shared.remove(followIPC);
            }
        };

        // Start the movement
        Ticker.shared.add(followIPC);
    }

}