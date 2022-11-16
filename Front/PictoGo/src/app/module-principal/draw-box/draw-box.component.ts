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
  canvas = { width: 810, height: 400 };
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
    console.log(this.cx);
  }

  refresh() {
    this.cx.beginPath();
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


