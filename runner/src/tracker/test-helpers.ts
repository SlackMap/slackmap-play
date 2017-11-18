import { Pixel } from './image-data';

/**
 * mapping char => rgba pixel array
 */
const colors = {
  '-': [0, 0, 0, 0],         // transparent black

  '0': [0, 0, 0, 255],     // black
  '1': [128, 128, 128, 255], // gray
  '9': [255, 255, 255, 255], // white

  'r': [255, 0, 0, 255], // Red
  'R': [255, 0, 0, 128], // Red half-alpha
  'g': [0, 255, 0, 255], // Green
  'G': [0, 255, 0, 128], // Green half-alpha
  'b': [0, 255, 0, 255], // Green
  'B': [0, 0, 255, 128] // Green half-alpha
};

/**
 * create pizel array from char
 *
 * @param colorChar colors char
 */
export function mkPixel(colorChar: string): Pixel {
  if (!colors[colorChar]) {
    throwUndefinedChar(colorChar);
  }
  return colors[colorChar];
}

/**
 * Build a ImageData object from a array of chars
 */
export function mkImageData(...pixels: string[]): ImageData {
  const data: ImageData = new ImageData(pixels[0].length, pixels.length);
  let pixelsData: number[] = [];
  for (let y = 0; y < data.height; y++) {
    const line = pixels[y];
    if (line.length !== data.width) {
      throw new Error(`wrong number of cols: row ${y} has ${line.length} cols, expected value is ${data.width}`);
    }
    for (let x = 0; x < data.width; x++) {
      const pixel = colors[line[x]];
      if (typeof pixel === 'undefined') {
        throwUndefinedChar(line[x]);
      } else {
        // console.log(data.data.length, data.width*data.height*4);
        pixelsData = [...pixelsData, ...pixel];
      }
    }
    data.data.set(pixelsData);
  }
  return data;
}



/**
 * HELPERS
 */

function hasOwnProp(obj, key) {
  Object.prototype.hasOwnProperty.call(obj, key);
}

function hashForEach(hash, func) {
  for (const key in hash) {
    if (hasOwnProp(hash, key)) {
      func(key, hash[key]);
    }
  }
}

function throwUndefinedChar(char) {
  throw Error('The char "' + char + '" is not a color. ' +
    'Valid chars: ' + Object.keys(colors).join(','));
}
