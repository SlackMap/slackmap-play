import { Pixel, Box, Pos } from './image-data';


export class Tracker {

  private threshold = 95;
  private frame: ImageData;
  public trackingColor: Pixel;
  private trackedColorBox: Box;
  private trackedColorMesh: ImageData;
  private trackedColorCenter: Pos;

  setTrackingColor(color: Pixel) {
    this.trackingColor = color;
  }

  setFrame(frame: ImageData): void {
    this.frame = frame;
  }

  track(): Box {
    let box: Box;
    const trackedColorMesh: ImageData = new ImageData(this.frame.width, this.frame.height);

    const imgPixels = this.frame;

    let closest = [];
    let closestDist = 0;

    for (let y = 0; y < imgPixels.height; y++) {
      for (let x = 0; x < imgPixels.width; x++) {
        const i = (y * 4) * imgPixels.width + x * 4;

        const pixel = [imgPixels.data[i], imgPixels.data[i + 1], imgPixels.data[i + 2]];
        const d = colorDistance(pixel, this.trackingColor);

        if (d > closestDist) {
          closestDist = d;
          closest = [x + 1, y + 1];
        }

        if (d > this.threshold) {
          box = extendBox(box, [x + 1, y + 1]);
          trackedColorMesh.data[i] = 0;
          trackedColorMesh.data[i + 1] = 0;
          trackedColorMesh.data[i + 2] = 0;
          trackedColorMesh.data[i + 3] = 255;
        } else {
          trackedColorMesh.data[i] = 0;
          trackedColorMesh.data[i + 1] = 0;
          trackedColorMesh.data[i + 2] = 0;
          trackedColorMesh.data[i + 3] = 0;

        }
      }
    }
    this.trackedColorBox = box;
    this.trackedColorCenter = getBoxCenter(box);
    this.trackedColorMesh = trackedColorMesh;

    return box;
  }

  getTrackedColorCenter(): Pos {
    return this.trackedColorCenter;
  }

  getTrackedColorMesh(): ImageData {
    return this.trackedColorMesh;
  }
}

/**
 * returns position of the box center
 *
 * @param box Box
 */
export function getBoxCenter(box: Box): Pos | null {
  if (!box) {
    return null;
  }
  const [x1, y1, x2, y2] = box;
  return [x1 + ((x2 - x1) / 2), y1 + ((y2 - y1) / 2)];
}

/**
 * converts rgb to hex
 */
function rgbToHex(r, g, b) {
  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * returns similarity distance between two colors
 */
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

/**
 * check if square contains the point
 * @param square
 * @param point
 */
function contains(s, p) {
  return ((p[0] > s[0] && p[0] < s[2]) && (p[1] > s[1] && p[1] < s[3]));
}
export function containsBox(box, box2) {
  const [x1, y1, x2, y2] = box2;
  return contains(box, [x1, y1]) || contains(box, [x2, y2]) || contains(box, [x2, y1]) || contains(box, [x1, y2]);
}

// console.log('not CONTAINS', contains([10,10,60,60], [5,5]))
// console.log('CONTAINS', contains([10,10,60,60], [15,15]))
// console.log('not CONTAINS', contains([10,10,60,60], [115,15]))

export function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
