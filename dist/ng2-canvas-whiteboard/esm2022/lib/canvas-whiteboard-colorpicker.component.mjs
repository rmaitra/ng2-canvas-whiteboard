import { Component, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class CanvasWhiteboardColorPickerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQtY29sb3JwaWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmcyLWNhbnZhcy13aGl0ZWJvYXJkL3NyYy9saWIvY2FudmFzLXdoaXRlYm9hcmQtY29sb3JwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsTUFBTSxFQUNOLFlBQVksRUFBVSxTQUFTLEVBQWMsS0FBSyxFQUNuRCxNQUFNLGVBQWUsQ0FBQzs7QUFnRXZCLE1BQU0sT0FBTyxvQ0FBb0M7SUFhL0MsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQVZ4QixrQkFBYSxHQUFXLGVBQWUsQ0FBQztRQUd4QyxvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUd6Qyx3QkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ2xELG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM3Qyw2QkFBd0IsR0FBRyxJQUFJLFlBQVksRUFBVSxDQUFDO0lBR2hFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLFlBQVks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Q0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDOytHQXZFVSxvQ0FBb0M7bUdBQXBDLG9DQUFvQywra0JBeERyQzs7Ozs7Ozs7Ozs7R0FXVDs7NEZBNkNVLG9DQUFvQztrQkE5RGhELFNBQVM7K0JBQ0UsK0JBQStCLFFBQ25DO3dCQUNKLHNCQUFzQixFQUFFLDhCQUE4Qjt3QkFDdEQsdUJBQXVCLEVBQUUsOEJBQThCO3FCQUN4RCxZQUNTOzs7Ozs7Ozs7OztHQVdUOytFQStDUSxXQUFXO3NCQUFuQixLQUFLO2dCQUNZLGFBQWE7c0JBQTlCLEtBQUs7Z0JBQ29ELE1BQU07c0JBQS9ELFNBQVM7dUJBQUMsNkJBQTZCLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUV0QyxlQUFlO3NCQUFoQyxLQUFLO2dCQUdJLG1CQUFtQjtzQkFBNUIsTUFBTTtnQkFDRyxlQUFlO3NCQUF4QixNQUFNO2dCQUNHLHdCQUF3QjtzQkFBakMsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgVmlld0NoaWxkLCBFbGVtZW50UmVmLCBJbnB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2FudmFzLXdoaXRlYm9hcmQtY29sb3JwaWNrZXInLFxuICBob3N0OiB7XG4gICAgJyhkb2N1bWVudDptb3VzZWRvd24pJzogJ2Nsb3NlT25FeHRlcm5hbENsaWNrKCRldmVudCknLFxuICAgICcoZG9jdW1lbnQ6dG91Y2hzdGFydCknOiAnY2xvc2VPbkV4dGVybmFsQ2xpY2soJGV2ZW50KSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IFtoaWRkZW5dPVwic2hvd0NvbG9yUGlja2VyXCIgY2xhc3M9XCJjYW52YXMtd2hpdGVib2FyZC1jb2xvcnBpY2tlci1pbnB1dFwiXG4gICAgICAgICAoY2xpY2spPVwidG9nZ2xlQ29sb3JQaWNrZXIoJGV2ZW50KVwiPlxuICAgICAgPGRpdiBjbGFzcz1cInNlbGVjdGVkLWNvbG9yLXR5cGUtd3JhcHBlclwiPnt7cHJldmlld1RleHR9fTwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlbGVjdGVkLWNvbG9yLXByZXZpZXdcIiBbc3R5bGUuYmFja2dyb3VuZF09XCJzZWxlY3RlZENvbG9yXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBbaGlkZGVuXT1cIiFzaG93Q29sb3JQaWNrZXJcIiBjbGFzcz1cImNhbnZhcy13aGl0ZWJvYXJkLWNvbG9ycGlja2VyLXdyYXBwZXJcIj5cbiAgICAgIDxkaXYgKGNsaWNrKT1cInNlbGVjdENvbG9yKCd0cmFuc3BhcmVudCcpXCIgY2xhc3M9XCJ0cmFuc3BhcmVudC1jb2xvclwiPlRyYW5zcGFyZW50PC9kaXY+XG4gICAgICA8Y2FudmFzICNjYW52YXN3aGl0ZWJvYXJkY29sb3JwaWNrZXIgY2xhc3M9XCJjYW52YXMtd2hpdGVib2FyZC1jb2xvcnBpY2tlclwiIHdpZHRoPVwiMjg0XCIgaGVpZ2h0PVwiMTU1XCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdENvbG9yKGRldGVybWluZUNvbG9yRnJvbUNhbnZhcygkZXZlbnQpKVwiPjwvY2FudmFzPlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgLnNlbGVjdGVkLWNvbG9yLXByZXZpZXcge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDIwJTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJvdHRvbTogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgfVxuXG4gICAgLnNlbGVjdGVkLWNvbG9yLXR5cGUtd3JhcHBlciB7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgIGNvbG9yOiAjMDAwO1xuICAgIH1cblxuICAgIC50cmFuc3BhcmVudC1jb2xvciB7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgfVxuXG4gICAgLmNhbnZhcy13aGl0ZWJvYXJkLWNvbG9ycGlja2VyLXdyYXBwZXIge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2FmYWZhZjtcbiAgICAgIGNvbG9yOiAjMDAwO1xuICAgIH1cblxuICAgIEBtZWRpYSAobWluLXdpZHRoOiA0MDFweCkge1xuICAgICAgLmNhbnZhcy13aGl0ZWJvYXJkLWNvbG9ycGlja2VyLXdyYXBwZXIge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLmNhbnZhcy13aGl0ZWJvYXJkLWNvbG9ycGlja2VyLWlucHV0IHtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHdpZHRoOiA0NHB4O1xuICAgICAgaGVpZ2h0OiA0NHB4O1xuICAgICAgbWFyZ2luOiA1cHg7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICBjb2xvcjogIzAwMDtcbiAgICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIENhbnZhc1doaXRlYm9hcmRDb2xvclBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG5cbiAgQElucHV0KCkgcHJldmlld1RleHQ6IHN0cmluZztcbiAgQElucHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRDb2xvcjogc3RyaW5nID0gJ3JnYmEoMCwwLDAsMSknO1xuICBAVmlld0NoaWxkKCdjYW52YXN3aGl0ZWJvYXJkY29sb3JwaWNrZXInLCB7c3RhdGljOiB0cnVlfSkgY2FudmFzOiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIHJlYWRvbmx5IHNob3dDb2xvclBpY2tlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgQE91dHB1dCgpIG9uVG9nZ2xlQ29sb3JQaWNrZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIEBPdXRwdXQoKSBvbkNvbG9yU2VsZWN0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgpIG9uU2Vjb25kYXJ5Q29sb3JTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGNhbnZhcyBkcmF3aW5nIGNvbnRleHQuIElmIHdlIGhhdmUgYW4gYXNwZWN0IHJhdGlvIHNldCB1cCwgdGhlIGNhbnZhcyB3aWxsIHJlc2l6ZVxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIGFzcGVjdCByYXRpby5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jcmVhdGVDb2xvclBhbGV0dGUoKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbG9yUGFsZXR0ZSgpOiB2b2lkIHtcbiAgICBsZXQgZ3JhZGllbnQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCAwKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJ3JnYigyNTUsIDAsIDApJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMTUsICdyZ2IoMjU1LCAwLCAyNTUpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuMzMsICdyZ2IoMCwgMCwgMjU1KScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjQ5LCAncmdiKDAsIDI1NSwgMjU1KScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjY3LCAncmdiKDAsIDI1NSwgMCknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC44NCwgJ3JnYigyNTUsIDI1NSwgMCknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJ3JnYigyNTUsIDAsIDApJyk7XG4gICAgdGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBncmFkaWVudDtcbiAgICB0aGlzLl9jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoLCB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgZ3JhZGllbnQgPSB0aGlzLl9jb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpJyk7XG4gICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDAuNSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknKTtcbiAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMC41LCAncmdiYSgwLCAwLCAwLCAwKScpO1xuICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCAncmdiYSgwLCAwLCAwLCAxKScpO1xuICAgIHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZ3JhZGllbnQ7XG4gICAgdGhpcy5fY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgfVxuXG4gIGNsb3NlT25FeHRlcm5hbENsaWNrKGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmIHRoaXMuc2hvd0NvbG9yUGlja2VyKSB7XG4gICAgICB0aGlzLm9uVG9nZ2xlQ29sb3JQaWNrZXIuZW1pdChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlQ29sb3JQaWNrZXIoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIHRoaXMub25Ub2dnbGVDb2xvclBpY2tlci5lbWl0KCF0aGlzLnNob3dDb2xvclBpY2tlcik7XG4gIH1cblxuICBkZXRlcm1pbmVDb2xvckZyb21DYW52YXMoZXZlbnQ6IGFueSk6IHN0cmluZyB7XG4gICAgY29uc3QgY2FudmFzUmVjdCA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGltYWdlRGF0YSA9IHRoaXMuX2NvbnRleHQuZ2V0SW1hZ2VEYXRhKGV2ZW50LmNsaWVudFggLSBjYW52YXNSZWN0LmxlZnQsXG4gICAgICBldmVudC5jbGllbnRZIC0gY2FudmFzUmVjdC50b3AsIDEsIDEpO1xuXG4gICAgcmV0dXJuIGByZ2JhKCR7aW1hZ2VEYXRhLmRhdGFbMF19LCAke2ltYWdlRGF0YS5kYXRhWzFdfSwgJHtpbWFnZURhdGEuZGF0YVsyXX0sICR7aW1hZ2VEYXRhLmRhdGFbM119KWA7XG4gIH1cblxuICBzZWxlY3RDb2xvcihjb2xvcjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5vbkNvbG9yU2VsZWN0ZWQuZW1pdChjb2xvcik7XG4gICAgdGhpcy50b2dnbGVDb2xvclBpY2tlcihudWxsKTtcbiAgfVxufVxuIl19