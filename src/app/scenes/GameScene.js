import { Container, Text } from 'pixi.js';
import BasicButton from '../components/BasicButton';
import BasicPopup from '../components/BasicPopup';
import InputLabel from '../components/InputLabel';

export default function createGameScene(app, switchScene) {
    const scene = new Container();

    // const button = new BasicButton('Show Popup', 200, 60, () => {
    //     const popup = new BasicPopup(app, 'This is a popup!', () => console.log('Closed'));
    //     app.stage.addChild(popup);
    // });
    // button.x = 100;
    // button.y = 100;
    // scene.addChild(button);

    // const input = new InputLabel({
    //     label: 'Player Name',
    //     placeholder: 'Enter your name',
    //     x: 200,
    //     y: 200,
    // });
    // scene.addChild(input);


    const style = {
        fill: 0xffffff,
        fontSize: 32,
    };
    const text = new Text({
        text: ' Game Scene - Click to Go Back',
        style
    });

    text.anchor.set(0.5);
    text.x = app.screen.width / 2;
    text.y = app.screen.height / 2;
    text.eventMode = 'static';
    text.cursor = 'pointer';

    text.on('pointerdown', () => switchScene('menu'));

    scene.addChild(text);
    return scene;
}
