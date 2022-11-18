import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter
} from "@angular/core";
import { fromEvent } from "rxjs";
import { tap, concatMap, takeUntil } from "rxjs/operators";
import {Room} from "../../model/room.model";
import {ChatMessage} from "../../model/message.model";
import {User} from "../../model/user.model";
import {LocalStorageService} from "../../service/local-storage.service";

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
export class DrawBoxComponent implements OnInit, OnChanges, AfterViewInit {

  @Output() drawInfoSend: EventEmitter<ChatMessage> = new EventEmitter<ChatMessage>();

  @Input() drawInfo: ChatMessage;
  @Input() drawInfos: ChatMessage[];
  @Input() actualRoom: Room;
  @Input() drawerName: string;

  private mouse: string = "";
  private mouseUpOffsetX : number;
  private mouseUpOffsetY : number;
  private mouseWasUp: boolean = false;

  private user: User = new User();

  name = "Angular";
  // @ts-ignore
  cx;
  canvas = { width: 810, height: 400 };
  currentLocation = { x: 200, y: 200 };
  //preDirection: string;

  locationList = [];

  @ViewChild("myCanvas", { static: false }) myCanvas : ElementRef | undefined;

  constructor(private el: ElementRef, private localStorageService: LocalStorageService) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes["drawInfo"]) {

      // @ts-ignore
      const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
      this.cx = canvasEl.getContext("2d");

      if(this.drawInfo.mouse === "mouseup") {
        this.mouseWasUp = true;
      }

      if(this.drawInfo.mouse === "mousemove") {
        if(this.mouseWasUp){
          this.cx.moveTo(this.drawInfo.offsetX, this.drawInfo.offsetY);
          this.mouseWasUp = false;
        } else {
          this.draw(Number(this.drawInfo.offsetX), Number(this.drawInfo.offsetY));
        }

      }

      if(this.drawInfo.mouse === "mousedown") {
      }

    }
  }

  ngAfterViewInit(): void {
    this.drawFunction();
  }

  drawFunction() {

    // @ts-ignore
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d");
    // @ts-ignore
    const mouseDown$ = fromEvent(this.myCanvas.nativeElement, "mousedown");
    // @ts-ignore
    const mouseMove$ = fromEvent(this.myCanvas.nativeElement, "mousemove");
    // @ts-ignore
    const mouseUp$ = fromEvent(this.myCanvas.nativeElement, "mouseup");


    mouseUp$.pipe().subscribe({
      next: (mouse: any) => {
        this.mouse = mouse.type;
        if (this.actualRoom.name === this.drawerName && (this.mouse === "mouseup") && !this.mouseWasUp) {
          this.drawInfoSend.emit({
            message: 'drawInfo',
            action: 'send-draw',
            target: this.actualRoom,
            sender: this.user,
            offsetX: mouse.offsetX.toString(),
            offsetY: mouse.offsetY.toString(),
            mouse: this.mouse,
          });
        }
      }
      })

      mouseDown$.pipe(concatMap(down => mouseMove$.pipe(takeUntil(mouseUp$))));

      const mouseDraw$ = mouseDown$.pipe(
        // @ts-ignore
        tap((e: MouseEvent) => {
          this.mouse = e.type
          this.cx.moveTo(e.offsetX, e.offsetY);
        }),
        concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
      );
  // @ts-ignore
      mouseDraw$.subscribe((e: MouseEvent) => {
        this.mouse = e.type;
        this.draw(e.offsetX, e.offsetY);

      });


  }

  draw(offsetX: number, offsetY: number) {
    if(this.actualRoom.name === this.drawerName) {
      this.drawInfoSend.emit({
        message: 'drawInfo',
        action: 'send-draw',
        target: this.actualRoom,
        sender: this.user,
        offsetX: offsetX.toString(),
        offsetY: offsetY.toString(),
        mouse: this.mouse,
      });
    }
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  refresh() {
    this.cx.beginPath();
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


