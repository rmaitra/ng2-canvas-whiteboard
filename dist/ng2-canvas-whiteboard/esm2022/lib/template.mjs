export const DEFAULT_STYLES = `
.canvas_whiteboard_button {
    display: inline-block;
    outline: 0px;
    padding-top: 7px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}

.canvas_whiteboard_buttons {
    z-index: 3;
}

@media (max-width: 400px) {
     .canvas_whiteboard_buttons {
            position: absolute;
            top: 0;
            width: 100%;
            text-align: center;
      }
}

@media (min-width: 401px) {
    .canvas_whiteboard_buttons {
        position: absolute;
        right: 0%;
        color: #fff;
    }
}

.canvas_whiteboard_buttons {
    padding: 5px;
}

.canvas_whiteboard_buttons > button {
    margin: 5px;
}

.canvas_whiteboard_button-draw_animated {
    -webkit-animation: pulsate 1s ease-out;
    -webkit-animation-iteration-count: infinite;
}

@keyframes pulsate {
    0% {
        -webkit-transform: scale(0.1, 0.1);
        opacity: 0.0;
    }
    50% {
        opacity: 1.0;
    }
    100% {
        -webkit-transform: scale(1.2, 1.2);
        opacity: 0.0;
    }
}
.canvas_wrapper_div {
    width: 100%;
    height: 100%;
    border: 0.5px solid #e2e2e2;
}

.canvas_whiteboard_button-clear {
    padding-top: 5px;
}

.canvas_whiteboard {
    position: absolute;
    z-index: 1;
}

.incomplete_shapes_canvas_whiteboard {
    position: absolute;
    z-index: 2;
}

`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItY2FudmFzLXdoaXRlYm9hcmQvc3JjL2xpYi90ZW1wbGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EyRjdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgREVGQVVMVF9TVFlMRVMgPSBgXG4uY2FudmFzX3doaXRlYm9hcmRfYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgb3V0bGluZTogMHB4O1xuICAgIHBhZGRpbmctdG9wOiA3cHg7XG4gICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICBsaW5lLWhlaWdodDogMS40Mjg1NzE0MztcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgIC1tcy10b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcbiAgICB0b3VjaC1hY3Rpb246IG1hbmlwdWxhdGlvbjtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcbiAgICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xuICAgIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLmNhbnZhc193aGl0ZWJvYXJkX2J1dHRvbnMge1xuICAgIHotaW5kZXg6IDM7XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0MDBweCkge1xuICAgICAuY2FudmFzX3doaXRlYm9hcmRfYnV0dG9ucyB7XG4gICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDQwMXB4KSB7XG4gICAgLmNhbnZhc193aGl0ZWJvYXJkX2J1dHRvbnMge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHJpZ2h0OiAwJTtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgfVxufVxuXG4uY2FudmFzX3doaXRlYm9hcmRfYnV0dG9ucyB7XG4gICAgcGFkZGluZzogNXB4O1xufVxuXG4uY2FudmFzX3doaXRlYm9hcmRfYnV0dG9ucyA+IGJ1dHRvbiB7XG4gICAgbWFyZ2luOiA1cHg7XG59XG5cbi5jYW52YXNfd2hpdGVib2FyZF9idXR0b24tZHJhd19hbmltYXRlZCB7XG4gICAgLXdlYmtpdC1hbmltYXRpb246IHB1bHNhdGUgMXMgZWFzZS1vdXQ7XG4gICAgLXdlYmtpdC1hbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBwdWxzYXRlIHtcbiAgICAwJSB7XG4gICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwLjEsIDAuMSk7XG4gICAgICAgIG9wYWNpdHk6IDAuMDtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgb3BhY2l0eTogMS4wO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEuMiwgMS4yKTtcbiAgICAgICAgb3BhY2l0eTogMC4wO1xuICAgIH1cbn1cbi5jYW52YXNfd3JhcHBlcl9kaXYge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBib3JkZXI6IDAuNXB4IHNvbGlkICNlMmUyZTI7XG59XG5cbi5jYW52YXNfd2hpdGVib2FyZF9idXR0b24tY2xlYXIge1xuICAgIHBhZGRpbmctdG9wOiA1cHg7XG59XG5cbi5jYW52YXNfd2hpdGVib2FyZCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDE7XG59XG5cbi5pbmNvbXBsZXRlX3NoYXBlc19jYW52YXNfd2hpdGVib2FyZCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDI7XG59XG5cbmA7XG4iXX0=