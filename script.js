const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];


let mouse = {
    x: undefined,
    y: undefined,
    radius: (canvas.height/80) * (canvas.width/80)
}
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    // reduce glitching; removes mouse radius for particle interaction if mouse isn't moving
    setTimeout(() => {
        mouse.x = undefined;
        mouse.y = undefined;
    }, 100);
});


class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = "azure";
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // check collision detection ;; mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx**2 + dy**2);
        if (distance < (mouse.radius + this.size)) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // move particle
        this.x += this.directionX;
        this.y += this.directionY;
        // draw particle
        this.draw();
    }
}

const init = () => {
    particlesArray = [];
    let numParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size*2) - (size * 2)) + (size * 2));
        let y = (Math.random() * ((innerHeight - size*2) - (size * 2)) + (size * 2));
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = "azure";
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}


const connect = () => {
    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx**2 + dy**2);
            
            if (distance < (150)) { // for responsiveness could try something like (canvas.width/60) * (canvas.height/60)
                opacityValue = 1 - (distance/150); // same value as if(distance<_#_) number
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.setLineDash([5,10]); // set to empty array for solid; set one value in array for even distribution
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}


const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}


// window resize event
window.addEventListener("resize", (e) => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.redius = ((canvas.height/80) * (canvas.height/80));
    init();

});


// mouse out event
window.addEventListener("mouseout", (e) => {
    mouse.x = undefined;
    mouse.y = undefined;
});


init();
animate();
