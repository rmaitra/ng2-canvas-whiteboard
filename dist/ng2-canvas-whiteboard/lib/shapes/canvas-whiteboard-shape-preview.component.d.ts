import { ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { INewCanvasWhiteboardShape } from './canvas-whiteboard-shape.service';
import { CanvasWhiteboardShape } from './canvas-whiteboard-shape';
import { CanvasWhiteboardShapeOptions } from './canvas-whiteboard-shape-options';
import * as i0 from "@angular/core";
export declare class CanvasWhiteboardShapePreviewComponent implements AfterViewInit, OnChanges {
    readonly shapeConstructor: INewCanvasWhiteboardShape<CanvasWhiteboardShape>;
    readonly shapeOptions: CanvasWhiteboardShapeOptions;
    canvas: ElementRef;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    drawShapePreview(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CanvasWhiteboardShapePreviewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CanvasWhiteboardShapePreviewComponent, "canvas-whiteboard-shape-preview", never, { "shapeConstructor": { "alias": "shapeConstructor"; "required": false; }; "shapeOptions": { "alias": "shapeOptions"; "required": false; }; }, {}, never, never, false, never>;
}
