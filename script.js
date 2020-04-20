
function fixDpi(canvas) {
  let dpi = window.devicePixelRatio;
  let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
  let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  canvas.height = style_height * dpi;
  canvas.width = style_width * dpi;
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

function drawTriangle(context, x, y, w, h, alpha, out) {

  let ipp = Math.sqrt(w * w / 4 + h * h);
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

function clearCanvas(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

window.onload = function () {

  const drawCanvas = document.getElementById("drawCanvas");
  const drawContext = drawCanvas.getContext("2d");
  const previewCanvas = document.getElementById("previewCanvas");
  const previewContext = previewCanvas.getContext("2d");

  fixDpi(drawCanvas);
  fixDpi(previewCanvas);

  document.getElementById("clear").addEventListener("click", () => {
    clearCanvas(drawContext, drawCanvas);
  });

  let img = "", showImage = true;
  let docBackground = document.getElementById("background");

  document.getElementById("imgUrl").addEventListener("change", () => {
    img = "url(\"" + document.getElementById("imgUrl").value + "\")";
    if (showImage) docBackground.style.backgroundImage = img;
  });

  let docTogImg = document.getElementById("toggleImage"); 
  docTogImg.addEventListener("click", () => {
    showImage = !showImage;
    if (showImage) {
      docTogImg.innerText = "Hide Img";
      docBackground.style.backgroundImage = img;
    }
    else {
      docTogImg.innerText = "Show Img";
      docBackground.style.backgroundImage = "url()";
    }
  });

  document.getElementById("opacity").addEventListener("click", () => {
    if (drawCanvas.style.opacity == 0.5) drawCanvas.style.opacity = 1;
    else drawCanvas.style.opacity = 0.5;
  });

  let erasing = false;
  let docBrush = document.getElementById("toggleBrush");
  docBrush.addEventListener("click", () => {
    erasing = !erasing;
    docBrush.innerText = erasing ? "Brush": "Eraser";
  });

  let x = 0, y = 0, w = 50, h = 50;
  let prevAlpha = 0, curAlpha = 0;
  let alpha = Math.PI / 2, drawing = false;

  widthSlider = document.getElementById("wSlider");
  widthSlider.addEventListener("mousemove", () => {
    w = widthSlider.value;
    document.getElementById("brushWidth").innerText = w;
  });

  heightSlider = document.getElementById("hSlider");
  heightSlider.addEventListener("mousemove", () => {
    h = heightSlider.value;
    document.getElementById("brushHeight").innerText = h;
  });

  drawCanvas.addEventListener("mousedown", () => {
    drawing = true;
  });

  drawCanvas.addEventListener("mousemove", e => {
    if (getDist(x, y, e.offsetX, e.offsetY) > 7.0) {
      curAlpha = getAngle(x, y, e.offsetX, e.offsetY);
      alpha -= (curAlpha - prevAlpha);
      prevAlpha = curAlpha;
      x = e.offsetX;
      y = e.offsetY;
    }

    if (drawing) drawTriangle(drawContext, e.offsetX, e.offsetY, w, h, alpha, erasing);
  });

  drawCanvas.addEventListener("mouseup", () => {
    drawing = false;
  });
}
