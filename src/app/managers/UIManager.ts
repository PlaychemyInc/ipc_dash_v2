import { Container, Sprite } from 'pixi.js';
import AddIpcPopup from '../popups/AddIpcPopup';
import { FancyButton } from '@pixi/ui';
import CountdownPopup from '../popups/CountdownPopup';
// import { GAME } from '../config';
import WinPopup from '../popups/WinPopup'
import IPC from '../components/IPC';



export default class UIManager {

    private static _instance: UIManager | null = null;

    private container: Container;
    private scene: any;
    private buttons: FancyButton[] = [];
    private addIpcPopup!: AddIpcPopup;
    private countdownPopup!: CountdownPopup;
    private winPopup!: WinPopup;
    private fastForwardBtn!: FancyButton;
    private addIPCButton!: FancyButton;

    private constructor(scene: any) {
        this.scene = scene;
        this.container = new Container();

        const screenWidth = this.scene.getScreenWidth();
        const screenHeight = this.scene.getScreenHeight();

        this.countdownPopup = new CountdownPopup(screenWidth / 2, screenHeight / 2, this.onCountdownPopupLoaded.bind(this));

        this.addIPCButton = this.createButton(10, 10, 'Add IPC', () => this.showAddIpcPopup());
    }

    public static init(scene: any): UIManager {
        if (!UIManager._instance) {
            UIManager._instance = new UIManager(scene);
        }
        return UIManager._instance;
    }

    public static getInstance(): UIManager {
        if (!UIManager._instance) {
            throw new Error("UIManager not initialized. Call UIManager.init(scene) first.");
        }
        return UIManager._instance;
    }

    private async onCountdownPopupLoaded() {
        this.addChild(this.countdownPopup.displayObject);
    }

    public createButton(x: number, y: number, text: string, onClick: () => void, onDoubleClick: () => void = () => { }): FancyButton {
        var style = {
            defaultView: Sprite.from(this.scene.assets['button']),
            hoverView: Sprite.from(this.scene.assets['button_hover']),
            pressedView: Sprite.from(this.scene.assets['button_pressed']),
            text,
            animations: {
                hover: { props: { scale: { x: 1.02, y: 1.02, } }, duration: 100, },
                pressed: { props: { scale: { x: 1, y: 1, } }, duration: 100, }
            }
        };

        const button = new FancyButton(style);
        button.x = x;
        button.y = y;

        this.addChild(button);
        this.buttons.push(button);

        // ---- Single & Double click logic ----
        let clickTimeout: NodeJS.Timeout | null = null;
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

    public createStartRaceButton(x: number, y: number, text: string, onClick: () => void, onDoubleClick: () => void = () => { }): FancyButton {

        const buttonStart = this.createButton(x, y, text, this.startRaceClicked.bind(this, onClick), onDoubleClick);
        return buttonStart;
        //     this.getScreenWidth() - 10,
        //     10,
        //     'Start Race',
        //     this.onStartRaceClicked.bind(this),
        //     this.onStartRaceQuick.bind(this)
        // );

    }

    public hideButtons(): void {
        this.buttons.forEach(button => button.visible = false);
    }

    public showButtons(): void {
        this.buttons.forEach(button => button.visible = true);
    }

    createAddIPCPopup(addMultipleIPC: (ids: number[]) => void): void {
        const screenWidth = this.scene.getScreenWidth();
        const screenHeight = this.scene.getScreenHeight();
        this.addIpcPopup = new AddIpcPopup(screenWidth / 2, screenHeight / 2, addMultipleIPC);
        this.addChild(this.addIpcPopup);
        this.addIpcPopup.zIndex = 1000;
    }

    showAddIpcPopup(): void{
        if (this.addIpcPopup) this.addIpcPopup.visible = true;
    }

    hidePopup() {
        if (this.addIpcPopup) this.addIpcPopup.visible = false;
    }

    showPopup() {
        this.hideButtons();
        if (this.addIpcPopup) this.addIpcPopup.visible = true;
    }

    createFastForwardButton(x: number, y: number, onClick: () => void): FancyButton {
        var style = {
            defaultView: Sprite.from(this.scene.assets['FastFowardBtn']),
            hoverView: Sprite.from(this.scene.assets['FastFowardBtn_hover']),
            pressedView: Sprite.from(this.scene.assets['FastFowardBtn_pressed']),
            animations: {
                hover: { props: { scale: { x: 1.02, y: 1.02, } }, duration: 100, },
                pressed: { props: { scale: { x: 1, y: 1, } }, duration: 100, }
            }
        };
        const button = new FancyButton(style);
        button.x = x;
        button.y = y;
        button.onPress.connect(onClick);
        this.addChild(button);
        this.fastForwardBtn = (button);
        return button;
    }

    public startRaceClicked(callback: () => void): void {
        this.hideButtons();
        this.countdownPopup.playAnimation(callback);
    }

    public createWinPopup(finishedIPCs: IPC[]): void {
        this.winPopup = new WinPopup(this.scene, this.scene.getScreenWidth() / 2, this.scene.getScreenHeight() / 2, finishedIPCs);
        this.addChild(this.winPopup.displayObject);
    }

    public addChild(child: any): void {
        this.container.addChild(child);
    }

    public get displayObject(): Container {
        return this.container;
    }

    public hideAddIpcButton(): void{
        this.addIPCButton.visible = false;
    }

    destroy() {
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];

        this.addIpcPopup?.destroy?.();
        this.countdownPopup?.destroy?.();
        this.winPopup?.destroy?.();
        this.fastForwardBtn?.destroy?.();

        this.container.destroy({ children: true });
        (this.scene as any) = null;

        UIManager._instance = null;
    }
}