
function fixDpi(canvas) {
  let dpi = window.devicePixelRatio;
  let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  canvas.setAttribute('height', style_height * dpi);
  canvas.setAttribute('width', style_width * dpi);
}

function drawTriangle(context, x, y, w, h, alpha, out) {

  let ipp = Math.sqrt(w * w / 4 + h * h);
  // console.log(ipp);
  let omega = Math.atan(w / (2 * h));

  if (out) context.globalCompositeOperation="destination-out";
  else context.globalCompositeOperation="source-over";

  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + ipp * Math.cos(alpha - omega), y - ipp * Math.sin(alpha - omega));
  context.lineTo(x + ipp * Math.cos(alpha + omega), y - ipp * Math.sin(alpha + omega));
  context.closePath();

  let gradient = context.createLinearGradient(
    x, y,
    x + ipp * Math.cos(alpha),
    y - ipp * Math.sin(alpha));
  gradient.addColorStop(0, "#2e075280");
  gradient.addColorStop(0.8, "#ffffff00");
  context.fillStyle = gradient;
  context.fill();
}

function getDist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function getAngle(x1, y1, x2, y2) {

  let x = x2 - x1;
  let y = y2 - y1;

  alpha = Math.atan(tg = y / Math.abs(x));
  if (x < 0) alpha = Math.PI - alpha;

  return alpha;
}

let out = false;
let img1 = "url(\"https://i.pinimg.com/originals/de/04/42/de04423b9f942def5cffb86987e0806d.jpg\")";
let img2 = "url()";

window.onload = function () {

  const canvas = document.getElementById("two");
  fixDpi(canvas);

  const context = canvas.getContext("2d");

  let clearButton = this.document.getElementById("clear");

  clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  let imgButton = this.document.getElementById("clear2");
  imgButton.addEventListener("click", () => {
    let k = document.getElementById("one");
    k.style.backgroundImage = img2;
    [img1, img2] = [img2, img1];
  });

  let opButton = this.document.getElementById("clear3");
  opButton.addEventListener("click", () => {
    let k = this.document.getElementById("two");
    if (k.style.opacity == 0.5) {
      k.style.opacity = 1;
    }
    else {
      k.style.opacity = 0.5;
    }
  });

  let eraseButton = this.document.getElementById("clear4");
  eraseButton.addEventListener("click", () => out = !out);

  let x = 0, y = 0, w = 50, h = 50;
  let prevAlpha = 0, curAlpha = 0;
  let alpha = Math.PI / 2, drawing = false;

  widthSlider = this.document.getElementById("slide1");
  widthSlider.addEventListener("change", () => w = widthSlider.value);

  heightSlider = this.document.getElementById("slide2");
  heightSlider.addEventListener("change", () => h = heightSlider.value);

  canvas.addEventListener("mousedown", () => {
    drawing = true;
  });

  canvas.addEventListener("mousemove", e => {
    if (this.getDist(x, y, e.offsetX, e.offsetY) > 7.0) {
      curAlpha = this.getAngle(x, y, e.offsetX, e.offsetY);
      alpha -= (curAlpha - prevAlpha);
      prevAlpha = curAlpha;
      x = e.offsetX;
      y = e.offsetY;
    }

    if (drawing) drawTriangle(context, e.offsetX, e.offsetY, w, h, alpha, out);
  });

  canvas.addEventListener("mouseup", () => {
    drawing = false;
  });
}
