import { Container, Sprite, Text, TextStyle } from 'pixi.js';
import { Input } from '@pixi/ui';

interface InputLabelOptions {
    label?: string;
    placeholder?: string;
    x?: number;
    y?: number;
    width?: number;
    labelFontSize?: number;
    labelColor?: number;
    inputFontSize?: number;
    inputColor?: number;
    inputBgTextureKey?: string;
    cleanOnFocus?: boolean;
    maxLength?: number;
    numericOnly?: boolean;
}

export default class InputLabel extends Container {
    private _labelText: Text;
    private _inputField: Input;
    private options: Required<InputLabelOptions>;

    constructor(options: InputLabelOptions = {}) {
        super();

        this.options = {
            label: options.label ?? 'Label',
            placeholder: options.placeholder ?? 'Enter text',
            x: options.x ?? 0,
            y: options.y ?? 0,
            width: options.width ?? 200,
            labelFontSize: options.labelFontSize ?? 16,
            labelColor: options.labelColor ?? 0xffffff,
            inputFontSize: options.inputFontSize ?? 16,
            inputColor: options.inputColor ?? 0x000000,
            inputBgTextureKey: options.inputBgTextureKey ?? 'input',
            cleanOnFocus: options.cleanOnFocus ?? false,
            maxLength: options.maxLength ?? 0, // 0 means no limit
            numericOnly: options.numericOnly ?? false,
        };

        this.x = this.options.x;
        this.y = this.options.y;

        this._labelText = new Text(this.options.label, new TextStyle({
            fontSize: this.options.labelFontSize,
            fill: this.options.labelColor,
            fontWeight: 'bold',
        }));
        this.addChild(this._labelText);

        const bgSprite = Sprite.from(this.options.inputBgTextureKey);
        bgSprite.width = this.options.width;
        bgSprite.height = this.options.inputFontSize + 20;// padding + font size

        this._inputField = new Input({
            bg: bgSprite,
            placeholder: this.options.placeholder,
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
            textStyle: {
                fill: this.options.inputColor,
                fontSize: this.options.inputFontSize,
            }
        });
        this._inputField.y = this._labelText.height + 8;
        this.addChild(this._inputField);

        // Clean on focus
        if (this.options.cleanOnFocus) {
            this._inputField.on('focus', () => {
                this._inputField.value = '';
            });
        }

        // Validation + change event
        this._inputField.on('change', this._handleChange.bind(this));
        this._inputField.on('submit', this._handleSubmit.bind(this));
    }

    private _handleChange(value: string): void {
        // Numeric-only filter
        if (this.options.numericOnly) {
            value = value.replace(/[^0-9]/g, '');
            this._inputField.value = value;
        }

        // Max length filter
        if (this.options.maxLength > 0 && value.length > this.options.maxLength) {
            value = value.substring(0, this.options.maxLength);
            this._inputField.value = value;
        }

        // Dispatch change event
        this.emit('change', value);
    }

    private _handleSubmit(value: string): void {
        this.emit('submit', value);
    }

    public getValue(): string {
        return this._inputField.value;
    }

    public setValue(val: string): void {
        this._inputField.value = val;
    }

    public destroy(options?: boolean | { children?: boolean; texture?: boolean; baseTexture?: boolean }): void {
        this._inputField.destroy();
        this._labelText.destroy();
        super.destroy(options);
    }
}
