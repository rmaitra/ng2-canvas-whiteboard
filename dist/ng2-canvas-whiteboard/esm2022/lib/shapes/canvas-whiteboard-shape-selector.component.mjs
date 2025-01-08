import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./canvas-whiteboard-shape.service";
import * as i2 from "@angular/common";
import * as i3 from "./canvas-whiteboard-shape-preview.component";
export class CanvasWhiteboardShapeSelectorComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeSelectorComponent, deps: [{ token: i0.ElementRef }, { token: i1.CanvasWhiteboardShapeService }], target: i0.ɵɵFactoryTarget.Component }); }
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
  `, isInline: true, styles: [".canvas-whiteboard-shape-selector-selected-preview{vertical-align:bottom;display:inline-block}.canvas-whiteboard-shape-selector-wrapper{display:block;padding:4px;border:1px solid #afafaf}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.CanvasWhiteboardShapePreviewComponent, selector: "canvas-whiteboard-shape-preview", inputs: ["shapeConstructor", "shapeOptions"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }] }); }
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
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.CanvasWhiteboardShapeService }], propDecorators: { showShapeSelector: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtc2VsZWN0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmcyLWNhbnZhcy13aGl0ZWJvYXJkL3NyYy9saWIvc2hhcGVzL2NhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXNlbGVjdG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDOzs7OztBQTJDdkIsTUFBTSxPQUFPLHNDQUFzQztJQVVqRCxZQUFvQixVQUFzQixFQUN0Qiw0QkFBMEQ7UUFEMUQsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixpQ0FBNEIsR0FBNUIsNEJBQTRCLENBQThCO1FBVjVELHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUkzQywwQkFBcUIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ3BELG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQW9ELENBQUM7UUFNL0YsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxpQkFBaUIsQ0FBQztJQUMvRSxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQXVEO1FBQ2pFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsb0JBQW9CLENBQUMsS0FBSztRQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNwRixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLENBQUM7SUFDSCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBWTtRQUM5QixJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ1YsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDM0QsQ0FBQzsrR0FoQ1Usc0NBQXNDO21HQUF0QyxzQ0FBc0MsdWJBL0J2Qzs7Ozs7Ozs7Ozs7O0dBWVQ7OzRGQW1CVSxzQ0FBc0M7a0JBckNsRCxTQUFTOytCQUNFLGtDQUFrQyxRQUN0Qzt3QkFDSixzQkFBc0IsRUFBRSw4QkFBOEI7d0JBQ3RELHVCQUF1QixFQUFFLDhCQUE4QjtxQkFDeEQsWUFDUzs7Ozs7Ozs7Ozs7O0dBWVQ7MEhBb0JpQixpQkFBaUI7c0JBQWxDLEtBQUs7Z0JBQ1ksd0JBQXdCO3NCQUF6QyxLQUFLO2dCQUNZLFlBQVk7c0JBQTdCLEtBQUs7Z0JBRUkscUJBQXFCO3NCQUE5QixNQUFNO2dCQUNHLGVBQWU7c0JBQXhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbnZhc1doaXRlYm9hcmRTaGFwZVNlcnZpY2UsIElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGUgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFNoYXBlIH0gZnJvbSAnLi9jYW52YXMtd2hpdGVib2FyZC1zaGFwZSc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zIH0gZnJvbSAnLi9jYW52YXMtd2hpdGVib2FyZC1zaGFwZS1vcHRpb25zJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtc2VsZWN0b3InLFxuICBob3N0OiB7XG4gICAgJyhkb2N1bWVudDptb3VzZWRvd24pJzogJ2Nsb3NlT25FeHRlcm5hbENsaWNrKCRldmVudCknLFxuICAgICcoZG9jdW1lbnQ6dG91Y2hzdGFydCknOiAnY2xvc2VPbkV4dGVybmFsQ2xpY2soJGV2ZW50KSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwiIXNob3dTaGFwZVNlbGVjdG9yXCIgKGNsaWNrKT1cInRvZ2dsZVNoYXBlU2VsZWN0b3IoJGV2ZW50KVwiXG4gICAgICAgICBjbGFzcz1cImNhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXNlbGVjdG9yLXNlbGVjdGVkLXByZXZpZXdcIj5cbiAgICAgIDxjYW52YXMtd2hpdGVib2FyZC1zaGFwZS1wcmV2aWV3IFtzaGFwZUNvbnN0cnVjdG9yXT1cInNlbGVjdGVkU2hhcGVDb25zdHJ1Y3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hhcGVPcHRpb25zXT1cInNoYXBlT3B0aW9uc1wiPjwvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtcHJldmlldz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtc2VsZWN0b3Itd3JhcHBlclwiICpuZ0lmPVwic2hvd1NoYXBlU2VsZWN0b3JcIj5cbiAgICAgIDxjYW52YXMtd2hpdGVib2FyZC1zaGFwZS1wcmV2aWV3ICpuZ0Zvcj1cImxldCBzaGFwZUNvbnN0cnVjdG9yIG9mIHJlZ2lzdGVyZWRTaGFwZXMkIHwgYXN5bmNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NoYXBlQ29uc3RydWN0b3JdPVwic2hhcGVDb25zdHJ1Y3RvclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hhcGVPcHRpb25zXT1cInNoYXBlT3B0aW9uc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0U2hhcGUoc2hhcGVDb25zdHJ1Y3RvcilcIj48L2NhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXByZXZpZXc+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICAuY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtc2VsZWN0b3Itc2VsZWN0ZWQtcHJldmlldyB7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIH1cblxuICAgIC5jYW52YXMtd2hpdGVib2FyZC1zaGFwZS1zZWxlY3Rvci13cmFwcGVyIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgcGFkZGluZzogNHB4O1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2FmYWZhZjtcbiAgICB9XG5cbiAgICBAbWVkaWEgKG1pbi13aWR0aDogNDAxcHgpIHtcbiAgICAgIC5jYW52YXMtd2hpdGVib2FyZC1zaGFwZS1zZWxlY3Rvci13cmFwcGVyIHtcbiAgICAgIH1cbiAgICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIENhbnZhc1doaXRlYm9hcmRTaGFwZVNlbGVjdG9yQ29tcG9uZW50IHtcbiAgQElucHV0KCkgcmVhZG9ubHkgc2hvd1NoYXBlU2VsZWN0b3I6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgcmVhZG9ubHkgc2VsZWN0ZWRTaGFwZUNvbnN0cnVjdG9yOiBJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT47XG4gIEBJbnB1dCgpIHJlYWRvbmx5IHNoYXBlT3B0aW9uczogQ2FudmFzV2hpdGVib2FyZFNoYXBlT3B0aW9ucztcblxuICBAT3V0cHV0KCkgb25Ub2dnbGVTaGFwZVNlbGVjdG9yID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgb25TaGFwZVNlbGVjdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT4+KCk7XG5cbiAgcmVnaXN0ZXJlZFNoYXBlcyQ6IE9ic2VydmFibGU8SU5ld0NhbnZhc1doaXRlYm9hcmRTaGFwZTxDYW52YXNXaGl0ZWJvYXJkU2hhcGU+W10+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjYW52YXNXaGl0ZWJvYXJkU2hhcGVTZXJ2aWNlOiBDYW52YXNXaGl0ZWJvYXJkU2hhcGVTZXJ2aWNlKSB7XG4gICAgdGhpcy5yZWdpc3RlcmVkU2hhcGVzJCA9IHRoaXMuY2FudmFzV2hpdGVib2FyZFNoYXBlU2VydmljZS5yZWdpc3RlcmVkU2hhcGVzJDtcbiAgfVxuXG4gIHNlbGVjdFNoYXBlKHNoYXBlOiBJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT4pOiB2b2lkIHtcbiAgICB0aGlzLm9uU2hhcGVTZWxlY3RlZC5lbWl0KHNoYXBlKTtcbiAgICB0aGlzLnRvZ2dsZVNoYXBlU2VsZWN0b3IobnVsbCk7XG4gIH1cblxuICBjbG9zZU9uRXh0ZXJuYWxDbGljayhldmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSAmJiB0aGlzLnNob3dTaGFwZVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLm9uVG9nZ2xlU2hhcGVTZWxlY3Rvci5lbWl0KGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICB0b2dnbGVTaGFwZVNlbGVjdG9yKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9uVG9nZ2xlU2hhcGVTZWxlY3Rvci5lbWl0KCF0aGlzLnNob3dTaGFwZVNlbGVjdG9yKTtcbiAgfVxufVxuIl19