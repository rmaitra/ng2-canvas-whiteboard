import { Component, Input, ViewChild } from '@angular/core';
import { CanvasWhiteboardPoint } from '../canvas-whiteboard-point.model';
import { CanvasWhiteboardShapeOptions } from './canvas-whiteboard-shape-options';
import * as i0 from "@angular/core";
export class CanvasWhiteboardShapePreviewComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtcHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItY2FudmFzLXdoaXRlYm9hcmQvc3JjL2xpYi9zaGFwZXMvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtcHJldmlldy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsU0FBUyxFQUlWLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDOztBQWNqRixNQUFNLE9BQU8scUNBQXFDO0lBTWhELGVBQWU7UUFDYixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNyRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMxQixDQUFDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakIsT0FBTztRQUNULENBQUM7UUFFRCxNQUFNLE9BQU8sR0FBNkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JGLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJFLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUM3QyxJQUFJLHFCQUFxQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDRCQUE0QixFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUNyRSxDQUFDO1FBRUYsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNyQyxDQUFDOytHQTlCVSxxQ0FBcUM7bUdBQXJDLHFDQUFxQyxvU0FWdEM7OztHQUdUOzs0RkFPVSxxQ0FBcUM7a0JBWmpELFNBQVM7K0JBQ0UsaUNBQWlDLFlBQ2pDOzs7R0FHVDs4QkFRaUIsZ0JBQWdCO3NCQUFqQyxLQUFLO2dCQUNZLFlBQVk7c0JBQTdCLEtBQUs7Z0JBRXFDLE1BQU07c0JBQWhELFNBQVM7dUJBQUMsOEJBQThCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgVmlld0NoaWxkLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlIH0gZnJvbSAnLi9jYW52YXMtd2hpdGVib2FyZC1zaGFwZS5zZXJ2aWNlJztcbmltcG9ydCB7IENhbnZhc1doaXRlYm9hcmRTaGFwZSB9IGZyb20gJy4vY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFBvaW50IH0gZnJvbSAnLi4vY2FudmFzLXdoaXRlYm9hcmQtcG9pbnQubW9kZWwnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFNoYXBlT3B0aW9ucyB9IGZyb20gJy4vY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtb3B0aW9ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXByZXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxjYW52YXMgI2NhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXcgd2lkdGg9XCI1MHB4XCIgaGVpZ2h0PVwiNTBweFwiXG4gICAgICAgICAgICBjbGFzcz1cImNhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXByZXZpZXctY2FudmFzXCI+PC9jYW52YXM+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICAuY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtcHJldmlldy1jYW52YXMge1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgQ2FudmFzV2hpdGVib2FyZFNoYXBlUHJldmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHJlYWRvbmx5IHNoYXBlQ29uc3RydWN0b3I6IElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPjtcbiAgQElucHV0KCkgcmVhZG9ubHkgc2hhcGVPcHRpb25zOiBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zO1xuXG4gIEBWaWV3Q2hpbGQoJ2NhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXcnKSBjYW52YXM6IEVsZW1lbnRSZWY7XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZHJhd1NoYXBlUHJldmlldygpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLnNoYXBlQ29uc3RydWN0b3IgfHwgY2hhbmdlcy5zaGFwZU9wdGlvbnMpIHtcbiAgICAgIHRoaXMuZHJhd1NoYXBlUHJldmlldygpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdTaGFwZVByZXZpZXcoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNhbnZhcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcblxuICAgIGNvbnN0IGNvbmNyZXRlU2hhcGUgPSBuZXcgdGhpcy5zaGFwZUNvbnN0cnVjdG9yKFxuICAgICAgbmV3IENhbnZhc1doaXRlYm9hcmRQb2ludCgwLCAwKSxcbiAgICAgIE9iamVjdC5hc3NpZ24obmV3IENhbnZhc1doaXRlYm9hcmRTaGFwZU9wdGlvbnMoKSwgdGhpcy5zaGFwZU9wdGlvbnMpXG4gICAgKTtcblxuICAgIGNvbmNyZXRlU2hhcGUuZHJhd1ByZXZpZXcoY29udGV4dCk7XG4gIH1cbn1cbiJdfQ==