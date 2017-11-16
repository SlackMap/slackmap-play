import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Tracker } from '../tracker/tracker';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-gremlins',
  styles: [`
    h1, h2 { text-align: center; color: white; }
    .container {width: 640px;margin: auto;}
    .toolbar {padding: 10px 0;}
    .canva {
      position: relative;
      width: 640px;
      height: 480px;
      margin: auto;
      border: 1px dotted gray;
    }
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
        <label><input type="checkbox" [(ngModel)]="invert" /> invert</label>
      </div>
    </div>

  `,
  encapsulation: ViewEncapsulation.None
})
export class GremlinsComponent implements OnInit {

  @ViewChild('video') videoRef: ElementRef;
  @ViewChild('canvas') canvasRef: ElementRef;

  public invert = false;
  public rendering = false;
  public tracker: Tracker;
  public context: CanvasRenderingContext2D;

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

    const data = this.tracker.getTrackedBoxImageData();

    if (data) {
      this.context.putImageData(data, 0, 0, 0, 0, data.width, data.height);
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(this.render.bind(this));
    });
  }

}
