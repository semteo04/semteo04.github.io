let c = document.getElementById('can');
let ctx = c.getContext("2d");
function dboard() {
    ctx.beginPath();
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 5;
    ctx.fillStyle = "black";
    for (let i = 1; i <= 8; i += 2) {
        for (let j = 1; j <= 8; j += 2) {
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
        }
    }
    for (let i = 2; i <= 8; i += 2) {
        for (let j = 2; j <= 8; j += 2) {
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.fillStyle = "white";
    for (let i = 2; i <= 8; i += 2) {
        for (let j = 1; j <= 8; j += 2) {
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.stroke();
        }
    }
    for (let i = 1; i <= 8; i += 2) {
        for (let j = 2; j <= 8; j += 2) {
            ctx.rect(-50 + i * 70, -50 + j * 70, 70, 70);
            ctx.stroke();
        }
    }
    ctx.closePath();
}
function render() {
    dboard();
}
render();