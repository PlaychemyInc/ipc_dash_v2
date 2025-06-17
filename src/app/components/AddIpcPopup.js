import { Container, Graphics, Text } from 'pixi.js';
import BasicButton from './BasicButton';
import InputLabel from './InputLabel';

class SimpleSlider extends Container {
  constructor(min, max, initialValue, onChange) {
    super();

    this.min = min;
    this.max = max;
    this.value = initialValue;
    this.onChange = onChange;

    const width = 200;
    const height = 4;
    const knobRadius = 10;

    // Track
    const track = new Graphics()
      .beginFill(0xaaaaaa)
      .drawRect(0, 0, width, height)
      .endFill();
    this.addChild(track);

    // Knob
    this.knob = new Graphics()
      .beginFill(0x333333)
      .drawCircle(0, 0, knobRadius)
      .endFill();
    this.knob.y = height / 2;
    this.addChild(this.knob);

    // Value label
    this.valueText = new Text(`${initialValue}`, { fontSize: 16, fill: 0x000000 });
    this.valueText.x = width + 20;
    this.valueText.y = -10;
    this.addChild(this.valueText);

    this.knob.interactive = true;
    this.knob.buttonMode = true;

    // Handle dragging
    this.knob
      .on('pointerdown', (event) => {
        this.dragging = true;
        this.dragData = event.data;
      })
      .on('pointerup', () => { this.dragging = false; })
      .on('pointerupoutside', () => { this.dragging = false; })
      .on('pointermove', () => {
        if (this.dragging) {
          const newPos = this.dragData.getLocalPosition(this);
          let clampedX = Math.max(0, Math.min(newPos.x, width));
          this.knob.x = clampedX;
          this.value = Math.round(this.min + (clampedX / width) * (this.max - this.min));
          this.valueText.text = `${this.value}`;
          if (this.onChange) this.onChange(this.value);
        }
      });

    // Initialize knob position
    this.setValue(initialValue);
  }

  setValue(val) {
    this.value = val;
    const width = 200;
    const relativeX = ((val - this.min) / (this.max - this.min)) * width;
    this.knob.x = relativeX;
    this.valueText.text = `${val}`;
  }

  getValue() {
    return this.value;
  }
}

export default class AddIpcPopup extends Container {
  constructor(x, y, onClose = () => { }, onGenerateRandom = () => { }) {
    super();

    var bg_width = 350;
    var bg_height = 300;

    this.onGenerateRandom = onGenerateRandom;

    //Background
    const box = new Graphics()
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, bg_width, bg_height, 20)
      .endFill();
    box.x = x - (bg_width / 2);
    box.y = y - (bg_height / 2);
    this.addChild(box);

    const text = new Text("ADD IPCs", {
      fill: 0x000000,
      fontSize: 18,
      wordWrap: true,
      wordWrapWidth: bg_width - 40,
    });
    text.x = box.x + bg_width / 2 - text.width / 2;
    text.y = box.y + 30;
    this.addChild(text);

    // Manual IPC input
    this.input = new InputLabel({
      label: '',
      placeholder: 'IPC ID',
      x: box.x + 10,
      y: text.y + 20,
    });
    this.addChild(this.input);

    // Slider label
    const sliderLabel = new Text("Random Count:", {
      fontSize: 16,
      fill: 0x000000
    });
    sliderLabel.x = box.x + 30;
    sliderLabel.y = this.input.y + this.input.height + 20;
    this.addChild(sliderLabel);

    // Slider
    this.slider = new SimpleSlider(1, 23, Math.floor(Math.random() * 23), (val) => {
      // live update if needed
    });
    this.slider.x = box.x + 30;
    this.slider.y = sliderLabel.y + sliderLabel.height + 20;
    this.addChild(this.slider);

    // Add button
    const closeBtn = new BasicButton('Add', 100, 40, () => {
      const addIPC = this.input.getValue();
      this.input.setValue('');
      if (addIPC === "") {
        this.generateRandomIPCs();
      }
      else {
        onClose(addIPC);
      }
    });
    closeBtn.x = box.x + 30;
    closeBtn.y = this.slider.y + this.slider.height + 20;
    this.addChild(closeBtn);

    // Generate Random button


    const randomBtn = new BasicButton('Generate Random', 160, 40, this.generateRandomIPCs.bind(this));
    randomBtn.x = box.x + 150;
    randomBtn.y = closeBtn.y;
    this.addChild(randomBtn);
  }

  generateRandomIPCs() {
    const count = this.slider.getValue();
    const randomValues = [];
    for (let i = 0; i < count; i++) {
      const randomIPC = 1 + (Math.floor(Math.random() * 11999));
      randomValues.push(randomIPC);
    }
    this.onGenerateRandom(randomValues);

  }
}
