addEventListener('load', () => {
  function Coordinates(x, y) {
    if (typeof x === 'number' && isFinite(x) && typeof y === 'number' && isFinite(y)) {
      this.x = x;
      this.y = y;
    } else throw new Error('Either x is not a number or y is not a number.');
  }

  function Position(coordinates, angle) {
    if (coordinates instanceof Coordinates && typeof angle === 'number' && isFinite(angle)) {
      this.coordinates = coordinates;
      this.angle = angle;
    }
  }

  function Line(position1, position2, position3) {
    if (position1 instanceof Position && position2 instanceof Position && position3 instanceof Position) {
      this.positions = [position1, position2, position3];
      this.currentIndex = 0;
    } else throw new Error('Wrong argument types.')
  }

  function redraw() {
    function setText(string, fontSize) {
      text = string;
      ctx.font = fontSize + "px sans-serif";
      textWidth = ctx.measureText(text).width;
    }

    var text;
    var textWidth;
    if (!lastDraw || 1000 / 4 < Date.now() - lastDraw) {
      ctx.lineWidth = 4;
      var color = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      for (var line of lines) line.draw();
      ctx.strokeRect((width - rectangleWidth) / 2, (height - rectangleHeight) / 3, rectangleWidth, rectangleHeight);
      setText('WEB UNDER CONSTRUCTION', 20);
      ctx.fillText(text, (width - textWidth) / 2, (height - rectangleHeight) / 3 + rectangleHeight / 2);
      ctx.fillStyle = '#111';
      setText('hola@estudioselva.com', 12);
      ctx.fillText(text, (width - textWidth) / 2, height / 2);
      setText('behance', frame % 2 ? 12 : 16);
      ctx.strokeRect((width - rectangleWidth) / 2, (height - rectangleHeight) / 3, rectangleWidth, rectangleHeight);
      ctx.fillText(text, (width - textWidth) / 2, height * 3 / 4);
      lastDraw = Date.now();
      frame++;
    }
    requestAnimationFrame(redraw);
  }

  function onResize() {
    width = innerWidth - 2 * margin;
    height = innerHeight - 2 * margin;
    lines = new Set();
    for (i = 0; i < 20; i++) {
      lines.add(new Line(
        new Position(new Coordinates(Math.random() * width, Math.random() * height), Math.random() * Math.PI * 2),
        new Position(new Coordinates(Math.random() * width, Math.random() * height), Math.random() * Math.PI * 2),
        new Position(new Coordinates(Math.random() * width, Math.random() * height), Math.random() * Math.PI * 2)
      ));
    }
    canvas.width = width;
    canvas.height = height;
  }

  var margin = parseFloat(getComputedStyle(document.body).margin);
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var rectangleWidth = 400;
  var rectangleHeight = 75;
  var frame = 0;
  var lastDraw;
  var width;
  var height;
  var lines;
  addEventListener('resize', onResize);
  Position.prototype.draw = function() {
    ctx.beginPath()
    ctx.moveTo(this.coordinates.x, this.coordinates.y);
    ctx.lineTo(this.coordinates.x + this.length * Math.cos(this.angle), this.coordinates.y + this.length * Math.sin(this.angle));
    ctx.stroke();
  };
  Position.prototype.length = 15;
  Line.prototype.draw = function() {
    this.positions[this.currentIndex].draw()
    this.currentIndex = (this.currentIndex + 1) % 3;
  };
  onResize();
  ctx.lineCap = "round";
  ctx.lineWidth = 4;
  ctx.textBaseline = 'middle';
  requestAnimationFrame(redraw);
});