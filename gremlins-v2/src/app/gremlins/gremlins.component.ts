import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Tracker, containsBox, randomRange } from '../tracker/tracker';
import { NgZone } from '@angular/core';
import { Pos } from '../tracker/image-data';

@Component({
  selector: 'app-gremlins',
  styles: [`
    h1, h2 { text-align: center; }
    .container {width: 640px;margin: auto;}
    .toolbar {padding: 10px 0;}
    .canva {
      position: relative;
      width: 640px;
      height: 480px;
      margin: auto;
      border: 1px dotted gray;
    }
    .hidden {visibility: hidden}
    .right {float: right}
    .right {float: right}
    .red {color: red}
    .blue {color: blue}
    .center {width: 200px; margin: auto; display: block; text-align: center}
    video, canvas {position: absolute; top: 0; left: 0;}
    .invert {-webkit-transform: scaleX(-1);transform: scaleX(-1);}
  `],
  template: `
    <div class="container">
      <h1>Gremlins Slaughter House</h1>
      <h2>JavaScript object tracking demonstration game</h2>
      <div class="canva" [ngClass]="{invert: invert}">
        <video #video width="640" height="480" autoplay></video>
        <canvas #canvas width="640" height="480" (click)="onCanvasClick($event)"></canvas>
      </div>
      <div class="toolbar">
        <label class="right"><input type="checkbox" [(ngModel)]="invert" /> invert</label>
        <b>{{score}} Kills</b>
        <p class="center">
          <button class="btn btn-default" *ngIf="!tracker" (click)="onCanvasClick($event)">Play</button>
          <b class=" blue" *ngIf="tracker && !tracker.trackingColor" (click)="onCanvasClick($event)"> Select color to track</b>
          <b class=" red" *ngIf="tracker && tracker.trackingColor">Kill 'Em All</b>
        </p>
        <hr>
        <p class="center">
          <a href="https://github.com/SlackMap/slackmap-play/tree/master/gremlins-v2" target="_blank">Source code on GitHub</a>
        </p>
      </div>
    </div>
    <img #gremlin src="assets/gremlin.png" class="hidden" />
    <img #knife src="assets/knife.png"  class="hidden" />

  `,
  encapsulation: ViewEncapsulation.None
})
export class GremlinsComponent implements OnInit {

  @ViewChild('video') videoRef: ElementRef;
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('gremlin') gremlinRef: ElementRef;
  @ViewChild('knife') knifeRef: ElementRef;

  public invert = true;
  public rendering = false;
  public tracker: Tracker;
  public context: CanvasRenderingContext2D;
  public gremlinPos: Pos;
  public score = 0;

  constructor(public ngZone: NgZone) {

  }

  ngOnInit() {
    this.context = this.canvasRef.nativeElement.getContext('2d');
  }

  onCanvasClick(e) {

    // console.log('canvas', e.layerX, e.layerY);

    if (this.tracker) {
      const video = this.videoRef.nativeElement;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.width;
      canvas.height = video.height;

      let clickPos;
      if (this.invert) {
        clickPos = [video.width - e.layerX, e.layerY];
      } else {
        clickPos = [e.layerX, e.layerY];
      }

      context.drawImage(video, 0, 0);

      const frame = <any>context.getImageData(0, 0, video.width, video.height);
      const trackedColor = <any>context.getImageData(clickPos[0], clickPos[1], 1, 1).data;

      this.tracker.setFrame(frame);

      // this.tracker.trackColorFrom([e.layerX, e.layerY]);
      this.tracker.setTrackingColor(trackedColor);
      if (!this.rendering) {
        this.render();
        this.gremlinPos = [
          randomRange(50, 580),
          randomRange(50, 420)
        ];
      }
    } else {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.videoRef.nativeElement.src = window.URL.createObjectURL(stream);
        this.videoRef.nativeElement.play();
        this.tracker = new Tracker();
      });
    }
  }

  render() {
    if (!this.tracker) {
      return;
    }
    this.rendering = true;
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.width;
    canvas.height = video.height;

    context.drawImage(video, 0, 0);

    const frame = <any>context.getImageData(0, 0, video.width, video.height);

    this.tracker.setFrame(frame);

    this.tracker.track();

    const data = this.tracker.getTrackedColorMesh();
    this.context.clearRect(0, 0, video.width, video.height);
    if (data) {
      // this.context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
    }

    const point = this.tracker.getTrackedColorCenter();
    if (point) {
      // this.context.fillStyle = 'rgba(255,0,0,125)';
      // this.context.fillRect(point[0], point[1], 20, 20);
      this.context.drawImage(this.knifeRef.nativeElement, point[0], point[1], 100, 100);
      this.hitGremlin(point);
    }

    // render gremlin
    if (this.gremlinPos) {
      // this.context.fillStyle = 'rgba(0,255,0,125)';
      // this.context.fillRect(this.gremlinPos[0], this.gremlinPos[1], 60, 60);
      this.context.drawImage(this.gremlinRef.nativeElement, this.gremlinPos[0], this.gremlinPos[1], 200, 122);
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(this.render.bind(this));
    });
  }

  /**
   * check if poit is inside gremlin
   * if yes, score++ & place new gremlin
   */
  hitGremlin(point) {
    if (!this.gremlinPos) {
      return;
    }
    if (containsBox([...this.gremlinPos, this.gremlinPos[0] + 200, this.gremlinPos[1] + 122], point)) {
      this.gremlinPos = [
        randomRange(50, 500),
        randomRange(50, 340)
      ];
      this.ngZone.run(() => {
        this.score++;
      });
    }
  }

  // play() {
  //   if (this.stream) return;
  //   navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  //     this.stream = stream;
  //     this.$refs.video.src = window.URL.createObjectURL(stream);
  //     this.$refs.video.play();
  //     this.snap()
  //   });
  // }

  // stop() {
  //   if (this.stream) {
  //     this.stream.getTracks()[0].stop();
  //     this.stream = null;
  //   }
  // }

}
