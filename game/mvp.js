

var app = new Vue({
    el: '#app',
    data: {
        stream: null,
        threshold: 95,
        lineColor: null,
        lineColorRgb: null,
        linePos: [0,0],
        gremlinPos: [333,333],
        score: 0
    },
    methods: {

        findBlobs: function (video) {
            if(!this.lineColorRgb) {
                return '';
            }
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
             
            var imgW = video.width;
            var imgH = video.height;
            canvas.width = imgW;
            canvas.height = imgH;
             
            context.drawImage(video, 0, 0);
            // flip context horizontally
            // context.translate(canvas.width, 0);
            // context.scale(-1, 1);
            // context.translate(canvas.width / 2, canvas.height / 2);
            // context.scale(-1, 1);

            var imgPixels = context.getImageData(0, 0, imgW, imgH);

            

            let closest = this.linePos;
            let closestDist = 0;
            let box;
             
            for(var y = 0; y < imgPixels.height; y++){
                for(var x = 0; x < imgPixels.width; x++){
                    var i = (y * 4) * imgPixels.width + x * 4;

                    // avg is brigthes, and we check it against threshold
                    // var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;

                    let pixel = [imgPixels.data[i], imgPixels.data[i + 1], imgPixels.data[i + 2]];
                    let d = dist(pixel, this.lineColorRgb)

                    if(d > closestDist) {
                        closestDist = d;
                        closest = [x,y]
                    }

                    if(d > this.threshold) {
        
                        imgPixels.data[i] = 0; 
                        imgPixels.data[i + 1] = 255; 
                        imgPixels.data[i + 2] = 0;
                        imgPixels.data[i + 3] = 255;
                        // update box
                        box = extendBox(box, [x,y])
                    } else {
                        imgPixels.data[i] = 0; 
                        imgPixels.data[i + 1] = 0; 
                        imgPixels.data[i + 2] = 0;
                        imgPixels.data[i + 3] = 0;
        
                    }
                }
            }
            // this.linePos = [640-closest[0], closest[1]];
            // this.linePos = closest;
            this.linePos = box || this.linePos;
            this.hitGremlin(this.linePos);
            context.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
            return canvas.toDataURL();
        },

        /**
         * check if poit is inside gremlin
         * if yes, score++ & place new gremlin
         */
        hitGremlin: function(point) {
            if(containsBox([...this.gremlinPos, this.gremlinPos[0]+60, this.gremlinPos[1]+60], point)) {
                this.score++;
                this.gremlinPos = [
                    randomRange(0, 580),
                    randomRange(0, 420)
                ]
            }
        },

        /**
         * get track line color by clicking on the canvas
         */
        onImgClick: function(e) {
            
            let video = this.$refs.video;
            var canvas = document.createElement('canvas');
            var canvasContext = canvas.getContext('2d');

            canvas.width = 1;
            canvas.height = 1;
            
            canvasContext.drawImage(video, 640-e.layerX, e.layerY, 1, 1, 0, 0, 1, 1);
            this.lineColorRgb = canvasContext.getImageData(0, 0, 1, 1).data;
            let [r,g,b] = this.lineColorRgb;
            this.lineColor = rgbToHex(r,g,b)

            // this.$refs.photo.src = canvas.toDataURL()

        },
        play: function () {
            if(this.stream) return;
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                this.stream = stream;
                this.$refs.video.src = window.URL.createObjectURL(stream);
                this.$refs.video.play();
                this.snap()
            });
        },

        stop: function () {
            if(this.stream) {
                this.stream.getTracks()[0].stop();
                this.stream = null;
            }
        },
        snap: function () {
            // this.findBlobs(this.$refs.video);
            this.$refs.photo.src = this.findBlobs(this.$refs.video);
            if(this.stream) {
                requestAnimationFrame(this.snap.bind(this));
            }
        }
    }
})

/**
 * converts rgb to hex
 */
function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * returns similarity distance between two colors
 */
function dist(c1, c2){
    let rDiff = Math.abs(c1[0] - c2[0]);
    var gDiff = Math.abs(c1[1] - c2[1]);
    var bDiff = Math.abs(c1[2] - c2[2]);
  
    var rScore = 100 - (rDiff / 255 * 100);
    var gScore = 100 - (gDiff / 255 * 100);
    var bScore = 100 - (bDiff / 255 * 100);
    return Math.round((rScore + gScore + bScore) / 3);
}

/**
 * check if square contains the point
 * @param square
 * @param point
 */
function contains(s, p) {
    return ((p[0] > s[0] && p[0] < s[2]) && (p[1] > s[1] && p[1] < s[3]))
}
function containsBox(box, box2) {
    let [x1, y1, x2, y2] = box2;
    return contains(box, [x1, y1]) || contains(box, [x2,y2]) || contains(box, [x2,y1]) || contains(box, [x1,y2])
}

// console.log('not CONTAINS', contains([10,10,60,60], [5,5]))
// console.log('CONTAINS', contains([10,10,60,60], [15,15]))
// console.log('not CONTAINS', contains([10,10,60,60], [115,15]))

function randomRange(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function extendBox(box, pixel) {
    if(!box) {
        return [...pixel, ...pixel];
    }

    let [x1, y1, x2, y2] = box;
    let [px, py] = pixel;
    
    if(px < x1) {
        x1 = px;
    }
    if(px > x2) {
        x2 = px;
    }
    if(py < y1) {
        y1 = py;
    }
    if(py > y2) {
        y2 = py;
    }
    return [x1,y1,x2,y2]
}
// var b = extendBox(undefined, [5,5]);
// console.log('extend', b)
// var b = extendBox(b, [15,15]);
// console.log('extend more', b)
// var b = extendBox(b, [3,1]);
// console.log('extend less', b)