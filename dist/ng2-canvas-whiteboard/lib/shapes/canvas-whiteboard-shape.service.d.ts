import { CanvasWhiteboardShape } from './canvas-whiteboard-shape';
import { CanvasWhiteboardShapeOptions } from './canvas-whiteboard-shape-options';
import { CanvasWhiteboardPoint } from '../canvas-whiteboard-point.model';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export type INewCanvasWhiteboardShape<T extends CanvasWhiteboardShape> = new (positionPoint?: CanvasWhiteboardPoint, options?: CanvasWhiteboardShapeOptions, ...args: any[]) => T;
export declare class CanvasWhiteboardShapeService {
    private registeredShapesSubject;
    registeredShapes$: Observable<Array<INewCanvasWhiteboardShape<CanvasWhiteboardShape>>>;
    constructor();
    getShapeConstructorFromShapeName(shapeName: string): INewCanvasWhiteboardShape<CanvasWhiteboardShape>;
    getCurrentRegisteredShapes(): Array<INewCanvasWhiteboardShape<CanvasWhiteboardShape>>;
    isRegisteredShape(shape: INewCanvasWhiteboardShape<CanvasWhiteboardShape>): boolean;
    registerShape(shape: INewCanvasWhiteboardShape<CanvasWhiteboardShape>): void;
    registerShapes(shapes: Array<INewCanvasWhiteboardShape<CanvasWhiteboardShape>>): void;
    unregisterShape(shape: INewCanvasWhiteboardShape<CanvasWhiteboardShape>): void;
    unregisterShapes(shapes: Array<INewCanvasWhiteboardShape<CanvasWhiteboardShape>>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CanvasWhiteboardShapeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CanvasWhiteboardShapeService>;
}
