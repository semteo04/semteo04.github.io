let c = document.getElementById('can');
let ctx = c.getContext("2d");
function dboard() {
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    for (let i = 1; i <= 8; i += 2) {
        for (let j = 1; j <= 8; j += 2) {
            ctx.beginPath(); 
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
            ctx.closePath()
        }
    }
    for (let i = 2; i <= 8; i += 2) {
        for (let j = 2; j <= 8; j += 2) {
            ctx.beginPath();
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
            ctx.closePath()
        }
    }
    ctx.fillStyle = "#E0E0E0";
    for (let i = 2; i <= 8; i += 2) {
        for (let j = 1; j <= 8; j += 2) {
            ctx.beginPath();
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
            ctx.closePath()
        }
    }
    for (let i = 1; i <= 8; i += 2) {
        for (let j = 2; j <= 8; j += 2) {
            ctx.beginPath();
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
            ctx.closePath()
        }
    }
    ctx.closePath();
}
function render() {
    dboard();
}
render();