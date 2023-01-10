let snareNoise;
let snareEnv;
let snarePat;
// let drums;
let bpFilter;
let rev;
let dist;
// let BPM;;

function setup(){

    snarePat = [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1];

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

    drums = new p5.Part();
    drums.setBPM('200');
    drums.addPhrase('snare', (time) => {
        snareEnv.play(snareNoise, time);
    }   , snarePat);
     drums.loop();
}


// function touchStarted() {
//     if (getAudioContext().state !== "running") {
//       get.AudioContext().resume();
//     }
//   }

//   function keyPressed() {
//     if (key ===' ') {
     
//       if (!drums.isPlaying) {
//         //drums.metro.metroTicks = 0;
//         drums.loop();
//       } else {
//         drums.stop();
//       } 
//      } else {
//         console.log('not loaded');
//      }

// }
  