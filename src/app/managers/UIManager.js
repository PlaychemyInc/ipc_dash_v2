import { Container, Sprite } from 'pixi.js';
import BasicPopup from '../components/BasicPopup';
import { FancyButton } from '@pixi/ui';


export default class UIManager {
    constructor(scene) {
        this.uiScene = new Container();
        this.scene = scene;

        this.buttons = [];

        this.scene.game.app.stage.addChild(this.uiScene); // Add after world to render on top
    }

    createButton(x, y, text, onClick) {
        var style = {
            defaultView: Sprite.from(this.scene.assets['button']),
            hoverView: Sprite.from(this.scene.assets['button_hover']),
            pressedView: Sprite.from(this.scene.assets['button_pressed']),
            text: text,
            animations: {
                hover: {
                    props: { scale: { x: 1.02, y: 1.02, } },
                    duration: 100,
                },
                pressed: {
                    props: { scale: { x: 1, y: 1, } },
                    duration: 100,
                }
            }
        };
        var button = new FancyButton(style);
        button.x = x;
        button.y = y;

        button.onPress.connect(onClick);
        this.addChild(button);

        this.buttons.push(button);

        return button;
    }

    hideButtons() {
        for (const index in this.buttons) {
            this.buttons[index].visible = false;
        }
    }

    showButtons() {
        for (const index in this.buttons) {
            this.buttons[index].visible = true;
        }

    }

    createPopup(x, y, callback) {
        this.popup = new BasicPopup(x, y, "Add your IPC", callback);
        this.addChild(this.popup);
        this.popup.zIndex = 1000;
    }

    hidePopup() {
        this.popup.visible = false;
    }

    showPopup() {
        this.popup.visible = true;

    }

    addChild(child) {
        this.uiScene.addChild(child);
    }
}