import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, Input, ViewChild, Output, NgModule } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { isEqual, cloneDeep } from 'lodash-es';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';

var CanvasWhiteboardUpdateType;
(function (CanvasWhiteboardUpdateType) {
    CanvasWhiteboardUpdateType[CanvasWhiteboardUpdateType["START"] = 0] = "START";
    CanvasWhiteboardUpdateType[CanvasWhiteboardUpdateType["DRAG"] = 1] = "DRAG";
    CanvasWhiteboardUpdateType[CanvasWhiteboardUpdateType["STOP"] = 2] = "STOP";
})(CanvasWhiteboardUpdateType || (CanvasWhiteboardUpdateType = {}));
class CanvasWhiteboardUpdate {
    static deserializeJson(json) {
        let parsedJson;
        try {
            parsedJson = JSON.parse(json);
            return new CanvasWhiteboardUpdate(parsedJson['x'], parsedJson['y'], parsedJson['type'], parsedJson['uuid'], parsedJson['selectedShape'], parsedJson['selectedShapeOptions']);
        }
        catch (e) {
            console.error("The canvas whiteboard update is not parseable");
            return null;
        }
    }
    constructor(x, y, type, UUID, selectedShape, selectedShapeOptions) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.UUID = UUID;
        this.selectedShape = selectedShape;
        this.selectedShapeOptions = selectedShapeOptions;
    }
    stringify() {
        const objectToSerialize = {
            x: this.x.toFixed(3),
            y: this.y.toFixed(3),
            type: this.type,
            uuid: this.UUID,
            selectedShape: this.selectedShape
        };
        if (this.selectedShapeOptions) {
            objectToSerialize['selectedShapeOptions'] = this.selectedShapeOptions;
        }
        return JSON.stringify(objectToSerialize);
    }
}

const DEFAULT_STYLES = `
.canvas_whiteboard_button {
    display: inline-block;
    outline: 0px;
    padding-top: 7px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.canvas_whiteboard_buttons {
    z-index: 3;
}

@media (max-width: 400px) {
     .canvas_whiteboard_buttons {
            position: absolute;
            top: 0;
            width: 100%;
            text-align: center;
      }
}

@media (min-width: 401px) {
    .canvas_whiteboard_buttons {
        position: absolute;
        right: 0%;
        color: #fff;
    }
}

.canvas_whiteboard_buttons {
    padding: 5px;
}

.canvas_whiteboard_buttons > button {
    margin: 5px;
}

.canvas_whiteboard_button-draw_animated {
    -webkit-animation: pulsate 1s ease-out;
    -webkit-animation-iteration-count: infinite;
}

@keyframes pulsate {
    0% {
        -webkit-transform: scale(0.1, 0.1);
        opacity: 0.0;
    }
    50% {
        opacity: 1.0;
    }
    100% {
        -webkit-transform: scale(1.2, 1.2);
        opacity: 0.0;
    }
}
.canvas_wrapper_div {
    width: 100%;
    height: 100%;
    border: 0.5px solid #e2e2e2;
}

.canvas_whiteboard_button-clear {
    padding-top: 5px;
}

.canvas_whiteboard {
    position: absolute;
    z-index: 1;
}

.incomplete_shapes_canvas_whiteboard {
    position: absolute;
    z-index: 2;
}

`;

class CanvasWhiteboardPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class CanvasWhiteboardShapeOptions {
    constructor() {
        this.shouldFillShape = false;
        this.fillStyle = null;
        this.strokeStyle = 'rgba(0, 0, 0, 1)';
        this.lineWidth = 2;
        this.lineJoin = 'round';
        this.lineCap = 'round';
    }
}

class CanvasWhiteboardService {
    constructor() {
        this._canvasDrawSubject = new Subject();
        this.canvasDrawSubject$ = this._canvasDrawSubject.asObservable();
        this._canvasClearSubject = new Subject();
        this.canvasClearSubject$ = this._canvasClearSubject.asObservable();
        this._canvasUndoSubject = new Subject();
        this.canvasUndoSubject$ = this._canvasUndoSubject.asObservable();
        this._canvasRedoSubject = new Subject();
        this.canvasRedoSubject$ = this._canvasRedoSubject.asObservable();
    }
    drawCanvas(updates) {
        this._canvasDrawSubject.next(updates);
    }
    clearCanvas() {
        this._canvasClearSubject.next(null);
    }
    undoCanvas(updateUUD) {
        this._canvasUndoSubject.next(updateUUD);
    }
    redoCanvas(updateUUD) {
        this._canvasRedoSubject.next(updateUUD);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class CanvasWhiteboardShape {
    constructor(positionPoint, options) {
        this.positionPoint = positionPoint || new CanvasWhiteboardPoint(0, 0);
        this.options = options || new CanvasWhiteboardShapeOptions();
        this.isVisible = true;
    }
    // noinspection TsLint
    onStopReceived(update) {
    }
}

class CircleShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options, radius) {
        super(positionPoint, options);
        this.radius = radius || 0;
    }
    getShapeName() {
        return 'CircleShape';
    }
    draw(context) {
        context.beginPath();
        context.arc(this.positionPoint.x, this.positionPoint.y, this.radius, 0, Math.PI * 2, false);
        Object.assign(context, this.options);
        context.stroke();
        if (this.options.shouldFillShape) {
            context.fill();
        }
        context.closePath();
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(context.canvas.width / 2, context.canvas.height / 2);
        this.radius = this.calculateRadius(context.canvas.width - 2, context.canvas.height / 2);
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.radius = this.calculateRadius(update.x, update.y);
    }
    calculateRadius(x, y) {
        return Math.sqrt(Math.pow(x - this.positionPoint.x, 2) + Math.pow(y - this.positionPoint.y, 2));
    }
}

class RectangleShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options, width, height) {
        super(positionPoint, options);
        this.width = width || 0;
        this.height = height || 0;
    }
    getShapeName() {
        return 'RectangleShape';
    }
    draw(context) {
        if (!this.width || !this.height) {
            return;
        }
        context.beginPath();
        Object.assign(context, this.options);
        context.rect(this.positionPoint.x, this.positionPoint.y, this.width, this.height);
        context.stroke();
        if (this.options.shouldFillShape) {
            context.fill();
        }
        context.closePath();
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(2, 2);
        this.width = context.canvas.width - 4;
        this.height = context.canvas.height - 4;
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.width = update.x - this.positionPoint.x;
        this.height = update.y - this.positionPoint.y;
    }
}

class FreeHandShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options) {
        super(positionPoint, options);
        this.linePositions = [];
    }
    getShapeName() {
        return 'FreeHandShape';
    }
    draw(context) {
        Object.assign(context, this.options);
        context.beginPath();
        context.moveTo(this.positionPoint.x, this.positionPoint.y);
        // Draw a dot
        context.lineTo(this.positionPoint.x + 1, this.positionPoint.y + 1);
        // Normal fastest free hand drawing
        // this.linePositions.forEach((linePosition) => {
        //     context.lineTo(linePosition.x, linePosition.y);
        // });
        // Quadratic curves drawing
        let i = 0;
        while (i < this.linePositions.length) {
            if (this.linePositions.length - i > 2) {
                const controlPoint1 = this.linePositions[i];
                const controlPoint2 = this.linePositions[i + 1];
                const endPoint = this.linePositions[i + 2];
                context.bezierCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
                i += 2;
            }
            else {
                const linePosition = this.linePositions[i];
                context.lineTo(linePosition.x, linePosition.y);
                i += 1;
            }
        }
        context.stroke();
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(2, 2);
        this.linePositions = [
            new CanvasWhiteboardPoint(context.canvas.width - 5, context.canvas.height * 0.3),
            // new CanvasWhiteboardPoint(context.canvas.width * 0.4, context.canvas.height * 0.6),
            new CanvasWhiteboardPoint(context.canvas.width * 0.2, context.canvas.height * 0.4),
            new CanvasWhiteboardPoint(context.canvas.width * 0.6, context.canvas.height * 0.8),
            new CanvasWhiteboardPoint(context.canvas.width, context.canvas.height)
        ];
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.linePositions.push(new CanvasWhiteboardPoint(update.x, update.y));
    }
}

class SmileyShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options, radius) {
        super(positionPoint, options);
        this.options.shouldFillShape = true;
        this.options.fillStyle = this.options.fillStyle || 'yellow';
        this.radius = radius || 0;
    }
    getShapeName() {
        return 'SmileyShape';
    }
    draw(context) {
        context.beginPath();
        Object.assign(context, this.options);
        context.arc(this.positionPoint.x, this.positionPoint.y, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.beginPath();
        const leftEyeX = this.positionPoint.x - this.radius * 0.3;
        const rightEyeX = this.positionPoint.x + this.radius * 0.3;
        const eyesY = this.positionPoint.y - this.radius * 0.2;
        const eyeSize = this.radius * 0.1;
        context.arc(leftEyeX, eyesY, eyeSize, 0, 2 * Math.PI, false);
        context.arc(rightEyeX, eyesY, eyeSize, 0, 2 * Math.PI, false);
        context.fillStyle = this.options.strokeStyle;
        context.fill();
        // draw the mouth
        context.beginPath();
        context.arc(this.positionPoint.x, this.positionPoint.y, this.radius * 0.7, 0, Math.PI, false);
        context.stroke();
        context.closePath();
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(context.canvas.width / 2, context.canvas.height / 2);
        this.radius = this.calculateRadius(context.canvas.width - 2, context.canvas.height / 2);
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.radius = this.calculateRadius(update.x, update.y);
    }
    calculateRadius(x, y) {
        return Math.sqrt(Math.pow(x - this.positionPoint.x, 2) + Math.pow(y - this.positionPoint.y, 2));
    }
}

class StarShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options, radius, spikes) {
        super(positionPoint, options);
        this.radius = radius || 0;
        this.spikes = spikes || 5;
    }
    getShapeName() {
        return 'StarShape';
    }
    draw(context) {
        Object.assign(context, this.options);
        let rotation = Math.PI / 2 * 3;
        let spikeX = this.positionPoint.x;
        let spikeY = this.positionPoint.y;
        const step = Math.PI / this.spikes;
        context.beginPath();
        context.moveTo(this.positionPoint.x, this.positionPoint.y - this.radius);
        for (let i = 0; i < this.spikes; i++) {
            spikeX = this.positionPoint.x + Math.cos(rotation) * this.radius;
            spikeY = this.positionPoint.y + Math.sin(rotation) * this.radius;
            context.lineTo(spikeX, spikeY);
            rotation += step;
            spikeX = this.positionPoint.x + Math.cos(rotation) * (this.radius * 0.4);
            spikeY = this.positionPoint.y + Math.sin(rotation) * (this.radius * 0.4);
            context.lineTo(spikeX, spikeY);
            rotation += step;
            context.stroke();
        }
        context.lineTo(this.positionPoint.x, this.positionPoint.y - this.radius);
        context.closePath();
        context.stroke();
        if (this.options.shouldFillShape) {
            context.fill();
        }
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(context.canvas.width / 2, context.canvas.height / 2);
        this.radius = this.calculateRadius(context.canvas.width - 2, context.canvas.height / 2);
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.radius = this.calculateRadius(update.x, update.y);
    }
    calculateRadius(x, y) {
        return Math.sqrt(Math.pow(x - this.positionPoint.x, 2) + Math.pow(y - this.positionPoint.y, 2));
    }
}

class LineShape extends CanvasWhiteboardShape {
    constructor(positionPoint, options, endPosition) {
        super(positionPoint, options);
        this.endPosition = endPosition || new CanvasWhiteboardPoint(this.positionPoint.x, this.positionPoint.y);
    }
    getShapeName() {
        return 'LineShape';
    }
    draw(context) {
        if (!this.endPosition) {
            return;
        }
        context.beginPath();
        Object.assign(context, this.options);
        context.moveTo(this.positionPoint.x, this.positionPoint.y);
        context.lineTo(this.endPosition.x, this.endPosition.y);
        context.closePath();
        context.stroke();
    }
    drawPreview(context) {
        this.positionPoint = new CanvasWhiteboardPoint(0, 0);
        this.endPosition = new CanvasWhiteboardPoint(context.canvas.width, context.canvas.height);
        this.draw(context);
    }
    onUpdateReceived(update) {
        this.endPosition = new CanvasWhiteboardPoint(update.x, update.y);
    }
}

class CanvasWhiteboardShapeService {
    constructor() {
        this.registeredShapesSubject = new BehaviorSubject([
            FreeHandShape,
            LineShape,
            RectangleShape,
            CircleShape,
            StarShape,
            SmileyShape
        ]);
        this.registeredShapes$ = this.registeredShapesSubject.asObservable();
    }
    getShapeConstructorFromShapeName(shapeName) {
        return this.getCurrentRegisteredShapes().find((shape) => (new shape).getShapeName() === shapeName);
    }
    getCurrentRegisteredShapes() {
        return this.registeredShapesSubject.getValue();
    }
    isRegisteredShape(shape) {
        return this.getCurrentRegisteredShapes().indexOf(shape) !== -1;
    }
    registerShape(shape) {
        if (this.isRegisteredShape(shape)) {
            console.warn(`You tried to register a shape:${shape}, but is has already been registered.`);
            return;
        }
        const registeredShapes = this.getCurrentRegisteredShapes();
        registeredShapes.push(shape);
        this.registeredShapesSubject.next(registeredShapes);
    }
    registerShapes(shapes) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes()
            .concat(shapes.filter((shape) => {
            if (this.isRegisteredShape(shape)) {
                console.warn(`You tried to register a shape:${shape}, but is has already been registered.`);
                return false;
            }
            return true;
        })));
    }
    unregisterShape(shape) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes().filter(registeredShape => registeredShape !== shape));
    }
    unregisterShapes(shapes) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes().filter(shape => shapes.indexOf(shape) === -1));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class CanvasWhiteboardColorPickerComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.selectedColor = 'rgba(0,0,0,1)';
        this.showColorPicker = false;
        this.onToggleColorPicker = new EventEmitter();
        this.onColorSelected = new EventEmitter();
        this.onSecondaryColorSelected = new EventEmitter();
    }
    /**
     * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
     * according to the aspect ratio.
     */
    ngOnInit() {
        this._context = this.canvas.nativeElement.getContext('2d');
        this.createColorPalette();
    }
    createColorPalette() {
        let gradient = this._context.createLinearGradient(0, 0, this._context.canvas.width, 0);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.15, 'rgb(255, 0, 255)');
        gradient.addColorStop(0.33, 'rgb(0, 0, 255)');
        gradient.addColorStop(0.49, 'rgb(0, 255, 255)');
        gradient.addColorStop(0.67, 'rgb(0, 255, 0)');
        gradient.addColorStop(0.84, 'rgb(255, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');
        this._context.fillStyle = gradient;
        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
        gradient = this._context.createLinearGradient(0, 0, 0, this._context.canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this._context.fillStyle = gradient;
        this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    }
    closeOnExternalClick(event) {
        if (!this.elementRef.nativeElement.contains(event.target) && this.showColorPicker) {
            this.onToggleColorPicker.emit(false);
        }
    }
    toggleColorPicker(event) {
        if (event) {
            event.preventDefault();
        }
        this.onToggleColorPicker.emit(!this.showColorPicker);
    }
    determineColorFromCanvas(event) {
        const canvasRect = this._context.canvas.getBoundingClientRect();
        const imageData = this._context.getImageData(event.clientX - canvasRect.left, event.clientY - canvasRect.top, 1, 1);
        return `rgba(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]}, ${imageData.data[3]})`;
    }
    selectColor(color) {
        this.onColorSelected.emit(color);
        this.toggleColorPicker(null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardColorPickerComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: CanvasWhiteboardColorPickerComponent, selector: "canvas-whiteboard-colorpicker", inputs: { previewText: "previewText", selectedColor: "selectedColor", showColorPicker: "showColorPicker" }, outputs: { onToggleColorPicker: "onToggleColorPicker", onColorSelected: "onColorSelected", onSecondaryColorSelected: "onSecondaryColorSelected" }, host: { listeners: { "document:mousedown": "closeOnExternalClick($event)", "document:touchstart": "closeOnExternalClick($event)" } }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["canvaswhiteboardcolorpicker"], descendants: true, static: true }], ngImport: i0, template: `
    <div [hidden]="showColorPicker" class="canvas-whiteboard-colorpicker-input"
         (click)="toggleColorPicker($event)">
      <div class="selected-color-type-wrapper">{{previewText}}</div>
      <div class="selected-color-preview" [style.background]="selectedColor"></div>
    </div>
    <div [hidden]="!showColorPicker" class="canvas-whiteboard-colorpicker-wrapper">
      <div (click)="selectColor('transparent')" class="transparent-color">Transparent</div>
      <canvas #canvaswhiteboardcolorpicker class="canvas-whiteboard-colorpicker" width="284" height="155"
              (click)="selectColor(determineColorFromCanvas($event))"></canvas>
    </div>
  `, isInline: true, styles: [".selected-color-preview{width:100%;height:20%;position:absolute;bottom:0;left:0}.selected-color-type-wrapper{display:inline-block;height:100%;width:100%;text-align:center;font-size:14px;color:#000}.transparent-color{font-size:14px}.canvas-whiteboard-colorpicker-wrapper{border:1px solid #afafaf;color:#000}@media (min-width: 401px){.canvas-whiteboard-colorpicker-wrapper{position:absolute}}.canvas-whiteboard-colorpicker-input{display:inline-block;position:relative;width:44px;height:44px;margin:5px;cursor:pointer;color:#000}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardColorPickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'canvas-whiteboard-colorpicker', host: {
                        '(document:mousedown)': 'closeOnExternalClick($event)',
                        '(document:touchstart)': 'closeOnExternalClick($event)'
                    }, template: `
    <div [hidden]="showColorPicker" class="canvas-whiteboard-colorpicker-input"
         (click)="toggleColorPicker($event)">
      <div class="selected-color-type-wrapper">{{previewText}}</div>
      <div class="selected-color-preview" [style.background]="selectedColor"></div>
    </div>
    <div [hidden]="!showColorPicker" class="canvas-whiteboard-colorpicker-wrapper">
      <div (click)="selectColor('transparent')" class="transparent-color">Transparent</div>
      <canvas #canvaswhiteboardcolorpicker class="canvas-whiteboard-colorpicker" width="284" height="155"
              (click)="selectColor(determineColorFromCanvas($event))"></canvas>
    </div>
  `, styles: [".selected-color-preview{width:100%;height:20%;position:absolute;bottom:0;left:0}.selected-color-type-wrapper{display:inline-block;height:100%;width:100%;text-align:center;font-size:14px;color:#000}.transparent-color{font-size:14px}.canvas-whiteboard-colorpicker-wrapper{border:1px solid #afafaf;color:#000}@media (min-width: 401px){.canvas-whiteboard-colorpicker-wrapper{position:absolute}}.canvas-whiteboard-colorpicker-input{display:inline-block;position:relative;width:44px;height:44px;margin:5px;cursor:pointer;color:#000}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { previewText: [{
                type: Input
            }], selectedColor: [{
                type: Input
            }], canvas: [{
                type: ViewChild,
                args: ['canvaswhiteboardcolorpicker', { static: true }]
            }], showColorPicker: [{
                type: Input
            }], onToggleColorPicker: [{
                type: Output
            }], onColorSelected: [{
                type: Output
            }], onSecondaryColorSelected: [{
                type: Output
            }] } });

