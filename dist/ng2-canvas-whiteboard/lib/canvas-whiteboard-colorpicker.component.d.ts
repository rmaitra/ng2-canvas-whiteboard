import { EventEmitter, OnInit, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class CanvasWhiteboardColorPickerComponent implements OnInit {
    private elementRef;
    previewText: string;
    readonly selectedColor: string;
    canvas: ElementRef;
    readonly showColorPicker: boolean;
    private _context;
    onToggleColorPicker: EventEmitter<boolean>;
    onColorSelected: EventEmitter<string>;
    onSecondaryColorSelected: EventEmitter<string>;
    constructor(elementRef: ElementRef);
    /**
     * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
     * according to the aspect ratio.
     */
    ngOnInit(): void;
    createColorPalette(): void;
    closeOnExternalClick(event: any): void;
    toggleColorPicker(event: Event): void;
    determineColorFromCanvas(event: any): string;
    selectColor(color: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CanvasWhiteboardColorPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CanvasWhiteboardColorPickerComponent, "canvas-whiteboard-colorpicker", never, { "previewText": { "alias": "previewText"; "required": false; }; "selectedColor": { "alias": "selectedColor"; "required": false; }; "showColorPicker": { "alias": "showColorPicker"; "required": false; }; }, { "onToggleColorPicker": "onToggleColorPicker"; "onColorSelected": "onColorSelected"; "onSecondaryColorSelected": "onSecondaryColorSelected"; }, never, never, false, never>;
}
