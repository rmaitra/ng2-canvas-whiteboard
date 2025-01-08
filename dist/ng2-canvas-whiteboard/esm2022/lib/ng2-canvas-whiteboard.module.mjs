import { NgModule } from '@angular/core';
import { CanvasWhiteboardComponent } from './canvas-whiteboard.component';
import { CommonModule } from '@angular/common';
import { CanvasWhiteboardColorPickerComponent } from './canvas-whiteboard-colorpicker.component';
import { CanvasWhiteboardShapeSelectorComponent } from './shapes/canvas-whiteboard-shape-selector.component';
import { CanvasWhiteboardShapePreviewComponent } from './shapes/canvas-whiteboard-shape-preview.component';
import * as i0 from "@angular/core";
export class CanvasWhiteboardModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmcyLWNhbnZhcy13aGl0ZWJvYXJkLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jYW52YXMtd2hpdGVib2FyZC9zcmMvbGliL25nMi1jYW52YXMtd2hpdGVib2FyZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakcsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLE1BQU0scURBQXFELENBQUM7QUFDN0csT0FBTyxFQUFFLHFDQUFxQyxFQUFFLE1BQU0sb0RBQW9ELENBQUM7O0FBZTNHLE1BQU0sT0FBTyxzQkFBc0I7K0dBQXRCLHNCQUFzQjtnSEFBdEIsc0JBQXNCLGlCQVgvQix5QkFBeUI7WUFDekIsb0NBQW9DO1lBQ3BDLHNDQUFzQztZQUN0QyxxQ0FBcUMsYUFHckMsWUFBWSxhQUdKLHlCQUF5QjtnSEFFeEIsc0JBQXNCLFlBTC9CLFlBQVk7OzRGQUtILHNCQUFzQjtrQkFibEMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1oseUJBQXlCO3dCQUN6QixvQ0FBb0M7d0JBQ3BDLHNDQUFzQzt3QkFDdEMscUNBQXFDO3FCQUN0QztvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxTQUFTLEVBQUUsRUFBRTtvQkFDYixPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztpQkFDckMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZENvbXBvbmVudCB9IGZyb20gJy4vY2FudmFzLXdoaXRlYm9hcmQuY29tcG9uZW50JztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkQ29sb3JQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLWNvbG9ycGlja2VyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVTZWxlY3RvckNvbXBvbmVudCB9IGZyb20gJy4vc2hhcGVzL2NhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXNlbGVjdG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVQcmV2aWV3Q29tcG9uZW50IH0gZnJvbSAnLi9zaGFwZXMvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtcHJldmlldy5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBDYW52YXNXaGl0ZWJvYXJkQ29tcG9uZW50LFxuICAgIENhbnZhc1doaXRlYm9hcmRDb2xvclBpY2tlckNvbXBvbmVudCxcbiAgICBDYW52YXNXaGl0ZWJvYXJkU2hhcGVTZWxlY3RvckNvbXBvbmVudCxcbiAgICBDYW52YXNXaGl0ZWJvYXJkU2hhcGVQcmV2aWV3Q29tcG9uZW50XG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXSxcbiAgZXhwb3J0czogW0NhbnZhc1doaXRlYm9hcmRDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIENhbnZhc1doaXRlYm9hcmRNb2R1bGUge1xuXG59XG4iXX0=