class CanvasWhiteboardShapePreviewComponent {
    ngAfterViewInit() {
        this.drawShapePreview();
    }
    ngOnChanges(changes) {
        if (changes.shapeConstructor || changes.shapeOptions) {
            this.drawShapePreview();
        }
    }
    drawShapePreview() {
        if (!this.canvas) {
            return;
        }
        const context = this.canvas.nativeElement.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        const concreteShape = new this.shapeConstructor(new CanvasWhiteboardPoint(0, 0), Object.assign(new CanvasWhiteboardShapeOptions(), this.shapeOptions));
        concreteShape.drawPreview(context);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapePreviewComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: CanvasWhiteboardShapePreviewComponent, selector: "canvas-whiteboard-shape-preview", inputs: { shapeConstructor: "shapeConstructor", shapeOptions: "shapeOptions" }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["canvasWhiteboardShapePreview"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <canvas #canvasWhiteboardShapePreview width="50px" height="50px"
            class="canvas-whiteboard-shape-preview-canvas"></canvas>
  `, isInline: true, styles: [".canvas-whiteboard-shape-preview-canvas{cursor:pointer}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapePreviewComponent, decorators: [{
            type: Component,
            args: [{ selector: 'canvas-whiteboard-shape-preview', template: `
    <canvas #canvasWhiteboardShapePreview width="50px" height="50px"
            class="canvas-whiteboard-shape-preview-canvas"></canvas>
  `, styles: [".canvas-whiteboard-shape-preview-canvas{cursor:pointer}\n"] }]
        }], propDecorators: { shapeConstructor: [{
                type: Input
            }], shapeOptions: [{
                type: Input
            }], canvas: [{
                type: ViewChild,
                args: ['canvasWhiteboardShapePreview']
            }] } });

class CanvasWhiteboardShapeSelectorComponent {
    constructor(elementRef, canvasWhiteboardShapeService) {
        this.elementRef = elementRef;
        this.canvasWhiteboardShapeService = canvasWhiteboardShapeService;
        this.showShapeSelector = false;
        this.onToggleShapeSelector = new EventEmitter();
        this.onShapeSelected = new EventEmitter();
        this.registeredShapes$ = this.canvasWhiteboardShapeService.registeredShapes$;
    }
    selectShape(shape) {
        this.onShapeSelected.emit(shape);
        this.toggleShapeSelector(null);
    }
    closeOnExternalClick(event) {
        if (!this.elementRef.nativeElement.contains(event.target) && this.showShapeSelector) {
            this.onToggleShapeSelector.emit(false);
        }
    }
    toggleShapeSelector(event) {
        if (event) {
            event.preventDefault();
        }
        this.onToggleShapeSelector.emit(!this.showShapeSelector);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeSelectorComponent, deps: [{ token: i0.ElementRef }, { token: CanvasWhiteboardShapeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: CanvasWhiteboardShapeSelectorComponent, selector: "canvas-whiteboard-shape-selector", inputs: { showShapeSelector: "showShapeSelector", selectedShapeConstructor: "selectedShapeConstructor", shapeOptions: "shapeOptions" }, outputs: { onToggleShapeSelector: "onToggleShapeSelector", onShapeSelected: "onShapeSelected" }, host: { listeners: { "document:mousedown": "closeOnExternalClick($event)", "document:touchstart": "closeOnExternalClick($event)" } }, ngImport: i0, template: `
    <div *ngIf="!showShapeSelector" (click)="toggleShapeSelector($event)"
         class="canvas-whiteboard-shape-selector-selected-preview">
      <canvas-whiteboard-shape-preview [shapeConstructor]="selectedShapeConstructor"
                                       [shapeOptions]="shapeOptions"></canvas-whiteboard-shape-preview>
    </div>
    <div class="canvas-whiteboard-shape-selector-wrapper" *ngIf="showShapeSelector">
      <canvas-whiteboard-shape-preview *ngFor="let shapeConstructor of registeredShapes$ | async"
                                       [shapeConstructor]="shapeConstructor"
                                       [shapeOptions]="shapeOptions"
                                       (click)="selectShape(shapeConstructor)"></canvas-whiteboard-shape-preview>
    </div>
  `, isInline: true, styles: [".canvas-whiteboard-shape-selector-selected-preview{vertical-align:bottom;display:inline-block}.canvas-whiteboard-shape-selector-wrapper{display:block;padding:4px;border:1px solid #afafaf}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: CanvasWhiteboardShapePreviewComponent, selector: "canvas-whiteboard-shape-preview", inputs: ["shapeConstructor", "shapeOptions"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'canvas-whiteboard-shape-selector', host: {
                        '(document:mousedown)': 'closeOnExternalClick($event)',
                        '(document:touchstart)': 'closeOnExternalClick($event)'
                    }, template: `
    <div *ngIf="!showShapeSelector" (click)="toggleShapeSelector($event)"
         class="canvas-whiteboard-shape-selector-selected-preview">
      <canvas-whiteboard-shape-preview [shapeConstructor]="selectedShapeConstructor"
                                       [shapeOptions]="shapeOptions"></canvas-whiteboard-shape-preview>
    </div>
    <div class="canvas-whiteboard-shape-selector-wrapper" *ngIf="showShapeSelector">
      <canvas-whiteboard-shape-preview *ngFor="let shapeConstructor of registeredShapes$ | async"
                                       [shapeConstructor]="shapeConstructor"
                                       [shapeOptions]="shapeOptions"
                                       (click)="selectShape(shapeConstructor)"></canvas-whiteboard-shape-preview>
    </div>
  `, styles: [".canvas-whiteboard-shape-selector-selected-preview{vertical-align:bottom;display:inline-block}.canvas-whiteboard-shape-selector-wrapper{display:block;padding:4px;border:1px solid #afafaf}\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: CanvasWhiteboardShapeService }], propDecorators: { showShapeSelector: [{
                type: Input
            }], selectedShapeConstructor: [{
                type: Input
            }], shapeOptions: [{
                type: Input
            }], onToggleShapeSelector: [{
                type: Output
            }], onShapeSelected: [{
                type: Output
            }] } });

class CanvasWhiteboardComponent {
    set imageUrl(imageUrl) {
        this._imageUrl = imageUrl;
        this._imageElement = null;
        this._redrawHistory();
    }
    get imageUrl() {
        return this._imageUrl;
    }
    constructor(ngZone, changeDetectorRef, canvasWhiteboardService, canvasWhiteboardShapeService) {
        this.ngZone = ngZone;
        this.changeDetectorRef = changeDetectorRef;
        this.canvasWhiteboardService = canvasWhiteboardService;
        this.canvasWhiteboardShapeService = canvasWhiteboardShapeService;
        // Number of ms to wait before sending out the updates as an array
        this.batchUpdateTimeoutDuration = 100;
        this.drawButtonText = '';
        this.clearButtonText = '';
        this.undoButtonText = '';
        this.redoButtonText = '';
        this.saveDataButtonText = '';
        this.strokeColorPickerText = 'Stroke';
        this.fillColorPickerText = 'Fill';
        this.drawButtonEnabled = true;
        this.clearButtonEnabled = true;
        this.undoButtonEnabled = false;
        this.redoButtonEnabled = false;
        this.saveDataButtonEnabled = false;
        this.shouldDownloadDrawing = true;
        /** @deprecated. Replaced with strokeColorPickerEnabled and fillColorPickerEnabled inputs */
        this.colorPickerEnabled = false;
        this.strokeColorPickerEnabled = false;
        this.fillColorPickerEnabled = false;
        this.lineWidth = 2;
        this.strokeColor = 'rgba(0, 0, 0, 1)';
        this.startingColor = '#fff';
        this.scaleFactor = 0;
        this.drawingEnabled = false;
        this.showStrokeColorPicker = false;
        this.showFillColorPicker = false;
        this.lineJoin = 'round';
        this.lineCap = 'round';
        this.shapeSelectorEnabled = true;
        this.showShapeSelector = false;
        this.fillColor = 'rgba(0,0,0,0)';
        this.onClear = new EventEmitter();
        this.onUndo = new EventEmitter();
        this.onRedo = new EventEmitter();
        this.onBatchUpdate = new EventEmitter();
        this.onImageLoaded = new EventEmitter();
        this.onSave = new EventEmitter();
        this._canDraw = true;
        this._clientDragging = false;
        this._updateHistory = [];
        this._undoStack = []; // Stores the value of start and count for each continuous stroke
        this._redoStack = [];
        this._batchUpdates = [];
        this._updatesNotDrawn = [];
        this._canvasWhiteboardServiceSubscriptions = [];
        this._shapesMap = new Map();
        this._incompleteShapesMap = new Map();
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
    }
    /**
     * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
     * according to the aspect ratio.
     */
    ngOnInit() {
        this._initInputsFromOptions(this.options);
        this._initCanvasEventListeners();
        this._initCanvasServiceObservables();
        this.context = this.canvas.nativeElement.getContext('2d');
        this._incompleteShapesCanvasContext = this._incompleteShapesCanvas.nativeElement.getContext('2d');
    }
    /**
     * If an image exists and it's url changes, we need to redraw the new image on the canvas.
     */
    ngOnChanges(changes) {
        if (changes.options && !isEqual(changes.options.currentValue, changes.options.previousValue)) {
            this._initInputsFromOptions(changes.options.currentValue);
        }
    }
    /**
     * Recalculate the width and height of the canvas after the view has been fully initialized
     */
    ngAfterViewInit() {
        this._calculateCanvasWidthAndHeight();
        this._redrawHistory();
    }
    /**
     * This method reads the options which are helpful since they can be really long when specified in HTML
     * This method is also called everytime the options object changes
     * For security reasons we must check each item on its own since if we iterate the keys
     * we may be injected with malicious values
     *
     * @param options
     */
    _initInputsFromOptions(options) {
        if (options) {
            if (!this._isNullOrUndefined(options.batchUpdateTimeoutDuration)) {
                this.batchUpdateTimeoutDuration = options.batchUpdateTimeoutDuration;
            }
            if (!this._isNullOrUndefined(options.imageUrl)) {
                this.imageUrl = options.imageUrl;
            }
            if (!this._isNullOrUndefined(options.aspectRatio)) {
                this.aspectRatio = options.aspectRatio;
            }
            if (!this._isNullOrUndefined(options.drawButtonClass)) {
                this.drawButtonClass = options.drawButtonClass;
            }
            if (!this._isNullOrUndefined(options.clearButtonClass)) {
                this.clearButtonClass = options.clearButtonClass;
            }
            if (!this._isNullOrUndefined(options.undoButtonClass)) {
                this.undoButtonClass = options.undoButtonClass;
            }
            if (!this._isNullOrUndefined(options.redoButtonClass)) {
                this.redoButtonClass = options.redoButtonClass;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonClass)) {
                this.saveDataButtonClass = options.saveDataButtonClass;
            }
            if (!this._isNullOrUndefined(options.drawButtonText)) {
                this.drawButtonText = options.drawButtonText;
            }
            if (!this._isNullOrUndefined(options.clearButtonText)) {
                this.clearButtonText = options.clearButtonText;
            }
            if (!this._isNullOrUndefined(options.undoButtonText)) {
                this.undoButtonText = options.undoButtonText;
            }
            if (!this._isNullOrUndefined(options.redoButtonText)) {
                this.redoButtonText = options.redoButtonText;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonText)) {
                this.saveDataButtonText = options.saveDataButtonText;
            }
            if (!this._isNullOrUndefined(options.strokeColorPickerText)) {
                this.strokeColorPickerText = options.strokeColorPickerText;
            }
            if (!this._isNullOrUndefined(options.fillColorPickerText)) {
                this.fillColorPickerText = options.fillColorPickerText;
            }
            if (!this._isNullOrUndefined(options.drawButtonEnabled)) {
                this.drawButtonEnabled = options.drawButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.clearButtonEnabled)) {
                this.clearButtonEnabled = options.clearButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.undoButtonEnabled)) {
                this.undoButtonEnabled = options.undoButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.redoButtonEnabled)) {
                this.redoButtonEnabled = options.redoButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonEnabled)) {
                this.saveDataButtonEnabled = options.saveDataButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.colorPickerEnabled)) {
                this.colorPickerEnabled = options.colorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.strokeColorPickerEnabled)) {
                this.strokeColorPickerEnabled = options.strokeColorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.fillColorPickerEnabled)) {
                this.fillColorPickerEnabled = options.fillColorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.lineWidth)) {
                this.lineWidth = options.lineWidth;
            }
            if (!this._isNullOrUndefined(options.strokeColor)) {
                this.strokeColor = options.strokeColor;
            }
            if (!this._isNullOrUndefined(options.shouldDownloadDrawing)) {
                this.shouldDownloadDrawing = options.shouldDownloadDrawing;
            }
            if (!this._isNullOrUndefined(options.startingColor)) {
                this.startingColor = options.startingColor;
            }
            if (!this._isNullOrUndefined(options.scaleFactor)) {
                this.scaleFactor = options.scaleFactor;
            }
            if (!this._isNullOrUndefined(options.drawingEnabled)) {
                this.drawingEnabled = options.drawingEnabled;
            }
            if (!this._isNullOrUndefined(options.downloadedFileName)) {
                this.downloadedFileName = options.downloadedFileName;
            }
            if (!this._isNullOrUndefined(options.lineJoin)) {
                this.lineJoin = options.lineJoin;
            }
            if (!this._isNullOrUndefined(options.lineCap)) {
                this.lineCap = options.lineCap;
            }
            if (!this._isNullOrUndefined(options.shapeSelectorEnabled)) {
                this.shapeSelectorEnabled = options.shapeSelectorEnabled;
            }
            if (!this._isNullOrUndefined(options.showShapeSelector)) {
                this.showShapeSelector = options.showShapeSelector;
            }
            if (!this._isNullOrUndefined(options.fillColor)) {
                this.fillColor = options.fillColor;
            }
            if (!this._isNullOrUndefined(options.showStrokeColorPicker)) {
                this.showStrokeColorPicker = options.showStrokeColorPicker;
            }
            if (!this._isNullOrUndefined(options.showFillColorPicker)) {
                this.showFillColorPicker = options.showFillColorPicker;
            }
        }
    }
    _isNullOrUndefined(property) {
        return property === null || property === undefined;
    }
    /**
     * Init global window listeners like resize and keydown
     */
    _initCanvasEventListeners() {
        this.ngZone.runOutsideAngular(() => {
            this._resizeSubscription = fromEvent(window, 'resize')
                .pipe(debounceTime(200), distinctUntilChanged())
                .subscribe(() => {
                this.ngZone.run(() => {
                    this._redrawCanvasOnResize();
                });
            });
        });
        window.addEventListener('keydown', this._canvasKeyDown.bind(this), false);
    }
    /**
     * Subscribes to new signals in the canvas whiteboard service and executes methods accordingly
     * Because of circular publishing and subscribing, the canvas methods do not use the service when
     * local actions are completed (Ex. clicking undo from the button inside this component)
     */
    _initCanvasServiceObservables() {
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasDrawSubject$
            .subscribe(updates => this.drawUpdates(updates)));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasClearSubject$
            .subscribe(() => this.clearCanvas()));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasUndoSubject$
            .subscribe((updateUUD) => this._undoCanvas(updateUUD)));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasRedoSubject$
            .subscribe((updateUUD) => this._redoCanvas(updateUUD)));
        this._registeredShapesSubscription = this.canvasWhiteboardShapeService.registeredShapes$.subscribe((shapes) => {
            if (!this.selectedShapeConstructor || !this.canvasWhiteboardShapeService.isRegisteredShape(this.selectedShapeConstructor)) {
                this.selectedShapeConstructor = shapes[0];
            }
        });
    }
    /**
     * Calculate the canvas width and height from it's parent container width and height (use aspect ratio if needed)
     */
    _calculateCanvasWidthAndHeight() {
        this.context.canvas.width = this.canvas.nativeElement.parentNode.clientWidth;
        if (this.aspectRatio) {
            this.context.canvas.height = this.canvas.nativeElement.parentNode.clientWidth * this.aspectRatio;
        }
        else {
            this.context.canvas.height = this.canvas.nativeElement.parentNode.clientHeight;
        }
        this._incompleteShapesCanvasContext.canvas.width = this.context.canvas.width;
        this._incompleteShapesCanvasContext.canvas.height = this.context.canvas.height;
    }
    /**
     * Load an image and draw it on the canvas (if an image exists)
     * @param callbackFn A function that is called after the image loading is finished
     * @return Emits a value when the image has been loaded.
     */
    _loadImage(callbackFn) {
        this._canDraw = false;
        // If we already have the image there is no need to acquire it
        if (this._imageElement) {
            this._canDraw = true;
            callbackFn && callbackFn();
            return;
        }
        this._imageElement = new Image();
        this._imageElement.addEventListener('load', () => {
            this._canDraw = true;
            callbackFn && callbackFn();
            this.onImageLoaded.emit(true);
        });
        this._imageElement.src = this.imageUrl;
    }
    /**
     * Sends a notification after clearing the canvas
     * This method should only be called from the clear button in this component since it will emit an clear event
     * If the client calls this method he may create a circular clear action which may cause danger.
     */
    clearCanvasLocal() {
        this.clearCanvas();
        this.onClear.emit(true);
    }
    /**
     * Clears all content on the canvas.
     */
    clearCanvas() {
        this._removeCanvasData();
        this._redoStack = [];
    }
    /**
     * This method resets the state of the canvas and redraws it.
     * It calls a callback function after redrawing
     * @param callbackFn
     */
    _removeCanvasData(callbackFn) {
        this._shapesMap = new Map();
        this._clientDragging = false;
        this._updateHistory = [];
        this._undoStack = [];
        this._redrawBackground(callbackFn);
    }
    /**
     * Clears the canvas and redraws the image if the url exists.
     * @param callbackFn A function that is called after the background is redrawn
     * @return Emits a value when the clearing is finished
     */
    _redrawBackground(callbackFn) {
        if (this.context) {
            if (this.imageUrl) {
                this._loadImage(() => {
                    this.context.save();
                    this._drawImage(this.context, this._imageElement, 0, 0, this.context.canvas.width, this.context.canvas.height, 0.5, 0.5);
                    this.context.restore();
                    this._drawMissingUpdates();
                    callbackFn && callbackFn();
                });
            }
            else {
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                this._drawStartingColor();
                callbackFn && callbackFn();
            }
        }
    }
    _drawStartingColor() {
        const previousFillStyle = this.context.fillStyle;
        this.context.save();
        this.context.fillStyle = this.startingColor;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillStyle = previousFillStyle;
        this.context.restore();
    }
    /**
     * @deprecated Use getDrawingEnabled(): boolean
     */
    getShouldDraw() {
        return this.getDrawingEnabled();
    }
    /**
     * Returns a value of whether the user clicked the draw button on the canvas.
     */
    getDrawingEnabled() {
        return this.drawingEnabled;
    }
    /**
     * Toggles drawing on the canvas. It is called via the draw button on the canvas.
     */
    toggleDrawingEnabled() {
        this.drawingEnabled = !this.drawingEnabled;
    }
    /**
     * Set if drawing is enabled from the client using the canvas
     * @param drawingEnabled
     */
    setDrawingEnabled(drawingEnabled) {
        this.drawingEnabled = drawingEnabled;
    }
    /**
     * @deprecated Please use the changeStrokeColor(newStrokeColor: string): void method
     */
    changeColor(newStrokeColor) {
        this.changeStrokeColor(newStrokeColor);
    }
    /**
     * Replaces the drawing color with a new color
     * The format should be ("#ffffff" or "rgb(r,g,b,a?)")
     * This method is public so that anyone can access the canvas and change the stroke color
     *
     * @param newStrokeColor The new stroke color
     */
    changeStrokeColor(newStrokeColor) {
        this.strokeColor = newStrokeColor;
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Replaces the fill color with a new color
     * The format should be ("#ffffff" or "rgb(r,g,b,a?)")
     * This method is public so that anyone can access the canvas and change the fill color
     *
     * @param newFillColor The new fill color
     */
    changeFillColor(newFillColor) {
        this.fillColor = newFillColor;
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * This method is invoked by the undo button on the canvas screen
     * It calls the global undo method and emits a notification after undoing.
     * This method should only be called from the undo button in this component since it will emit an undo event
     * If the client calls this method he may create a circular undo action which may cause danger.
     */
    undoLocal() {
        this.undo((updateUUID) => {
            this._redoStack.push(updateUUID);
            this.onUndo.emit(updateUUID);
        });
    }
    /**
     * This methods selects the last uuid prepares it for undoing (making the whole update sequence invisible)
     * This method can be called if the canvas component is a ViewChild of some other component.
     * This method will work even if the undo button has been disabled
     */
    undo(callbackFn) {
        if (!this._undoStack.length) {
            return;
        }
        const updateUUID = this._undoStack.pop();
        this._undoCanvas(updateUUID);
        callbackFn && callbackFn(updateUUID);
    }
    /**
     * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid invisible
     * @param updateUUID
     */
    _undoCanvas(updateUUID) {
        if (this._shapesMap.has(updateUUID)) {
            const shape = this._shapesMap.get(updateUUID);
            shape.isVisible = false;
            this.drawAllShapes();
        }
    }
    /**
     * This method is invoked by the redo button on the canvas screen
     * It calls the global redo method and emits a notification after redoing
     * This method should only be called from the redo button in this component since it will emit an redo event
     * If the client calls this method he may create a circular redo action which may cause danger.
     */
    redoLocal() {
        this.redo((updateUUID) => {
            this._undoStack.push(updateUUID);
            this.onRedo.emit(updateUUID);
        });
    }
    /**
     * This methods selects the last uuid prepares it for redoing (making the whole update sequence visible)
     * This method can be called if the canvas component is a ViewChild of some other component.
     * This method will work even if the redo button has been disabled
     */
    redo(callbackFn) {
        if (!this._redoStack.length) {
            return;
        }
        const updateUUID = this._redoStack.pop();
        this._redoCanvas(updateUUID);
        callbackFn && callbackFn(updateUUID);
    }
    /**
     * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid visible
     * @param updateUUID
     */
    _redoCanvas(updateUUID) {
        if (this._shapesMap.has(updateUUID)) {
            const shape = this._shapesMap.get(updateUUID);
            shape.isVisible = true;
            this.drawAllShapes();
        }
    }
    /**
     * Catches the Mouse and Touch events made on the canvas.
     * If drawing is disabled (If an image exists but it's not loaded, or the user did not click Draw),
     * this function does nothing.
     *
     * If a "mousedown | touchstart" event is triggered, dragging will be set to true and an CanvasWhiteboardUpdate object
     * of type "start" will be drawn and then sent as an update to all receiving ends.
     *
     * If a "mousemove | touchmove" event is triggered and the client is dragging, an CanvasWhiteboardUpdate object
     * of type "drag" will be drawn and then sent as an update to all receiving ends.
     *
     * If a "mouseup, mouseout | touchend, touchcancel" event is triggered, dragging will be set to false and
     * an CanvasWhiteboardUpdate object of type "stop" will be drawn and then sent as an update to all receiving ends.
     *
     */
    canvasUserEvents(event) {
        // Ignore all if we didn't click the _draw! button or the image did not load
        if (!this.drawingEnabled || !this._canDraw) {
            return;
        }
        // Ignore mouse move Events if we're not dragging
        if (!this._clientDragging
            && (event.type === 'mousemove'
                || event.type === 'touchmove'
                || event.type === 'mouseout'
                || event.type === 'touchcancel'
                || event.type === 'mouseup'
                || event.type === 'touchend'
                || event.type === 'mouseout')) {
            return;
        }
        if (event.target == this._incompleteShapesCanvas.nativeElement || event.target == this.canvas.nativeElement) {
            event.preventDefault();
        }
        let update;
        let updateType;
        const eventPosition = this._getCanvasEventPosition(event);
        update = new CanvasWhiteboardUpdate(eventPosition.x, eventPosition.y);
        switch (event.type) {
            case 'mousedown':
            case 'touchstart':
                this._clientDragging = true;
                this._lastUUID = this._generateUUID();
                updateType = CanvasWhiteboardUpdateType.START;
                this._redoStack = [];
                this._addCurrentShapeDataToAnUpdate(update);
                break;
            case 'mousemove':
            case 'touchmove':
                if (!this._clientDragging) {
                    return;
                }
                updateType = CanvasWhiteboardUpdateType.DRAG;
                break;
            case 'touchcancel':
            case 'mouseup':
            case 'touchend':
            case 'mouseout':
                this._clientDragging = false;
                updateType = CanvasWhiteboardUpdateType.STOP;
                this._undoStack.push(this._lastUUID);
                break;
        }
        update.UUID = this._lastUUID;
        update.type = updateType;
        this._draw(update);
        this._prepareToSendUpdate(update);
    }
    /**
     * Get the coordinates (x,y) from a given event
     * If it is a touch event, get the touch positions
     * If we released the touch, the position will be placed in the changedTouches object
     * If it is not a touch event, use the original mouse event received
     * @param eventData
     */
    _getCanvasEventPosition(eventData) {
        const canvasBoundingRect = this.context.canvas.getBoundingClientRect();
        let hasTouches = (eventData.touches && eventData.touches.length) ? eventData.touches[0] : null;
        if (!hasTouches) {
            hasTouches = (eventData.changedTouches && eventData.changedTouches.length) ? eventData.changedTouches[0] : null;
        }
        const event = hasTouches ? hasTouches : eventData;
        const scaleWidth = canvasBoundingRect.width / this.context.canvas.width;
        const scaleHeight = canvasBoundingRect.height / this.context.canvas.height;
        let xPosition = (event.clientX - canvasBoundingRect.left);
        let yPosition = (event.clientY - canvasBoundingRect.top);
        xPosition /= this.scaleFactor ? this.scaleFactor : scaleWidth;
        yPosition /= this.scaleFactor ? this.scaleFactor : scaleHeight;
        return new CanvasWhiteboardPoint(xPosition / this.context.canvas.width, yPosition / this.context.canvas.height);
    }
    /**
     * The update coordinates on the canvas are mapped so that all receiving ends
     * can reverse the mapping and get the same position as the one that
     * was drawn on this update.
     *
     * @param update The CanvasWhiteboardUpdate object.
     */
    _prepareToSendUpdate(update) {
        this._prepareUpdateForBatchDispatch(update);
    }
    /**
     * Catches the Key Up events made on the canvas.
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 90 (z), an undo action will be performed
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 89 (y), a redo action will be performed
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 83 (s) or 115(S), a save action will be performed
     *
     * @param event The event that occurred.
     */
    _canvasKeyDown(event) {
        if (event.ctrlKey || event.metaKey) {
            if (event.keyCode === 90 && this.undoButtonEnabled) {
                event.preventDefault();
                this.undo();
            }
            if (event.keyCode === 89 && this.redoButtonEnabled) {
                event.preventDefault();
                this.redo();
            }
            if (event.keyCode === 83 || event.keyCode === 115) {
                event.preventDefault();
                this.saveLocal();
            }
        }
    }
    /**
     * On window resize, recalculate the canvas dimensions and redraw the history
     */
    _redrawCanvasOnResize() {
        this._calculateCanvasWidthAndHeight();
        this._redrawHistory();
    }
    /**
     * Redraw the saved history after resetting the canvas state
     */
    _redrawHistory() {
        const updatesToDraw = [].concat(this._updateHistory);
        this._removeCanvasData(() => {
            updatesToDraw.forEach((update) => {
                this._draw(update);
            });
        });
    }
    /**
     * Draws a CanvasWhiteboardUpdate object on the canvas.
     * The coordinates are first reverse mapped so that they can be drawn in the proper place. The update
     * is afterwards added to the undoStack so that it can be
     *
     * If the CanvasWhiteboardUpdate Type is "start", a new "selectedShape" is created.
     * If the CanvasWhiteboardUpdate Type is "drag", the shape is taken from the shapesMap and then it's updated.
     * Afterwards the context is used to draw the shape on the canvas.
     * This function saves the last X and Y coordinates that were drawn.
     *
     * @param update The update object.
     */
    _draw(update) {
        this._updateHistory.push(update);
        // map the canvas coordinates to our canvas size since they are scaled.
        update = Object.assign(new CanvasWhiteboardUpdate(), update, {
            x: update.x * this.context.canvas.width,
            y: update.y * this.context.canvas.height
        });
        if (update.type === CanvasWhiteboardUpdateType.START) {
            const updateShapeConstructor = this.canvasWhiteboardShapeService.getShapeConstructorFromShapeName(update.selectedShape);
            const shape = new updateShapeConstructor(new CanvasWhiteboardPoint(update.x, update.y), Object.assign(new CanvasWhiteboardShapeOptions(), update.selectedShapeOptions));
            this._incompleteShapesMap.set(update.UUID, shape);
            this._drawIncompleteShapes();
        }
        else if (update.type === CanvasWhiteboardUpdateType.DRAG) {
            const shape = this._incompleteShapesMap.get(update.UUID);
            shape && shape.onUpdateReceived(update);
            this._drawIncompleteShapes();
        }
        else if (CanvasWhiteboardUpdateType.STOP) {
            const shape = this._incompleteShapesMap.get(update.UUID);
            shape && shape.onStopReceived(update);
            this._shapesMap.set(update.UUID, shape);
            this._incompleteShapesMap.delete(update.UUID);
            this._swapCompletedShapeToActualCanvas(shape);
        }
    }
    _drawIncompleteShapes() {
        this._resetIncompleteShapeCanvas();
        this._incompleteShapesMap.forEach((shape) => {
            if (shape.isVisible) {
                shape.draw(this._incompleteShapesCanvasContext);
            }
        });
    }
    _swapCompletedShapeToActualCanvas(shape) {
        this._drawIncompleteShapes();
        if (shape.isVisible) {
            shape.draw(this.context);
        }
    }
    _resetIncompleteShapeCanvas() {
        this._incompleteShapesCanvasContext.clearRect(0, 0, this._incompleteShapesCanvasContext.canvas.width, this._incompleteShapesCanvasContext.canvas.height);
        this._incompleteShapesCanvasContext.fillStyle = 'transparent';
        this._incompleteShapesCanvasContext.fillRect(0, 0, this._incompleteShapesCanvasContext.canvas.width, this._incompleteShapesCanvasContext.canvas.height);
    }
    /**
     * Delete everything from the screen, redraw the background, and then redraw all the shapes from the shapesMap
     */
    drawAllShapes() {
        this._redrawBackground(() => {
            this._shapesMap.forEach((shape) => {
                if (shape.isVisible) {
                    shape.draw(this.context);
                }
            });
        });
    }
    _addCurrentShapeDataToAnUpdate(update) {
        if (!update.selectedShape) {
            update.selectedShape = (new this.selectedShapeConstructor).getShapeName();
        }
        if (!update.selectedShapeOptions) {
            // Make a deep copy since we don't want some Shape implementation to change something by accident
            update.selectedShapeOptions = Object.assign(new CanvasWhiteboardShapeOptions(), this.generateShapePreviewOptions(), { lineWidth: this.lineWidth });
        }
    }
    generateShapePreviewOptions() {
        return Object.assign(new CanvasWhiteboardShapeOptions(), {
            shouldFillShape: !!this.fillColor,
            fillStyle: this.fillColor,
            strokeStyle: this.strokeColor,
            lineWidth: 2,
            lineJoin: this.lineJoin,
            lineCap: this.lineCap
        });
    }
    /**
     * Sends the update to all receiving ends as an Event emit. This is done as a batch operation (meaning
     * multiple updates are sent at the same time). If this method is called, after 100 ms all updates
     * that were made at that time will be packed up together and sent to the receiver.
     *
     * @param update The update object.
     * @return Emits an Array of Updates when the batch.
     */
    _prepareUpdateForBatchDispatch(update) {
        this._batchUpdates.push(cloneDeep(update));
        if (!this._updateTimeout) {
            this._updateTimeout = setTimeout(() => {
                this.onBatchUpdate.emit(this._batchUpdates);
                this._batchUpdates = [];
                this._updateTimeout = null;
            }, this.batchUpdateTimeoutDuration);
        }
    }
    /**
     * Draws an Array of Updates on the canvas.
     *
     * @param updates The array with Updates.
     */
    drawUpdates(updates) {
        if (this._canDraw) {
            this._drawMissingUpdates();
            updates.forEach((update) => {
                this._draw(update);
            });
        }
        else {
            this._updatesNotDrawn = this._updatesNotDrawn.concat(updates);
        }
    }
    /**
     * Draw any missing updates that were received before the image was loaded
     */
    _drawMissingUpdates() {
        if (this._updatesNotDrawn.length > 0) {
            const updatesToDraw = this._updatesNotDrawn;
            this._updatesNotDrawn = [];
            updatesToDraw.forEach((update) => {
                this._draw(update);
            });
        }
    }
    /**
     * Draws an image on the canvas
     *
     * @param context The context used to draw the image on the canvas.
     * @param image The image to draw.
     * @param x The X coordinate for the starting draw position.
     * @param y The Y coordinate for the starting draw position.
     * @param width The width of the image that will be drawn.
     * @param height The height of the image that will be drawn.
     * @param offsetX The offsetX if the image size is larger than the canvas (aspect Ratio)
     * @param offsetY The offsetY if the image size is larger than the canvas (aspect Ratio)
     */
    _drawImage(context, image, x, y, width, height, offsetX, offsetY) {
        if (arguments.length === 2) {
            x = y = 0;
            width = context.canvas.width;
            height = context.canvas.height;
        }
        offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
        offsetY = typeof offsetY === 'number' ? offsetY : 0.5;
        if (offsetX < 0) {
            offsetX = 0;
        }
        if (offsetY < 0) {
            offsetY = 0;
        }
        if (offsetX > 1) {
            offsetX = 1;
        }
        if (offsetY > 1) {
            offsetY = 1;
        }
        const imageWidth = image.width;
        const imageHeight = image.height;
        const radius = Math.min(width / imageWidth, height / imageHeight);
        let newWidth = imageWidth * radius;
        let newHeight = imageHeight * radius;
        let finalDrawX;
        let finalDrawY;
        let finalDrawWidth;
        let finalDrawHeight;
        let aspectRatio = 1;
        // decide which gap to fill
        if (newWidth < width) {
            aspectRatio = width / newWidth;
        }
        if (Math.abs(aspectRatio - 1) < 1e-14 && newHeight < height) {
            aspectRatio = height / newHeight;
        }
        newWidth *= aspectRatio;
        newHeight *= aspectRatio;
        // calculate source rectangle
        finalDrawWidth = imageWidth / (newWidth / width);
        finalDrawHeight = imageHeight / (newHeight / height);
        finalDrawX = (imageWidth - finalDrawWidth) * offsetX;
        finalDrawY = (imageHeight - finalDrawHeight) * offsetY;
        // make sure the source rectangle is valid
        if (finalDrawX < 0) {
            finalDrawX = 0;
        }
        if (finalDrawY < 0) {
            finalDrawY = 0;
        }
        if (finalDrawWidth > imageWidth) {
            finalDrawWidth = imageWidth;
        }
        if (finalDrawHeight > imageHeight) {
            finalDrawHeight = imageHeight;
        }
        // fill the image in destination rectangle
        context.drawImage(image, finalDrawX, finalDrawY, finalDrawWidth, finalDrawHeight, x, y, width, height);
    }
    /**
     * The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG).
     * The returned image is in a resolution of 96 dpi.
     * If the height or width of the canvas is 0, the string "data:," is returned.
     * If the requested type is not image/png, but the returned value starts with data:image/png, then the requested type is not supported.
     * Chrome also supports the image/webp type.
     *
     * @param returnedDataType A DOMString indicating the image format. The default format type is image/png.
     * @param returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
     If this argument is anything else, the default value for image quality is used. The default value is 0.92. Other arguments are ignored.
     */
    generateCanvasDataUrl(returnedDataType = 'image/png', returnedDataQuality = 1) {
        return this.context.canvas.toDataURL(returnedDataType, returnedDataQuality);
    }
    /**
     * Generate a Blob object representing the content drawn on the canvas.
     * This file may be cached on the disk or stored in memory at the discretion of the user agent.
     * If type is not specified, the image type is image/png. The created image is in a resolution of 96dpi.
     * The third argument is used with image/jpeg images to specify the quality of the output.
     *
     * @param callbackFn The function that should be executed when the blob is created. Should accept a parameter Blob (for the result).
     * @param returnedDataType A DOMString indicating the image format. The default type is image/png.
     * @param returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
     If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
     */
    generateCanvasBlob(callbackFn, returnedDataType = 'image/png', returnedDataQuality = 1) {
        let toBlobMethod;
        if (typeof this.context.canvas.toBlob !== 'undefined') {
            toBlobMethod = this.context.canvas.toBlob.bind(this.context.canvas);
        }
        else if (typeof this.context.canvas.msToBlob !== 'undefined') {
            // For IE
            toBlobMethod = (callback) => {
                callback && callback(this.context.canvas.msToBlob());
            };
        }
        toBlobMethod && toBlobMethod((blob) => {
            callbackFn && callbackFn(blob, returnedDataType);
        }, returnedDataType, returnedDataQuality);
    }
    /**
     * Generate a canvas image representation and download it locally
     * The name of the image is canvas_drawing_ + the current local Date and Time the image was created
     * Methods for standalone creation of the images in this method are left here for backwards compatibility
     *
     * @param returnedDataType A DOMString indicating the image format. The default type is image/png.
     * @param downloadData? The created string or Blob (IE).
     * @param customFileName? The name of the file that should be downloaded
     */
    downloadCanvasImage(returnedDataType = 'image/png', downloadData, customFileName) {
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob === undefined) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', downloadData ? downloadData : this.generateCanvasDataUrl(returnedDataType));
            const fileName = customFileName ? customFileName
                : (this.downloadedFileName ? this.downloadedFileName : 'canvas_drawing_' + new Date().valueOf());
            downloadLink.setAttribute('download', fileName + this._generateDataTypeString(returnedDataType));
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        else {
            // IE-specific code
            if (downloadData) {
                this._saveCanvasBlob(downloadData, returnedDataType);
            }
            else {
                this.generateCanvasBlob(this._saveCanvasBlob.bind(this), returnedDataType);
            }
        }
    }
    /**
     * Save the canvas blob (IE) locally
     * @param blob
     * @param returnedDataType
     */
    _saveCanvasBlob(blob, returnedDataType = 'image/png') {
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, 'canvas_drawing_' +
            new Date().valueOf() + this._generateDataTypeString(returnedDataType));
    }
    /**
     * This method generates a canvas url string or a canvas blob with the presented data type
     * A callback function is then invoked since the blob creation must be done via a callback
     *
     * @param callback
     * @param returnedDataType
     * @param returnedDataQuality
     */
    generateCanvasData(callback, returnedDataType = 'image/png', returnedDataQuality = 1) {
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob === undefined) {
            // tslint:disable-next-line:no-unused-expression
            callback && callback(this.generateCanvasDataUrl(returnedDataType, returnedDataQuality));
        }
        else {
            this.generateCanvasBlob(callback, returnedDataType, returnedDataQuality);
        }
    }
    /**
     * Local method to invoke saving of the canvas data when clicked on the canvas Save button
     * This method will emit the generated data with the specified Event Emitter
     *
     * @param returnedDataType
     */
    saveLocal(returnedDataType = 'image/png') {
        this.generateCanvasData((generatedData) => {
            this.onSave.emit(generatedData);
            if (this.shouldDownloadDrawing) {
                this.downloadCanvasImage(returnedDataType, generatedData);
            }
        });
    }
    _generateDataTypeString(returnedDataType) {
        if (returnedDataType) {
            return '.' + returnedDataType.split('/')[1];
        }
        return '';
    }
    /**
     * Toggles the color picker window, delegating the showColorPicker Input to the ColorPickerComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleStrokeColorPicker(value) {
        this.showStrokeColorPicker = !this._isNullOrUndefined(value) ? value : !this.showStrokeColorPicker;
    }
    /**
     * Toggles the color picker window, delegating the showColorPicker Input to the ColorPickerComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleFillColorPicker(value) {
        this.showFillColorPicker = !this._isNullOrUndefined(value) ? value : !this.showFillColorPicker;
    }
    /**
     * Toggles the shape selector window, delegating the showShapeSelector Input to the CanvasWhiteboardShapeSelectorComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleShapeSelector(value) {
        this.showShapeSelector = !this._isNullOrUndefined(value) ? value : !this.showShapeSelector;
    }
    selectShape(newShapeBlueprint) {
        this.selectedShapeConstructor = newShapeBlueprint;
    }
    /**
     * Returns a deep copy of the current drawing history for the canvas.
     * The deep copy is returned because we don't want anyone to mutate the current history
     */
    getDrawingHistory() {
        return cloneDeep(this._updateHistory);
    }
    /**
     * Unsubscribe from a given subscription if it is active
     * @param subscription
     */
    _unsubscribe(subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    _generateUUID() {
        return this._random4() + this._random4() + '-' + this._random4() + '-' + this._random4() + '-' +
            this._random4() + '-' + this._random4() + this._random4() + this._random4();
    }
    _random4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    /**
     * Unsubscribe from the service observables
     */
    ngOnDestroy() {
        this._unsubscribe(this._resizeSubscription);
        this._unsubscribe(this._registeredShapesSubscription);
        this._canvasWhiteboardServiceSubscriptions.forEach(subscription => this._unsubscribe(subscription));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardComponent, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: CanvasWhiteboardService }, { token: CanvasWhiteboardShapeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: CanvasWhiteboardComponent, selector: "canvas-whiteboard", inputs: { options: "options", batchUpdateTimeoutDuration: "batchUpdateTimeoutDuration", imageUrl: "imageUrl", aspectRatio: "aspectRatio", drawButtonClass: "drawButtonClass", clearButtonClass: "clearButtonClass", undoButtonClass: "undoButtonClass", redoButtonClass: "redoButtonClass", saveDataButtonClass: "saveDataButtonClass", drawButtonText: "drawButtonText", clearButtonText: "clearButtonText", undoButtonText: "undoButtonText", redoButtonText: "redoButtonText", saveDataButtonText: "saveDataButtonText", strokeColorPickerText: "strokeColorPickerText", fillColorPickerText: "fillColorPickerText", drawButtonEnabled: "drawButtonEnabled", clearButtonEnabled: "clearButtonEnabled", undoButtonEnabled: "undoButtonEnabled", redoButtonEnabled: "redoButtonEnabled", saveDataButtonEnabled: "saveDataButtonEnabled", shouldDownloadDrawing: "shouldDownloadDrawing", colorPickerEnabled: "colorPickerEnabled", strokeColorPickerEnabled: "strokeColorPickerEnabled", fillColorPickerEnabled: "fillColorPickerEnabled", lineWidth: "lineWidth", strokeColor: "strokeColor", startingColor: "startingColor", scaleFactor: "scaleFactor", drawingEnabled: "drawingEnabled", showStrokeColorPicker: "showStrokeColorPicker", showFillColorPicker: "showFillColorPicker", downloadedFileName: "downloadedFileName", lineJoin: "lineJoin", lineCap: "lineCap", shapeSelectorEnabled: "shapeSelectorEnabled", showShapeSelector: "showShapeSelector", fillColor: "fillColor" }, outputs: { onClear: "onClear", onUndo: "onUndo", onRedo: "onRedo", onBatchUpdate: "onBatchUpdate", onImageLoaded: "onImageLoaded", onSave: "onSave" }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["canvas"], descendants: true, static: true }, { propertyName: "_incompleteShapesCanvas", first: true, predicate: ["incompleteShapesCanvas"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <div class="canvas_wrapper_div">
      <div class="canvas_whiteboard_buttons">
        <canvas-whiteboard-shape-selector *ngIf="shapeSelectorEnabled"
                                          [showShapeSelector]="showShapeSelector"
                                          [selectedShapeConstructor]="selectedShapeConstructor"
                                          [shapeOptions]="generateShapePreviewOptions()"
                                          (onToggleShapeSelector)="toggleShapeSelector($event)"
                                          (onShapeSelected)="selectShape($event)"></canvas-whiteboard-shape-selector>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || fillColorPickerEnabled"
                                       [previewText]="fillColorPickerText"
                                       [showColorPicker]="showFillColorPicker"
                                       [selectedColor]="fillColor"
                                       (onToggleColorPicker)="toggleFillColorPicker($event)"
                                       (onColorSelected)="changeFillColor($event)">
        </canvas-whiteboard-colorpicker>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || strokeColorPickerEnabled"
                                       [previewText]="strokeColorPickerText"
                                       [showColorPicker]="showStrokeColorPicker"
                                       [selectedColor]="strokeColor"
                                       (onToggleColorPicker)="toggleStrokeColorPicker($event)"
                                       (onColorSelected)="changeStrokeColor($event)">
        </canvas-whiteboard-colorpicker>


        <button *ngIf="drawButtonEnabled" (click)="toggleDrawingEnabled()"
                [class.canvas_whiteboard_button-draw_animated]="getDrawingEnabled()"
                class="canvas_whiteboard_button canvas_whiteboard_button-draw" type="button">
          <i [class]="drawButtonClass" aria-hidden="true"></i> {{drawButtonText}}
        </button>

        <button *ngIf="clearButtonEnabled" (click)="clearCanvasLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-clear">
          <i [class]="clearButtonClass" aria-hidden="true"></i> {{clearButtonText}}
        </button>

        <button *ngIf="undoButtonEnabled" (click)="undoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-undo">
          <i [class]="undoButtonClass" aria-hidden="true"></i> {{undoButtonText}}
        </button>

        <button *ngIf="redoButtonEnabled" (click)="redoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-redo">
          <i [class]="redoButtonClass" aria-hidden="true"></i> {{redoButtonText}}
        </button>
        <button *ngIf="saveDataButtonEnabled" (click)="saveLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-save">
          <i [class]="saveDataButtonClass" aria-hidden="true"></i> {{saveDataButtonText}}
        </button>
      </div>
      <canvas #canvas class="canvas_whiteboard"></canvas>
      <canvas #incompleteShapesCanvas class="incomplete_shapes_canvas_whiteboard"
              (mousedown)="canvasUserEvents($event)" (mouseup)="canvasUserEvents($event)"
              (mousemove)="canvasUserEvents($event)" (mouseout)="canvasUserEvents($event)"
              (touchstart)="canvasUserEvents($event)" (touchmove)="canvasUserEvents($event)"
              (touchend)="canvasUserEvents($event)" (touchcancel)="canvasUserEvents($event)"></canvas>
    </div>
  `, isInline: true, styles: [".canvas_whiteboard_button{display:inline-block;outline:0px;padding-top:7px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.canvas_whiteboard_buttons{z-index:3}@media (max-width: 400px){.canvas_whiteboard_buttons{position:absolute;top:0;width:100%;text-align:center}}@media (min-width: 401px){.canvas_whiteboard_buttons{position:absolute;right:0%;color:#fff}}.canvas_whiteboard_buttons{padding:5px}.canvas_whiteboard_buttons>button{margin:5px}.canvas_whiteboard_button-draw_animated{-webkit-animation:pulsate 1s ease-out;-webkit-animation-iteration-count:infinite}@keyframes pulsate{0%{-webkit-transform:scale(.1,.1);opacity:0}50%{opacity:1}to{-webkit-transform:scale(1.2,1.2);opacity:0}}.canvas_wrapper_div{width:100%;height:100%;border:.5px solid #e2e2e2}.canvas_whiteboard_button-clear{padding-top:5px}.canvas_whiteboard{position:absolute;z-index:1}.incomplete_shapes_canvas_whiteboard{position:absolute;z-index:2}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: CanvasWhiteboardColorPickerComponent, selector: "canvas-whiteboard-colorpicker", inputs: ["previewText", "selectedColor", "showColorPicker"], outputs: ["onToggleColorPicker", "onColorSelected", "onSecondaryColorSelected"] }, { kind: "component", type: CanvasWhiteboardShapeSelectorComponent, selector: "canvas-whiteboard-shape-selector", inputs: ["showShapeSelector", "selectedShapeConstructor", "shapeOptions"], outputs: ["onToggleShapeSelector", "onShapeSelected"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'canvas-whiteboard', template: `
    <div class="canvas_wrapper_div">
      <div class="canvas_whiteboard_buttons">
        <canvas-whiteboard-shape-selector *ngIf="shapeSelectorEnabled"
                                          [showShapeSelector]="showShapeSelector"
                                          [selectedShapeConstructor]="selectedShapeConstructor"
                                          [shapeOptions]="generateShapePreviewOptions()"
                                          (onToggleShapeSelector)="toggleShapeSelector($event)"
                                          (onShapeSelected)="selectShape($event)"></canvas-whiteboard-shape-selector>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || fillColorPickerEnabled"
                                       [previewText]="fillColorPickerText"
                                       [showColorPicker]="showFillColorPicker"
                                       [selectedColor]="fillColor"
                                       (onToggleColorPicker)="toggleFillColorPicker($event)"
                                       (onColorSelected)="changeFillColor($event)">
        </canvas-whiteboard-colorpicker>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || strokeColorPickerEnabled"
                                       [previewText]="strokeColorPickerText"
                                       [showColorPicker]="showStrokeColorPicker"
                                       [selectedColor]="strokeColor"
                                       (onToggleColorPicker)="toggleStrokeColorPicker($event)"
                                       (onColorSelected)="changeStrokeColor($event)">
        </canvas-whiteboard-colorpicker>


        <button *ngIf="drawButtonEnabled" (click)="toggleDrawingEnabled()"
                [class.canvas_whiteboard_button-draw_animated]="getDrawingEnabled()"
                class="canvas_whiteboard_button canvas_whiteboard_button-draw" type="button">
          <i [class]="drawButtonClass" aria-hidden="true"></i> {{drawButtonText}}
        </button>

        <button *ngIf="clearButtonEnabled" (click)="clearCanvasLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-clear">
          <i [class]="clearButtonClass" aria-hidden="true"></i> {{clearButtonText}}
        </button>

        <button *ngIf="undoButtonEnabled" (click)="undoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-undo">
          <i [class]="undoButtonClass" aria-hidden="true"></i> {{undoButtonText}}
        </button>

        <button *ngIf="redoButtonEnabled" (click)="redoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-redo">
          <i [class]="redoButtonClass" aria-hidden="true"></i> {{redoButtonText}}
        </button>
        <button *ngIf="saveDataButtonEnabled" (click)="saveLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-save">
          <i [class]="saveDataButtonClass" aria-hidden="true"></i> {{saveDataButtonText}}
        </button>
      </div>
      <canvas #canvas class="canvas_whiteboard"></canvas>
      <canvas #incompleteShapesCanvas class="incomplete_shapes_canvas_whiteboard"
              (mousedown)="canvasUserEvents($event)" (mouseup)="canvasUserEvents($event)"
              (mousemove)="canvasUserEvents($event)" (mouseout)="canvasUserEvents($event)"
              (touchstart)="canvasUserEvents($event)" (touchmove)="canvasUserEvents($event)"
              (touchend)="canvasUserEvents($event)" (touchcancel)="canvasUserEvents($event)"></canvas>
    </div>
  `, styles: [".canvas_whiteboard_button{display:inline-block;outline:0px;padding-top:7px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.canvas_whiteboard_buttons{z-index:3}@media (max-width: 400px){.canvas_whiteboard_buttons{position:absolute;top:0;width:100%;text-align:center}}@media (min-width: 401px){.canvas_whiteboard_buttons{position:absolute;right:0%;color:#fff}}.canvas_whiteboard_buttons{padding:5px}.canvas_whiteboard_buttons>button{margin:5px}.canvas_whiteboard_button-draw_animated{-webkit-animation:pulsate 1s ease-out;-webkit-animation-iteration-count:infinite}@keyframes pulsate{0%{-webkit-transform:scale(.1,.1);opacity:0}50%{opacity:1}to{-webkit-transform:scale(1.2,1.2);opacity:0}}.canvas_wrapper_div{width:100%;height:100%;border:.5px solid #e2e2e2}.canvas_whiteboard_button-clear{padding-top:5px}.canvas_whiteboard{position:absolute;z-index:1}.incomplete_shapes_canvas_whiteboard{position:absolute;z-index:2}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: CanvasWhiteboardService }, { type: CanvasWhiteboardShapeService }], propDecorators: { options: [{
                type: Input
            }], batchUpdateTimeoutDuration: [{
                type: Input
            }], imageUrl: [{
                type: Input
            }], aspectRatio: [{
                type: Input
            }], drawButtonClass: [{
                type: Input
            }], clearButtonClass: [{
                type: Input
            }], undoButtonClass: [{
                type: Input
            }], redoButtonClass: [{
                type: Input
            }], saveDataButtonClass: [{
                type: Input
            }], drawButtonText: [{
                type: Input
            }], clearButtonText: [{
                type: Input
            }], undoButtonText: [{
                type: Input
            }], redoButtonText: [{
                type: Input
            }], saveDataButtonText: [{
                type: Input
            }], strokeColorPickerText: [{
                type: Input
            }], fillColorPickerText: [{
                type: Input
            }], drawButtonEnabled: [{
                type: Input
            }], clearButtonEnabled: [{
                type: Input
            }], undoButtonEnabled: [{
                type: Input
            }], redoButtonEnabled: [{
                type: Input
            }], saveDataButtonEnabled: [{
                type: Input
            }], shouldDownloadDrawing: [{
                type: Input
            }], colorPickerEnabled: [{
                type: Input
            }], strokeColorPickerEnabled: [{
                type: Input
            }], fillColorPickerEnabled: [{
                type: Input
            }], lineWidth: [{
                type: Input
            }], strokeColor: [{
                type: Input
            }], startingColor: [{
                type: Input
            }], scaleFactor: [{
                type: Input
            }], drawingEnabled: [{
                type: Input
            }], showStrokeColorPicker: [{
                type: Input
            }], showFillColorPicker: [{
                type: Input
            }], downloadedFileName: [{
                type: Input
            }], lineJoin: [{
                type: Input
            }], lineCap: [{
                type: Input
            }], shapeSelectorEnabled: [{
                type: Input
            }], showShapeSelector: [{
                type: Input
            }], fillColor: [{
                type: Input
            }], onClear: [{
                type: Output
            }], onUndo: [{
                type: Output
            }], onRedo: [{
                type: Output
            }], onBatchUpdate: [{
                type: Output
            }], onImageLoaded: [{
                type: Output
            }], onSave: [{
                type: Output
            }], canvas: [{
                type: ViewChild,
                args: ['canvas', { static: true }]
            }], _incompleteShapesCanvas: [{
                type: ViewChild,
                args: ['incompleteShapesCanvas', { static: true }]
            }] } });

class CanvasWhiteboardModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardModule, declarations: [CanvasWhiteboardComponent,
            CanvasWhiteboardColorPickerComponent,
            CanvasWhiteboardShapeSelectorComponent,
            CanvasWhiteboardShapePreviewComponent], imports: [CommonModule], exports: [CanvasWhiteboardComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        CanvasWhiteboardComponent,
                        CanvasWhiteboardColorPickerComponent,
                        CanvasWhiteboardShapeSelectorComponent,
                        CanvasWhiteboardShapePreviewComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    providers: [],
                    exports: [CanvasWhiteboardComponent]
                }]
        }] });

/*
 * Public API Surface of ng2-canvas-whiteboard
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CanvasWhiteboardColorPickerComponent, CanvasWhiteboardComponent, CanvasWhiteboardModule, CanvasWhiteboardPoint, CanvasWhiteboardService, CanvasWhiteboardShape, CanvasWhiteboardShapeOptions, CanvasWhiteboardShapePreviewComponent, CanvasWhiteboardShapeSelectorComponent, CanvasWhiteboardShapeService, CanvasWhiteboardUpdate, CircleShape, FreeHandShape, LineShape, RectangleShape, SmileyShape, StarShape };
//# sourceMappingURL=ng2-canvas-whiteboard.mjs.map
