// https://pixijs.io/ui/storybook/?path=/story/components-input-use-graphics--use-graphics&globals=backgrounds.grid:!true


import { Container, Sprite, Text, Texture } from 'pixi.js';
import {Input} from '@pixi/ui'; 

export default class InputLabel extends Container {
  constructor({ label = 'Label', placeholder = 'Enter text', x = 0, y = 0 }) {
    super();

    this.x = x;
    this.y = y;

    // Label Text
    const labelText = new Text(label, {
      fontSize: 16,
      fill: 0xffffff,
      fontWeight: 'bold',
    });
    labelText.y = 0;
    this.addChild(labelText);

    // Input Field
    this.input = new Input({
      bg: Sprite.from('input'), // must be preloaded!
      placeholder: placeholder,
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
      textStyle: {
        fill: '#000000',
        fontSize: 16,
      },
      width: 200,
    });

    this.input.y = labelText.height + 8;
    this.addChild(this.input);
  }

  getValue() {
    return this.input.value;
  }

  setValue(val) {
    this.input.text = val;
  }

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }
}
