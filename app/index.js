var soundToImage = new p5(function(s) {
  var sgl = {};

  s.preload = function() {
    /**
     * 0 - ready to record audio
     * 1 - recording audio, ready to stop
     * 2 - ready to play image (sound)
     */
    sgl.state = 0;
    sgl.x = 0;

    sgl.img = s.createImage(400, 400);
    sgl.img.loadPixels();
  }

  s.setup = function() {
    s.createCanvas(400, 400);
    s.background(0, 200, 0);
    s.fill(0);
    s.stroke(0);

    sgl.mic = new p5.AudioIn();
    sgl.mic.start();

    sgl.recorder = new p5.SoundRecorder();
    sgl.recorder.setInput(sgl.mic);

    sgl.soundFile = new p5.SoundFile();

    sgl.fft = new p5.FFT();
    sgl.fft.setInput(sgl.mic);
  }

  s.draw = function() {
    if (sgl.state === 1) {
      var spectrum = sgl.fft.analyze();
      sgl.x++;

      var sl = spectrum.length / sgl.img.height;
      for (var y = 0; y < sgl.img.height; y++) {
        sgl.img.set(sgl.x, sgl.img.height - y, s.color(255 - spectrum[Math.floor(sl*y)]));
      }
      sgl.img.updatePixels();
      s.image(sgl.img, 0, 0);
    } else if (sgl.state === 0 && sgl.mic.enabled) {
    /*
      x++;
      s.image(sgl.img, 0, 0);
      s.line(x, 0, x, sgl.img.height);
      */
    } else {
      sgl.x = 0;
      sgl.img = s.createImage(400, 400);
    }
  }

  s.mousePressed = function() {
    if (sgl.state === 0 && sgl.mic.enabled) {
      sgl.soundFile.stop();
      sgl.recorder.record(sgl.soundFile);
      s.background(200, 0, 0);
      sgl.state++;
    } else if (sgl.state === 1) {
      sgl.recorder.stop();
      sgl.state++;
    } else if (sgl.state === 2) {
      sgl.soundFile.play();
      sgl.state = 0;
    }
  }
}, 'app-container');
