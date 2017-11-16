

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
    }
})

