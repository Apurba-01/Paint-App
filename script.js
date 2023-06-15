const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill"),
  sizeSlider = document.querySelector("#slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#choose-color"),
  clearCanvas = document.querySelector(".clear"),
  saveImg = document.querySelector(".save"),
  ctx = canvas.getContext("2d");

let prevMouseX,
  prevMouseY,
  snapshot,
  isDrawing = false,
  selectedTool = "brush",
  brushWidth = 5,
  selectedColor = "#000";

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX || e.touches[0].clientX, e.offsetY || e.touches[0].clientY);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX || e.touches[0].clientX,
      e.offsetY || e.touches[0].clientY,
      prevMouseX - (e.offsetX || e.touches[0].clientX) ,
      prevMouseY - (e.offsetY || e.touches[0].clientY)
    );
  }
  ctx.fillRect(
    e.offsetX || e.touches[0].clientX,
    e.offsetY || e.touches[0].clientY,
    prevMouseX - (e.offsetX || e.touches[0].clientX),
    prevMouseY - (e.offsetY || e.touches[0].clientY)
  );
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
   Math.pow(prevMouseX - (e.offsetX || e.touches[0].clientX), 2) + Math.pow(prevMouseY - (e.offsetY || e.touches[0].clientY), 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX || e.touches[0].clientX, e.offsetY || e.touches[0].clientY);
  ctx.lineTo(prevMouseX * 2 - (e.offsetX || e.touches[0].clientX), (e.offsetY || e.touches[0].clientY));
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX || e.touches[0].clientX;
  prevMouseY = e.offsetY || e.touches[0].clientY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "line") {
    drawLine(e);
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("touchmove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("touchend", () => (isDrawing = false));
