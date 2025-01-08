import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export class CanvasWhiteboardService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jYW52YXMtd2hpdGVib2FyZC9zcmMvbGliL2NhbnZhcy13aGl0ZWJvYXJkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQUszQyxNQUFNLE9BQU8sdUJBQXVCO0lBSHBDO1FBSVUsdUJBQWtCLEdBQXNDLElBQUksT0FBTyxFQUFFLENBQUM7UUFDOUUsdUJBQWtCLEdBQXlDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUUxRix3QkFBbUIsR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUMxRCx3QkFBbUIsR0FBb0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXZFLHVCQUFrQixHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ3pELHVCQUFrQixHQUFvQixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFckUsdUJBQWtCLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDekQsdUJBQWtCLEdBQW9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQWlCOUU7SUFmUSxVQUFVLENBQUMsT0FBaUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRU0sV0FBVztRQUNoQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTSxVQUFVLENBQUMsU0FBaUI7UUFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU0sVUFBVSxDQUFDLFNBQWlCO1FBQ2pDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQzsrR0EzQlUsdUJBQXVCO21IQUF2Qix1QkFBdUIsY0FGdEIsTUFBTTs7NEZBRVAsdUJBQXVCO2tCQUhuQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbnZhc1doaXRlYm9hcmRVcGRhdGUgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLXVwZGF0ZS5tb2RlbCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBDYW52YXNXaGl0ZWJvYXJkU2VydmljZSB7XG4gIHByaXZhdGUgX2NhbnZhc0RyYXdTdWJqZWN0OiBTdWJqZWN0PENhbnZhc1doaXRlYm9hcmRVcGRhdGVbXT4gPSBuZXcgU3ViamVjdCgpO1xuICBjYW52YXNEcmF3U3ViamVjdCQ6IE9ic2VydmFibGU8Q2FudmFzV2hpdGVib2FyZFVwZGF0ZVtdPiA9IHRoaXMuX2NhbnZhc0RyYXdTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgX2NhbnZhc0NsZWFyU3ViamVjdDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgY2FudmFzQ2xlYXJTdWJqZWN0JDogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5fY2FudmFzQ2xlYXJTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgX2NhbnZhc1VuZG9TdWJqZWN0OiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICBjYW52YXNVbmRvU3ViamVjdCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuX2NhbnZhc1VuZG9TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHByaXZhdGUgX2NhbnZhc1JlZG9TdWJqZWN0OiBTdWJqZWN0PGFueT4gPSBuZXcgU3ViamVjdCgpO1xuICBjYW52YXNSZWRvU3ViamVjdCQ6IE9ic2VydmFibGU8YW55PiA9IHRoaXMuX2NhbnZhc1JlZG9TdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHB1YmxpYyBkcmF3Q2FudmFzKHVwZGF0ZXM6IENhbnZhc1doaXRlYm9hcmRVcGRhdGVbXSk6IHZvaWQge1xuICAgIHRoaXMuX2NhbnZhc0RyYXdTdWJqZWN0Lm5leHQodXBkYXRlcyk7XG4gIH1cblxuICBwdWJsaWMgY2xlYXJDYW52YXMoKTogdm9pZCB7XG4gICAgdGhpcy5fY2FudmFzQ2xlYXJTdWJqZWN0Lm5leHQobnVsbCk7XG4gIH1cblxuICBwdWJsaWMgdW5kb0NhbnZhcyh1cGRhdGVVVUQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX2NhbnZhc1VuZG9TdWJqZWN0Lm5leHQodXBkYXRlVVVEKTtcbiAgfVxuXG4gIHB1YmxpYyByZWRvQ2FudmFzKHVwZGF0ZVVVRDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fY2FudmFzUmVkb1N1YmplY3QubmV4dCh1cGRhdGVVVUQpO1xuICB9XG59XG4iXX0=