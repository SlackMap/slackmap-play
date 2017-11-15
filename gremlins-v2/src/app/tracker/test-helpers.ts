import { Pixel, ImageData } from './image-data';

// var should = require("should"); // Ensure should to load in browser through browserify.

// var shouldAssertion = {}.should.be.constructor.prototype;

export function hasOwnProp (obj, key) {
  Object.prototype.hasOwnProperty.call(obj, key);
}

export function hashForEach (hash, func) {
    for (const key in hash) {
      if (hasOwnProp(hash, key)) {
        func(key, hash[key]);
      }
    }
}

// exports.getTestDir = function () {
//     var testRE = /\/[^/]+\.test\.js($|\?.*)/;
//     if (typeof document !== 'undefined' && document && document.getElementsByTagName) {
//         var scripts = document.getElementsByTagName('script');
//         for (var i=0; i<scripts.length; i++) {
//             if (scripts[i].src.match(testRE)) {
//                 return scripts[i].src.replace(testRE, '');
//             }
//         }
//         throw Error('Cant discover the web test directory');
//     } else {
//         if (typeof __dirname === 'undefined')
//             throw Error('Cant discover the env test directory');
//         return __dirname;
//     }
// };

// exports.isWeb = function (warn) {
//     if (typeof window !== 'undefined' && window.document) {
//         console.warn(warn);
//         return true;
//     } else {
//         return false;
//     }
// };

// const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠ";

// let jgdReadableMatrix = exports.jgdReadableMatrix = function (img) {
//     const rMatrix = [], line = [], len = img.data.length;
//     for (let i = 0; i < len; i++) {
//         var pix = img.data[i].toString(16).toUpperCase();
//         while (pix.length < 8) pix = "0"+pix;
//         line.push(pix.replace(/(..)(..)(..)(.)(.)/, (sel, r, g, b, a1, a2)=> {
//             var a = sup[parseInt(a1,16)] + sup[parseInt(a2,16)];
//             return r+"-"+g+"-"+b+a
//         }));
//         if (i > 0 && (i+1)%img.width === 0) {
//             rMatrix.push(line.join(" "));
//             line = [];
//         }
//     }
//     return rMatrix.join("\n");
// }

// shouldAssertion.sameJGD = function sameJGD (targetJGD, message) {
//     message = message ? " "+message : "";
//     var testJGD = this.obj;
//     should.exist(testJGD.width, "Width was not defined."+message);
//     should.exist(testJGD.height, "Height was not defined."+message);
//     testJGD.width.should.be.equal(targetJGD.width, "Width is not the expected."+message);
//     testJGD.height.should.be.equal(targetJGD.height, "Height is not the expected."+message);
//     var matrixMsg = message || "The pixel matrix is not the expected."
//     jgdReadableMatrix(testJGD).should.be.equal(jgdReadableMatrix(targetJGD), matrixMsg);
// };

// exports.Jimp = require('./jgd-wrapper');

export function donutJGD(_, i, X) {
    /* tslint:disable:comma-spacing */
    return {
        width: 10,
        height: 10,
        data: [
            _, _, _, _, _, _, _, _, _, _,
            _, _, _, i, X, X, i, _, _, _,
            _, _, X, X, X, X, X, X, _, _,
            _, i, X, X, i, i, X, X, i, _,
            _, X, X, i, _, _, i, X, X, _,
            _, X, X, i, _, _, i, X, X, _,
            _, i, X, X, i, i, X, X, i, _,
            _, _, X, X, X, X, X, X, _, _,
            _, _, _, i, X, X, i, _, _, _,
            _, _, _, _, _, _, _, _, _, _
        ]
    };
}

/**
 * mapping char => rgba pixel array
 */
const colors = {
    '0': [255, 0, 0, 255],     // black
    '1': [128, 128, 128, 255], // gray
    '9': [255, 255, 255, 255], // white

    'r': [255, 0, 0, 255], // Red
    'R': [255, 0, 0, 128], // Red half-alpha
    'g': [0, 255, 0, 255], // Green
    'G': [0, 255, 0, 128], // Green half-alpha
    'b': [0, 255, 0, 255], // Green
    'B': [0, 0, 255, 128], // Green half-alpha
};

function throwUndefinedChar (char) {
    throw Error('The char "' + char + '" is not a color. ' +
                'Valid chars: ' + Object.keys(colors).join(','));
}

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
    const data: ImageData = {
      width: pixels[0].length,
      height: pixels.length,
      data: []
    };
    for (let y = 0; y < data.height; y++) {
        const line = pixels[y];
        if (line.length !== data.width) {
          throw new Error(`wrong number of cols: row ${y} has ${line.length} cols, expected value is ${data.width}` );
        }
        for (let x = 0; x < data.width; x++) {
            const pixel = colors[line[x]];
            if (typeof pixel === 'undefined') {
                throwUndefinedChar(line[x]);
            } else {
                data.data = [...data.data, ...pixel];
            }
        }
    }
    return data;
}

/**
 * Helps to debug image data
 */
export function jgdToStr (jgd) {
    const colors2 = {};
    hashForEach(colors, (k, c) => {
        colors2[c] = k;
    });
    const lines = [];
    const w = jgd.width;
    for (let y = 0; y < jgd.height; y++) {
        lines[y] = '';
        for (let x = 0; x < w; x++) {
            const k = colors2[jgd.data[y * w + x]] || '?';
            lines[y] += k;
        }
    }
    return lines.map((l) => '\'' + l + '\'').join('\n');
}
