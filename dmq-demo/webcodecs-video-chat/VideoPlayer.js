class VideoPlayer{
    constructor(parentDom) {
        this.parentDom = parentDom;
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext('2d');
        this.parentDom.appendChild(this.canvas);
    }
    adjustResolution(config){
        if (this.canvas.width !== config.codedWidth){
            this.canvas.width = config.codedWidth;
        }
        if (this.canvas.height !== config.codedHeight){
            this.canvas.height = config.codedHeight;
        }
        console.log('Adjust Resolution to ', this.canvas.width, this.canvas.height);
    }
    drawFrame(f){
        this.ctx.drawImage(f, 0, 0);
    }
}