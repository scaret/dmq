class VideoPlayer{
    constructor(parentDom) {
        self.parentDom = parentDom;
        self.canvas = document.createElement("canvas")
        self.ctx = self.canvas.getContext('2d');
        self.parentDom.appendChild(self.canvas);
    }
    adjustResolution(config){
        if (self.canvas.width !== config.codedWidth){
            self.canvas.width = config.codedWidth;
        }
        if (self.canvas.height !== config.codedHeight){
            self.canvas.height = config.codedHeight;
        }
        console.log('Adjust Resolution to ', self.canvas.width, self.canvas.height);
    }
    drawFrame(f){
        self.ctx.drawImage(f, 0, 0);
    }
}