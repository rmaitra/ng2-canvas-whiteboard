import { ElementRef, EventEmitter } from '@angular/core';
import { CanvasWhiteboardShapeService, INewCanvasWhiteboardShape } from './canvas-whiteboard-shape.service';
import { CanvasWhiteboardShape } from './canvas-whiteboard-shape';
import { CanvasWhiteboardShapeOptions } from './canvas-whiteboard-shape-options';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class CanvasWhiteboardShapeSelectorComponent {
    private elementRef;
    private canvasWhiteboardShapeService;
    readonly showShapeSelector: boolean;
    readonly selectedShapeConstructor: INewCanvasWhiteboardShape<CanvasWhiteboardShape>;
    readonly shapeOptions: CanvasWhiteboardShapeOptions;
    onToggleShapeSelector: EventEmitter<boolean>;
    onShapeSelected: EventEmitter<INewCanvasWhiteboardShape<CanvasWhiteboardShape>>;
    registeredShapes$: Observable<INewCanvasWhiteboardShape<CanvasWhiteboardShape>[]>;
    constructor(elementRef: ElementRef, canvasWhiteboardShapeService: CanvasWhiteboardShapeService);
    selectShape(shape: INewCanvasWhiteboardShape<CanvasWhiteboardShape>): void;
    closeOnExternalClick(event: any): void;
    toggleShapeSelector(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CanvasWhiteboardShapeSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CanvasWhiteboardShapeSelectorComponent, "canvas-whiteboard-shape-selector", never, { "showShapeSelector": { "alias": "showShapeSelector"; "required": false; }; "selectedShapeConstructor": { "alias": "selectedShapeConstructor"; "required": false; }; "shapeOptions": { "alias": "shapeOptions"; "required": false; }; }, { "onToggleShapeSelector": "onToggleShapeSelector"; "onShapeSelected": "onShapeSelected"; }, never, never, false, never>;
}
