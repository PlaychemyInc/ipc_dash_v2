import { Container, Sprite } from 'pixi.js';
import AddIpcPopup from '../popups/AddIpcPopup';
import { FancyButton } from '@pixi/ui';
import CountdownPopup from '../popups/CountdownPopup';
import { GAME } from '../config';
import WinPopup from '../popups/WinPopup'



export default class UIManager {

    constructor(scene) {
        this.container = new Container();
        this.scene = scene;

        this.buttons = [];


        var screenWidth = this.scene.getScreenWidth();
        var screenHeight = this.scene.getScreenHeight();
        this.countdownPopup = new CountdownPopup(screenWidth / 2, screenHeight / 2, this.onCountdownPopupLoaded.bind(this));

    }

    async onCountdownPopupLoaded() {
        this.addChild(this.countdownPopup.displayObject);
    }

    createButton(x, y, text, onClick, onDoubleClick = () => {}) {
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

        this.addChild(button);
        this.buttons.push(button);

        // ---- Single & Double click logic ----
        let clickTimeout = null;
        const doubleClickThreshold = 300;  // milliseconds

        button.onPress.connect(() => {
            if (clickTimeout) {
                // double click detected
                clearTimeout(clickTimeout);
                clickTimeout = null;
                onDoubleClick();
            } else {
                // start timer for single click
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                    onClick();
                }, doubleClickThreshold);
            }
        });

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

    createPopup(x, y, addIPC, addMultipleIPC) {
        this.addIpcPopup = new AddIpcPopup(x, y, addIPC, addMultipleIPC);
        this.addChild(this.addIpcPopup);
        this.addIpcPopup.zIndex = 1000;
    }

    hidePopup() {
        this.addIpcPopup.visible = false;
    }

    showPopup() {
        this.addIpcPopup.visible = true;

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
        this.addChild(button);

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

    startRaceClicked(callback) {
        this.hideButtons();
        this.countdownPopup.playAnimation(callback);
    }

    createWinPopup(winner, finishedIPCs) {
        this.winPopup = new WinPopup(this.scene, this.scene.getScreenWidth() / 2, this.scene.getScreenHeight() / 2, winner, finishedIPCs);
        this.addChild(this.winPopup.displayObject);
    }

    addChild(child) {
        this.container.addChild(child);
    }

    get displayObject() {
        return this.container;
    }

        destroy() {
        throw new Error('Method not implemented.');
    }
}