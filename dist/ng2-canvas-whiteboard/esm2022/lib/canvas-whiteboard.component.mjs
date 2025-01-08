import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CanvasWhiteboardUpdate, CanvasWhiteboardUpdateType } from './canvas-whiteboard-update.model';
import { DEFAULT_STYLES } from './template';
import { CanvasWhiteboardPoint } from './canvas-whiteboard-point.model';
import { CanvasWhiteboardShapeOptions } from './shapes/canvas-whiteboard-shape-options';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { cloneDeep, isEqual } from 'lodash-es';
import * as i0 from "@angular/core";
import * as i1 from "./canvas-whiteboard.service";
import * as i2 from "./shapes/canvas-whiteboard-shape.service";
import * as i3 from "@angular/common";
import * as i4 from "./canvas-whiteboard-colorpicker.component";
import * as i5 from "./shapes/canvas-whiteboard-shape-selector.component";
export class CanvasWhiteboardComponent {
    set imageUrl(imageUrl) {
        this._imageUrl = imageUrl;
        this._imageElement = null;
        this._redrawHistory();
    }
    get imageUrl() {
        return this._imageUrl;
    }
    constructor(ngZone, changeDetectorRef, canvasWhiteboardService, canvasWhiteboardShapeService) {
        this.ngZone = ngZone;
        this.changeDetectorRef = changeDetectorRef;
        this.canvasWhiteboardService = canvasWhiteboardService;
        this.canvasWhiteboardShapeService = canvasWhiteboardShapeService;
        // Number of ms to wait before sending out the updates as an array
        this.batchUpdateTimeoutDuration = 100;
        this.drawButtonText = '';
        this.clearButtonText = '';
        this.undoButtonText = '';
        this.redoButtonText = '';
        this.saveDataButtonText = '';
        this.strokeColorPickerText = 'Stroke';
        this.fillColorPickerText = 'Fill';
        this.drawButtonEnabled = true;
        this.clearButtonEnabled = true;
        this.undoButtonEnabled = false;
        this.redoButtonEnabled = false;
        this.saveDataButtonEnabled = false;
        this.shouldDownloadDrawing = true;
        /** @deprecated. Replaced with strokeColorPickerEnabled and fillColorPickerEnabled inputs */
        this.colorPickerEnabled = false;
        this.strokeColorPickerEnabled = false;
        this.fillColorPickerEnabled = false;
        this.lineWidth = 2;
        this.strokeColor = 'rgba(0, 0, 0, 1)';
        this.startingColor = '#fff';
        this.scaleFactor = 0;
        this.drawingEnabled = false;
        this.showStrokeColorPicker = false;
        this.showFillColorPicker = false;
        this.lineJoin = 'round';
        this.lineCap = 'round';
        this.shapeSelectorEnabled = true;
        this.showShapeSelector = false;
        this.fillColor = 'rgba(0,0,0,0)';
        this.onClear = new EventEmitter();
        this.onUndo = new EventEmitter();
        this.onRedo = new EventEmitter();
        this.onBatchUpdate = new EventEmitter();
        this.onImageLoaded = new EventEmitter();
        this.onSave = new EventEmitter();
        this._canDraw = true;
        this._clientDragging = false;
        this._updateHistory = [];
        this._undoStack = []; // Stores the value of start and count for each continuous stroke
        this._redoStack = [];
        this._batchUpdates = [];
        this._updatesNotDrawn = [];
        this._canvasWhiteboardServiceSubscriptions = [];
        this._shapesMap = new Map();
        this._incompleteShapesMap = new Map();
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
    }
    /**
     * Initialize the canvas drawing context. If we have an aspect ratio set up, the canvas will resize
     * according to the aspect ratio.
     */
    ngOnInit() {
        this._initInputsFromOptions(this.options);
        this._initCanvasEventListeners();
        this._initCanvasServiceObservables();
        this.context = this.canvas.nativeElement.getContext('2d');
        this._incompleteShapesCanvasContext = this._incompleteShapesCanvas.nativeElement.getContext('2d');
    }
    /**
     * If an image exists and it's url changes, we need to redraw the new image on the canvas.
     */
    ngOnChanges(changes) {
        if (changes.options && !isEqual(changes.options.currentValue, changes.options.previousValue)) {
            this._initInputsFromOptions(changes.options.currentValue);
        }
    }
    /**
     * Recalculate the width and height of the canvas after the view has been fully initialized
     */
    ngAfterViewInit() {
        this._calculateCanvasWidthAndHeight();
        this._redrawHistory();
    }
    /**
     * This method reads the options which are helpful since they can be really long when specified in HTML
     * This method is also called everytime the options object changes
     * For security reasons we must check each item on its own since if we iterate the keys
     * we may be injected with malicious values
     *
     * @param options
     */
    _initInputsFromOptions(options) {
        if (options) {
            if (!this._isNullOrUndefined(options.batchUpdateTimeoutDuration)) {
                this.batchUpdateTimeoutDuration = options.batchUpdateTimeoutDuration;
            }
            if (!this._isNullOrUndefined(options.imageUrl)) {
                this.imageUrl = options.imageUrl;
            }
            if (!this._isNullOrUndefined(options.aspectRatio)) {
                this.aspectRatio = options.aspectRatio;
            }
            if (!this._isNullOrUndefined(options.drawButtonClass)) {
                this.drawButtonClass = options.drawButtonClass;
            }
            if (!this._isNullOrUndefined(options.clearButtonClass)) {
                this.clearButtonClass = options.clearButtonClass;
            }
            if (!this._isNullOrUndefined(options.undoButtonClass)) {
                this.undoButtonClass = options.undoButtonClass;
            }
            if (!this._isNullOrUndefined(options.redoButtonClass)) {
                this.redoButtonClass = options.redoButtonClass;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonClass)) {
                this.saveDataButtonClass = options.saveDataButtonClass;
            }
            if (!this._isNullOrUndefined(options.drawButtonText)) {
                this.drawButtonText = options.drawButtonText;
            }
            if (!this._isNullOrUndefined(options.clearButtonText)) {
                this.clearButtonText = options.clearButtonText;
            }
            if (!this._isNullOrUndefined(options.undoButtonText)) {
                this.undoButtonText = options.undoButtonText;
            }
            if (!this._isNullOrUndefined(options.redoButtonText)) {
                this.redoButtonText = options.redoButtonText;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonText)) {
                this.saveDataButtonText = options.saveDataButtonText;
            }
            if (!this._isNullOrUndefined(options.strokeColorPickerText)) {
                this.strokeColorPickerText = options.strokeColorPickerText;
            }
            if (!this._isNullOrUndefined(options.fillColorPickerText)) {
                this.fillColorPickerText = options.fillColorPickerText;
            }
            if (!this._isNullOrUndefined(options.drawButtonEnabled)) {
                this.drawButtonEnabled = options.drawButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.clearButtonEnabled)) {
                this.clearButtonEnabled = options.clearButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.undoButtonEnabled)) {
                this.undoButtonEnabled = options.undoButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.redoButtonEnabled)) {
                this.redoButtonEnabled = options.redoButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.saveDataButtonEnabled)) {
                this.saveDataButtonEnabled = options.saveDataButtonEnabled;
            }
            if (!this._isNullOrUndefined(options.colorPickerEnabled)) {
                this.colorPickerEnabled = options.colorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.strokeColorPickerEnabled)) {
                this.strokeColorPickerEnabled = options.strokeColorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.fillColorPickerEnabled)) {
                this.fillColorPickerEnabled = options.fillColorPickerEnabled;
            }
            if (!this._isNullOrUndefined(options.lineWidth)) {
                this.lineWidth = options.lineWidth;
            }
            if (!this._isNullOrUndefined(options.strokeColor)) {
                this.strokeColor = options.strokeColor;
            }
            if (!this._isNullOrUndefined(options.shouldDownloadDrawing)) {
                this.shouldDownloadDrawing = options.shouldDownloadDrawing;
            }
            if (!this._isNullOrUndefined(options.startingColor)) {
                this.startingColor = options.startingColor;
            }
            if (!this._isNullOrUndefined(options.scaleFactor)) {
                this.scaleFactor = options.scaleFactor;
            }
            if (!this._isNullOrUndefined(options.drawingEnabled)) {
                this.drawingEnabled = options.drawingEnabled;
            }
            if (!this._isNullOrUndefined(options.downloadedFileName)) {
                this.downloadedFileName = options.downloadedFileName;
            }
            if (!this._isNullOrUndefined(options.lineJoin)) {
                this.lineJoin = options.lineJoin;
            }
            if (!this._isNullOrUndefined(options.lineCap)) {
                this.lineCap = options.lineCap;
            }
            if (!this._isNullOrUndefined(options.shapeSelectorEnabled)) {
                this.shapeSelectorEnabled = options.shapeSelectorEnabled;
            }
            if (!this._isNullOrUndefined(options.showShapeSelector)) {
                this.showShapeSelector = options.showShapeSelector;
            }
            if (!this._isNullOrUndefined(options.fillColor)) {
                this.fillColor = options.fillColor;
            }
            if (!this._isNullOrUndefined(options.showStrokeColorPicker)) {
                this.showStrokeColorPicker = options.showStrokeColorPicker;
            }
            if (!this._isNullOrUndefined(options.showFillColorPicker)) {
                this.showFillColorPicker = options.showFillColorPicker;
            }
        }
    }
    _isNullOrUndefined(property) {
        return property === null || property === undefined;
    }
    /**
     * Init global window listeners like resize and keydown
     */
    _initCanvasEventListeners() {
        this.ngZone.runOutsideAngular(() => {
            this._resizeSubscription = fromEvent(window, 'resize')
                .pipe(debounceTime(200), distinctUntilChanged())
                .subscribe(() => {
                this.ngZone.run(() => {
                    this._redrawCanvasOnResize();
                });
            });
        });
        window.addEventListener('keydown', this._canvasKeyDown.bind(this), false);
    }
    /**
     * Subscribes to new signals in the canvas whiteboard service and executes methods accordingly
     * Because of circular publishing and subscribing, the canvas methods do not use the service when
     * local actions are completed (Ex. clicking undo from the button inside this component)
     */
    _initCanvasServiceObservables() {
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasDrawSubject$
            .subscribe(updates => this.drawUpdates(updates)));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasClearSubject$
            .subscribe(() => this.clearCanvas()));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasUndoSubject$
            .subscribe((updateUUD) => this._undoCanvas(updateUUD)));
        this._canvasWhiteboardServiceSubscriptions.push(this.canvasWhiteboardService.canvasRedoSubject$
            .subscribe((updateUUD) => this._redoCanvas(updateUUD)));
        this._registeredShapesSubscription = this.canvasWhiteboardShapeService.registeredShapes$.subscribe((shapes) => {
            if (!this.selectedShapeConstructor || !this.canvasWhiteboardShapeService.isRegisteredShape(this.selectedShapeConstructor)) {
                this.selectedShapeConstructor = shapes[0];
            }
        });
    }
    /**
     * Calculate the canvas width and height from it's parent container width and height (use aspect ratio if needed)
     */
    _calculateCanvasWidthAndHeight() {
        this.context.canvas.width = this.canvas.nativeElement.parentNode.clientWidth;
        if (this.aspectRatio) {
            this.context.canvas.height = this.canvas.nativeElement.parentNode.clientWidth * this.aspectRatio;
        }
        else {
            this.context.canvas.height = this.canvas.nativeElement.parentNode.clientHeight;
        }
        this._incompleteShapesCanvasContext.canvas.width = this.context.canvas.width;
        this._incompleteShapesCanvasContext.canvas.height = this.context.canvas.height;
    }
    /**
     * Load an image and draw it on the canvas (if an image exists)
     * @param callbackFn A function that is called after the image loading is finished
     * @return Emits a value when the image has been loaded.
     */
    _loadImage(callbackFn) {
        this._canDraw = false;
        // If we already have the image there is no need to acquire it
        if (this._imageElement) {
            this._canDraw = true;
            callbackFn && callbackFn();
            return;
        }
        this._imageElement = new Image();
        this._imageElement.addEventListener('load', () => {
            this._canDraw = true;
            callbackFn && callbackFn();
            this.onImageLoaded.emit(true);
        });
        this._imageElement.src = this.imageUrl;
    }
    /**
     * Sends a notification after clearing the canvas
     * This method should only be called from the clear button in this component since it will emit an clear event
     * If the client calls this method he may create a circular clear action which may cause danger.
     */
    clearCanvasLocal() {
        this.clearCanvas();
        this.onClear.emit(true);
    }
    /**
     * Clears all content on the canvas.
     */
    clearCanvas() {
        this._removeCanvasData();
        this._redoStack = [];
    }
    /**
     * This method resets the state of the canvas and redraws it.
     * It calls a callback function after redrawing
     * @param callbackFn
     */
    _removeCanvasData(callbackFn) {
        this._shapesMap = new Map();
        this._clientDragging = false;
        this._updateHistory = [];
        this._undoStack = [];
        this._redrawBackground(callbackFn);
    }
    /**
     * Clears the canvas and redraws the image if the url exists.
     * @param callbackFn A function that is called after the background is redrawn
     * @return Emits a value when the clearing is finished
     */
    _redrawBackground(callbackFn) {
        if (this.context) {
            if (this.imageUrl) {
                this._loadImage(() => {
                    this.context.save();
                    this._drawImage(this.context, this._imageElement, 0, 0, this.context.canvas.width, this.context.canvas.height, 0.5, 0.5);
                    this.context.restore();
                    this._drawMissingUpdates();
                    callbackFn && callbackFn();
                });
            }
            else {
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                this._drawStartingColor();
                callbackFn && callbackFn();
            }
        }
    }
    _drawStartingColor() {
        const previousFillStyle = this.context.fillStyle;
        this.context.save();
        this.context.fillStyle = this.startingColor;
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillStyle = previousFillStyle;
        this.context.restore();
    }
    /**
     * @deprecated Use getDrawingEnabled(): boolean
     */
    getShouldDraw() {
        return this.getDrawingEnabled();
    }
    /**
     * Returns a value of whether the user clicked the draw button on the canvas.
     */
    getDrawingEnabled() {
        return this.drawingEnabled;
    }
    /**
     * Toggles drawing on the canvas. It is called via the draw button on the canvas.
     */
    toggleDrawingEnabled() {
        this.drawingEnabled = !this.drawingEnabled;
    }
    /**
     * Set if drawing is enabled from the client using the canvas
     * @param drawingEnabled
     */
    setDrawingEnabled(drawingEnabled) {
        this.drawingEnabled = drawingEnabled;
    }
    /**
     * @deprecated Please use the changeStrokeColor(newStrokeColor: string): void method
     */
    changeColor(newStrokeColor) {
        this.changeStrokeColor(newStrokeColor);
    }
    /**
     * Replaces the drawing color with a new color
     * The format should be ("#ffffff" or "rgb(r,g,b,a?)")
     * This method is public so that anyone can access the canvas and change the stroke color
     *
     * @param newStrokeColor The new stroke color
     */
    changeStrokeColor(newStrokeColor) {
        this.strokeColor = newStrokeColor;
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Replaces the fill color with a new color
     * The format should be ("#ffffff" or "rgb(r,g,b,a?)")
     * This method is public so that anyone can access the canvas and change the fill color
     *
     * @param newFillColor The new fill color
     */
    changeFillColor(newFillColor) {
        this.fillColor = newFillColor;
        this.canvasWhiteboardShapePreviewOptions = this.generateShapePreviewOptions();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * This method is invoked by the undo button on the canvas screen
     * It calls the global undo method and emits a notification after undoing.
     * This method should only be called from the undo button in this component since it will emit an undo event
     * If the client calls this method he may create a circular undo action which may cause danger.
     */
    undoLocal() {
        this.undo((updateUUID) => {
            this._redoStack.push(updateUUID);
            this.onUndo.emit(updateUUID);
        });
    }
    /**
     * This methods selects the last uuid prepares it for undoing (making the whole update sequence invisible)
     * This method can be called if the canvas component is a ViewChild of some other component.
     * This method will work even if the undo button has been disabled
     */
    undo(callbackFn) {
        if (!this._undoStack.length) {
            return;
        }
        const updateUUID = this._undoStack.pop();
        this._undoCanvas(updateUUID);
        callbackFn && callbackFn(updateUUID);
    }
    /**
     * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid invisible
     * @param updateUUID
     */
    _undoCanvas(updateUUID) {
        if (this._shapesMap.has(updateUUID)) {
            const shape = this._shapesMap.get(updateUUID);
            shape.isVisible = false;
            this.drawAllShapes();
        }
    }
    /**
     * This method is invoked by the redo button on the canvas screen
     * It calls the global redo method and emits a notification after redoing
     * This method should only be called from the redo button in this component since it will emit an redo event
     * If the client calls this method he may create a circular redo action which may cause danger.
     */
    redoLocal() {
        this.redo((updateUUID) => {
            this._undoStack.push(updateUUID);
            this.onRedo.emit(updateUUID);
        });
    }
    /**
     * This methods selects the last uuid prepares it for redoing (making the whole update sequence visible)
     * This method can be called if the canvas component is a ViewChild of some other component.
     * This method will work even if the redo button has been disabled
     */
    redo(callbackFn) {
        if (!this._redoStack.length) {
            return;
        }
        const updateUUID = this._redoStack.pop();
        this._redoCanvas(updateUUID);
        callbackFn && callbackFn(updateUUID);
    }
    /**
     * This method takes an UUID for an update, and redraws the canvas by making all updates with that uuid visible
     * @param updateUUID
     */
    _redoCanvas(updateUUID) {
        if (this._shapesMap.has(updateUUID)) {
            const shape = this._shapesMap.get(updateUUID);
            shape.isVisible = true;
            this.drawAllShapes();
        }
    }
    /**
     * Catches the Mouse and Touch events made on the canvas.
     * If drawing is disabled (If an image exists but it's not loaded, or the user did not click Draw),
     * this function does nothing.
     *
     * If a "mousedown | touchstart" event is triggered, dragging will be set to true and an CanvasWhiteboardUpdate object
     * of type "start" will be drawn and then sent as an update to all receiving ends.
     *
     * If a "mousemove | touchmove" event is triggered and the client is dragging, an CanvasWhiteboardUpdate object
     * of type "drag" will be drawn and then sent as an update to all receiving ends.
     *
     * If a "mouseup, mouseout | touchend, touchcancel" event is triggered, dragging will be set to false and
     * an CanvasWhiteboardUpdate object of type "stop" will be drawn and then sent as an update to all receiving ends.
     *
     */
    canvasUserEvents(event) {
        // Ignore all if we didn't click the _draw! button or the image did not load
        if (!this.drawingEnabled || !this._canDraw) {
            return;
        }
        // Ignore mouse move Events if we're not dragging
        if (!this._clientDragging
            && (event.type === 'mousemove'
                || event.type === 'touchmove'
                || event.type === 'mouseout'
                || event.type === 'touchcancel'
                || event.type === 'mouseup'
                || event.type === 'touchend'
                || event.type === 'mouseout')) {
            return;
        }
        if (event.target == this._incompleteShapesCanvas.nativeElement || event.target == this.canvas.nativeElement) {
            event.preventDefault();
        }
        let update;
        let updateType;
        const eventPosition = this._getCanvasEventPosition(event);
        update = new CanvasWhiteboardUpdate(eventPosition.x, eventPosition.y);
        switch (event.type) {
            case 'mousedown':
            case 'touchstart':
                this._clientDragging = true;
                this._lastUUID = this._generateUUID();
                updateType = CanvasWhiteboardUpdateType.START;
                this._redoStack = [];
                this._addCurrentShapeDataToAnUpdate(update);
                break;
            case 'mousemove':
            case 'touchmove':
                if (!this._clientDragging) {
                    return;
                }
                updateType = CanvasWhiteboardUpdateType.DRAG;
                break;
            case 'touchcancel':
            case 'mouseup':
            case 'touchend':
            case 'mouseout':
                this._clientDragging = false;
                updateType = CanvasWhiteboardUpdateType.STOP;
                this._undoStack.push(this._lastUUID);
                break;
        }
        update.UUID = this._lastUUID;
        update.type = updateType;
        this._draw(update);
        this._prepareToSendUpdate(update);
    }
    /**
     * Get the coordinates (x,y) from a given event
     * If it is a touch event, get the touch positions
     * If we released the touch, the position will be placed in the changedTouches object
     * If it is not a touch event, use the original mouse event received
     * @param eventData
     */
    _getCanvasEventPosition(eventData) {
        const canvasBoundingRect = this.context.canvas.getBoundingClientRect();
        let hasTouches = (eventData.touches && eventData.touches.length) ? eventData.touches[0] : null;
        if (!hasTouches) {
            hasTouches = (eventData.changedTouches && eventData.changedTouches.length) ? eventData.changedTouches[0] : null;
        }
        const event = hasTouches ? hasTouches : eventData;
        const scaleWidth = canvasBoundingRect.width / this.context.canvas.width;
        const scaleHeight = canvasBoundingRect.height / this.context.canvas.height;
        let xPosition = (event.clientX - canvasBoundingRect.left);
        let yPosition = (event.clientY - canvasBoundingRect.top);
        xPosition /= this.scaleFactor ? this.scaleFactor : scaleWidth;
        yPosition /= this.scaleFactor ? this.scaleFactor : scaleHeight;
        return new CanvasWhiteboardPoint(xPosition / this.context.canvas.width, yPosition / this.context.canvas.height);
    }
    /**
     * The update coordinates on the canvas are mapped so that all receiving ends
     * can reverse the mapping and get the same position as the one that
     * was drawn on this update.
     *
     * @param update The CanvasWhiteboardUpdate object.
     */
    _prepareToSendUpdate(update) {
        this._prepareUpdateForBatchDispatch(update);
    }
    /**
     * Catches the Key Up events made on the canvas.
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 90 (z), an undo action will be performed
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 89 (y), a redo action will be performed
     * If the ctrlKey or commandKey(macOS) was held and the keyCode is 83 (s) or 115(S), a save action will be performed
     *
     * @param event The event that occurred.
     */
    _canvasKeyDown(event) {
        if (event.ctrlKey || event.metaKey) {
            if (event.keyCode === 90 && this.undoButtonEnabled) {
                event.preventDefault();
                this.undo();
            }
            if (event.keyCode === 89 && this.redoButtonEnabled) {
                event.preventDefault();
                this.redo();
            }
            if (event.keyCode === 83 || event.keyCode === 115) {
                event.preventDefault();
                this.saveLocal();
            }
        }
    }
    /**
     * On window resize, recalculate the canvas dimensions and redraw the history
     */
    _redrawCanvasOnResize() {
        this._calculateCanvasWidthAndHeight();
        this._redrawHistory();
    }
    /**
     * Redraw the saved history after resetting the canvas state
     */
    _redrawHistory() {
        const updatesToDraw = [].concat(this._updateHistory);
        this._removeCanvasData(() => {
            updatesToDraw.forEach((update) => {
                this._draw(update);
            });
        });
    }
    /**
     * Draws a CanvasWhiteboardUpdate object on the canvas.
     * The coordinates are first reverse mapped so that they can be drawn in the proper place. The update
     * is afterwards added to the undoStack so that it can be
     *
     * If the CanvasWhiteboardUpdate Type is "start", a new "selectedShape" is created.
     * If the CanvasWhiteboardUpdate Type is "drag", the shape is taken from the shapesMap and then it's updated.
     * Afterwards the context is used to draw the shape on the canvas.
     * This function saves the last X and Y coordinates that were drawn.
     *
     * @param update The update object.
     */
    _draw(update) {
        this._updateHistory.push(update);
        // map the canvas coordinates to our canvas size since they are scaled.
        update = Object.assign(new CanvasWhiteboardUpdate(), update, {
            x: update.x * this.context.canvas.width,
            y: update.y * this.context.canvas.height
        });
        if (update.type === CanvasWhiteboardUpdateType.START) {
            const updateShapeConstructor = this.canvasWhiteboardShapeService.getShapeConstructorFromShapeName(update.selectedShape);
            const shape = new updateShapeConstructor(new CanvasWhiteboardPoint(update.x, update.y), Object.assign(new CanvasWhiteboardShapeOptions(), update.selectedShapeOptions));
            this._incompleteShapesMap.set(update.UUID, shape);
            this._drawIncompleteShapes();
        }
        else if (update.type === CanvasWhiteboardUpdateType.DRAG) {
            const shape = this._incompleteShapesMap.get(update.UUID);
            shape && shape.onUpdateReceived(update);
            this._drawIncompleteShapes();
        }
        else if (CanvasWhiteboardUpdateType.STOP) {
            const shape = this._incompleteShapesMap.get(update.UUID);
            shape && shape.onStopReceived(update);
            this._shapesMap.set(update.UUID, shape);
            this._incompleteShapesMap.delete(update.UUID);
            this._swapCompletedShapeToActualCanvas(shape);
        }
    }
    _drawIncompleteShapes() {
        this._resetIncompleteShapeCanvas();
        this._incompleteShapesMap.forEach((shape) => {
            if (shape.isVisible) {
                shape.draw(this._incompleteShapesCanvasContext);
            }
        });
    }
    _swapCompletedShapeToActualCanvas(shape) {
        this._drawIncompleteShapes();
        if (shape.isVisible) {
            shape.draw(this.context);
        }
    }
    _resetIncompleteShapeCanvas() {
        this._incompleteShapesCanvasContext.clearRect(0, 0, this._incompleteShapesCanvasContext.canvas.width, this._incompleteShapesCanvasContext.canvas.height);
        this._incompleteShapesCanvasContext.fillStyle = 'transparent';
        this._incompleteShapesCanvasContext.fillRect(0, 0, this._incompleteShapesCanvasContext.canvas.width, this._incompleteShapesCanvasContext.canvas.height);
    }
    /**
     * Delete everything from the screen, redraw the background, and then redraw all the shapes from the shapesMap
     */
    drawAllShapes() {
        this._redrawBackground(() => {
            this._shapesMap.forEach((shape) => {
                if (shape.isVisible) {
                    shape.draw(this.context);
                }
            });
        });
    }
    _addCurrentShapeDataToAnUpdate(update) {
        if (!update.selectedShape) {
            update.selectedShape = (new this.selectedShapeConstructor).getShapeName();
        }
        if (!update.selectedShapeOptions) {
            // Make a deep copy since we don't want some Shape implementation to change something by accident
            update.selectedShapeOptions = Object.assign(new CanvasWhiteboardShapeOptions(), this.generateShapePreviewOptions(), { lineWidth: this.lineWidth });
        }
    }
    generateShapePreviewOptions() {
        return Object.assign(new CanvasWhiteboardShapeOptions(), {
            shouldFillShape: !!this.fillColor,
            fillStyle: this.fillColor,
            strokeStyle: this.strokeColor,
            lineWidth: 2,
            lineJoin: this.lineJoin,
            lineCap: this.lineCap
        });
    }
    /**
     * Sends the update to all receiving ends as an Event emit. This is done as a batch operation (meaning
     * multiple updates are sent at the same time). If this method is called, after 100 ms all updates
     * that were made at that time will be packed up together and sent to the receiver.
     *
     * @param update The update object.
     * @return Emits an Array of Updates when the batch.
     */
    _prepareUpdateForBatchDispatch(update) {
        this._batchUpdates.push(cloneDeep(update));
        if (!this._updateTimeout) {
            this._updateTimeout = setTimeout(() => {
                this.onBatchUpdate.emit(this._batchUpdates);
                this._batchUpdates = [];
                this._updateTimeout = null;
            }, this.batchUpdateTimeoutDuration);
        }
    }
    /**
     * Draws an Array of Updates on the canvas.
     *
     * @param updates The array with Updates.
     */
    drawUpdates(updates) {
        if (this._canDraw) {
            this._drawMissingUpdates();
            updates.forEach((update) => {
                this._draw(update);
            });
        }
        else {
            this._updatesNotDrawn = this._updatesNotDrawn.concat(updates);
        }
    }
    /**
     * Draw any missing updates that were received before the image was loaded
     */
    _drawMissingUpdates() {
        if (this._updatesNotDrawn.length > 0) {
            const updatesToDraw = this._updatesNotDrawn;
            this._updatesNotDrawn = [];
            updatesToDraw.forEach((update) => {
                this._draw(update);
            });
        }
    }
    /**
     * Draws an image on the canvas
     *
     * @param context The context used to draw the image on the canvas.
     * @param image The image to draw.
     * @param x The X coordinate for the starting draw position.
     * @param y The Y coordinate for the starting draw position.
     * @param width The width of the image that will be drawn.
     * @param height The height of the image that will be drawn.
     * @param offsetX The offsetX if the image size is larger than the canvas (aspect Ratio)
     * @param offsetY The offsetY if the image size is larger than the canvas (aspect Ratio)
     */
    _drawImage(context, image, x, y, width, height, offsetX, offsetY) {
        if (arguments.length === 2) {
            x = y = 0;
            width = context.canvas.width;
            height = context.canvas.height;
        }
        offsetX = typeof offsetX === 'number' ? offsetX : 0.5;
        offsetY = typeof offsetY === 'number' ? offsetY : 0.5;
        if (offsetX < 0) {
            offsetX = 0;
        }
        if (offsetY < 0) {
            offsetY = 0;
        }
        if (offsetX > 1) {
            offsetX = 1;
        }
        if (offsetY > 1) {
            offsetY = 1;
        }
        const imageWidth = image.width;
        const imageHeight = image.height;
        const radius = Math.min(width / imageWidth, height / imageHeight);
        let newWidth = imageWidth * radius;
        let newHeight = imageHeight * radius;
        let finalDrawX;
        let finalDrawY;
        let finalDrawWidth;
        let finalDrawHeight;
        let aspectRatio = 1;
        // decide which gap to fill
        if (newWidth < width) {
            aspectRatio = width / newWidth;
        }
        if (Math.abs(aspectRatio - 1) < 1e-14 && newHeight < height) {
            aspectRatio = height / newHeight;
        }
        newWidth *= aspectRatio;
        newHeight *= aspectRatio;
        // calculate source rectangle
        finalDrawWidth = imageWidth / (newWidth / width);
        finalDrawHeight = imageHeight / (newHeight / height);
        finalDrawX = (imageWidth - finalDrawWidth) * offsetX;
        finalDrawY = (imageHeight - finalDrawHeight) * offsetY;
        // make sure the source rectangle is valid
        if (finalDrawX < 0) {
            finalDrawX = 0;
        }
        if (finalDrawY < 0) {
            finalDrawY = 0;
        }
        if (finalDrawWidth > imageWidth) {
            finalDrawWidth = imageWidth;
        }
        if (finalDrawHeight > imageHeight) {
            finalDrawHeight = imageHeight;
        }
        // fill the image in destination rectangle
        context.drawImage(image, finalDrawX, finalDrawY, finalDrawWidth, finalDrawHeight, x, y, width, height);
    }
    /**
     * The HTMLCanvasElement.toDataURL() method returns a data URI containing a representation of the image in the format specified by the type parameter (defaults to PNG).
     * The returned image is in a resolution of 96 dpi.
     * If the height or width of the canvas is 0, the string "data:," is returned.
     * If the requested type is not image/png, but the returned value starts with data:image/png, then the requested type is not supported.
     * Chrome also supports the image/webp type.
     *
     * @param returnedDataType A DOMString indicating the image format. The default format type is image/png.
     * @param returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
     If this argument is anything else, the default value for image quality is used. The default value is 0.92. Other arguments are ignored.
     */
    generateCanvasDataUrl(returnedDataType = 'image/png', returnedDataQuality = 1) {
        return this.context.canvas.toDataURL(returnedDataType, returnedDataQuality);
    }
    /**
     * Generate a Blob object representing the content drawn on the canvas.
     * This file may be cached on the disk or stored in memory at the discretion of the user agent.
     * If type is not specified, the image type is image/png. The created image is in a resolution of 96dpi.
     * The third argument is used with image/jpeg images to specify the quality of the output.
     *
     * @param callbackFn The function that should be executed when the blob is created. Should accept a parameter Blob (for the result).
     * @param returnedDataType A DOMString indicating the image format. The default type is image/png.
     * @param returnedDataQuality A Number between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
     If this argument is anything else, the default value for image quality is used. Other arguments are ignored.
     */
    generateCanvasBlob(callbackFn, returnedDataType = 'image/png', returnedDataQuality = 1) {
        let toBlobMethod;
        if (typeof this.context.canvas.toBlob !== 'undefined') {
            toBlobMethod = this.context.canvas.toBlob.bind(this.context.canvas);
        }
        else if (typeof this.context.canvas.msToBlob !== 'undefined') {
            // For IE
            toBlobMethod = (callback) => {
                callback && callback(this.context.canvas.msToBlob());
            };
        }
        toBlobMethod && toBlobMethod((blob) => {
            callbackFn && callbackFn(blob, returnedDataType);
        }, returnedDataType, returnedDataQuality);
    }
    /**
     * Generate a canvas image representation and download it locally
     * The name of the image is canvas_drawing_ + the current local Date and Time the image was created
     * Methods for standalone creation of the images in this method are left here for backwards compatibility
     *
     * @param returnedDataType A DOMString indicating the image format. The default type is image/png.
     * @param downloadData? The created string or Blob (IE).
     * @param customFileName? The name of the file that should be downloaded
     */
    downloadCanvasImage(returnedDataType = 'image/png', downloadData, customFileName) {
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob === undefined) {
            const downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', downloadData ? downloadData : this.generateCanvasDataUrl(returnedDataType));
            const fileName = customFileName ? customFileName
                : (this.downloadedFileName ? this.downloadedFileName : 'canvas_drawing_' + new Date().valueOf());
            downloadLink.setAttribute('download', fileName + this._generateDataTypeString(returnedDataType));
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        else {
            // IE-specific code
            if (downloadData) {
                this._saveCanvasBlob(downloadData, returnedDataType);
            }
            else {
                this.generateCanvasBlob(this._saveCanvasBlob.bind(this), returnedDataType);
            }
        }
    }
    /**
     * Save the canvas blob (IE) locally
     * @param blob
     * @param returnedDataType
     */
    _saveCanvasBlob(blob, returnedDataType = 'image/png') {
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, 'canvas_drawing_' +
            new Date().valueOf() + this._generateDataTypeString(returnedDataType));
    }
    /**
     * This method generates a canvas url string or a canvas blob with the presented data type
     * A callback function is then invoked since the blob creation must be done via a callback
     *
     * @param callback
     * @param returnedDataType
     * @param returnedDataQuality
     */
    generateCanvasData(callback, returnedDataType = 'image/png', returnedDataQuality = 1) {
        // @ts-ignore
        if (window.navigator.msSaveOrOpenBlob === undefined) {
            // tslint:disable-next-line:no-unused-expression
            callback && callback(this.generateCanvasDataUrl(returnedDataType, returnedDataQuality));
        }
        else {
            this.generateCanvasBlob(callback, returnedDataType, returnedDataQuality);
        }
    }
    /**
     * Local method to invoke saving of the canvas data when clicked on the canvas Save button
     * This method will emit the generated data with the specified Event Emitter
     *
     * @param returnedDataType
     */
    saveLocal(returnedDataType = 'image/png') {
        this.generateCanvasData((generatedData) => {
            this.onSave.emit(generatedData);
            if (this.shouldDownloadDrawing) {
                this.downloadCanvasImage(returnedDataType, generatedData);
            }
        });
    }
    _generateDataTypeString(returnedDataType) {
        if (returnedDataType) {
            return '.' + returnedDataType.split('/')[1];
        }
        return '';
    }
    /**
     * Toggles the color picker window, delegating the showColorPicker Input to the ColorPickerComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleStrokeColorPicker(value) {
        this.showStrokeColorPicker = !this._isNullOrUndefined(value) ? value : !this.showStrokeColorPicker;
    }
    /**
     * Toggles the color picker window, delegating the showColorPicker Input to the ColorPickerComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleFillColorPicker(value) {
        this.showFillColorPicker = !this._isNullOrUndefined(value) ? value : !this.showFillColorPicker;
    }
    /**
     * Toggles the shape selector window, delegating the showShapeSelector Input to the CanvasWhiteboardShapeSelectorComponent.
     * If no value is supplied (null/undefined) the current value will be negated and used.
     * @param value
     */
    toggleShapeSelector(value) {
        this.showShapeSelector = !this._isNullOrUndefined(value) ? value : !this.showShapeSelector;
    }
    selectShape(newShapeBlueprint) {
        this.selectedShapeConstructor = newShapeBlueprint;
    }
    /**
     * Returns a deep copy of the current drawing history for the canvas.
     * The deep copy is returned because we don't want anyone to mutate the current history
     */
    getDrawingHistory() {
        return cloneDeep(this._updateHistory);
    }
    /**
     * Unsubscribe from a given subscription if it is active
     * @param subscription
     */
    _unsubscribe(subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
    _generateUUID() {
        return this._random4() + this._random4() + '-' + this._random4() + '-' + this._random4() + '-' +
            this._random4() + '-' + this._random4() + this._random4() + this._random4();
    }
    _random4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    /**
     * Unsubscribe from the service observables
     */
    ngOnDestroy() {
        this._unsubscribe(this._resizeSubscription);
        this._unsubscribe(this._registeredShapesSubscription);
        this._canvasWhiteboardServiceSubscriptions.forEach(subscription => this._unsubscribe(subscription));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardComponent, deps: [{ token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i1.CanvasWhiteboardService }, { token: i2.CanvasWhiteboardShapeService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.13", type: CanvasWhiteboardComponent, selector: "canvas-whiteboard", inputs: { options: "options", batchUpdateTimeoutDuration: "batchUpdateTimeoutDuration", imageUrl: "imageUrl", aspectRatio: "aspectRatio", drawButtonClass: "drawButtonClass", clearButtonClass: "clearButtonClass", undoButtonClass: "undoButtonClass", redoButtonClass: "redoButtonClass", saveDataButtonClass: "saveDataButtonClass", drawButtonText: "drawButtonText", clearButtonText: "clearButtonText", undoButtonText: "undoButtonText", redoButtonText: "redoButtonText", saveDataButtonText: "saveDataButtonText", strokeColorPickerText: "strokeColorPickerText", fillColorPickerText: "fillColorPickerText", drawButtonEnabled: "drawButtonEnabled", clearButtonEnabled: "clearButtonEnabled", undoButtonEnabled: "undoButtonEnabled", redoButtonEnabled: "redoButtonEnabled", saveDataButtonEnabled: "saveDataButtonEnabled", shouldDownloadDrawing: "shouldDownloadDrawing", colorPickerEnabled: "colorPickerEnabled", strokeColorPickerEnabled: "strokeColorPickerEnabled", fillColorPickerEnabled: "fillColorPickerEnabled", lineWidth: "lineWidth", strokeColor: "strokeColor", startingColor: "startingColor", scaleFactor: "scaleFactor", drawingEnabled: "drawingEnabled", showStrokeColorPicker: "showStrokeColorPicker", showFillColorPicker: "showFillColorPicker", downloadedFileName: "downloadedFileName", lineJoin: "lineJoin", lineCap: "lineCap", shapeSelectorEnabled: "shapeSelectorEnabled", showShapeSelector: "showShapeSelector", fillColor: "fillColor" }, outputs: { onClear: "onClear", onUndo: "onUndo", onRedo: "onRedo", onBatchUpdate: "onBatchUpdate", onImageLoaded: "onImageLoaded", onSave: "onSave" }, viewQueries: [{ propertyName: "canvas", first: true, predicate: ["canvas"], descendants: true, static: true }, { propertyName: "_incompleteShapesCanvas", first: true, predicate: ["incompleteShapesCanvas"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <div class="canvas_wrapper_div">
      <div class="canvas_whiteboard_buttons">
        <canvas-whiteboard-shape-selector *ngIf="shapeSelectorEnabled"
                                          [showShapeSelector]="showShapeSelector"
                                          [selectedShapeConstructor]="selectedShapeConstructor"
                                          [shapeOptions]="generateShapePreviewOptions()"
                                          (onToggleShapeSelector)="toggleShapeSelector($event)"
                                          (onShapeSelected)="selectShape($event)"></canvas-whiteboard-shape-selector>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || fillColorPickerEnabled"
                                       [previewText]="fillColorPickerText"
                                       [showColorPicker]="showFillColorPicker"
                                       [selectedColor]="fillColor"
                                       (onToggleColorPicker)="toggleFillColorPicker($event)"
                                       (onColorSelected)="changeFillColor($event)">
        </canvas-whiteboard-colorpicker>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || strokeColorPickerEnabled"
                                       [previewText]="strokeColorPickerText"
                                       [showColorPicker]="showStrokeColorPicker"
                                       [selectedColor]="strokeColor"
                                       (onToggleColorPicker)="toggleStrokeColorPicker($event)"
                                       (onColorSelected)="changeStrokeColor($event)">
        </canvas-whiteboard-colorpicker>


        <button *ngIf="drawButtonEnabled" (click)="toggleDrawingEnabled()"
                [class.canvas_whiteboard_button-draw_animated]="getDrawingEnabled()"
                class="canvas_whiteboard_button canvas_whiteboard_button-draw" type="button">
          <i [class]="drawButtonClass" aria-hidden="true"></i> {{drawButtonText}}
        </button>

        <button *ngIf="clearButtonEnabled" (click)="clearCanvasLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-clear">
          <i [class]="clearButtonClass" aria-hidden="true"></i> {{clearButtonText}}
        </button>

        <button *ngIf="undoButtonEnabled" (click)="undoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-undo">
          <i [class]="undoButtonClass" aria-hidden="true"></i> {{undoButtonText}}
        </button>

        <button *ngIf="redoButtonEnabled" (click)="redoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-redo">
          <i [class]="redoButtonClass" aria-hidden="true"></i> {{redoButtonText}}
        </button>
        <button *ngIf="saveDataButtonEnabled" (click)="saveLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-save">
          <i [class]="saveDataButtonClass" aria-hidden="true"></i> {{saveDataButtonText}}
        </button>
      </div>
      <canvas #canvas class="canvas_whiteboard"></canvas>
      <canvas #incompleteShapesCanvas class="incomplete_shapes_canvas_whiteboard"
              (mousedown)="canvasUserEvents($event)" (mouseup)="canvasUserEvents($event)"
              (mousemove)="canvasUserEvents($event)" (mouseout)="canvasUserEvents($event)"
              (touchstart)="canvasUserEvents($event)" (touchmove)="canvasUserEvents($event)"
              (touchend)="canvasUserEvents($event)" (touchcancel)="canvasUserEvents($event)"></canvas>
    </div>
  `, isInline: true, styles: [".canvas_whiteboard_button{display:inline-block;outline:0px;padding-top:7px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.canvas_whiteboard_buttons{z-index:3}@media (max-width: 400px){.canvas_whiteboard_buttons{position:absolute;top:0;width:100%;text-align:center}}@media (min-width: 401px){.canvas_whiteboard_buttons{position:absolute;right:0%;color:#fff}}.canvas_whiteboard_buttons{padding:5px}.canvas_whiteboard_buttons>button{margin:5px}.canvas_whiteboard_button-draw_animated{-webkit-animation:pulsate 1s ease-out;-webkit-animation-iteration-count:infinite}@keyframes pulsate{0%{-webkit-transform:scale(.1,.1);opacity:0}50%{opacity:1}to{-webkit-transform:scale(1.2,1.2);opacity:0}}.canvas_wrapper_div{width:100%;height:100%;border:.5px solid #e2e2e2}.canvas_whiteboard_button-clear{padding-top:5px}.canvas_whiteboard{position:absolute;z-index:1}.incomplete_shapes_canvas_whiteboard{position:absolute;z-index:2}\n"], dependencies: [{ kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i4.CanvasWhiteboardColorPickerComponent, selector: "canvas-whiteboard-colorpicker", inputs: ["previewText", "selectedColor", "showColorPicker"], outputs: ["onToggleColorPicker", "onColorSelected", "onSecondaryColorSelected"] }, { kind: "component", type: i5.CanvasWhiteboardShapeSelectorComponent, selector: "canvas-whiteboard-shape-selector", inputs: ["showShapeSelector", "selectedShapeConstructor", "shapeOptions"], outputs: ["onToggleShapeSelector", "onShapeSelected"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CanvasWhiteboardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'canvas-whiteboard', template: `
    <div class="canvas_wrapper_div">
      <div class="canvas_whiteboard_buttons">
        <canvas-whiteboard-shape-selector *ngIf="shapeSelectorEnabled"
                                          [showShapeSelector]="showShapeSelector"
                                          [selectedShapeConstructor]="selectedShapeConstructor"
                                          [shapeOptions]="generateShapePreviewOptions()"
                                          (onToggleShapeSelector)="toggleShapeSelector($event)"
                                          (onShapeSelected)="selectShape($event)"></canvas-whiteboard-shape-selector>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || fillColorPickerEnabled"
                                       [previewText]="fillColorPickerText"
                                       [showColorPicker]="showFillColorPicker"
                                       [selectedColor]="fillColor"
                                       (onToggleColorPicker)="toggleFillColorPicker($event)"
                                       (onColorSelected)="changeFillColor($event)">
        </canvas-whiteboard-colorpicker>

        <canvas-whiteboard-colorpicker *ngIf="colorPickerEnabled || strokeColorPickerEnabled"
                                       [previewText]="strokeColorPickerText"
                                       [showColorPicker]="showStrokeColorPicker"
                                       [selectedColor]="strokeColor"
                                       (onToggleColorPicker)="toggleStrokeColorPicker($event)"
                                       (onColorSelected)="changeStrokeColor($event)">
        </canvas-whiteboard-colorpicker>


        <button *ngIf="drawButtonEnabled" (click)="toggleDrawingEnabled()"
                [class.canvas_whiteboard_button-draw_animated]="getDrawingEnabled()"
                class="canvas_whiteboard_button canvas_whiteboard_button-draw" type="button">
          <i [class]="drawButtonClass" aria-hidden="true"></i> {{drawButtonText}}
        </button>

        <button *ngIf="clearButtonEnabled" (click)="clearCanvasLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-clear">
          <i [class]="clearButtonClass" aria-hidden="true"></i> {{clearButtonText}}
        </button>

        <button *ngIf="undoButtonEnabled" (click)="undoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-undo">
          <i [class]="undoButtonClass" aria-hidden="true"></i> {{undoButtonText}}
        </button>

        <button *ngIf="redoButtonEnabled" (click)="redoLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-redo">
          <i [class]="redoButtonClass" aria-hidden="true"></i> {{redoButtonText}}
        </button>
        <button *ngIf="saveDataButtonEnabled" (click)="saveLocal()" type="button"
                class="canvas_whiteboard_button canvas_whiteboard_button-save">
          <i [class]="saveDataButtonClass" aria-hidden="true"></i> {{saveDataButtonText}}
        </button>
      </div>
      <canvas #canvas class="canvas_whiteboard"></canvas>
      <canvas #incompleteShapesCanvas class="incomplete_shapes_canvas_whiteboard"
              (mousedown)="canvasUserEvents($event)" (mouseup)="canvasUserEvents($event)"
              (mousemove)="canvasUserEvents($event)" (mouseout)="canvasUserEvents($event)"
              (touchstart)="canvasUserEvents($event)" (touchmove)="canvasUserEvents($event)"
              (touchend)="canvasUserEvents($event)" (touchcancel)="canvasUserEvents($event)"></canvas>
    </div>
  `, styles: [".canvas_whiteboard_button{display:inline-block;outline:0px;padding-top:7px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px}.canvas_whiteboard_buttons{z-index:3}@media (max-width: 400px){.canvas_whiteboard_buttons{position:absolute;top:0;width:100%;text-align:center}}@media (min-width: 401px){.canvas_whiteboard_buttons{position:absolute;right:0%;color:#fff}}.canvas_whiteboard_buttons{padding:5px}.canvas_whiteboard_buttons>button{margin:5px}.canvas_whiteboard_button-draw_animated{-webkit-animation:pulsate 1s ease-out;-webkit-animation-iteration-count:infinite}@keyframes pulsate{0%{-webkit-transform:scale(.1,.1);opacity:0}50%{opacity:1}to{-webkit-transform:scale(1.2,1.2);opacity:0}}.canvas_wrapper_div{width:100%;height:100%;border:.5px solid #e2e2e2}.canvas_whiteboard_button-clear{padding-top:5px}.canvas_whiteboard{position:absolute;z-index:1}.incomplete_shapes_canvas_whiteboard{position:absolute;z-index:2}\n"] }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i1.CanvasWhiteboardService }, { type: i2.CanvasWhiteboardShapeService }], propDecorators: { options: [{
                type: Input
            }], batchUpdateTimeoutDuration: [{
                type: Input
            }], imageUrl: [{
                type: Input
            }], aspectRatio: [{
                type: Input
            }], drawButtonClass: [{
                type: Input
            }], clearButtonClass: [{
                type: Input
            }], undoButtonClass: [{
                type: Input
            }], redoButtonClass: [{
                type: Input
            }], saveDataButtonClass: [{
                type: Input
            }], drawButtonText: [{
                type: Input
            }], clearButtonText: [{
                type: Input
            }], undoButtonText: [{
                type: Input
            }], redoButtonText: [{
                type: Input
            }], saveDataButtonText: [{
                type: Input
            }], strokeColorPickerText: [{
                type: Input
            }], fillColorPickerText: [{
                type: Input
            }], drawButtonEnabled: [{
                type: Input
            }], clearButtonEnabled: [{
                type: Input
            }], undoButtonEnabled: [{
                type: Input
            }], redoButtonEnabled: [{
                type: Input
            }], saveDataButtonEnabled: [{
                type: Input
            }], shouldDownloadDrawing: [{
                type: Input
            }], colorPickerEnabled: [{
                type: Input
            }], strokeColorPickerEnabled: [{
                type: Input
            }], fillColorPickerEnabled: [{
                type: Input
            }], lineWidth: [{
                type: Input
            }], strokeColor: [{
                type: Input
            }], startingColor: [{
                type: Input
            }], scaleFactor: [{
                type: Input
            }], drawingEnabled: [{
                type: Input
            }], showStrokeColorPicker: [{
                type: Input
            }], showFillColorPicker: [{
                type: Input
            }], downloadedFileName: [{
                type: Input
            }], lineJoin: [{
                type: Input
            }], lineCap: [{
                type: Input
            }], shapeSelectorEnabled: [{
                type: Input
            }], showShapeSelector: [{
                type: Input
            }], fillColor: [{
                type: Input
            }], onClear: [{
                type: Output
            }], onUndo: [{
                type: Output
            }], onRedo: [{
                type: Output
            }], onBatchUpdate: [{
                type: Output
            }], onImageLoaded: [{
                type: Output
            }], onSave: [{
                type: Output
            }], canvas: [{
                type: ViewChild,
                args: ['canvas', { static: true }]
            }], _incompleteShapesCanvas: [{
                type: ViewChild,
                args: ['incompleteShapesCanvas', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FudmFzLXdoaXRlYm9hcmQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmcyLWNhbnZhcy13aGl0ZWJvYXJkL3NyYy9saWIvY2FudmFzLXdoaXRlYm9hcmQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUlWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RHLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFJNUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFeEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDeEYsT0FBTyxFQUFFLFNBQVMsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFlBQVksRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7Ozs7O0FBbUUvQyxNQUFNLE9BQU8seUJBQXlCO0lBT3BDLElBQWEsUUFBUSxDQUFDLFFBQWdCO1FBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUE4RUQsWUFBb0IsTUFBYyxFQUNkLGlCQUFvQyxFQUNwQyx1QkFBZ0QsRUFDaEQsNEJBQTBEO1FBSDFELFdBQU0sR0FB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RSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBRzBCLHVCQUF1QjtzQkFBbkYsU0FBUzt1QkFBQyx3QkFBd0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBPbkluaXQsXG4gIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBOZ1pvbmUsIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFVwZGF0ZSwgQ2FudmFzV2hpdGVib2FyZFVwZGF0ZVR5cGUgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLXVwZGF0ZS5tb2RlbCc7XG5pbXBvcnQgeyBERUZBVUxUX1NUWUxFUyB9IGZyb20gJy4vdGVtcGxhdGUnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFNlcnZpY2UgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZE9wdGlvbnMgfSBmcm9tICcuL2NhbnZhcy13aGl0ZWJvYXJkLW9wdGlvbnMnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFNoYXBlIH0gZnJvbSAnLi9zaGFwZXMvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUnO1xuaW1wb3J0IHsgQ2FudmFzV2hpdGVib2FyZFBvaW50IH0gZnJvbSAnLi9jYW52YXMtd2hpdGVib2FyZC1wb2ludC5tb2RlbCc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVTZXJ2aWNlLCBJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlIH0gZnJvbSAnLi9zaGFwZXMvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUuc2VydmljZSc7XG5pbXBvcnQgeyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zIH0gZnJvbSAnLi9zaGFwZXMvY2FudmFzLXdoaXRlYm9hcmQtc2hhcGUtb3B0aW9ucyc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGNsb25lRGVlcCwgaXNFcXVhbCB9IGZyb20gJ2xvZGFzaC1lcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NhbnZhcy13aGl0ZWJvYXJkJyxcbiAgdGVtcGxhdGU6XG4gICAgICBgXG4gICAgPGRpdiBjbGFzcz1cImNhbnZhc193cmFwcGVyX2RpdlwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNhbnZhc193aGl0ZWJvYXJkX2J1dHRvbnNcIj5cbiAgICAgICAgPGNhbnZhcy13aGl0ZWJvYXJkLXNoYXBlLXNlbGVjdG9yICpuZ0lmPVwic2hhcGVTZWxlY3RvckVuYWJsZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dTaGFwZVNlbGVjdG9yXT1cInNob3dTaGFwZVNlbGVjdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzZWxlY3RlZFNoYXBlQ29uc3RydWN0b3JdPVwic2VsZWN0ZWRTaGFwZUNvbnN0cnVjdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzaGFwZU9wdGlvbnNdPVwiZ2VuZXJhdGVTaGFwZVByZXZpZXdPcHRpb25zKClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uVG9nZ2xlU2hhcGVTZWxlY3Rvcik9XCJ0b2dnbGVTaGFwZVNlbGVjdG9yKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uU2hhcGVTZWxlY3RlZCk9XCJzZWxlY3RTaGFwZSgkZXZlbnQpXCI+PC9jYW52YXMtd2hpdGVib2FyZC1zaGFwZS1zZWxlY3Rvcj5cblxuICAgICAgICA8Y2FudmFzLXdoaXRlYm9hcmQtY29sb3JwaWNrZXIgKm5nSWY9XCJjb2xvclBpY2tlckVuYWJsZWQgfHwgZmlsbENvbG9yUGlja2VyRW5hYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbcHJldmlld1RleHRdPVwiZmlsbENvbG9yUGlja2VyVGV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0NvbG9yUGlja2VyXT1cInNob3dGaWxsQ29sb3JQaWNrZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlbGVjdGVkQ29sb3JdPVwiZmlsbENvbG9yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvblRvZ2dsZUNvbG9yUGlja2VyKT1cInRvZ2dsZUZpbGxDb2xvclBpY2tlcigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChvbkNvbG9yU2VsZWN0ZWQpPVwiY2hhbmdlRmlsbENvbG9yKCRldmVudClcIj5cbiAgICAgICAgPC9jYW52YXMtd2hpdGVib2FyZC1jb2xvcnBpY2tlcj5cblxuICAgICAgICA8Y2FudmFzLXdoaXRlYm9hcmQtY29sb3JwaWNrZXIgKm5nSWY9XCJjb2xvclBpY2tlckVuYWJsZWQgfHwgc3Ryb2tlQ29sb3JQaWNrZXJFbmFibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtwcmV2aWV3VGV4dF09XCJzdHJva2VDb2xvclBpY2tlclRleHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dDb2xvclBpY2tlcl09XCJzaG93U3Ryb2tlQ29sb3JQaWNrZXJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW3NlbGVjdGVkQ29sb3JdPVwic3Ryb2tlQ29sb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG9uVG9nZ2xlQ29sb3JQaWNrZXIpPVwidG9nZ2xlU3Ryb2tlQ29sb3JQaWNrZXIoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAob25Db2xvclNlbGVjdGVkKT1cImNoYW5nZVN0cm9rZUNvbG9yKCRldmVudClcIj5cbiAgICAgICAgPC9jYW52YXMtd2hpdGVib2FyZC1jb2xvcnBpY2tlcj5cblxuXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJkcmF3QnV0dG9uRW5hYmxlZFwiIChjbGljayk9XCJ0b2dnbGVEcmF3aW5nRW5hYmxlZCgpXCJcbiAgICAgICAgICAgICAgICBbY2xhc3MuY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uLWRyYXdfYW5pbWF0ZWRdPVwiZ2V0RHJhd2luZ0VuYWJsZWQoKVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYW52YXNfd2hpdGVib2FyZF9idXR0b24gY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uLWRyYXdcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgPGkgW2NsYXNzXT1cImRyYXdCdXR0b25DbGFzc1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4ge3tkcmF3QnV0dG9uVGV4dH19XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJjbGVhckJ1dHRvbkVuYWJsZWRcIiAoY2xpY2spPVwiY2xlYXJDYW52YXNMb2NhbCgpXCIgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYW52YXNfd2hpdGVib2FyZF9idXR0b24gY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uLWNsZWFyXCI+XG4gICAgICAgICAgPGkgW2NsYXNzXT1cImNsZWFyQnV0dG9uQ2xhc3NcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IHt7Y2xlYXJCdXR0b25UZXh0fX1cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInVuZG9CdXR0b25FbmFibGVkXCIgKGNsaWNrKT1cInVuZG9Mb2NhbCgpXCIgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYW52YXNfd2hpdGVib2FyZF9idXR0b24gY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uLXVuZG9cIj5cbiAgICAgICAgICA8aSBbY2xhc3NdPVwidW5kb0J1dHRvbkNsYXNzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiB7e3VuZG9CdXR0b25UZXh0fX1cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInJlZG9CdXR0b25FbmFibGVkXCIgKGNsaWNrKT1cInJlZG9Mb2NhbCgpXCIgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJjYW52YXNfd2hpdGVib2FyZF9idXR0b24gY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uLXJlZG9cIj5cbiAgICAgICAgICA8aSBbY2xhc3NdPVwicmVkb0J1dHRvbkNsYXNzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiB7e3JlZG9CdXR0b25UZXh0fX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJzYXZlRGF0YUJ1dHRvbkVuYWJsZWRcIiAoY2xpY2spPVwic2F2ZUxvY2FsKClcIiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImNhbnZhc193aGl0ZWJvYXJkX2J1dHRvbiBjYW52YXNfd2hpdGVib2FyZF9idXR0b24tc2F2ZVwiPlxuICAgICAgICAgIDxpIFtjbGFzc109XCJzYXZlRGF0YUJ1dHRvbkNsYXNzXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiB7e3NhdmVEYXRhQnV0dG9uVGV4dH19XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8Y2FudmFzICNjYW52YXMgY2xhc3M9XCJjYW52YXNfd2hpdGVib2FyZFwiPjwvY2FudmFzPlxuICAgICAgPGNhbnZhcyAjaW5jb21wbGV0ZVNoYXBlc0NhbnZhcyBjbGFzcz1cImluY29tcGxldGVfc2hhcGVzX2NhbnZhc193aGl0ZWJvYXJkXCJcbiAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJjYW52YXNVc2VyRXZlbnRzKCRldmVudClcIiAobW91c2V1cCk9XCJjYW52YXNVc2VyRXZlbnRzKCRldmVudClcIlxuICAgICAgICAgICAgICAobW91c2Vtb3ZlKT1cImNhbnZhc1VzZXJFdmVudHMoJGV2ZW50KVwiIChtb3VzZW91dCk9XCJjYW52YXNVc2VyRXZlbnRzKCRldmVudClcIlxuICAgICAgICAgICAgICAodG91Y2hzdGFydCk9XCJjYW52YXNVc2VyRXZlbnRzKCRldmVudClcIiAodG91Y2htb3ZlKT1cImNhbnZhc1VzZXJFdmVudHMoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJjYW52YXNVc2VyRXZlbnRzKCRldmVudClcIiAodG91Y2hjYW5jZWwpPVwiY2FudmFzVXNlckV2ZW50cygkZXZlbnQpXCI+PC9jYW52YXM+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW0RFRkFVTFRfU1RZTEVTXVxufSlcbmV4cG9ydCBjbGFzcyBDYW52YXNXaGl0ZWJvYXJkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IENhbnZhc1doaXRlYm9hcmRPcHRpb25zO1xuXG4gIC8vIE51bWJlciBvZiBtcyB0byB3YWl0IGJlZm9yZSBzZW5kaW5nIG91dCB0aGUgdXBkYXRlcyBhcyBhbiBhcnJheVxuICBASW5wdXQoKSBiYXRjaFVwZGF0ZVRpbWVvdXREdXJhdGlvbiA9IDEwMDtcblxuICBwcml2YXRlIF9pbWFnZVVybDogc3RyaW5nO1xuICBASW5wdXQoKSBzZXQgaW1hZ2VVcmwoaW1hZ2VVcmw6IHN0cmluZykge1xuICAgIHRoaXMuX2ltYWdlVXJsID0gaW1hZ2VVcmw7XG4gICAgdGhpcy5faW1hZ2VFbGVtZW50ID0gbnVsbDtcbiAgICB0aGlzLl9yZWRyYXdIaXN0b3J5KCk7XG4gIH1cblxuICBnZXQgaW1hZ2VVcmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faW1hZ2VVcmw7XG4gIH1cblxuICBASW5wdXQoKSBhc3BlY3RSYXRpbzogbnVtYmVyO1xuICBASW5wdXQoKSBkcmF3QnV0dG9uQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KCkgY2xlYXJCdXR0b25DbGFzczogc3RyaW5nO1xuICBASW5wdXQoKSB1bmRvQnV0dG9uQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KCkgcmVkb0J1dHRvbkNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNhdmVEYXRhQnV0dG9uQ2xhc3M6IHN0cmluZztcbiAgQElucHV0KCkgZHJhd0J1dHRvblRleHQgPSAnJztcbiAgQElucHV0KCkgY2xlYXJCdXR0b25UZXh0ID0gJyc7XG4gIEBJbnB1dCgpIHVuZG9CdXR0b25UZXh0ID0gJyc7XG4gIEBJbnB1dCgpIHJlZG9CdXR0b25UZXh0ID0gJyc7XG4gIEBJbnB1dCgpIHNhdmVEYXRhQnV0dG9uVGV4dCA9ICcnO1xuICBASW5wdXQoKSBzdHJva2VDb2xvclBpY2tlclRleHQgPSAnU3Ryb2tlJztcbiAgQElucHV0KCkgZmlsbENvbG9yUGlja2VyVGV4dCA9ICdGaWxsJztcbiAgQElucHV0KCkgZHJhd0J1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSBjbGVhckJ1dHRvbkVuYWJsZWQgPSB0cnVlO1xuICBASW5wdXQoKSB1bmRvQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSByZWRvQnV0dG9uRW5hYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBzYXZlRGF0YUJ1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgc2hvdWxkRG93bmxvYWREcmF3aW5nID0gdHJ1ZTtcbiAgLyoqIEBkZXByZWNhdGVkLiBSZXBsYWNlZCB3aXRoIHN0cm9rZUNvbG9yUGlja2VyRW5hYmxlZCBhbmQgZmlsbENvbG9yUGlja2VyRW5hYmxlZCBpbnB1dHMgKi9cbiAgQElucHV0KCkgY29sb3JQaWNrZXJFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIHN0cm9rZUNvbG9yUGlja2VyRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBmaWxsQ29sb3JQaWNrZXJFbmFibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxpbmVXaWR0aCA9IDI7XG4gIEBJbnB1dCgpIHN0cm9rZUNvbG9yID0gJ3JnYmEoMCwgMCwgMCwgMSknO1xuICBASW5wdXQoKSBzdGFydGluZ0NvbG9yID0gJyNmZmYnO1xuICBASW5wdXQoKSBzY2FsZUZhY3RvciA9IDA7XG4gIEBJbnB1dCgpIGRyYXdpbmdFbmFibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIHNob3dTdHJva2VDb2xvclBpY2tlciA9IGZhbHNlO1xuICBASW5wdXQoKSBzaG93RmlsbENvbG9yUGlja2VyID0gZmFsc2U7XG4gIEBJbnB1dCgpIGRvd25sb2FkZWRGaWxlTmFtZTogc3RyaW5nO1xuXG4gIEBJbnB1dCgpIGxpbmVKb2luID0gJ3JvdW5kJztcbiAgQElucHV0KCkgbGluZUNhcCA9ICdyb3VuZCc7XG4gIEBJbnB1dCgpIHNoYXBlU2VsZWN0b3JFbmFibGVkID0gdHJ1ZTtcbiAgQElucHV0KCkgc2hvd1NoYXBlU2VsZWN0b3IgPSBmYWxzZTtcbiAgQElucHV0KCkgZmlsbENvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuXG4gIEBPdXRwdXQoKSBvbkNsZWFyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvblVuZG8gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG9uUmVkbyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25CYXRjaFVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8Q2FudmFzV2hpdGVib2FyZFVwZGF0ZVtdPigpO1xuICBAT3V0cHV0KCkgb25JbWFnZUxvYWRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25TYXZlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmcgfCBCbG9iPigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2NhbnZhcycsIHtzdGF0aWM6IHRydWV9KSBjYW52YXM6IEVsZW1lbnRSZWY7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICBAVmlld0NoaWxkKCdpbmNvbXBsZXRlU2hhcGVzQ2FudmFzJywge3N0YXRpYzogdHJ1ZX0pIHByaXZhdGUgX2luY29tcGxldGVTaGFwZXNDYW52YXM6IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIHByaXZhdGUgX2luY29tcGxldGVTaGFwZXNNYXA6IE1hcDxzdHJpbmcsIENhbnZhc1doaXRlYm9hcmRTaGFwZT47XG5cbiAgcHJpdmF0ZSBfaW1hZ2VFbGVtZW50OiBhbnk7XG5cbiAgcHJpdmF0ZSBfY2FuRHJhdyA9IHRydWU7XG5cbiAgcHJpdmF0ZSBfY2xpZW50RHJhZ2dpbmcgPSBmYWxzZTtcblxuICBwcml2YXRlIF91cGRhdGVIaXN0b3J5OiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlW10gPSBbXTtcbiAgcHJpdmF0ZSBfbGFzdFVVSUQ6IHN0cmluZztcbiAgcHJpdmF0ZSBfc2hhcGVzTWFwOiBNYXA8c3RyaW5nLCBDYW52YXNXaGl0ZWJvYXJkU2hhcGU+O1xuXG4gIHByaXZhdGUgX3VuZG9TdGFjazogc3RyaW5nW10gPSBbXTsgLy8gU3RvcmVzIHRoZSB2YWx1ZSBvZiBzdGFydCBhbmQgY291bnQgZm9yIGVhY2ggY29udGludW91cyBzdHJva2VcbiAgcHJpdmF0ZSBfcmVkb1N0YWNrOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9iYXRjaFVwZGF0ZXM6IENhbnZhc1doaXRlYm9hcmRVcGRhdGVbXSA9IFtdO1xuICBwcml2YXRlIF91cGRhdGVzTm90RHJhd246IGFueSA9IFtdO1xuXG4gIHByaXZhdGUgX3VwZGF0ZVRpbWVvdXQ6IGFueTtcblxuICBwcml2YXRlIF9jYW52YXNXaGl0ZWJvYXJkU2VydmljZVN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgX3Jlc2l6ZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9yZWdpc3RlcmVkU2hhcGVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgc2VsZWN0ZWRTaGFwZUNvbnN0cnVjdG9yOiBJTmV3Q2FudmFzV2hpdGVib2FyZFNoYXBlPENhbnZhc1doaXRlYm9hcmRTaGFwZT47XG4gIGNhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXdPcHRpb25zOiBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICAgICAgICBwcml2YXRlIGNhbnZhc1doaXRlYm9hcmRTZXJ2aWNlOiBDYW52YXNXaGl0ZWJvYXJkU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjYW52YXNXaGl0ZWJvYXJkU2hhcGVTZXJ2aWNlOiBDYW52YXNXaGl0ZWJvYXJkU2hhcGVTZXJ2aWNlKSB7XG4gICAgdGhpcy5fc2hhcGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIENhbnZhc1doaXRlYm9hcmRTaGFwZT4oKTtcbiAgICB0aGlzLl9pbmNvbXBsZXRlU2hhcGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIENhbnZhc1doaXRlYm9hcmRTaGFwZT4oKTtcbiAgICB0aGlzLmNhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXdPcHRpb25zID0gdGhpcy5nZW5lcmF0ZVNoYXBlUHJldmlld09wdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBjYW52YXMgZHJhd2luZyBjb250ZXh0LiBJZiB3ZSBoYXZlIGFuIGFzcGVjdCByYXRpbyBzZXQgdXAsIHRoZSBjYW52YXMgd2lsbCByZXNpemVcbiAgICogYWNjb3JkaW5nIHRvIHRoZSBhc3BlY3QgcmF0aW8uXG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9pbml0SW5wdXRzRnJvbU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLl9pbml0Q2FudmFzRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl9pbml0Q2FudmFzU2VydmljZU9ic2VydmFibGVzKCk7XG4gICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0ID0gdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gIH1cblxuICAvKipcbiAgICogSWYgYW4gaW1hZ2UgZXhpc3RzIGFuZCBpdCdzIHVybCBjaGFuZ2VzLCB3ZSBuZWVkIHRvIHJlZHJhdyB0aGUgbmV3IGltYWdlIG9uIHRoZSBjYW52YXMuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5vcHRpb25zICYmICFpc0VxdWFsKGNoYW5nZXMub3B0aW9ucy5jdXJyZW50VmFsdWUsIGNoYW5nZXMub3B0aW9ucy5wcmV2aW91c1ZhbHVlKSkge1xuICAgICAgdGhpcy5faW5pdElucHV0c0Zyb21PcHRpb25zKGNoYW5nZXMub3B0aW9ucy5jdXJyZW50VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZSB0aGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2FudmFzIGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGZ1bGx5IGluaXRpYWxpemVkXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY2FsY3VsYXRlQ2FudmFzV2lkdGhBbmRIZWlnaHQoKTtcbiAgICB0aGlzLl9yZWRyYXdIaXN0b3J5KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmVhZHMgdGhlIG9wdGlvbnMgd2hpY2ggYXJlIGhlbHBmdWwgc2luY2UgdGhleSBjYW4gYmUgcmVhbGx5IGxvbmcgd2hlbiBzcGVjaWZpZWQgaW4gSFRNTFxuICAgKiBUaGlzIG1ldGhvZCBpcyBhbHNvIGNhbGxlZCBldmVyeXRpbWUgdGhlIG9wdGlvbnMgb2JqZWN0IGNoYW5nZXNcbiAgICogRm9yIHNlY3VyaXR5IHJlYXNvbnMgd2UgbXVzdCBjaGVjayBlYWNoIGl0ZW0gb24gaXRzIG93biBzaW5jZSBpZiB3ZSBpdGVyYXRlIHRoZSBrZXlzXG4gICAqIHdlIG1heSBiZSBpbmplY3RlZCB3aXRoIG1hbGljaW91cyB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICovXG4gIHByaXZhdGUgX2luaXRJbnB1dHNGcm9tT3B0aW9ucyhvcHRpb25zOiBDYW52YXNXaGl0ZWJvYXJkT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuYmF0Y2hVcGRhdGVUaW1lb3V0RHVyYXRpb24pKSB7XG4gICAgICAgIHRoaXMuYmF0Y2hVcGRhdGVUaW1lb3V0RHVyYXRpb24gPSBvcHRpb25zLmJhdGNoVXBkYXRlVGltZW91dER1cmF0aW9uO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmltYWdlVXJsKSkge1xuICAgICAgICB0aGlzLmltYWdlVXJsID0gb3B0aW9ucy5pbWFnZVVybDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5hc3BlY3RSYXRpbykpIHtcbiAgICAgICAgdGhpcy5hc3BlY3RSYXRpbyA9IG9wdGlvbnMuYXNwZWN0UmF0aW87XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuZHJhd0J1dHRvbkNsYXNzKSkge1xuICAgICAgICB0aGlzLmRyYXdCdXR0b25DbGFzcyA9IG9wdGlvbnMuZHJhd0J1dHRvbkNsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmNsZWFyQnV0dG9uQ2xhc3MpKSB7XG4gICAgICAgIHRoaXMuY2xlYXJCdXR0b25DbGFzcyA9IG9wdGlvbnMuY2xlYXJCdXR0b25DbGFzcztcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy51bmRvQnV0dG9uQ2xhc3MpKSB7XG4gICAgICAgIHRoaXMudW5kb0J1dHRvbkNsYXNzID0gb3B0aW9ucy51bmRvQnV0dG9uQ2xhc3M7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMucmVkb0J1dHRvbkNsYXNzKSkge1xuICAgICAgICB0aGlzLnJlZG9CdXR0b25DbGFzcyA9IG9wdGlvbnMucmVkb0J1dHRvbkNsYXNzO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLnNhdmVEYXRhQnV0dG9uQ2xhc3MpKSB7XG4gICAgICAgIHRoaXMuc2F2ZURhdGFCdXR0b25DbGFzcyA9IG9wdGlvbnMuc2F2ZURhdGFCdXR0b25DbGFzcztcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5kcmF3QnV0dG9uVGV4dCkpIHtcbiAgICAgICAgdGhpcy5kcmF3QnV0dG9uVGV4dCA9IG9wdGlvbnMuZHJhd0J1dHRvblRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuY2xlYXJCdXR0b25UZXh0KSkge1xuICAgICAgICB0aGlzLmNsZWFyQnV0dG9uVGV4dCA9IG9wdGlvbnMuY2xlYXJCdXR0b25UZXh0O1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLnVuZG9CdXR0b25UZXh0KSkge1xuICAgICAgICB0aGlzLnVuZG9CdXR0b25UZXh0ID0gb3B0aW9ucy51bmRvQnV0dG9uVGV4dDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5yZWRvQnV0dG9uVGV4dCkpIHtcbiAgICAgICAgdGhpcy5yZWRvQnV0dG9uVGV4dCA9IG9wdGlvbnMucmVkb0J1dHRvblRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc2F2ZURhdGFCdXR0b25UZXh0KSkge1xuICAgICAgICB0aGlzLnNhdmVEYXRhQnV0dG9uVGV4dCA9IG9wdGlvbnMuc2F2ZURhdGFCdXR0b25UZXh0O1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLnN0cm9rZUNvbG9yUGlja2VyVGV4dCkpIHtcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvclBpY2tlclRleHQgPSBvcHRpb25zLnN0cm9rZUNvbG9yUGlja2VyVGV4dDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5maWxsQ29sb3JQaWNrZXJUZXh0KSkge1xuICAgICAgICB0aGlzLmZpbGxDb2xvclBpY2tlclRleHQgPSBvcHRpb25zLmZpbGxDb2xvclBpY2tlclRleHQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuZHJhd0J1dHRvbkVuYWJsZWQpKSB7XG4gICAgICAgIHRoaXMuZHJhd0J1dHRvbkVuYWJsZWQgPSBvcHRpb25zLmRyYXdCdXR0b25FbmFibGVkO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmNsZWFyQnV0dG9uRW5hYmxlZCkpIHtcbiAgICAgICAgdGhpcy5jbGVhckJ1dHRvbkVuYWJsZWQgPSBvcHRpb25zLmNsZWFyQnV0dG9uRW5hYmxlZDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy51bmRvQnV0dG9uRW5hYmxlZCkpIHtcbiAgICAgICAgdGhpcy51bmRvQnV0dG9uRW5hYmxlZCA9IG9wdGlvbnMudW5kb0J1dHRvbkVuYWJsZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMucmVkb0J1dHRvbkVuYWJsZWQpKSB7XG4gICAgICAgIHRoaXMucmVkb0J1dHRvbkVuYWJsZWQgPSBvcHRpb25zLnJlZG9CdXR0b25FbmFibGVkO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLnNhdmVEYXRhQnV0dG9uRW5hYmxlZCkpIHtcbiAgICAgICAgdGhpcy5zYXZlRGF0YUJ1dHRvbkVuYWJsZWQgPSBvcHRpb25zLnNhdmVEYXRhQnV0dG9uRW5hYmxlZDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5jb2xvclBpY2tlckVuYWJsZWQpKSB7XG4gICAgICAgIHRoaXMuY29sb3JQaWNrZXJFbmFibGVkID0gb3B0aW9ucy5jb2xvclBpY2tlckVuYWJsZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc3Ryb2tlQ29sb3JQaWNrZXJFbmFibGVkKSkge1xuICAgICAgICB0aGlzLnN0cm9rZUNvbG9yUGlja2VyRW5hYmxlZCA9IG9wdGlvbnMuc3Ryb2tlQ29sb3JQaWNrZXJFbmFibGVkO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmZpbGxDb2xvclBpY2tlckVuYWJsZWQpKSB7XG4gICAgICAgIHRoaXMuZmlsbENvbG9yUGlja2VyRW5hYmxlZCA9IG9wdGlvbnMuZmlsbENvbG9yUGlja2VyRW5hYmxlZDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5saW5lV2lkdGgpKSB7XG4gICAgICAgIHRoaXMubGluZVdpZHRoID0gb3B0aW9ucy5saW5lV2lkdGg7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc3Ryb2tlQ29sb3IpKSB7XG4gICAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSBvcHRpb25zLnN0cm9rZUNvbG9yO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLnNob3VsZERvd25sb2FkRHJhd2luZykpIHtcbiAgICAgICAgdGhpcy5zaG91bGREb3dubG9hZERyYXdpbmcgPSBvcHRpb25zLnNob3VsZERvd25sb2FkRHJhd2luZztcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5zdGFydGluZ0NvbG9yKSkge1xuICAgICAgICB0aGlzLnN0YXJ0aW5nQ29sb3IgPSBvcHRpb25zLnN0YXJ0aW5nQ29sb3I7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc2NhbGVGYWN0b3IpKSB7XG4gICAgICAgIHRoaXMuc2NhbGVGYWN0b3IgPSBvcHRpb25zLnNjYWxlRmFjdG9yO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmRyYXdpbmdFbmFibGVkKSkge1xuICAgICAgICB0aGlzLmRyYXdpbmdFbmFibGVkID0gb3B0aW9ucy5kcmF3aW5nRW5hYmxlZDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5kb3dubG9hZGVkRmlsZU5hbWUpKSB7XG4gICAgICAgIHRoaXMuZG93bmxvYWRlZEZpbGVOYW1lID0gb3B0aW9ucy5kb3dubG9hZGVkRmlsZU5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMubGluZUpvaW4pKSB7XG4gICAgICAgIHRoaXMubGluZUpvaW4gPSBvcHRpb25zLmxpbmVKb2luO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmxpbmVDYXApKSB7XG4gICAgICAgIHRoaXMubGluZUNhcCA9IG9wdGlvbnMubGluZUNhcDtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5zaGFwZVNlbGVjdG9yRW5hYmxlZCkpIHtcbiAgICAgICAgdGhpcy5zaGFwZVNlbGVjdG9yRW5hYmxlZCA9IG9wdGlvbnMuc2hhcGVTZWxlY3RvckVuYWJsZWQ7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc2hvd1NoYXBlU2VsZWN0b3IpKSB7XG4gICAgICAgIHRoaXMuc2hvd1NoYXBlU2VsZWN0b3IgPSBvcHRpb25zLnNob3dTaGFwZVNlbGVjdG9yO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLl9pc051bGxPclVuZGVmaW5lZChvcHRpb25zLmZpbGxDb2xvcikpIHtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSBvcHRpb25zLmZpbGxDb2xvcjtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5faXNOdWxsT3JVbmRlZmluZWQob3B0aW9ucy5zaG93U3Ryb2tlQ29sb3JQaWNrZXIpKSB7XG4gICAgICAgIHRoaXMuc2hvd1N0cm9rZUNvbG9yUGlja2VyID0gb3B0aW9ucy5zaG93U3Ryb2tlQ29sb3JQaWNrZXI7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuX2lzTnVsbE9yVW5kZWZpbmVkKG9wdGlvbnMuc2hvd0ZpbGxDb2xvclBpY2tlcikpIHtcbiAgICAgICAgdGhpcy5zaG93RmlsbENvbG9yUGlja2VyID0gb3B0aW9ucy5zaG93RmlsbENvbG9yUGlja2VyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2lzTnVsbE9yVW5kZWZpbmVkKHByb3BlcnR5OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcHJvcGVydHkgPT09IG51bGwgfHwgcHJvcGVydHkgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0IGdsb2JhbCB3aW5kb3cgbGlzdGVuZXJzIGxpa2UgcmVzaXplIGFuZCBrZXlkb3duXG4gICAqL1xuICBwcml2YXRlIF9pbml0Q2FudmFzRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fcmVzaXplU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ3Jlc2l6ZScpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIGRlYm91bmNlVGltZSgyMDApLFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fcmVkcmF3Q2FudmFzT25SZXNpemUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2NhbnZhc0tleURvd24uYmluZCh0aGlzKSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gbmV3IHNpZ25hbHMgaW4gdGhlIGNhbnZhcyB3aGl0ZWJvYXJkIHNlcnZpY2UgYW5kIGV4ZWN1dGVzIG1ldGhvZHMgYWNjb3JkaW5nbHlcbiAgICogQmVjYXVzZSBvZiBjaXJjdWxhciBwdWJsaXNoaW5nIGFuZCBzdWJzY3JpYmluZywgdGhlIGNhbnZhcyBtZXRob2RzIGRvIG5vdCB1c2UgdGhlIHNlcnZpY2Ugd2hlblxuICAgKiBsb2NhbCBhY3Rpb25zIGFyZSBjb21wbGV0ZWQgKEV4LiBjbGlja2luZyB1bmRvIGZyb20gdGhlIGJ1dHRvbiBpbnNpZGUgdGhpcyBjb21wb25lbnQpXG4gICAqL1xuICBwcml2YXRlIF9pbml0Q2FudmFzU2VydmljZU9ic2VydmFibGVzKCk6IHZvaWQge1xuICAgIHRoaXMuX2NhbnZhc1doaXRlYm9hcmRTZXJ2aWNlU3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuY2FudmFzV2hpdGVib2FyZFNlcnZpY2UuY2FudmFzRHJhd1N1YmplY3QkXG4gICAgICAuc3Vic2NyaWJlKHVwZGF0ZXMgPT4gdGhpcy5kcmF3VXBkYXRlcyh1cGRhdGVzKSkpO1xuICAgIHRoaXMuX2NhbnZhc1doaXRlYm9hcmRTZXJ2aWNlU3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMuY2FudmFzV2hpdGVib2FyZFNlcnZpY2UuY2FudmFzQ2xlYXJTdWJqZWN0JFxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsZWFyQ2FudmFzKCkpKTtcbiAgICB0aGlzLl9jYW52YXNXaGl0ZWJvYXJkU2VydmljZVN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmNhbnZhc1doaXRlYm9hcmRTZXJ2aWNlLmNhbnZhc1VuZG9TdWJqZWN0JFxuICAgICAgLnN1YnNjcmliZSgodXBkYXRlVVVEKSA9PiB0aGlzLl91bmRvQ2FudmFzKHVwZGF0ZVVVRCkpKTtcbiAgICB0aGlzLl9jYW52YXNXaGl0ZWJvYXJkU2VydmljZVN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmNhbnZhc1doaXRlYm9hcmRTZXJ2aWNlLmNhbnZhc1JlZG9TdWJqZWN0JFxuICAgICAgLnN1YnNjcmliZSgodXBkYXRlVVVEKSA9PiB0aGlzLl9yZWRvQ2FudmFzKHVwZGF0ZVVVRCkpKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyZWRTaGFwZXNTdWJzY3JpcHRpb24gPSB0aGlzLmNhbnZhc1doaXRlYm9hcmRTaGFwZVNlcnZpY2UucmVnaXN0ZXJlZFNoYXBlcyQuc3Vic2NyaWJlKChzaGFwZXMpID0+IHtcbiAgICAgIGlmICghdGhpcy5zZWxlY3RlZFNoYXBlQ29uc3RydWN0b3IgfHwgIXRoaXMuY2FudmFzV2hpdGVib2FyZFNoYXBlU2VydmljZS5pc1JlZ2lzdGVyZWRTaGFwZSh0aGlzLnNlbGVjdGVkU2hhcGVDb25zdHJ1Y3RvcikpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNoYXBlQ29uc3RydWN0b3IgPSBzaGFwZXNbMF07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBjYW52YXMgd2lkdGggYW5kIGhlaWdodCBmcm9tIGl0J3MgcGFyZW50IGNvbnRhaW5lciB3aWR0aCBhbmQgaGVpZ2h0ICh1c2UgYXNwZWN0IHJhdGlvIGlmIG5lZWRlZClcbiAgICovXG4gIHByaXZhdGUgX2NhbGN1bGF0ZUNhbnZhc1dpZHRoQW5kSGVpZ2h0KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUuY2xpZW50V2lkdGg7XG4gICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8pIHtcbiAgICAgIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLmNsaWVudFdpZHRoICogdGhpcy5hc3BlY3RSYXRpbztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUuY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0LmNhbnZhcy53aWR0aCA9IHRoaXMuY29udGV4dC5jYW52YXMud2lkdGg7XG4gICAgdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhc0NvbnRleHQuY2FudmFzLmhlaWdodCA9IHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gaW1hZ2UgYW5kIGRyYXcgaXQgb24gdGhlIGNhbnZhcyAoaWYgYW4gaW1hZ2UgZXhpc3RzKVxuICAgKiBAcGFyYW0gY2FsbGJhY2tGbiBBIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGFmdGVyIHRoZSBpbWFnZSBsb2FkaW5nIGlzIGZpbmlzaGVkXG4gICAqIEByZXR1cm4gRW1pdHMgYSB2YWx1ZSB3aGVuIHRoZSBpbWFnZSBoYXMgYmVlbiBsb2FkZWQuXG4gICAqL1xuICBwcml2YXRlIF9sb2FkSW1hZ2UoY2FsbGJhY2tGbj86IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2NhbkRyYXcgPSBmYWxzZTtcblxuICAgIC8vIElmIHdlIGFscmVhZHkgaGF2ZSB0aGUgaW1hZ2UgdGhlcmUgaXMgbm8gbmVlZCB0byBhY3F1aXJlIGl0XG4gICAgaWYgKHRoaXMuX2ltYWdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fY2FuRHJhdyA9IHRydWU7XG4gICAgICBjYWxsYmFja0ZuICYmIGNhbGxiYWNrRm4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9pbWFnZUVsZW1lbnQgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLl9pbWFnZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX2NhbkRyYXcgPSB0cnVlO1xuICAgICAgY2FsbGJhY2tGbiAmJiBjYWxsYmFja0ZuKCk7XG4gICAgICB0aGlzLm9uSW1hZ2VMb2FkZWQuZW1pdCh0cnVlKTtcbiAgICB9KTtcbiAgICB0aGlzLl9pbWFnZUVsZW1lbnQuc3JjID0gdGhpcy5pbWFnZVVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG5vdGlmaWNhdGlvbiBhZnRlciBjbGVhcmluZyB0aGUgY2FudmFzXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBmcm9tIHRoZSBjbGVhciBidXR0b24gaW4gdGhpcyBjb21wb25lbnQgc2luY2UgaXQgd2lsbCBlbWl0IGFuIGNsZWFyIGV2ZW50XG4gICAqIElmIHRoZSBjbGllbnQgY2FsbHMgdGhpcyBtZXRob2QgaGUgbWF5IGNyZWF0ZSBhIGNpcmN1bGFyIGNsZWFyIGFjdGlvbiB3aGljaCBtYXkgY2F1c2UgZGFuZ2VyLlxuICAgKi9cbiAgY2xlYXJDYW52YXNMb2NhbCgpOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgdGhpcy5vbkNsZWFyLmVtaXQodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBjb250ZW50IG9uIHRoZSBjYW52YXMuXG4gICAqL1xuICBjbGVhckNhbnZhcygpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW1vdmVDYW52YXNEYXRhKCk7XG4gICAgdGhpcy5fcmVkb1N0YWNrID0gW107XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmVzZXRzIHRoZSBzdGF0ZSBvZiB0aGUgY2FudmFzIGFuZCByZWRyYXdzIGl0LlxuICAgKiBJdCBjYWxscyBhIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHJlZHJhd2luZ1xuICAgKiBAcGFyYW0gY2FsbGJhY2tGblxuICAgKi9cbiAgcHJpdmF0ZSBfcmVtb3ZlQ2FudmFzRGF0YShjYWxsYmFja0ZuPzogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fc2hhcGVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIENhbnZhc1doaXRlYm9hcmRTaGFwZT4oKTtcbiAgICB0aGlzLl9jbGllbnREcmFnZ2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX3VwZGF0ZUhpc3RvcnkgPSBbXTtcbiAgICB0aGlzLl91bmRvU3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yZWRyYXdCYWNrZ3JvdW5kKGNhbGxiYWNrRm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgY2FudmFzIGFuZCByZWRyYXdzIHRoZSBpbWFnZSBpZiB0aGUgdXJsIGV4aXN0cy5cbiAgICogQHBhcmFtIGNhbGxiYWNrRm4gQSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBhZnRlciB0aGUgYmFja2dyb3VuZCBpcyByZWRyYXduXG4gICAqIEByZXR1cm4gRW1pdHMgYSB2YWx1ZSB3aGVuIHRoZSBjbGVhcmluZyBpcyBmaW5pc2hlZFxuICAgKi9cbiAgcHJpdmF0ZSBfcmVkcmF3QmFja2dyb3VuZChjYWxsYmFja0ZuPzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udGV4dCkge1xuICAgICAgaWYgKHRoaXMuaW1hZ2VVcmwpIHtcbiAgICAgICAgdGhpcy5fbG9hZEltYWdlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgICAgICAgIHRoaXMuX2RyYXdJbWFnZSh0aGlzLmNvbnRleHQsIHRoaXMuX2ltYWdlRWxlbWVudCwgMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQsIDAuNSwgMC41KTtcbiAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgICAgIHRoaXMuX2RyYXdNaXNzaW5nVXBkYXRlcygpO1xuICAgICAgICAgIGNhbGxiYWNrRm4gJiYgY2FsbGJhY2tGbigpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aCwgdGhpcy5jb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9kcmF3U3RhcnRpbmdDb2xvcigpO1xuICAgICAgICBjYWxsYmFja0ZuICYmIGNhbGxiYWNrRm4oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9kcmF3U3RhcnRpbmdDb2xvcigpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2aW91c0ZpbGxTdHlsZSA9IHRoaXMuY29udGV4dC5maWxsU3R5bGU7XG4gICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcblxuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLnN0YXJ0aW5nQ29sb3I7XG4gICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0KTtcbiAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcHJldmlvdXNGaWxsU3R5bGU7XG5cbiAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGdldERyYXdpbmdFbmFibGVkKCk6IGJvb2xlYW5cbiAgICovXG4gIGdldFNob3VsZERyYXcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RHJhd2luZ0VuYWJsZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdmFsdWUgb2Ygd2hldGhlciB0aGUgdXNlciBjbGlja2VkIHRoZSBkcmF3IGJ1dHRvbiBvbiB0aGUgY2FudmFzLlxuICAgKi9cbiAgZ2V0RHJhd2luZ0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZHJhd2luZ0VuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyBkcmF3aW5nIG9uIHRoZSBjYW52YXMuIEl0IGlzIGNhbGxlZCB2aWEgdGhlIGRyYXcgYnV0dG9uIG9uIHRoZSBjYW52YXMuXG4gICAqL1xuICB0b2dnbGVEcmF3aW5nRW5hYmxlZCgpOiB2b2lkIHtcbiAgICB0aGlzLmRyYXdpbmdFbmFibGVkID0gIXRoaXMuZHJhd2luZ0VuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGlmIGRyYXdpbmcgaXMgZW5hYmxlZCBmcm9tIHRoZSBjbGllbnQgdXNpbmcgdGhlIGNhbnZhc1xuICAgKiBAcGFyYW0gZHJhd2luZ0VuYWJsZWRcbiAgICovXG4gIHNldERyYXdpbmdFbmFibGVkKGRyYXdpbmdFbmFibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kcmF3aW5nRW5hYmxlZCA9IGRyYXdpbmdFbmFibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFBsZWFzZSB1c2UgdGhlIGNoYW5nZVN0cm9rZUNvbG9yKG5ld1N0cm9rZUNvbG9yOiBzdHJpbmcpOiB2b2lkIG1ldGhvZFxuICAgKi9cbiAgY2hhbmdlQ29sb3IobmV3U3Ryb2tlQ29sb3I6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuY2hhbmdlU3Ryb2tlQ29sb3IobmV3U3Ryb2tlQ29sb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIHRoZSBkcmF3aW5nIGNvbG9yIHdpdGggYSBuZXcgY29sb3JcbiAgICogVGhlIGZvcm1hdCBzaG91bGQgYmUgKFwiI2ZmZmZmZlwiIG9yIFwicmdiKHIsZyxiLGE/KVwiKVxuICAgKiBUaGlzIG1ldGhvZCBpcyBwdWJsaWMgc28gdGhhdCBhbnlvbmUgY2FuIGFjY2VzcyB0aGUgY2FudmFzIGFuZCBjaGFuZ2UgdGhlIHN0cm9rZSBjb2xvclxuICAgKlxuICAgKiBAcGFyYW0gbmV3U3Ryb2tlQ29sb3IgVGhlIG5ldyBzdHJva2UgY29sb3JcbiAgICovXG4gIGNoYW5nZVN0cm9rZUNvbG9yKG5ld1N0cm9rZUNvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnN0cm9rZUNvbG9yID0gbmV3U3Ryb2tlQ29sb3I7XG5cbiAgICB0aGlzLmNhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXdPcHRpb25zID0gdGhpcy5nZW5lcmF0ZVNoYXBlUHJldmlld09wdGlvbnMoKTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyB0aGUgZmlsbCBjb2xvciB3aXRoIGEgbmV3IGNvbG9yXG4gICAqIFRoZSBmb3JtYXQgc2hvdWxkIGJlIChcIiNmZmZmZmZcIiBvciBcInJnYihyLGcsYixhPylcIilcbiAgICogVGhpcyBtZXRob2QgaXMgcHVibGljIHNvIHRoYXQgYW55b25lIGNhbiBhY2Nlc3MgdGhlIGNhbnZhcyBhbmQgY2hhbmdlIHRoZSBmaWxsIGNvbG9yXG4gICAqXG4gICAqIEBwYXJhbSBuZXdGaWxsQ29sb3IgVGhlIG5ldyBmaWxsIGNvbG9yXG4gICAqL1xuICBjaGFuZ2VGaWxsQ29sb3IobmV3RmlsbENvbG9yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmZpbGxDb2xvciA9IG5ld0ZpbGxDb2xvcjtcbiAgICB0aGlzLmNhbnZhc1doaXRlYm9hcmRTaGFwZVByZXZpZXdPcHRpb25zID0gdGhpcy5nZW5lcmF0ZVNoYXBlUHJldmlld09wdGlvbnMoKTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIGJ5IHRoZSB1bmRvIGJ1dHRvbiBvbiB0aGUgY2FudmFzIHNjcmVlblxuICAgKiBJdCBjYWxscyB0aGUgZ2xvYmFsIHVuZG8gbWV0aG9kIGFuZCBlbWl0cyBhIG5vdGlmaWNhdGlvbiBhZnRlciB1bmRvaW5nLlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSBjYWxsZWQgZnJvbSB0aGUgdW5kbyBidXR0b24gaW4gdGhpcyBjb21wb25lbnQgc2luY2UgaXQgd2lsbCBlbWl0IGFuIHVuZG8gZXZlbnRcbiAgICogSWYgdGhlIGNsaWVudCBjYWxscyB0aGlzIG1ldGhvZCBoZSBtYXkgY3JlYXRlIGEgY2lyY3VsYXIgdW5kbyBhY3Rpb24gd2hpY2ggbWF5IGNhdXNlIGRhbmdlci5cbiAgICovXG4gIHVuZG9Mb2NhbCgpOiB2b2lkIHtcbiAgICB0aGlzLnVuZG8oKHVwZGF0ZVVVSUQpID0+IHtcbiAgICAgIHRoaXMuX3JlZG9TdGFjay5wdXNoKHVwZGF0ZVVVSUQpO1xuICAgICAgdGhpcy5vblVuZG8uZW1pdCh1cGRhdGVVVUlEKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZHMgc2VsZWN0cyB0aGUgbGFzdCB1dWlkIHByZXBhcmVzIGl0IGZvciB1bmRvaW5nIChtYWtpbmcgdGhlIHdob2xlIHVwZGF0ZSBzZXF1ZW5jZSBpbnZpc2libGUpXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgaWYgdGhlIGNhbnZhcyBjb21wb25lbnQgaXMgYSBWaWV3Q2hpbGQgb2Ygc29tZSBvdGhlciBjb21wb25lbnQuXG4gICAqIFRoaXMgbWV0aG9kIHdpbGwgd29yayBldmVuIGlmIHRoZSB1bmRvIGJ1dHRvbiBoYXMgYmVlbiBkaXNhYmxlZFxuICAgKi9cbiAgdW5kbyhjYWxsYmFja0ZuPzogKHVwZGF0ZVVVSUQ6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdW5kb1N0YWNrLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZVVVSUQgPSB0aGlzLl91bmRvU3RhY2sucG9wKCk7XG4gICAgdGhpcy5fdW5kb0NhbnZhcyh1cGRhdGVVVUlEKTtcbiAgICBjYWxsYmFja0ZuICYmIGNhbGxiYWNrRm4odXBkYXRlVVVJRCk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgdGFrZXMgYW4gVVVJRCBmb3IgYW4gdXBkYXRlLCBhbmQgcmVkcmF3cyB0aGUgY2FudmFzIGJ5IG1ha2luZyBhbGwgdXBkYXRlcyB3aXRoIHRoYXQgdXVpZCBpbnZpc2libGVcbiAgICogQHBhcmFtIHVwZGF0ZVVVSURcbiAgICovXG4gIHByaXZhdGUgX3VuZG9DYW52YXModXBkYXRlVVVJRDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3NoYXBlc01hcC5oYXModXBkYXRlVVVJRCkpIHtcbiAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fc2hhcGVzTWFwLmdldCh1cGRhdGVVVUlEKTtcbiAgICAgIHNoYXBlLmlzVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kcmF3QWxsU2hhcGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgYnkgdGhlIHJlZG8gYnV0dG9uIG9uIHRoZSBjYW52YXMgc2NyZWVuXG4gICAqIEl0IGNhbGxzIHRoZSBnbG9iYWwgcmVkbyBtZXRob2QgYW5kIGVtaXRzIGEgbm90aWZpY2F0aW9uIGFmdGVyIHJlZG9pbmdcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgY2FsbGVkIGZyb20gdGhlIHJlZG8gYnV0dG9uIGluIHRoaXMgY29tcG9uZW50IHNpbmNlIGl0IHdpbGwgZW1pdCBhbiByZWRvIGV2ZW50XG4gICAqIElmIHRoZSBjbGllbnQgY2FsbHMgdGhpcyBtZXRob2QgaGUgbWF5IGNyZWF0ZSBhIGNpcmN1bGFyIHJlZG8gYWN0aW9uIHdoaWNoIG1heSBjYXVzZSBkYW5nZXIuXG4gICAqL1xuICByZWRvTG9jYWwoKTogdm9pZCB7XG4gICAgdGhpcy5yZWRvKCh1cGRhdGVVVUlEKSA9PiB7XG4gICAgICB0aGlzLl91bmRvU3RhY2sucHVzaCh1cGRhdGVVVUlEKTtcbiAgICAgIHRoaXMub25SZWRvLmVtaXQodXBkYXRlVVVJRCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2RzIHNlbGVjdHMgdGhlIGxhc3QgdXVpZCBwcmVwYXJlcyBpdCBmb3IgcmVkb2luZyAobWFraW5nIHRoZSB3aG9sZSB1cGRhdGUgc2VxdWVuY2UgdmlzaWJsZSlcbiAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBpZiB0aGUgY2FudmFzIGNvbXBvbmVudCBpcyBhIFZpZXdDaGlsZCBvZiBzb21lIG90aGVyIGNvbXBvbmVudC5cbiAgICogVGhpcyBtZXRob2Qgd2lsbCB3b3JrIGV2ZW4gaWYgdGhlIHJlZG8gYnV0dG9uIGhhcyBiZWVuIGRpc2FibGVkXG4gICAqL1xuICByZWRvKGNhbGxiYWNrRm4/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3JlZG9TdGFjay5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cGRhdGVVVUlEID0gdGhpcy5fcmVkb1N0YWNrLnBvcCgpO1xuICAgIHRoaXMuX3JlZG9DYW52YXModXBkYXRlVVVJRCk7XG4gICAgY2FsbGJhY2tGbiAmJiBjYWxsYmFja0ZuKHVwZGF0ZVVVSUQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHRha2VzIGFuIFVVSUQgZm9yIGFuIHVwZGF0ZSwgYW5kIHJlZHJhd3MgdGhlIGNhbnZhcyBieSBtYWtpbmcgYWxsIHVwZGF0ZXMgd2l0aCB0aGF0IHV1aWQgdmlzaWJsZVxuICAgKiBAcGFyYW0gdXBkYXRlVVVJRFxuICAgKi9cbiAgcHJpdmF0ZSBfcmVkb0NhbnZhcyh1cGRhdGVVVUlEOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2hhcGVzTWFwLmhhcyh1cGRhdGVVVUlEKSkge1xuICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLl9zaGFwZXNNYXAuZ2V0KHVwZGF0ZVVVSUQpO1xuICAgICAgc2hhcGUuaXNWaXNpYmxlID0gdHJ1ZTtcblxuICAgICAgdGhpcy5kcmF3QWxsU2hhcGVzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhdGNoZXMgdGhlIE1vdXNlIGFuZCBUb3VjaCBldmVudHMgbWFkZSBvbiB0aGUgY2FudmFzLlxuICAgKiBJZiBkcmF3aW5nIGlzIGRpc2FibGVkIChJZiBhbiBpbWFnZSBleGlzdHMgYnV0IGl0J3Mgbm90IGxvYWRlZCwgb3IgdGhlIHVzZXIgZGlkIG5vdCBjbGljayBEcmF3KSxcbiAgICogdGhpcyBmdW5jdGlvbiBkb2VzIG5vdGhpbmcuXG4gICAqXG4gICAqIElmIGEgXCJtb3VzZWRvd24gfCB0b3VjaHN0YXJ0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkLCBkcmFnZ2luZyB3aWxsIGJlIHNldCB0byB0cnVlIGFuZCBhbiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlIG9iamVjdFxuICAgKiBvZiB0eXBlIFwic3RhcnRcIiB3aWxsIGJlIGRyYXduIGFuZCB0aGVuIHNlbnQgYXMgYW4gdXBkYXRlIHRvIGFsbCByZWNlaXZpbmcgZW5kcy5cbiAgICpcbiAgICogSWYgYSBcIm1vdXNlbW92ZSB8IHRvdWNobW92ZVwiIGV2ZW50IGlzIHRyaWdnZXJlZCBhbmQgdGhlIGNsaWVudCBpcyBkcmFnZ2luZywgYW4gQ2FudmFzV2hpdGVib2FyZFVwZGF0ZSBvYmplY3RcbiAgICogb2YgdHlwZSBcImRyYWdcIiB3aWxsIGJlIGRyYXduIGFuZCB0aGVuIHNlbnQgYXMgYW4gdXBkYXRlIHRvIGFsbCByZWNlaXZpbmcgZW5kcy5cbiAgICpcbiAgICogSWYgYSBcIm1vdXNldXAsIG1vdXNlb3V0IHwgdG91Y2hlbmQsIHRvdWNoY2FuY2VsXCIgZXZlbnQgaXMgdHJpZ2dlcmVkLCBkcmFnZ2luZyB3aWxsIGJlIHNldCB0byBmYWxzZSBhbmRcbiAgICogYW4gQ2FudmFzV2hpdGVib2FyZFVwZGF0ZSBvYmplY3Qgb2YgdHlwZSBcInN0b3BcIiB3aWxsIGJlIGRyYXduIGFuZCB0aGVuIHNlbnQgYXMgYW4gdXBkYXRlIHRvIGFsbCByZWNlaXZpbmcgZW5kcy5cbiAgICpcbiAgICovXG4gIGNhbnZhc1VzZXJFdmVudHMoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIC8vIElnbm9yZSBhbGwgaWYgd2UgZGlkbid0IGNsaWNrIHRoZSBfZHJhdyEgYnV0dG9uIG9yIHRoZSBpbWFnZSBkaWQgbm90IGxvYWRcbiAgICBpZiAoIXRoaXMuZHJhd2luZ0VuYWJsZWQgfHwgIXRoaXMuX2NhbkRyYXcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgbW91c2UgbW92ZSBFdmVudHMgaWYgd2UncmUgbm90IGRyYWdnaW5nXG4gICAgaWYgKCF0aGlzLl9jbGllbnREcmFnZ2luZ1xuICAgICAgJiYgKGV2ZW50LnR5cGUgPT09ICdtb3VzZW1vdmUnXG4gICAgICAgIHx8IGV2ZW50LnR5cGUgPT09ICd0b3VjaG1vdmUnXG4gICAgICAgIHx8IGV2ZW50LnR5cGUgPT09ICdtb3VzZW91dCdcbiAgICAgICAgfHwgZXZlbnQudHlwZSA9PT0gJ3RvdWNoY2FuY2VsJ1xuICAgICAgICB8fCBldmVudC50eXBlID09PSAnbW91c2V1cCdcbiAgICAgICAgfHwgZXZlbnQudHlwZSA9PT0gJ3RvdWNoZW5kJ1xuICAgICAgICB8fCBldmVudC50eXBlID09PSAnbW91c2VvdXQnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChldmVudC50YXJnZXQgPT0gdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhcy5uYXRpdmVFbGVtZW50IHx8IGV2ZW50LnRhcmdldCA9PSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGxldCB1cGRhdGU6IENhbnZhc1doaXRlYm9hcmRVcGRhdGU7XG4gICAgbGV0IHVwZGF0ZVR5cGU6IG51bWJlcjtcbiAgICBjb25zdCBldmVudFBvc2l0aW9uOiBDYW52YXNXaGl0ZWJvYXJkUG9pbnQgPSB0aGlzLl9nZXRDYW52YXNFdmVudFBvc2l0aW9uKGV2ZW50KTtcbiAgICB1cGRhdGUgPSBuZXcgQ2FudmFzV2hpdGVib2FyZFVwZGF0ZShldmVudFBvc2l0aW9uLngsIGV2ZW50UG9zaXRpb24ueSk7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlZG93bic6XG4gICAgICBjYXNlICd0b3VjaHN0YXJ0JzpcbiAgICAgICAgdGhpcy5fY2xpZW50RHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9sYXN0VVVJRCA9IHRoaXMuX2dlbmVyYXRlVVVJRCgpO1xuICAgICAgICB1cGRhdGVUeXBlID0gQ2FudmFzV2hpdGVib2FyZFVwZGF0ZVR5cGUuU1RBUlQ7XG4gICAgICAgIHRoaXMuX3JlZG9TdGFjayA9IFtdO1xuXG4gICAgICAgIHRoaXMuX2FkZEN1cnJlbnRTaGFwZURhdGFUb0FuVXBkYXRlKHVwZGF0ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbW91c2Vtb3ZlJzpcbiAgICAgIGNhc2UgJ3RvdWNobW92ZSc6XG4gICAgICAgIGlmICghdGhpcy5fY2xpZW50RHJhZ2dpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXBkYXRlVHlwZSA9IENhbnZhc1doaXRlYm9hcmRVcGRhdGVUeXBlLkRSQUc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAndG91Y2hjYW5jZWwnOlxuICAgICAgY2FzZSAnbW91c2V1cCc6XG4gICAgICBjYXNlICd0b3VjaGVuZCc6XG4gICAgICBjYXNlICdtb3VzZW91dCc6XG4gICAgICAgIHRoaXMuX2NsaWVudERyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIHVwZGF0ZVR5cGUgPSBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlVHlwZS5TVE9QO1xuICAgICAgICB0aGlzLl91bmRvU3RhY2sucHVzaCh0aGlzLl9sYXN0VVVJRCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHVwZGF0ZS5VVUlEID0gdGhpcy5fbGFzdFVVSUQ7XG4gICAgdXBkYXRlLnR5cGUgPSB1cGRhdGVUeXBlO1xuXG4gICAgdGhpcy5fZHJhdyh1cGRhdGUpO1xuICAgIHRoaXMuX3ByZXBhcmVUb1NlbmRVcGRhdGUodXBkYXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvb3JkaW5hdGVzICh4LHkpIGZyb20gYSBnaXZlbiBldmVudFxuICAgKiBJZiBpdCBpcyBhIHRvdWNoIGV2ZW50LCBnZXQgdGhlIHRvdWNoIHBvc2l0aW9uc1xuICAgKiBJZiB3ZSByZWxlYXNlZCB0aGUgdG91Y2gsIHRoZSBwb3NpdGlvbiB3aWxsIGJlIHBsYWNlZCBpbiB0aGUgY2hhbmdlZFRvdWNoZXMgb2JqZWN0XG4gICAqIElmIGl0IGlzIG5vdCBhIHRvdWNoIGV2ZW50LCB1c2UgdGhlIG9yaWdpbmFsIG1vdXNlIGV2ZW50IHJlY2VpdmVkXG4gICAqIEBwYXJhbSBldmVudERhdGFcbiAgICovXG4gIHByaXZhdGUgX2dldENhbnZhc0V2ZW50UG9zaXRpb24oZXZlbnREYXRhOiBhbnkpOiBDYW52YXNXaGl0ZWJvYXJkUG9pbnQge1xuICAgIGNvbnN0IGNhbnZhc0JvdW5kaW5nUmVjdCA9IHRoaXMuY29udGV4dC5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgaGFzVG91Y2hlcyA9IChldmVudERhdGEudG91Y2hlcyAmJiBldmVudERhdGEudG91Y2hlcy5sZW5ndGgpID8gZXZlbnREYXRhLnRvdWNoZXNbMF0gOiBudWxsO1xuICAgIGlmICghaGFzVG91Y2hlcykge1xuICAgICAgaGFzVG91Y2hlcyA9IChldmVudERhdGEuY2hhbmdlZFRvdWNoZXMgJiYgZXZlbnREYXRhLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCkgPyBldmVudERhdGEuY2hhbmdlZFRvdWNoZXNbMF0gOiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50ID0gaGFzVG91Y2hlcyA/IGhhc1RvdWNoZXMgOiBldmVudERhdGE7XG5cbiAgICBjb25zdCBzY2FsZVdpZHRoID0gY2FudmFzQm91bmRpbmdSZWN0LndpZHRoIC8gdGhpcy5jb250ZXh0LmNhbnZhcy53aWR0aDtcbiAgICBjb25zdCBzY2FsZUhlaWdodCA9IGNhbnZhc0JvdW5kaW5nUmVjdC5oZWlnaHQgLyB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodDtcblxuICAgIGxldCB4UG9zaXRpb24gPSAoZXZlbnQuY2xpZW50WCAtIGNhbnZhc0JvdW5kaW5nUmVjdC5sZWZ0KTtcbiAgICBsZXQgeVBvc2l0aW9uID0gKGV2ZW50LmNsaWVudFkgLSBjYW52YXNCb3VuZGluZ1JlY3QudG9wKTtcblxuICAgIHhQb3NpdGlvbiAvPSB0aGlzLnNjYWxlRmFjdG9yID8gdGhpcy5zY2FsZUZhY3RvciA6IHNjYWxlV2lkdGg7XG4gICAgeVBvc2l0aW9uIC89IHRoaXMuc2NhbGVGYWN0b3IgPyB0aGlzLnNjYWxlRmFjdG9yIDogc2NhbGVIZWlnaHQ7XG5cbiAgICByZXR1cm4gbmV3IENhbnZhc1doaXRlYm9hcmRQb2ludCh4UG9zaXRpb24gLyB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLCB5UG9zaXRpb24gLyB0aGlzLmNvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHVwZGF0ZSBjb29yZGluYXRlcyBvbiB0aGUgY2FudmFzIGFyZSBtYXBwZWQgc28gdGhhdCBhbGwgcmVjZWl2aW5nIGVuZHNcbiAgICogY2FuIHJldmVyc2UgdGhlIG1hcHBpbmcgYW5kIGdldCB0aGUgc2FtZSBwb3NpdGlvbiBhcyB0aGUgb25lIHRoYXRcbiAgICogd2FzIGRyYXduIG9uIHRoaXMgdXBkYXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdXBkYXRlIFRoZSBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlIG9iamVjdC5cbiAgICovXG4gIHByaXZhdGUgX3ByZXBhcmVUb1NlbmRVcGRhdGUodXBkYXRlOiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlKTogdm9pZCB7XG4gICAgdGhpcy5fcHJlcGFyZVVwZGF0ZUZvckJhdGNoRGlzcGF0Y2godXBkYXRlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhdGNoZXMgdGhlIEtleSBVcCBldmVudHMgbWFkZSBvbiB0aGUgY2FudmFzLlxuICAgKiBJZiB0aGUgY3RybEtleSBvciBjb21tYW5kS2V5KG1hY09TKSB3YXMgaGVsZCBhbmQgdGhlIGtleUNvZGUgaXMgOTAgKHopLCBhbiB1bmRvIGFjdGlvbiB3aWxsIGJlIHBlcmZvcm1lZFxuICAgKiBJZiB0aGUgY3RybEtleSBvciBjb21tYW5kS2V5KG1hY09TKSB3YXMgaGVsZCBhbmQgdGhlIGtleUNvZGUgaXMgODkgKHkpLCBhIHJlZG8gYWN0aW9uIHdpbGwgYmUgcGVyZm9ybWVkXG4gICAqIElmIHRoZSBjdHJsS2V5IG9yIGNvbW1hbmRLZXkobWFjT1MpIHdhcyBoZWxkIGFuZCB0aGUga2V5Q29kZSBpcyA4MyAocykgb3IgMTE1KFMpLCBhIHNhdmUgYWN0aW9uIHdpbGwgYmUgcGVyZm9ybWVkXG4gICAqXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdGhhdCBvY2N1cnJlZC5cbiAgICovXG4gIHByaXZhdGUgX2NhbnZhc0tleURvd24oZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmIChldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSA5MCAmJiB0aGlzLnVuZG9CdXR0b25FbmFibGVkKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMudW5kbygpO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDg5ICYmIHRoaXMucmVkb0J1dHRvbkVuYWJsZWQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5yZWRvKCk7XG4gICAgICB9XG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gODMgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTE1KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuc2F2ZUxvY2FsKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uIHdpbmRvdyByZXNpemUsIHJlY2FsY3VsYXRlIHRoZSBjYW52YXMgZGltZW5zaW9ucyBhbmQgcmVkcmF3IHRoZSBoaXN0b3J5XG4gICAqL1xuICBwcml2YXRlIF9yZWRyYXdDYW52YXNPblJlc2l6ZSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jYWxjdWxhdGVDYW52YXNXaWR0aEFuZEhlaWdodCgpO1xuICAgIHRoaXMuX3JlZHJhd0hpc3RvcnkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWRyYXcgdGhlIHNhdmVkIGhpc3RvcnkgYWZ0ZXIgcmVzZXR0aW5nIHRoZSBjYW52YXMgc3RhdGVcbiAgICovXG4gIHByaXZhdGUgX3JlZHJhd0hpc3RvcnkoKTogdm9pZCB7XG4gICAgY29uc3QgdXBkYXRlc1RvRHJhdyA9IFtdLmNvbmNhdCh0aGlzLl91cGRhdGVIaXN0b3J5KTtcblxuICAgIHRoaXMuX3JlbW92ZUNhbnZhc0RhdGEoKCkgPT4ge1xuICAgICAgdXBkYXRlc1RvRHJhdy5mb3JFYWNoKCh1cGRhdGU6IENhbnZhc1doaXRlYm9hcmRVcGRhdGUpID0+IHtcbiAgICAgICAgdGhpcy5fZHJhdyh1cGRhdGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYSBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlIG9iamVjdCBvbiB0aGUgY2FudmFzLlxuICAgKiBUaGUgY29vcmRpbmF0ZXMgYXJlIGZpcnN0IHJldmVyc2UgbWFwcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgZHJhd24gaW4gdGhlIHByb3BlciBwbGFjZS4gVGhlIHVwZGF0ZVxuICAgKiBpcyBhZnRlcndhcmRzIGFkZGVkIHRvIHRoZSB1bmRvU3RhY2sgc28gdGhhdCBpdCBjYW4gYmVcbiAgICpcbiAgICogSWYgdGhlIENhbnZhc1doaXRlYm9hcmRVcGRhdGUgVHlwZSBpcyBcInN0YXJ0XCIsIGEgbmV3IFwic2VsZWN0ZWRTaGFwZVwiIGlzIGNyZWF0ZWQuXG4gICAqIElmIHRoZSBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlIFR5cGUgaXMgXCJkcmFnXCIsIHRoZSBzaGFwZSBpcyB0YWtlbiBmcm9tIHRoZSBzaGFwZXNNYXAgYW5kIHRoZW4gaXQncyB1cGRhdGVkLlxuICAgKiBBZnRlcndhcmRzIHRoZSBjb250ZXh0IGlzIHVzZWQgdG8gZHJhdyB0aGUgc2hhcGUgb24gdGhlIGNhbnZhcy5cbiAgICogVGhpcyBmdW5jdGlvbiBzYXZlcyB0aGUgbGFzdCBYIGFuZCBZIGNvb3JkaW5hdGVzIHRoYXQgd2VyZSBkcmF3bi5cbiAgICpcbiAgICogQHBhcmFtIHVwZGF0ZSBUaGUgdXBkYXRlIG9iamVjdC5cbiAgICovXG4gIHByaXZhdGUgX2RyYXcodXBkYXRlOiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlKTogdm9pZCB7XG4gICAgdGhpcy5fdXBkYXRlSGlzdG9yeS5wdXNoKHVwZGF0ZSk7XG5cbiAgICAvLyBtYXAgdGhlIGNhbnZhcyBjb29yZGluYXRlcyB0byBvdXIgY2FudmFzIHNpemUgc2luY2UgdGhleSBhcmUgc2NhbGVkLlxuICAgIHVwZGF0ZSA9IE9iamVjdC5hc3NpZ24obmV3IENhbnZhc1doaXRlYm9hcmRVcGRhdGUoKSxcbiAgICAgIHVwZGF0ZSxcbiAgICAgIHtcbiAgICAgICAgeDogdXBkYXRlLnggKiB0aGlzLmNvbnRleHQuY2FudmFzLndpZHRoLFxuICAgICAgICB5OiB1cGRhdGUueSAqIHRoaXMuY29udGV4dC5jYW52YXMuaGVpZ2h0XG4gICAgICB9KTtcblxuICAgIGlmICh1cGRhdGUudHlwZSA9PT0gQ2FudmFzV2hpdGVib2FyZFVwZGF0ZVR5cGUuU1RBUlQpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZVNoYXBlQ29uc3RydWN0b3IgPSB0aGlzLmNhbnZhc1doaXRlYm9hcmRTaGFwZVNlcnZpY2UuZ2V0U2hhcGVDb25zdHJ1Y3RvckZyb21TaGFwZU5hbWUodXBkYXRlLnNlbGVjdGVkU2hhcGUpO1xuICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgdXBkYXRlU2hhcGVDb25zdHJ1Y3RvcihcbiAgICAgICAgbmV3IENhbnZhc1doaXRlYm9hcmRQb2ludCh1cGRhdGUueCwgdXBkYXRlLnkpLFxuICAgICAgICBPYmplY3QuYXNzaWduKG5ldyBDYW52YXNXaGl0ZWJvYXJkU2hhcGVPcHRpb25zKCksIHVwZGF0ZS5zZWxlY3RlZFNoYXBlT3B0aW9ucylcbiAgICAgICk7XG4gICAgICB0aGlzLl9pbmNvbXBsZXRlU2hhcGVzTWFwLnNldCh1cGRhdGUuVVVJRCwgc2hhcGUpO1xuICAgICAgdGhpcy5fZHJhd0luY29tcGxldGVTaGFwZXMoKTtcbiAgICB9IGVsc2UgaWYgKHVwZGF0ZS50eXBlID09PSBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlVHlwZS5EUkFHKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2luY29tcGxldGVTaGFwZXNNYXAuZ2V0KHVwZGF0ZS5VVUlEKTtcbiAgICAgIHNoYXBlICYmIHNoYXBlLm9uVXBkYXRlUmVjZWl2ZWQodXBkYXRlKTtcbiAgICAgIHRoaXMuX2RyYXdJbmNvbXBsZXRlU2hhcGVzKCk7XG4gICAgfSBlbHNlIGlmIChDYW52YXNXaGl0ZWJvYXJkVXBkYXRlVHlwZS5TVE9QKSB7XG4gICAgICBjb25zdCBzaGFwZSA9IHRoaXMuX2luY29tcGxldGVTaGFwZXNNYXAuZ2V0KHVwZGF0ZS5VVUlEKTtcbiAgICAgIHNoYXBlICYmIHNoYXBlLm9uU3RvcFJlY2VpdmVkKHVwZGF0ZSk7XG5cbiAgICAgIHRoaXMuX3NoYXBlc01hcC5zZXQodXBkYXRlLlVVSUQsIHNoYXBlKTtcbiAgICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNNYXAuZGVsZXRlKHVwZGF0ZS5VVUlEKTtcbiAgICAgIHRoaXMuX3N3YXBDb21wbGV0ZWRTaGFwZVRvQWN0dWFsQ2FudmFzKHNoYXBlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9kcmF3SW5jb21wbGV0ZVNoYXBlcygpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNldEluY29tcGxldGVTaGFwZUNhbnZhcygpO1xuICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNNYXAuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgIGlmIChzaGFwZS5pc1Zpc2libGUpIHtcbiAgICAgICAgc2hhcGUuZHJhdyh0aGlzLl9pbmNvbXBsZXRlU2hhcGVzQ2FudmFzQ29udGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9zd2FwQ29tcGxldGVkU2hhcGVUb0FjdHVhbENhbnZhcyhzaGFwZTogQ2FudmFzV2hpdGVib2FyZFNoYXBlKTogdm9pZCB7XG4gICAgdGhpcy5fZHJhd0luY29tcGxldGVTaGFwZXMoKTtcbiAgICBpZiAoc2hhcGUuaXNWaXNpYmxlKSB7XG4gICAgICBzaGFwZS5kcmF3KHRoaXMuY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVzZXRJbmNvbXBsZXRlU2hhcGVDYW52YXMoKTogdm9pZCB7XG4gICAgdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0LmNhbnZhcy53aWR0aCxcbiAgICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0LmNhbnZhcy5oZWlnaHQpO1xuICAgIHRoaXMuX2luY29tcGxldGVTaGFwZXNDYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9ICd0cmFuc3BhcmVudCc7XG4gICAgdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhc0NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhc0NvbnRleHQuY2FudmFzLndpZHRoLFxuICAgICAgdGhpcy5faW5jb21wbGV0ZVNoYXBlc0NhbnZhc0NvbnRleHQuY2FudmFzLmhlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGV2ZXJ5dGhpbmcgZnJvbSB0aGUgc2NyZWVuLCByZWRyYXcgdGhlIGJhY2tncm91bmQsIGFuZCB0aGVuIHJlZHJhdyBhbGwgdGhlIHNoYXBlcyBmcm9tIHRoZSBzaGFwZXNNYXBcbiAgICovXG4gIGRyYXdBbGxTaGFwZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fcmVkcmF3QmFja2dyb3VuZCgoKSA9PiB7XG4gICAgICB0aGlzLl9zaGFwZXNNYXAuZm9yRWFjaCgoc2hhcGU6IENhbnZhc1doaXRlYm9hcmRTaGFwZSkgPT4ge1xuICAgICAgICBpZiAoc2hhcGUuaXNWaXNpYmxlKSB7XG4gICAgICAgICAgc2hhcGUuZHJhdyh0aGlzLmNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkZEN1cnJlbnRTaGFwZURhdGFUb0FuVXBkYXRlKHVwZGF0ZTogQ2FudmFzV2hpdGVib2FyZFVwZGF0ZSk6IHZvaWQge1xuICAgIGlmICghdXBkYXRlLnNlbGVjdGVkU2hhcGUpIHtcbiAgICAgIHVwZGF0ZS5zZWxlY3RlZFNoYXBlID0gKG5ldyB0aGlzLnNlbGVjdGVkU2hhcGVDb25zdHJ1Y3RvcikuZ2V0U2hhcGVOYW1lKCk7XG4gICAgfVxuXG4gICAgaWYgKCF1cGRhdGUuc2VsZWN0ZWRTaGFwZU9wdGlvbnMpIHtcbiAgICAgIC8vIE1ha2UgYSBkZWVwIGNvcHkgc2luY2Ugd2UgZG9uJ3Qgd2FudCBzb21lIFNoYXBlIGltcGxlbWVudGF0aW9uIHRvIGNoYW5nZSBzb21ldGhpbmcgYnkgYWNjaWRlbnRcbiAgICAgIHVwZGF0ZS5zZWxlY3RlZFNoYXBlT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24obmV3IENhbnZhc1doaXRlYm9hcmRTaGFwZU9wdGlvbnMoKSxcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVNoYXBlUHJldmlld09wdGlvbnMoKSwge2xpbmVXaWR0aDogdGhpcy5saW5lV2lkdGh9KTtcbiAgICB9XG4gIH1cblxuICBnZW5lcmF0ZVNoYXBlUHJldmlld09wdGlvbnMoKTogQ2FudmFzV2hpdGVib2FyZFNoYXBlT3B0aW9ucyB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IENhbnZhc1doaXRlYm9hcmRTaGFwZU9wdGlvbnMoKSxcbiAgICAgIHtcbiAgICAgICAgc2hvdWxkRmlsbFNoYXBlOiAhIXRoaXMuZmlsbENvbG9yLFxuICAgICAgICBmaWxsU3R5bGU6IHRoaXMuZmlsbENvbG9yLFxuICAgICAgICBzdHJva2VTdHlsZTogdGhpcy5zdHJva2VDb2xvcixcbiAgICAgICAgbGluZVdpZHRoOiAyLFxuICAgICAgICBsaW5lSm9pbjogdGhpcy5saW5lSm9pbixcbiAgICAgICAgbGluZUNhcDogdGhpcy5saW5lQ2FwXG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgdXBkYXRlIHRvIGFsbCByZWNlaXZpbmcgZW5kcyBhcyBhbiBFdmVudCBlbWl0LiBUaGlzIGlzIGRvbmUgYXMgYSBiYXRjaCBvcGVyYXRpb24gKG1lYW5pbmdcbiAgICogbXVsdGlwbGUgdXBkYXRlcyBhcmUgc2VudCBhdCB0aGUgc2FtZSB0aW1lKS4gSWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkLCBhZnRlciAxMDAgbXMgYWxsIHVwZGF0ZXNcbiAgICogdGhhdCB3ZXJlIG1hZGUgYXQgdGhhdCB0aW1lIHdpbGwgYmUgcGFja2VkIHVwIHRvZ2V0aGVyIGFuZCBzZW50IHRvIHRoZSByZWNlaXZlci5cbiAgICpcbiAgICogQHBhcmFtIHVwZGF0ZSBUaGUgdXBkYXRlIG9iamVjdC5cbiAgICogQHJldHVybiBFbWl0cyBhbiBBcnJheSBvZiBVcGRhdGVzIHdoZW4gdGhlIGJhdGNoLlxuICAgKi9cbiAgcHJpdmF0ZSBfcHJlcGFyZVVwZGF0ZUZvckJhdGNoRGlzcGF0Y2godXBkYXRlOiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlKTogdm9pZCB7XG4gICAgdGhpcy5fYmF0Y2hVcGRhdGVzLnB1c2goY2xvbmVEZWVwKHVwZGF0ZSkpO1xuICAgIGlmICghdGhpcy5fdXBkYXRlVGltZW91dCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uQmF0Y2hVcGRhdGUuZW1pdCh0aGlzLl9iYXRjaFVwZGF0ZXMpO1xuICAgICAgICB0aGlzLl9iYXRjaFVwZGF0ZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVGltZW91dCA9IG51bGw7XG4gICAgICB9LCB0aGlzLmJhdGNoVXBkYXRlVGltZW91dER1cmF0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRHJhd3MgYW4gQXJyYXkgb2YgVXBkYXRlcyBvbiB0aGUgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0gdXBkYXRlcyBUaGUgYXJyYXkgd2l0aCBVcGRhdGVzLlxuICAgKi9cbiAgZHJhd1VwZGF0ZXModXBkYXRlczogQ2FudmFzV2hpdGVib2FyZFVwZGF0ZVtdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2NhbkRyYXcpIHtcbiAgICAgIHRoaXMuX2RyYXdNaXNzaW5nVXBkYXRlcygpO1xuICAgICAgdXBkYXRlcy5mb3JFYWNoKCh1cGRhdGU6IENhbnZhc1doaXRlYm9hcmRVcGRhdGUpID0+IHtcbiAgICAgICAgdGhpcy5fZHJhdyh1cGRhdGUpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZXNOb3REcmF3biA9IHRoaXMuX3VwZGF0ZXNOb3REcmF3bi5jb25jYXQodXBkYXRlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERyYXcgYW55IG1pc3NpbmcgdXBkYXRlcyB0aGF0IHdlcmUgcmVjZWl2ZWQgYmVmb3JlIHRoZSBpbWFnZSB3YXMgbG9hZGVkXG4gICAqL1xuICBwcml2YXRlIF9kcmF3TWlzc2luZ1VwZGF0ZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3VwZGF0ZXNOb3REcmF3bi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB1cGRhdGVzVG9EcmF3ID0gdGhpcy5fdXBkYXRlc05vdERyYXduO1xuICAgICAgdGhpcy5fdXBkYXRlc05vdERyYXduID0gW107XG5cbiAgICAgIHVwZGF0ZXNUb0RyYXcuZm9yRWFjaCgodXBkYXRlOiBDYW52YXNXaGl0ZWJvYXJkVXBkYXRlKSA9PiB7XG4gICAgICAgIHRoaXMuX2RyYXcodXBkYXRlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3cyBhbiBpbWFnZSBvbiB0aGUgY2FudmFzXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjb250ZXh0IHVzZWQgdG8gZHJhdyB0aGUgaW1hZ2Ugb24gdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIGltYWdlIFRoZSBpbWFnZSB0byBkcmF3LlxuICAgKiBAcGFyYW0geCBUaGUgWCBjb29yZGluYXRlIGZvciB0aGUgc3RhcnRpbmcgZHJhdyBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHkgVGhlIFkgY29vcmRpbmF0ZSBmb3IgdGhlIHN0YXJ0aW5nIGRyYXcgcG9zaXRpb24uXG4gICAqIEBwYXJhbSB3aWR0aCBUaGUgd2lkdGggb2YgdGhlIGltYWdlIHRoYXQgd2lsbCBiZSBkcmF3bi5cbiAgICogQHBhcmFtIGhlaWdodCBUaGUgaGVpZ2h0IG9mIHRoZSBpbWFnZSB0aGF0IHdpbGwgYmUgZHJhd24uXG4gICAqIEBwYXJhbSBvZmZzZXRYIFRoZSBvZmZzZXRYIGlmIHRoZSBpbWFnZSBzaXplIGlzIGxhcmdlciB0aGFuIHRoZSBjYW52YXMgKGFzcGVjdCBSYXRpbylcbiAgICogQHBhcmFtIG9mZnNldFkgVGhlIG9mZnNldFkgaWYgdGhlIGltYWdlIHNpemUgaXMgbGFyZ2VyIHRoYW4gdGhlIGNhbnZhcyAoYXNwZWN0IFJhdGlvKVxuICAgKi9cbiAgcHJpdmF0ZSBfZHJhd0ltYWdlKGNvbnRleHQ6IGFueSwgaW1hZ2U6IGFueSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBvZmZzZXRYOiBudW1iZXIsIG9mZnNldFk6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICB4ID0geSA9IDA7XG4gICAgICB3aWR0aCA9IGNvbnRleHQuY2FudmFzLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gY29udGV4dC5jYW52YXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIG9mZnNldFggPSB0eXBlb2Ygb2Zmc2V0WCA9PT0gJ251bWJlcicgPyBvZmZzZXRYIDogMC41O1xuICAgIG9mZnNldFkgPSB0eXBlb2Ygb2Zmc2V0WSA9PT0gJ251bWJlcicgPyBvZmZzZXRZIDogMC41O1xuXG4gICAgaWYgKG9mZnNldFggPCAwKSB7XG4gICAgICBvZmZzZXRYID0gMDtcbiAgICB9XG4gICAgaWYgKG9mZnNldFkgPCAwKSB7XG4gICAgICBvZmZzZXRZID0gMDtcbiAgICB9XG4gICAgaWYgKG9mZnNldFggPiAxKSB7XG4gICAgICBvZmZzZXRYID0gMTtcbiAgICB9XG4gICAgaWYgKG9mZnNldFkgPiAxKSB7XG4gICAgICBvZmZzZXRZID0gMTtcbiAgICB9XG5cbiAgICBjb25zdCBpbWFnZVdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgY29uc3QgaW1hZ2VIZWlnaHQgPSBpbWFnZS5oZWlnaHQ7XG4gICAgY29uc3QgcmFkaXVzID0gTWF0aC5taW4od2lkdGggLyBpbWFnZVdpZHRoLCBoZWlnaHQgLyBpbWFnZUhlaWdodCk7XG4gICAgbGV0IG5ld1dpZHRoID0gaW1hZ2VXaWR0aCAqIHJhZGl1cztcbiAgICBsZXQgbmV3SGVpZ2h0ID0gaW1hZ2VIZWlnaHQgKiByYWRpdXM7XG4gICAgbGV0IGZpbmFsRHJhd1g6IGFueTtcbiAgICBsZXQgZmluYWxEcmF3WTogYW55O1xuICAgIGxldCBmaW5hbERyYXdXaWR0aDogYW55O1xuICAgIGxldCBmaW5hbERyYXdIZWlnaHQ6IGFueTtcbiAgICBsZXQgYXNwZWN0UmF0aW8gPSAxO1xuXG4gICAgLy8gZGVjaWRlIHdoaWNoIGdhcCB0byBmaWxsXG4gICAgaWYgKG5ld1dpZHRoIDwgd2lkdGgpIHtcbiAgICAgIGFzcGVjdFJhdGlvID0gd2lkdGggLyBuZXdXaWR0aDtcbiAgICB9XG4gICAgaWYgKE1hdGguYWJzKGFzcGVjdFJhdGlvIC0gMSkgPCAxZS0xNCAmJiBuZXdIZWlnaHQgPCBoZWlnaHQpIHtcbiAgICAgIGFzcGVjdFJhdGlvID0gaGVpZ2h0IC8gbmV3SGVpZ2h0O1xuICAgIH1cbiAgICBuZXdXaWR0aCAqPSBhc3BlY3RSYXRpbztcbiAgICBuZXdIZWlnaHQgKj0gYXNwZWN0UmF0aW87XG5cbiAgICAvLyBjYWxjdWxhdGUgc291cmNlIHJlY3RhbmdsZVxuICAgIGZpbmFsRHJhd1dpZHRoID0gaW1hZ2VXaWR0aCAvIChuZXdXaWR0aCAvIHdpZHRoKTtcbiAgICBmaW5hbERyYXdIZWlnaHQgPSBpbWFnZUhlaWdodCAvIChuZXdIZWlnaHQgLyBoZWlnaHQpO1xuXG4gICAgZmluYWxEcmF3WCA9IChpbWFnZVdpZHRoIC0gZmluYWxEcmF3V2lkdGgpICogb2Zmc2V0WDtcbiAgICBmaW5hbERyYXdZID0gKGltYWdlSGVpZ2h0IC0gZmluYWxEcmF3SGVpZ2h0KSAqIG9mZnNldFk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhlIHNvdXJjZSByZWN0YW5nbGUgaXMgdmFsaWRcbiAgICBpZiAoZmluYWxEcmF3WCA8IDApIHtcbiAgICAgIGZpbmFsRHJhd1ggPSAwO1xuICAgIH1cbiAgICBpZiAoZmluYWxEcmF3WSA8IDApIHtcbiAgICAgIGZpbmFsRHJhd1kgPSAwO1xuICAgIH1cbiAgICBpZiAoZmluYWxEcmF3V2lkdGggPiBpbWFnZVdpZHRoKSB7XG4gICAgICBmaW5hbERyYXdXaWR0aCA9IGltYWdlV2lkdGg7XG4gICAgfVxuICAgIGlmIChmaW5hbERyYXdIZWlnaHQgPiBpbWFnZUhlaWdodCkge1xuICAgICAgZmluYWxEcmF3SGVpZ2h0ID0gaW1hZ2VIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gZmlsbCB0aGUgaW1hZ2UgaW4gZGVzdGluYXRpb24gcmVjdGFuZ2xlXG4gICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIGZpbmFsRHJhd1gsIGZpbmFsRHJhd1ksIGZpbmFsRHJhd1dpZHRoLCBmaW5hbERyYXdIZWlnaHQsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBIVE1MQ2FudmFzRWxlbWVudC50b0RhdGFVUkwoKSBtZXRob2QgcmV0dXJucyBhIGRhdGEgVVJJIGNvbnRhaW5pbmcgYSByZXByZXNlbnRhdGlvbiBvZiB0aGUgaW1hZ2UgaW4gdGhlIGZvcm1hdCBzcGVjaWZpZWQgYnkgdGhlIHR5cGUgcGFyYW1ldGVyIChkZWZhdWx0cyB0byBQTkcpLlxuICAgKiBUaGUgcmV0dXJuZWQgaW1hZ2UgaXMgaW4gYSByZXNvbHV0aW9uIG9mIDk2IGRwaS5cbiAgICogSWYgdGhlIGhlaWdodCBvciB3aWR0aCBvZiB0aGUgY2FudmFzIGlzIDAsIHRoZSBzdHJpbmcgXCJkYXRhOixcIiBpcyByZXR1cm5lZC5cbiAgICogSWYgdGhlIHJlcXVlc3RlZCB0eXBlIGlzIG5vdCBpbWFnZS9wbmcsIGJ1dCB0aGUgcmV0dXJuZWQgdmFsdWUgc3RhcnRzIHdpdGggZGF0YTppbWFnZS9wbmcsIHRoZW4gdGhlIHJlcXVlc3RlZCB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQuXG4gICAqIENocm9tZSBhbHNvIHN1cHBvcnRzIHRoZSBpbWFnZS93ZWJwIHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSByZXR1cm5lZERhdGFUeXBlIEEgRE9NU3RyaW5nIGluZGljYXRpbmcgdGhlIGltYWdlIGZvcm1hdC4gVGhlIGRlZmF1bHQgZm9ybWF0IHR5cGUgaXMgaW1hZ2UvcG5nLlxuICAgKiBAcGFyYW0gcmV0dXJuZWREYXRhUXVhbGl0eSBBIE51bWJlciBiZXR3ZWVuIDAgYW5kIDEgaW5kaWNhdGluZyBpbWFnZSBxdWFsaXR5IGlmIHRoZSByZXF1ZXN0ZWQgdHlwZSBpcyBpbWFnZS9qcGVnIG9yIGltYWdlL3dlYnAuXG4gICBJZiB0aGlzIGFyZ3VtZW50IGlzIGFueXRoaW5nIGVsc2UsIHRoZSBkZWZhdWx0IHZhbHVlIGZvciBpbWFnZSBxdWFsaXR5IGlzIHVzZWQuIFRoZSBkZWZhdWx0IHZhbHVlIGlzIDAuOTIuIE90aGVyIGFyZ3VtZW50cyBhcmUgaWdub3JlZC5cbiAgICovXG4gIGdlbmVyYXRlQ2FudmFzRGF0YVVybChyZXR1cm5lZERhdGFUeXBlOiBzdHJpbmcgPSAnaW1hZ2UvcG5nJywgcmV0dXJuZWREYXRhUXVhbGl0eTogbnVtYmVyID0gMSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dC5jYW52YXMudG9EYXRhVVJMKHJldHVybmVkRGF0YVR5cGUsIHJldHVybmVkRGF0YVF1YWxpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgQmxvYiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb250ZW50IGRyYXduIG9uIHRoZSBjYW52YXMuXG4gICAqIFRoaXMgZmlsZSBtYXkgYmUgY2FjaGVkIG9uIHRoZSBkaXNrIG9yIHN0b3JlZCBpbiBtZW1vcnkgYXQgdGhlIGRpc2NyZXRpb24gb2YgdGhlIHVzZXIgYWdlbnQuXG4gICAqIElmIHR5cGUgaXMgbm90IHNwZWNpZmllZCwgdGhlIGltYWdlIHR5cGUgaXMgaW1hZ2UvcG5nLiBUaGUgY3JlYXRlZCBpbWFnZSBpcyBpbiBhIHJlc29sdXRpb24gb2YgOTZkcGkuXG4gICAqIFRoZSB0aGlyZCBhcmd1bWVudCBpcyB1c2VkIHdpdGggaW1hZ2UvanBlZyBpbWFnZXMgdG8gc3BlY2lmeSB0aGUgcXVhbGl0eSBvZiB0aGUgb3V0cHV0LlxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tGbiBUaGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgYmxvYiBpcyBjcmVhdGVkLiBTaG91bGQgYWNjZXB0IGEgcGFyYW1ldGVyIEJsb2IgKGZvciB0aGUgcmVzdWx0KS5cbiAgICogQHBhcmFtIHJldHVybmVkRGF0YVR5cGUgQSBET01TdHJpbmcgaW5kaWNhdGluZyB0aGUgaW1hZ2UgZm9ybWF0LiBUaGUgZGVmYXVsdCB0eXBlIGlzIGltYWdlL3BuZy5cbiAgICogQHBhcmFtIHJldHVybmVkRGF0YVF1YWxpdHkgQSBOdW1iZXIgYmV0d2VlbiAwIGFuZCAxIGluZGljYXRpbmcgaW1hZ2UgcXVhbGl0eSBpZiB0aGUgcmVxdWVzdGVkIHR5cGUgaXMgaW1hZ2UvanBlZyBvciBpbWFnZS93ZWJwLlxuICAgSWYgdGhpcyBhcmd1bWVudCBpcyBhbnl0aGluZyBlbHNlLCB0aGUgZGVmYXVsdCB2YWx1ZSBmb3IgaW1hZ2UgcXVhbGl0eSBpcyB1c2VkLiBPdGhlciBhcmd1bWVudHMgYXJlIGlnbm9yZWQuXG4gICAqL1xuICBnZW5lcmF0ZUNhbnZhc0Jsb2IoY2FsbGJhY2tGbjogYW55LCByZXR1cm5lZERhdGFUeXBlOiBzdHJpbmcgPSAnaW1hZ2UvcG5nJywgcmV0dXJuZWREYXRhUXVhbGl0eTogbnVtYmVyID0gMSk6IHZvaWQge1xuICAgIGxldCB0b0Jsb2JNZXRob2Q6IEZ1bmN0aW9uO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvbnRleHQuY2FudmFzLnRvQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRvQmxvYk1ldGhvZCA9IHRoaXMuY29udGV4dC5jYW52YXMudG9CbG9iLmJpbmQodGhpcy5jb250ZXh0LmNhbnZhcyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgKHRoaXMuY29udGV4dC5jYW52YXMgYXMgYW55KS5tc1RvQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIEZvciBJRVxuICAgICAgdG9CbG9iTWV0aG9kID0gKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCh0aGlzLmNvbnRleHQuY2FudmFzIGFzIGFueSkubXNUb0Jsb2IoKSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHRvQmxvYk1ldGhvZCAmJiB0b0Jsb2JNZXRob2QoKGJsb2I6IEJsb2IpID0+IHtcbiAgICAgIGNhbGxiYWNrRm4gJiYgY2FsbGJhY2tGbihibG9iLCByZXR1cm5lZERhdGFUeXBlKTtcbiAgICB9LCByZXR1cm5lZERhdGFUeXBlLCByZXR1cm5lZERhdGFRdWFsaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIGNhbnZhcyBpbWFnZSByZXByZXNlbnRhdGlvbiBhbmQgZG93bmxvYWQgaXQgbG9jYWxseVxuICAgKiBUaGUgbmFtZSBvZiB0aGUgaW1hZ2UgaXMgY2FudmFzX2RyYXdpbmdfICsgdGhlIGN1cnJlbnQgbG9jYWwgRGF0ZSBhbmQgVGltZSB0aGUgaW1hZ2Ugd2FzIGNyZWF0ZWRcbiAgICogTWV0aG9kcyBmb3Igc3RhbmRhbG9uZSBjcmVhdGlvbiBvZiB0aGUgaW1hZ2VzIGluIHRoaXMgbWV0aG9kIGFyZSBsZWZ0IGhlcmUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAqXG4gICAqIEBwYXJhbSByZXR1cm5lZERhdGFUeXBlIEEgRE9NU3RyaW5nIGluZGljYXRpbmcgdGhlIGltYWdlIGZvcm1hdC4gVGhlIGRlZmF1bHQgdHlwZSBpcyBpbWFnZS9wbmcuXG4gICAqIEBwYXJhbSBkb3dubG9hZERhdGE/IFRoZSBjcmVhdGVkIHN0cmluZyBvciBCbG9iIChJRSkuXG4gICAqIEBwYXJhbSBjdXN0b21GaWxlTmFtZT8gVGhlIG5hbWUgb2YgdGhlIGZpbGUgdGhhdCBzaG91bGQgYmUgZG93bmxvYWRlZFxuICAgKi9cbiAgZG93bmxvYWRDYW52YXNJbWFnZShyZXR1cm5lZERhdGFUeXBlOiBzdHJpbmcgPSAnaW1hZ2UvcG5nJywgZG93bmxvYWREYXRhPzogc3RyaW5nIHwgQmxvYiwgY3VzdG9tRmlsZU5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkb3dubG9hZExpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICBkb3dubG9hZExpbmsuc2V0QXR0cmlidXRlKCdocmVmJywgZG93bmxvYWREYXRhID8gZG93bmxvYWREYXRhIGFzIHN0cmluZyA6IHRoaXMuZ2VuZXJhdGVDYW52YXNEYXRhVXJsKHJldHVybmVkRGF0YVR5cGUpKTtcblxuICAgICAgY29uc3QgZmlsZU5hbWUgPSBjdXN0b21GaWxlTmFtZSA/IGN1c3RvbUZpbGVOYW1lXG4gICAgICAgIDogKHRoaXMuZG93bmxvYWRlZEZpbGVOYW1lID8gdGhpcy5kb3dubG9hZGVkRmlsZU5hbWUgOiAnY2FudmFzX2RyYXdpbmdfJyArIG5ldyBEYXRlKCkudmFsdWVPZigpKTtcblxuICAgICAgZG93bmxvYWRMaW5rLnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlTmFtZSArIHRoaXMuX2dlbmVyYXRlRGF0YVR5cGVTdHJpbmcocmV0dXJuZWREYXRhVHlwZSkpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb3dubG9hZExpbmspO1xuICAgICAgZG93bmxvYWRMaW5rLmNsaWNrKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGRvd25sb2FkTGluayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElFLXNwZWNpZmljIGNvZGVcbiAgICAgIGlmIChkb3dubG9hZERhdGEpIHtcbiAgICAgICAgdGhpcy5fc2F2ZUNhbnZhc0Jsb2IoZG93bmxvYWREYXRhIGFzIEJsb2IsIHJldHVybmVkRGF0YVR5cGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZUNhbnZhc0Jsb2IodGhpcy5fc2F2ZUNhbnZhc0Jsb2IuYmluZCh0aGlzKSwgcmV0dXJuZWREYXRhVHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIGNhbnZhcyBibG9iIChJRSkgbG9jYWxseVxuICAgKiBAcGFyYW0gYmxvYlxuICAgKiBAcGFyYW0gcmV0dXJuZWREYXRhVHlwZVxuICAgKi9cbiAgcHJpdmF0ZSBfc2F2ZUNhbnZhc0Jsb2IoYmxvYjogQmxvYiwgcmV0dXJuZWREYXRhVHlwZTogc3RyaW5nID0gJ2ltYWdlL3BuZycpOiB2b2lkIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGJsb2IsICdjYW52YXNfZHJhd2luZ18nICtcbiAgICAgIG5ldyBEYXRlKCkudmFsdWVPZigpICsgdGhpcy5fZ2VuZXJhdGVEYXRhVHlwZVN0cmluZyhyZXR1cm5lZERhdGFUeXBlKSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgZ2VuZXJhdGVzIGEgY2FudmFzIHVybCBzdHJpbmcgb3IgYSBjYW52YXMgYmxvYiB3aXRoIHRoZSBwcmVzZW50ZWQgZGF0YSB0eXBlXG4gICAqIEEgY2FsbGJhY2sgZnVuY3Rpb24gaXMgdGhlbiBpbnZva2VkIHNpbmNlIHRoZSBibG9iIGNyZWF0aW9uIG11c3QgYmUgZG9uZSB2aWEgYSBjYWxsYmFja1xuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogQHBhcmFtIHJldHVybmVkRGF0YVR5cGVcbiAgICogQHBhcmFtIHJldHVybmVkRGF0YVF1YWxpdHlcbiAgICovXG4gIGdlbmVyYXRlQ2FudmFzRGF0YShjYWxsYmFjazogYW55LCByZXR1cm5lZERhdGFUeXBlOiBzdHJpbmcgPSAnaW1hZ2UvcG5nJywgcmV0dXJuZWREYXRhUXVhbGl0eTogbnVtYmVyID0gMSk6IHZvaWQge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnVzZWQtZXhwcmVzc2lvblxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sodGhpcy5nZW5lcmF0ZUNhbnZhc0RhdGFVcmwocmV0dXJuZWREYXRhVHlwZSwgcmV0dXJuZWREYXRhUXVhbGl0eSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdlbmVyYXRlQ2FudmFzQmxvYihjYWxsYmFjaywgcmV0dXJuZWREYXRhVHlwZSwgcmV0dXJuZWREYXRhUXVhbGl0eSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsIG1ldGhvZCB0byBpbnZva2Ugc2F2aW5nIG9mIHRoZSBjYW52YXMgZGF0YSB3aGVuIGNsaWNrZWQgb24gdGhlIGNhbnZhcyBTYXZlIGJ1dHRvblxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGVtaXQgdGhlIGdlbmVyYXRlZCBkYXRhIHdpdGggdGhlIHNwZWNpZmllZCBFdmVudCBFbWl0dGVyXG4gICAqXG4gICAqIEBwYXJhbSByZXR1cm5lZERhdGFUeXBlXG4gICAqL1xuICBzYXZlTG9jYWwocmV0dXJuZWREYXRhVHlwZTogc3RyaW5nID0gJ2ltYWdlL3BuZycpOiB2b2lkIHtcbiAgICB0aGlzLmdlbmVyYXRlQ2FudmFzRGF0YSgoZ2VuZXJhdGVkRGF0YTogc3RyaW5nIHwgQmxvYikgPT4ge1xuICAgICAgdGhpcy5vblNhdmUuZW1pdChnZW5lcmF0ZWREYXRhKTtcblxuICAgICAgaWYgKHRoaXMuc2hvdWxkRG93bmxvYWREcmF3aW5nKSB7XG4gICAgICAgIHRoaXMuZG93bmxvYWRDYW52YXNJbWFnZShyZXR1cm5lZERhdGFUeXBlLCBnZW5lcmF0ZWREYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dlbmVyYXRlRGF0YVR5cGVTdHJpbmcocmV0dXJuZWREYXRhVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAocmV0dXJuZWREYXRhVHlwZSkge1xuICAgICAgcmV0dXJuICcuJyArIHJldHVybmVkRGF0YVR5cGUuc3BsaXQoJy8nKVsxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgY29sb3IgcGlja2VyIHdpbmRvdywgZGVsZWdhdGluZyB0aGUgc2hvd0NvbG9yUGlja2VyIElucHV0IHRvIHRoZSBDb2xvclBpY2tlckNvbXBvbmVudC5cbiAgICogSWYgbm8gdmFsdWUgaXMgc3VwcGxpZWQgKG51bGwvdW5kZWZpbmVkKSB0aGUgY3VycmVudCB2YWx1ZSB3aWxsIGJlIG5lZ2F0ZWQgYW5kIHVzZWQuXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgdG9nZ2xlU3Ryb2tlQ29sb3JQaWNrZXIodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNob3dTdHJva2VDb2xvclBpY2tlciA9ICF0aGlzLl9pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6ICF0aGlzLnNob3dTdHJva2VDb2xvclBpY2tlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBjb2xvciBwaWNrZXIgd2luZG93LCBkZWxlZ2F0aW5nIHRoZSBzaG93Q29sb3JQaWNrZXIgSW5wdXQgdG8gdGhlIENvbG9yUGlja2VyQ29tcG9uZW50LlxuICAgKiBJZiBubyB2YWx1ZSBpcyBzdXBwbGllZCAobnVsbC91bmRlZmluZWQpIHRoZSBjdXJyZW50IHZhbHVlIHdpbGwgYmUgbmVnYXRlZCBhbmQgdXNlZC5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB0b2dnbGVGaWxsQ29sb3JQaWNrZXIodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNob3dGaWxsQ29sb3JQaWNrZXIgPSAhdGhpcy5faXNOdWxsT3JVbmRlZmluZWQodmFsdWUpID8gdmFsdWUgOiAhdGhpcy5zaG93RmlsbENvbG9yUGlja2VyO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIHNoYXBlIHNlbGVjdG9yIHdpbmRvdywgZGVsZWdhdGluZyB0aGUgc2hvd1NoYXBlU2VsZWN0b3IgSW5wdXQgdG8gdGhlIENhbnZhc1doaXRlYm9hcmRTaGFwZVNlbGVjdG9yQ29tcG9uZW50LlxuICAgKiBJZiBubyB2YWx1ZSBpcyBzdXBwbGllZCAobnVsbC91bmRlZmluZWQpIHRoZSBjdXJyZW50IHZhbHVlIHdpbGwgYmUgbmVnYXRlZCBhbmQgdXNlZC5cbiAgICogQHBhcmFtIHZhbHVlXG4gICAqL1xuICB0b2dnbGVTaGFwZVNlbGVjdG9yKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zaG93U2hhcGVTZWxlY3RvciA9ICF0aGlzLl9pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6ICF0aGlzLnNob3dTaGFwZVNlbGVjdG9yO1xuICB9XG5cbiAgc2VsZWN0U2hhcGUobmV3U2hhcGVCbHVlcHJpbnQ6IElOZXdDYW52YXNXaGl0ZWJvYXJkU2hhcGU8Q2FudmFzV2hpdGVib2FyZFNoYXBlPik6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWRTaGFwZUNvbnN0cnVjdG9yID0gbmV3U2hhcGVCbHVlcHJpbnQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGRlZXAgY29weSBvZiB0aGUgY3VycmVudCBkcmF3aW5nIGhpc3RvcnkgZm9yIHRoZSBjYW52YXMuXG4gICAqIFRoZSBkZWVwIGNvcHkgaXMgcmV0dXJuZWQgYmVjYXVzZSB3ZSBkb24ndCB3YW50IGFueW9uZSB0byBtdXRhdGUgdGhlIGN1cnJlbnQgaGlzdG9yeVxuICAgKi9cbiAgZ2V0RHJhd2luZ0hpc3RvcnkoKTogQ2FudmFzV2hpdGVib2FyZFVwZGF0ZVtdIHtcbiAgICByZXR1cm4gY2xvbmVEZWVwKHRoaXMuX3VwZGF0ZUhpc3RvcnkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlIGZyb20gYSBnaXZlbiBzdWJzY3JpcHRpb24gaWYgaXQgaXMgYWN0aXZlXG4gICAqIEBwYXJhbSBzdWJzY3JpcHRpb25cbiAgICovXG4gIHByaXZhdGUgX3Vuc3Vic2NyaWJlKHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgaWYgKHN1YnNjcmlwdGlvbikge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVVVUlEKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmRvbTQoKSArIHRoaXMuX3JhbmRvbTQoKSArICctJyArIHRoaXMuX3JhbmRvbTQoKSArICctJyArIHRoaXMuX3JhbmRvbTQoKSArICctJyArXG4gICAgICB0aGlzLl9yYW5kb200KCkgKyAnLScgKyB0aGlzLl9yYW5kb200KCkgKyB0aGlzLl9yYW5kb200KCkgKyB0aGlzLl9yYW5kb200KCk7XG4gIH1cblxuICBwcml2YXRlIF9yYW5kb200KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoKDEgKyBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDApXG4gICAgICAudG9TdHJpbmcoMTYpXG4gICAgICAuc3Vic3RyaW5nKDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlIGZyb20gdGhlIHNlcnZpY2Ugb2JzZXJ2YWJsZXNcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKHRoaXMuX3Jlc2l6ZVN1YnNjcmlwdGlvbik7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUodGhpcy5fcmVnaXN0ZXJlZFNoYXBlc1N1YnNjcmlwdGlvbik7XG4gICAgdGhpcy5fY2FudmFzV2hpdGVib2FyZFNlcnZpY2VTdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHRoaXMuX3Vuc3Vic2NyaWJlKHN1YnNjcmlwdGlvbikpO1xuICB9XG59XG4iXX0=