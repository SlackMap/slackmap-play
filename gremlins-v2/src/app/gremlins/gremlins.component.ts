import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

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

  @ViewChild('video') videoRef:ElementRef;
  @ViewChild('canvas') canvasref:ElementRef;

  public invert: boolean = true;

  constructor() { 
    
  }

  ngOnInit() {
    
  }

  onCanvasClick(e) {
    console.log('canvas', e.layerX, e.layerY)
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.videoRef.nativeElement.src = window.URL.createObjectURL(stream);
        this.videoRef.nativeElement.play();
    });
  }

}
