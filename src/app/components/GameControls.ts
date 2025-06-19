export default class GameControls {
    private scene: any;
    private uiManager: any;
    private camera: any;

    constructor(scene: any, uiManager: any, camera: any) {
        this.scene = scene;
        this.uiManager = uiManager;
        this.camera = camera;

        this.setupControls();
    }

    private setupControls(): void {
        this.uiManager.createPopup(
            this.scene.getScreenWidth() / 2,
            this.scene.getScreenHeight() / 2,
            this.scene.addIPCtoScene.bind(this.scene),
            this.scene.addMultipleIPCsToScene.bind(this.scene)
        );

        this.uiManager.addIpcButton = this.uiManager.createButton(10, 10, 'Add IPC', this.scene.showPopup.bind(this.scene));

        const buttonStart = this.uiManager.createButton(
            this.scene.getScreenWidth() - 10, 
            10, 
            'Start Race', 
            this.scene.onStartRaceClicked.bind(this.scene), 
            this.scene.onStartRaceQuick.bind(this.scene)
        );
        buttonStart.x -= buttonStart.width;

        this.scene.fastForwardButton = this.uiManager.createFastForwardButton(
            this.scene.getScreenWidth() - 10,
            10,
            this.scene.increaseSpeed.bind(this.scene)
        );
        this.scene.fastForwardButton.x -= this.scene.fastForwardButton.width;
        this.scene.fastForwardButton.visible = false;

        this.camera.addToMoveWithCamera(this.uiManager.displayObject);
    }

    public destroy(): void {
        // if you had any specific listeners in controls, remove them here
    }
}
