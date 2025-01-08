import { Injectable } from '@angular/core';
import { CircleShape } from './circle-shape';
import { RectangleShape } from './rectangle-shape';
import { FreeHandShape } from './free-hand-shape';
import { SmileyShape } from './smiley-shape';
import { StarShape } from './star-shape';
import { LineShape } from './line-shape';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class CanvasWhiteboardShapeService {
    constructor() {
        this.registeredShapesSubject = new BehaviorSubject([
            FreeHandShape,
            LineShape,
            RectangleShape,
            CircleShape,
            StarShape,
            SmileyShape
        ]);
        this.registeredShapes$ = this.registeredShapesSubject.asObservable();
    }
    getShapeConstructorFromShapeName(shapeName) {
        return this.getCurrentRegisteredShapes().find((shape) => (new shape).getShapeName() === shapeName);
    }
    getCurrentRegisteredShapes() {
        return this.registeredShapesSubject.getValue();
    }
    isRegisteredShape(shape) {
        return this.getCurrentRegisteredShapes().indexOf(shape) !== -1;
    }
    registerShape(shape) {
        if (this.isRegisteredShape(shape)) {
            console.warn(`You tried to register a shape:${shape}, but is has already been registered.`);
            return;
        }
        const registeredShapes = this.getCurrentRegisteredShapes();
        registeredShapes.push(shape);
        this.registeredShapesSubject.next(registeredShapes);
    }
    registerShapes(shapes) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes()
            .concat(shapes.filter((shape) => {
            if (this.isRegisteredShape(shape)) {
                console.warn(`You tried to register a shape:${shape}, but is has already been registered.`);
                return false;
            }
            return true;
        })));
    }
    unregisterShape(shape) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes().filter(registeredShape => registeredShape !== shape));
    }
    unregisterShapes(shapes) {
        this.registeredShapesSubject.next(this.getCurrentRegisteredShapes().filter(shape => shapes.indexOf(shape) === -1));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardShapeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jYW52YXMtd2hpdGVib2FyZC9zcmMvbGliL3NoYXBlcy9jYW52YXMtd2hpdGVib2FyZC1zaGFwZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFHbEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDekMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN6QyxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDOztBQVFuRCxNQUFNLE9BQU8sNEJBQTRCO0lBSXZDO1FBQ0UsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksZUFBZSxDQUFDO1lBQ2pELGFBQWE7WUFDYixTQUFTO1lBQ1QsY0FBYztZQUNkLFdBQVc7WUFDWCxTQUFTO1lBQ1QsV0FBVztTQUNaLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdkUsQ0FBQztJQUVELGdDQUFnQyxDQUFDLFNBQWlCO1FBQ2hELE9BQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FDdEQsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCwwQkFBMEI7UUFDeEIsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELGlCQUFpQixDQUFDLEtBQXVEO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBdUQ7UUFDbkUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxLQUFLLHVDQUF1QyxDQUFDLENBQUM7WUFDNUYsT0FBTztRQUNULENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1FBQzNELGdCQUFnQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGNBQWMsQ0FBQyxNQUErRDtRQUM1RSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUMvQixJQUFJLENBQUMsMEJBQTBCLEVBQUU7YUFDOUIsTUFBTSxDQUNMLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN0QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxLQUFLLHVDQUF1QyxDQUFDLENBQUM7Z0JBQzVGLE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztZQUVELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQ0gsQ0FDSixDQUFDO0lBQ0osQ0FBQztJQUVELGVBQWUsQ0FBQyxLQUF1RDtRQUNyRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUMvQixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEtBQUssS0FBSyxDQUFDLENBQ3ZGLENBQUM7SUFDSixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsTUFBK0Q7UUFDOUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FDL0IsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUNoRixDQUFDO0lBQ0osQ0FBQzsrR0FsRVUsNEJBQTRCO21IQUE1Qiw0QkFBNEIsY0FGM0IsTUFBTTs7NEZBRVAsNEJBQTRCO2tCQUh4QyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhbnZhc1doaXRlYm9hcmRTaGFwZSB9IGZyb20gJy4vY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUnO1xuaW1wb3J0IHsgQ2lyY2xlU2hhcGUgfSBmcm9tICcuL2NpcmNsZS1zaGFwZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGVTaGFwZSB9IGZyb20gJy4vcmVjdGFuZ2xlLXNoYXBlJztcbmltcG9ydCB7IEZyZWVIYW5kU2hhcGUgfSBmcm9tICcuL2ZyZWUtaGFuZC1zaGFwZSc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zIH0gZnJvbSAnLi9jYW52YXMtd2hpdGVib2FyZC1zaGFwZS1vcHRpb25zJztcbmltcG9ydCB7IENhbnZhc1doaXRlYm9hcmRQb2ludCB9IGZyb20gJy4uL2NhbnZhcy13aGl0ZWJvYXJkLXBvaW50Lm1vZGVsJztcbmltcG9ydCB7IFNtaWxleVNoYXBlIH0gZnJvbSAnLi9zbWlsZXktc2hhcGUnO1xuaW1wb3J0IHsgU3RhclNoYXBlIH0gZnJvbSAnLi9zdGFyLXNoYXBlJztcbmltcG9ydCB7IExpbmVTaGFwZSB9IGZyb20gJy4vbGluZS1zaGFwZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IHR5cGUgSU5ld0NhbnZhc1doaXRlYm9hcmRTaGFwZTxUIGV4dGVuZHMgQ2FudmFzV2hpdGVib2FyZFNoYXBlPiA9XG4gIG5ldyAocG9zaXRpb25Qb2ludD86IENhbnZhc1doaXRlYm9hcmRQb2ludCwgb3B0aW9ucz86IENhbnZhc1doaXRlYm9hcmRTaGFwZU9wdGlvbnMsIC4uLmFyZ3M6IGFueVtdKSA9PiBUO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgQ2FudmFzV2hpdGVib2FyZFNoYXBlU2VydmljZSB7XG4gIHByaXZhdGUgcmVnaXN0ZXJlZFNoYXBlc1N1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxBcnJheTxJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT4+PjtcbiAgcHVibGljIHJlZ2lzdGVyZWRTaGFwZXMkOiBPYnNlcnZhYmxlPEFycmF5PElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPj4+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVnaXN0ZXJlZFNoYXBlc1N1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFtcbiAgICAgIEZyZWVIYW5kU2hhcGUsXG4gICAgICBMaW5lU2hhcGUsXG4gICAgICBSZWN0YW5nbGVTaGFwZSxcbiAgICAgIENpcmNsZVNoYXBlLFxuICAgICAgU3RhclNoYXBlLFxuICAgICAgU21pbGV5U2hhcGVcbiAgICBdKTtcbiAgICB0aGlzLnJlZ2lzdGVyZWRTaGFwZXMkID0gdGhpcy5yZWdpc3RlcmVkU2hhcGVzU3ViamVjdC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldFNoYXBlQ29uc3RydWN0b3JGcm9tU2hhcGVOYW1lKHNoYXBlTmFtZTogc3RyaW5nKTogSU5ld0NhbnZhc1doaXRlYm9hcmRTaGFwZTxDYW52YXNXaGl0ZWJvYXJkU2hhcGU+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50UmVnaXN0ZXJlZFNoYXBlcygpLmZpbmQoKHNoYXBlKSA9PlxuICAgICAgKG5ldyBzaGFwZSkuZ2V0U2hhcGVOYW1lKCkgPT09IHNoYXBlTmFtZSk7XG4gIH1cblxuICBnZXRDdXJyZW50UmVnaXN0ZXJlZFNoYXBlcygpOiBBcnJheTxJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT4+IHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RlcmVkU2hhcGVzU3ViamVjdC5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgaXNSZWdpc3RlcmVkU2hhcGUoc2hhcGU6IElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRSZWdpc3RlcmVkU2hhcGVzKCkuaW5kZXhPZihzaGFwZSkgIT09IC0xO1xuICB9XG5cbiAgcmVnaXN0ZXJTaGFwZShzaGFwZTogSU5ld0NhbnZhc1doaXRlYm9hcmRTaGFwZTxDYW52YXNXaGl0ZWJvYXJkU2hhcGU+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSZWdpc3RlcmVkU2hhcGUoc2hhcGUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFlvdSB0cmllZCB0byByZWdpc3RlciBhIHNoYXBlOiR7c2hhcGV9LCBidXQgaXMgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZ2lzdGVyZWRTaGFwZXMgPSB0aGlzLmdldEN1cnJlbnRSZWdpc3RlcmVkU2hhcGVzKCk7XG4gICAgcmVnaXN0ZXJlZFNoYXBlcy5wdXNoKHNoYXBlKTtcbiAgICB0aGlzLnJlZ2lzdGVyZWRTaGFwZXNTdWJqZWN0Lm5leHQocmVnaXN0ZXJlZFNoYXBlcyk7XG4gIH1cblxuICByZWdpc3RlclNoYXBlcyhzaGFwZXM6IEFycmF5PElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPj4pOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyZWRTaGFwZXNTdWJqZWN0Lm5leHQoXG4gICAgICB0aGlzLmdldEN1cnJlbnRSZWdpc3RlcmVkU2hhcGVzKClcbiAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICBzaGFwZXMuZmlsdGVyKChzaGFwZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZWdpc3RlcmVkU2hhcGUoc2hhcGUpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihgWW91IHRyaWVkIHRvIHJlZ2lzdGVyIGEgc2hhcGU6JHtzaGFwZX0sIGJ1dCBpcyBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuYCk7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICk7XG4gIH1cblxuICB1bnJlZ2lzdGVyU2hhcGUoc2hhcGU6IElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPik6IHZvaWQge1xuICAgIHRoaXMucmVnaXN0ZXJlZFNoYXBlc1N1YmplY3QubmV4dChcbiAgICAgIHRoaXMuZ2V0Q3VycmVudFJlZ2lzdGVyZWRTaGFwZXMoKS5maWx0ZXIocmVnaXN0ZXJlZFNoYXBlID0+IHJlZ2lzdGVyZWRTaGFwZSAhPT0gc2hhcGUpXG4gICAgKTtcbiAgfVxuXG4gIHVucmVnaXN0ZXJTaGFwZXMoc2hhcGVzOiBBcnJheTxJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT4+KTogdm9pZCB7XG4gICAgdGhpcy5yZWdpc3RlcmVkU2hhcGVzU3ViamVjdC5uZXh0KFxuICAgICAgdGhpcy5nZXRDdXJyZW50UmVnaXN0ZXJlZFNoYXBlcygpLmZpbHRlcihzaGFwZSA9PiBzaGFwZXMuaW5kZXhPZihzaGFwZSkgPT09IC0xKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==