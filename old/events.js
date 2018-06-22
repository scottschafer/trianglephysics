var mc = false;

function begin() {
  canvas = document.getElementById('Tricanvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousedown', MouseDown, false);
  canvas.addEventListener('mousemove', MouseMove, false);
  canvas.addEventListener('mouseup', MouseUp, false);
}


function MouseDown(e) {
  var pos = getMousePos(canvas, e);
  MouseX = pos.x;
  MouseY = pos.y;
  repositionVertex(triangles[0], 0, MouseX, MouseY);
  mc = true;
}



function MouseMove(e) {
  if (mc) {
    var pos = getMousePos(canvas, e);
    MouseX = pos.x;
    MouseY = pos.y;
    repositionVertex(triangles[0], 0, MouseX, MouseY);
  }
}

function MouseUp() {
  mc = false;
}

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;
  scaleX /= canvas.width / worldDim;
  scaleY /= canvas.width / worldDim;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}


window.setInterval(function () {

  // apply momentum and render
  applyMomemntum();

  var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,
    scaleY = canvas.height / rect.height;

  scaleX *= canvas.width / worldDim;
  scaleY *= canvas.width / worldDim;

  ctx.clearRect(0, 0, canvas.width, canvas.height);


  triangles.forEach(function (triangle) {
    ctx.beginPath();
    ctx.moveTo(triangle.x[0] * scaleX, triangle.y[0] * scaleY);
    ctx.lineTo(triangle.x[1] * scaleX, triangle.y[1] * scaleY);
    ctx.lineTo(triangle.x[2] * scaleX, triangle.y[2] * scaleY);
    ctx.lineTo(triangle.x[0] * scaleX, triangle.y[0] * scaleY);
    ctx.closePath();
    ctx.stroke();
  });

}, 1000 / 60);