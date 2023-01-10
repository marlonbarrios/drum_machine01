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

let title;
let description;
let instructions1;
let instructions2;
let instructions3;
let instructions4;




function setup() {
  beatLength = 16;
  cellWidth = width / beatLength;
   
  cnv = createCanvas(windowWidth * 0.80, 200);
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



BPMcontrol = createSlider(30, 300, 60, 1)
BPMcontrol.position(width * 0.20, height * 1.5);
BPMcontrol.style('width', '400px');
BPMcontrol.style('display', 'block');
BPMcontrol.style('margin', 'auto');







BPMcontrol.style('display', 'block');
BPMcontrol.style('margin', 'auto');
BPMcontrol.style('margin-top', '50px');
BPMcontrol.style('margin-bottom', '20px');



cnv.style('display', 'block');
cnv.style('margin', 'auto');
cnv.style('margin-top', '100px');
cnv.style('margin-bottom', '20px');
cnv.style('border', '3px solid black');
cnv.style('box-shadow', '1px 4px 4px #000000');
cnv.style('border-radius', '15px');




BPMcontrol.input(() => {drums.setBPM(BPMcontrol.value())});
drums.setBPM('60');
 
drawMatrix();
drawCedits();

  
}


function windowResized() {
  resizeCanvas(windowWidth * 0.80, 200);
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

function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
drawPlayHead(beatIndex);
  }, time * 1000)

}

function drawPlayHead(beatIndex) {
stroke(255);
fill(255, 0, 0, 30);
rect((beatIndex -1) * width / beatLength, 0, width / beatLength, height)
fill(255)
let BPM = BPMcontrol.value();
textSize(20);
textAlign(CENTER);
textFont('monospace');
text(BPM, (beatIndex- 0.5) * width / beatLength, 105);

text(beatIndex, (beatIndex- 0.5) * width / beatLength, 160)

}

function drawCedits() {
 title = createP('Drum Machine 01');
  title.position(width * 0.20, 20);
  title.style('font-size', '30px');
  title.style('color', 'white');
  title.style('text-align', 'center');
  title.style('justify-text', 'center');
  title.style('font-family', 'monospace');
  title.style('font-weight', 'bold');
  title.style('text-shadow', '2px 2px 4px #000000');
  title.style('margin', '0px');

  description = createP('A simple drum machine made with JaveScript');
  description.position(width * 0.20, 50);
  description.style('font-size', '20px');
  description.style('color', 'white');
  description.style('text-align', 'center');
  description.style('font-family', 'monospace');
  description.style('font-weight', 'bold');
  description.style('margin', '0px');

  instructions1 = createP('Press space to play/stop');
 
  instructions1.position(width * 0.20, 380);
  instructions1.style('font-size', '20px');
  instructions1.style('color', 'white');
  instructions1.style('text-align', 'center');
  instructions1.style('font-family', 'monospace');
  instructions1.style('font-weight', 'bold');
  instructions1.style('margin', '0px');

  instructions2 = createP('Click on the matrix to change the pattern');
  instructions2.position(width * 0.20, 410);
  instructions2.style('font-size', '20px');
  instructions2.style('color', 'white');
  instructions2.style('text-align', 'center');
  instructions2.style('font-family', 'monospace');
  instructions2.style('font-weight', 'bold');
  instructions2.style('margin', '0px');

  instructions3 = createP('Drag the slider to change the BPM');
  instructions3.position(width * 0.20, 440);
  instructions3.style('font-size', '20px');
  instructions3.style('color', 'white');
  instructions3.style('text-align', 'center');
  instructions3.style('font-family', 'monospace');
  instructions3.style('font-weight', 'bold');
  instructions3.style('margin', '0px');

  instructions4 = createA('https://marlonbarrios.github.io/', 'Programmed by Marlon Barrios Solano', '_blank');
  instructions4.position(width * 0.20, 470);
  instructions4.style('font-size', '20px');
  instructions4.style('color', 'white');
  instructions4.style('text-align', 'center');
  instructions4.style('font-family', 'monospace');
  instructions4.style('margin', '0px');

}



// function windowResized() {
// setup();
// }

