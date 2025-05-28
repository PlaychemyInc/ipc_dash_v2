import Rock from '../components/Rock';
import {Ticker} from 'pixi.js';

const RockCount = 10;

export default class RockManager {

    constructor(scene) {
        this.scene = scene;
        this.rocks = {};
    }

    createRocks(ipc) {

        var lastX = ipc.x;
        var spacing = 500;//(endX - startX - 200)/RockCount;
        this.rocks[ipc.getID()] = [];
        for (let i = 0; i < RockCount; i++) {
            const x = lastX + spacing + Math.random() * 200; // staggered, randomized spacing
            var rock = new Rock(this, ipc.getID(),  x, ipc.y, this.assetLoaded.bind(this));
            this.rocks[ipc.getID()].push(rock);
            lastX = x;
        }

    }

    assetLoaded(ipc_id, rock) {
        this.scene.add(rock);

        const ipcRocks = this.rocks[ipc_id];
        const ipcPlayer = this.scene.ipcManager.getIPC(ipc_id);
        var index = 0;

        function rockCollison() {
            if (index < ipcRocks.length) {
                var rock = ipcRocks[index];
                if (isCollidingX(ipcPlayer.sprite, rock.sprite)) {
                    // Handle collision
                    // rock.sprite.play();
                    // rock.sprite.loop = false;
                    ipcPlayer.hitRock(rock);
                    index++;
                }
            }
            else {
                Ticker.shared.remove(rockCollison);
            }
        }
        Ticker.shared.add(rockCollison);
    }

}

function isCollidingX(spriteA, spriteB) {
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();

    return (
        boundsA.x < boundsB.x + boundsB.width &&
        boundsA.x + boundsA.width > boundsB.x 
    );
}

function isColliding(spriteA, spriteB) {
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();

    return (
        boundsA.x < boundsB.x + boundsB.width &&
        boundsA.x + boundsA.width > boundsB.x &&
        boundsA.y < boundsB.y + boundsB.height &&
        boundsA.y + boundsA.height > boundsB.y
    );
}