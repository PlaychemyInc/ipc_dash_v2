import { Container, Graphics, Text } from 'pixi.js';

export default class SimpleSlider extends Container {
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