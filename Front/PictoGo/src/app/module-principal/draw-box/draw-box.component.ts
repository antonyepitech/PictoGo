import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit
} from "@angular/core";
import { fromEvent, combineLatest } from "rxjs";
import { filter, tap, concatMap, mergeMap, takeUntil } from "rxjs/operators";

export enum Direction {
  up,
  left,
  down,
  right
}

export const DistanceConfig = {
  up: {
    x: 0,
    y: 10
  },
  left: {
    x: -10,
    y: 0
  },
  down: {
    x: 0,
    y: -10
  },
  right: {
    x: 10,
    y: 0
  }
};

@Component({
  selector: "app-draw-box",
  templateUrl: "./draw-box.component.html",
  styleUrls: ["./draw-box.component.scss"]
})
export class DrawBoxComponent implements OnInit, AfterViewInit {
  name = "Angular";
  // @ts-ignore
  cx;
  canvas = { width: 800, height: 500 };
  currentLocation = { x: 200, y: 200 };
  //preDirection: string;

  locationList = [];

  @ViewChild("myCanvas", { static: false }) myCanvas : ElementRef | undefined;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    // @ts-ignore
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d");
// @ts-ignore
    const mouseDown$ = fromEvent(this.myCanvas.nativeElement, "mousedown");
    // @ts-ignore
    const mouseMove$ = fromEvent(this.myCanvas.nativeElement, "mousemove");
    // @ts-ignore
    const mouseUp$ = fromEvent(this.myCanvas.nativeElement, "mouseup");

    mouseDown$.pipe(concatMap(down => mouseMove$.pipe(takeUntil(mouseUp$))));

    const mouseDraw$ = mouseDown$.pipe(
      // @ts-ignore
      tap((e: MouseEvent) => {
        this.cx.moveTo(e.offsetX, e.offsetY);
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );
// @ts-ignore
    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
  }

  draw(offsetX: number, offsetY: number) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  autoDraw() {
    const runTimes = 100;
    for (let i = 0; i < runTimes; i++) {
      this.excuteAutoDraw();
    }
  }

  excuteAutoDraw() {
    const direction = this.getDirection();

    // @ts-ignore
    const distance = DistanceConfig[direction];
    const newLocation = { ...this.currentLocation };
    newLocation.x = newLocation.x + distance.x;
    newLocation.y = newLocation.y + distance.y;

    if (this.isNewPath(newLocation)) {
      console.log(this.currentLocation, newLocation);
      this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
      this.cx.lineTo(newLocation.x, newLocation.y);
      this.cx.stroke();

      this.currentLocation = newLocation;
      // @ts-ignore
      this.locationList.push(newLocation);
    }

  }

  isNewPath(newLoc: { x: number; y: number }) {
    const idx = this.locationList.findIndex(
      // @ts-ignore
      oldLoc => oldLoc.x === newLoc.x && oldLoc.y == newLoc.y
    );
    return idx == -1;
  }

  getDirection() {
    const idx = Math.floor(Math.random() * 4);
    return Direction[idx];
  }

  refresh() {
    this.cx.beginPath();
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


