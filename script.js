const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
// const img1 = document.getElementById("img1")
const btn = document.getElementById("btn1");



class Particle{
    constructor(Effect,x,y,color){
        this.effect = Effect;
        this.x = Math.random() * this.effect.width;
        this.y =  Math.random() * this.effect.height;
        this.originX = Math.floor(x);
        this.originY = Math.floor(y);
        this.color = color;
        this.size = this.effect.gap ;
        this.vx = 0;
        this.vy =0;
        this.ease = 0.05;
        this.friction = 0.96;
        this.dx =0;
        this.dy =0;
        this.distance =0;
        this.force= 0;
        this.angle = 0;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    } 
    update(){

            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = (this.dx * this.dx) + (this.dy * this.dy);
            this.force = -this.effect.mouse.radius / this.distance;
            if(this.distance < this.effect.mouse.radius){
                this.angle = Math.atan2(this.dy,this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);

            }
            this.x += (this.vx *= this.friction) +  (this.originX - this.x)*this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y)*this.ease;
    }
    warp(){
        this.x = Math.random() * this.effect.width;
        this.y =  Math.random() * this.effect.height;
        this.ease = 0.05;
    }
}

class Effect{
    constructor(width , height){
        this.width = width;
        this.height = height;
        this.pArray = [];
        this.img1 = document.getElementById("img1");
        this.centerX = (this.width * 0.5) - (this.img1.width * 0.5);
        this.centerY = (this.height * 0.5) -  (this.img1.height * 0.5);
        this.gap = 3;
        this.mouse = {
            radius: 1500,
            x: undefined,
            y: undefined
        }
        window.addEventListener("mousemove", event =>  {
                    this.mouse.x = event.x;
                    this.mouse.y = event.y;
        })
    }
    init(ctx){
        ctx.drawImage(img1,this.centerX,this.centerY)
        const pexels = ctx.getImageData(0,0,this.width,this.height).data;
       // console.log(pexels);
        for (let y = 0; y < this.height; y += this.gap) {
            for (let x = 0; x < this.width; x += this.gap) {
                    const index = ((y * this.width) + x) * 4;
                    const r = pexels[index];
                    const g = pexels[index + 1];
                    const b = pexels[index + 2];
                    const alpha = pexels[index+3];
                    const color = 'rgb('+r+','+g+','+b+')';
                    if (alpha > 0){
                        this.pArray.push(new Particle(this,x,y,color));
                    }
            }
            
        }

    }
    draw(ctx){
        
        this.pArray.forEach(item => item.draw(ctx))
    }
    update(){
        this.pArray.forEach(item => item.update())
    }
    warp(){
        this.pArray.forEach(item => item.warp())
    }
}
// testing code
console.log(ctx)
console.log(canvas)
// ctx.drawImage(img1,50,50)
const effect = new Effect(canvas.width,canvas.height);
effect.init(ctx);
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.draw(ctx);
    effect.update();
    requestAnimationFrame(animate);
}
 animate();
 btn.addEventListener("click",function() {
    // console.log("hello")
    effect.warp();
 })
console.log(effect)
// console.log("hello")