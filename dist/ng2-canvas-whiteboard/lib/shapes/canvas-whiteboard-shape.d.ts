import { CanvasWhiteboardShapeOptions } from './canvas-whiteboard-shape-options';
import { CanvasWhiteboardPoint } from '../canvas-whiteboard-point.model';
import { CanvasWhiteboardUpdate } from '../canvas-whiteboard-update.model';
export declare abstract class CanvasWhiteboardShape {
    isVisible: boolean;
    protected positionPoint: CanvasWhiteboardPoint;
    protected options: CanvasWhiteboardShapeOptions;
    protected constructor(positionPoint?: CanvasWhiteboardPoint, options?: CanvasWhiteboardShapeOptions);
    abstract getShapeName(): string;
    abstract onUpdateReceived(update: CanvasWhiteboardUpdate): void;
    onStopReceived(update: CanvasWhiteboardUpdate): void;
    abstract draw(context: CanvasRenderingContext2D): void;
    abstract drawPreview(context: CanvasRenderingContext2D): void;
}
