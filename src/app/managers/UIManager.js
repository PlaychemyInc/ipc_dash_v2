import { Container, Sprite } from 'pixi.js';
import BasicPopup from '../components/BasicPopup';
import { FancyButton } from '@pixi/ui';
import CountdownPopup from '../components/CountdownPopup';
import { GAME } from '../config';


export default class UIManager {
    constructor(scene) {
        this.container = new Container();
        this.scene = scene;

        this.buttons = [];

       
        var screenWidth = GAME.app.screen.width;
        var screenHeight = GAME.app.screen.height;
        this.countdownPopup = new CountdownPopup(screenWidth / 2, screenHeight / 2, this.onCountdownPopupLoaded.bind(this));
    }

    async onCountdownPopupLoaded() {
       
        this.addChild(this.countdownPopup.displayObject);
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

    createFastForwardButton(x, y, onClick) {
        var style = {
            defaultView: Sprite.from(this.scene.assets['FastFowardBtn']),
            hoverView: Sprite.from(this.scene.assets['FastFowardBtn_hover']),
            pressedView: Sprite.from(this.scene.assets['FastFowardBtn_pressed']),
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
        // this.addChild(button);

        this.fastForwardBtn = (button);

        return button;
    }

    hideFastForwardButton() {
        for (const index in this.buttons) {
            this.buttons[index].visible = false;
        }
    }

    showFastForwardButton() {
        for (const index in this.buttons) {
            this.buttons[index].visible = true;
        }

    }

    startRaceClicked(callback){
        this.hideButtons();
        this.countdownPopup.playAnimation(callback);
    }

    addChild(child) {
        this.container.addChild(child);
    }

    get displayObject() {
        return this.container;
    }
}