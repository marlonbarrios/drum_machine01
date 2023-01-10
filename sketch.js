let hh, clap, bass;
let hPat, cPat, bPat;
let hPhrase, cPhrase, bPhrase;
let drums;
let BPMcontrol;
let cellWidth;
let beatLength;
let cnv;
let secPat;
let cursorPos;

let snarePhrase;
let snareEnv;
let snarePat;
let bpFilter;
let rev;
let dist;




function setup() {
  beatLength = 16;
  cellWidth = width / beatLength;
   
  cnv = createCanvas(400, 100);
  cnv.mousePressed(canvasPressed);


  hh = loadSound('hh_sample.mp3', () => {});
  clap = loadSound('clap_sample.mp3', () => {});
  bass = loadSound('bass_sample.mp3', () => {});


  hPat = [1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 1];
  cPat = [0, 0, 0, 0, 1, 0, 0, 0,0, 0, 0, 0, 1, 0, 0, 0];
  bPat = [1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0];
  snarePat = [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1];
  secPat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];  
 

  bpFilter = new p5.BandPass();
  bpFilter.freq(700);
  bpFilter.res(5);

  rev = new p5.Reverb();
  dist = new p5.Distortion();


  snareNoise = new p5.Noise('white');
  snareNoise.start();

  snareNoise.disconnect();
  snareNoise.connect(bpFilter);

  //bpFilter.chain(rev, dist);

  rev.process(bpFilter, 0.5, 1);

  snareEnv = new p5.Envelope();
  snareEnv.set(0.001, 5, 0.01, 0.5, 0.1);
  snareNoise.amp(snareEnv);

  hPhrase = new p5.Phrase('hh', (time) => {
    hh.play(time);
  } , hPat);

  cPhrase = new p5.Phrase('clap', (time) => {
    clap.play(time);
  } , cPat);

  bPhrase = new p5.Phrase('bass', (time) => {
    bass.play(time);
  } , bPat);

  snarePhrase = new p5.Phrase('snare', (time) => {
    snareEnv.play(snareNoise, time);
  } , snarePat);


  drums = new p5.Part();

  drums.addPhrase(hPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase('seq',sequence, secPat)
  drums.addPhrase(snarePhrase);



BPMcontrol = createSlider(30, 300, 60, 1).position(10, 130).size(200, 10);
BPMcontrol.input(() => {drums.setBPM(BPMcontrol.value())});
drums.setBPM('60');
 
drawMatrix();
  
  
}

function keyPressed() {
  if (key ===' ') {
   if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded()) {
    if (!drums.isPlaying) {
      //drums.metro.metroTicks = 0;
      drums.loop();
    } else {
      drums.stop();
    } 
   } else {
      console.log('not loaded');
   }
  }
}

function canvasPressed() {
  let rowClicked = floor(4* mouseY / height);
  let indexClicked = floor(beatLength*mouseX / width);
  if (rowClicked === 0) {
    hPat[indexClicked] = +!hPat[indexClicked];
  } else if (rowClicked === 1) {
    cPat[indexClicked] = +!cPat[indexClicked];
  } else if (rowClicked === 2) {
    bPat[indexClicked] = +!bPat[indexClicked];
  } else if (rowClicked === 3) {
    snarePat[indexClicked] = +!snarePat[indexClicked];
  }

  drawMatrix();
}

function drawMatrix() {
  background(80)
  stroke('gray');
  strokeWeight(2)
  fill(255)

  for (let i = 0; i < beatLength +1; i++) {

  line(i * width / beatLength, 0, i * width / beatLength, height)
  }
  for (let i = 0; i < 5 ; i++) {
  line(0, i * height / 4, width, i * height / 4)
  }

  
  for (let i = 0; i < beatLength ; i++) {

    if (hPat[i] === 1) {
    ellipse(i * width / beatLength + 0.5 * width/beatLength, height* 0.25/2, 10)
  }
  if (cPat[i] === 1) {
    ellipse(i * width / beatLength + 0.5 * width/beatLength,height* 0.37, 10)
  }
  if (bPat[i] === 1) {
    ellipse(i * width / beatLength + 0.5 * width/beatLength, height * 0.60, 10)
  }
  if (snarePat[i] === 1) {
    ellipse(i * width / beatLength + 0.5 * width/beatLength, height * 0.88, 10)
  }
}
}

// function windowResized() {
//   resizeCanvas(windowWidth, 100);
//   setup();
// }

function touchStarted() {
  if (getAudioContext().state !== "running") {
    get.AudioContext().resume();
  }
}

function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
drawPlayHead(beatIndex);
  }, time * 1000)

}

function drawPlayHead(beatIndex) {
stroke('red');
fill(255, 0, 0, 30);
rect((beatIndex -1) * width / beatLength, 0, width / beatLength, height)
}

