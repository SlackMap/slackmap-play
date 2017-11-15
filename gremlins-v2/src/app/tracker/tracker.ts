import { Pixel, ImageData, Box } from './image-data';


export class Tracker {

  private threshold = 95;
  private frame: ImageData;
  private trackingColor: Pixel;

  setTrackingColor(color: Pixel) {
    this.trackingColor = color;
  }

  setFrame(frame: ImageData): void {
    this.frame = frame;
  }
  track(): Box {
    let box: Box = [0, 0, 0, 0];
    const imgPixels = this.frame;

    let closest = [];
    let closestDist = 0;

    for (let y = 0; y < imgPixels.height; y++) {
      for (let x = 0; x < imgPixels.width; x++) {
        const i = (y * 4) * imgPixels.width + x * 4;

        // avg is brigthes, and we check it against threshold
        // var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;

        const pixel = [imgPixels.data[i], imgPixels.data[i + 1], imgPixels.data[i + 2]];
        const d = colorDistance(pixel, this.trackingColor);

        if (d > closestDist) {
          closestDist = d;
          closest = [x, y];
        }

        if (d > this.threshold) {

          imgPixels.data[i] = 0;
          imgPixels.data[i + 1] = 255;
          imgPixels.data[i + 2] = 0;
          imgPixels.data[i + 3] = 255;
          // update box
          box = extendBox(box, [x, y]);
        } else {
          imgPixels.data[i] = 0;
          imgPixels.data[i + 1] = 0;
          imgPixels.data[i + 2] = 0;
          imgPixels.data[i + 3] = 0;

        }
      }
    }
    return box;
  }
}

export function colorDistance(c1, c2): number {
  const rDiff = Math.abs(c1[0] - c2[0]);
  const gDiff = Math.abs(c1[1] - c2[1]);
  const bDiff = Math.abs(c1[2] - c2[2]);

  const rScore = 100 - (rDiff / 255 * 100);
  const gScore = 100 - (gDiff / 255 * 100);
  const bScore = 100 - (bDiff / 255 * 100);
  return Math.round((rScore + gScore + bScore) / 3);
}

export function extendBox(box, pixel): Box {
  if (!box) {
    return <Box>[...pixel, ...pixel];
  }

  let [x1, y1, x2, y2] = box;
  const [px, py] = pixel;

  if (px < x1) {
    x1 = px;
  }
  if (px > x2) {
    x2 = px;
  }
  if (py < y1) {
    y1 = py;
  }
  if (py > y2) {
    y2 = py;
  }
  return [x1, y1, x2, y2];
}
