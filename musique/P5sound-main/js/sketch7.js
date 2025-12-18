

// anim 1 
let activeMode = 1;
let sketch3D = null;
let canvas2D = null;
let isGlobalGlitchActive = false; 

let soundGreenGlobal, soundSheepGlobal;
let currentSoundGlobal; 
let isSoundStarted = false; 



function switchTo3D() {
  noLoop(); 
  
  if (!canvas2D) canvas2D = document.querySelector("canvas");
  if (canvas2D) canvas2D.style.display = "none";
  
  if (!sketch3D) sketch3D = createSketch3D();
  
  activeMode = 2;
}




function switchTo2D() {
  if (sketch3D) {
    try { sketch3D.remove(); } catch(e) {} 
    sketch3D = null;
  }
  
  
  
  if (!canvas2D) canvas2D = document.querySelector("canvas");
  if (canvas2D) canvas2D.style.display = "block";
  
  loop(); 
  activeMode = 1;
}






//anim 2 
let currentScene = 1; 
let amp;
let temps = 0; 
let marge = 100; 
let zoom = 0.005; 
let grilleCercle = 20; 



let rayonBase; 
let forceDisintegration = 0; 
let nbrePics = 20; 
let repulsionRadius = 75; 
let repulsionStrength = 0.5;


let grillePleine = 10; 
let currentAffichage = 0; 
let playbackRate = 1.0; 
let isColorMode = false; 

function preload() {
  soundGreenGlobal = loadSound('sound/GREEN.mp3');
  soundSheepGlobal = loadSound('sound/SHEEP.mp3');
}

function setup() {
  colorMode(HSL, 360, 100, 100, 100);
  createCanvas(windowWidth, windowHeight);
  frameRate(20);
  
  amp = new p5.Amplitude();
  
  currentSoundGlobal = soundGreenGlobal;
  
  rayonBase = min(width, height) * 0.3;
  background(0);
  noCursor();
  canvas2D = document.querySelector("canvas");
}

function draw() {
  if (activeMode !== 1) return;

  if (isSoundStarted && currentSoundGlobal.isPlaying()) {
    currentSoundGlobal.rate(playbackRate);
  }

  fill(0, 0, 0, 10);
  rect(0, 0, width, height);

  if (currentScene === 1) sceneUnCercle();
  else if (currentScene === 2) sceneDeuxGrille();

  if (isGlobalGlitchActive) {
    drawGlobalGlitch2D();
  }

  if (!isSoundStarted) {
    
  
  
  
  
  
  
  
  
  } else {



    
    
    fill(0, 0, 100); textSize(14);
    
    textAlign(LEFT, TOP);
    text("Appuyer sur 1 ou 2", marge, 30);

    textAlign(LEFT, BOTTOM);
    text("Appuyez sur ENTRER ou P", marge, height - 60);

   
   
   
    textAlign(RIGHT, BOTTOM);
    text("Appuyez sur les flèches", width - marge, height - 60);

    textAlign(RIGHT, TOP);

    text("Appuyez sur M ou N", width - marge, 30);
    if(isGlobalGlitchActive) {
        
    } else {
        fill(0, 0, 100);
        text("Appuyez sur M ou N", width - marge, 30);
    }
  }
}



function drawGlobalGlitch2D() {




    let level = amp.getLevel();
    let glitchGrille = 40; 
    let shake = level * 30; 

    stroke(0, 100, 50, 80); 
    strokeWeight(2);
    noFill();



    for (let x = 0; x < width; x += glitchGrille) {
        beginShape();
        for (let y = 0; y < height; y += glitchGrille) {
            let offsetX = random(-shake, shake);
            if (level > 0.2 && random() > 0.95) offsetX += random(-50, 50);
            vertex(x + offsetX, y);
        }
        endShape();
    }
    




    strokeWeight(1);
    for (let y = 0; y < height; y += glitchGrille) {
        beginShape();
        for (let x = 0; x < width; x += glitchGrille) {
             let offsetY = random(-shake * 0.5, shake * 0.5); //changer le 0.5
             vertex(x, y + offsetY);
        }
        endShape();
    }





    if (level > 0.1) {
        noStroke();


        fill(0, 100, 50, random(50, 150)); //noFill()
        for(let i = 0; i < 3; i++) {
            rect(random(width), random(height), random(10, 100), random(2, 10));
        }
    }
}

function sceneUnCercle() {
  let level = amp.getLevel();
  forceDisintegration = lerp(forceDisintegration, map(level, 0, 0.4, 0, 0.9), 0.1);
  temps += level * 0.1 * playbackRate;
  let cx = width / 2; let cy = height / 2;
  noFill(); stroke(0, 0, 90, 80); strokeWeight(1);
  let startX = -floor(rayonBase * 2 / grilleCercle / 2) * grilleCercle;
  
  for (let xOffset = startX; xOffset <= -startX; xOffset += grilleCercle) {
    for (let yOffset = startX; yOffset <= -startX; yOffset += grilleCercle) {
      let d = dist(0, 0, xOffset, yOffset);
      if (d < rayonBase) {
        let posX = cx + xOffset; let posY = cy + yOffset;
        let noiseValue = noise(posX * zoom, posY * zoom, temps) * 2;
        let distToMouse = dist(posX, posY, mouseX, mouseY);
        if (distToMouse < repulsionRadius) {
          let rep = map(distToMouse, 0, repulsionRadius, repulsionStrength, 0);
          let angle = atan2(posY - mouseY, posX - mouseX);
          posX += cos(angle) * rep * 10; posY += sin(angle) * rep * 10;
        }
        let offsetChute = map(yOffset, 0, rayonBase, 0, 1) * forceDisintegration * 150;
        let vibration = map(noiseValue, 0, 2, -15, 15) * forceDisintegration * 0.5;
        let fragmentAlpha = map(forceDisintegration, 0, 1, 60, 20);
        stroke(0, 0, 90, fragmentAlpha); fill(0, 0, 90, 5);
        rect(posX, posY + offsetChute + vibration, grilleCercle * noiseValue * 0.5, grilleCercle * 0.5); noFill();
      }
    }
  }
  let len = map(level, 0, 0.5, 50, 250) * playbackRate;
  for (let i = 0; i < nbrePics; i++) {
    let a = map(i, 0, nbrePics, 0, TWO_PI);
    let n = noise(cos(a) * zoom * 20, sin(a) * zoom * 20, temps * 0.1) * 0.5;
    line(cx + cos(a) * (rayonBase + 5), cy + sin(a) * (rayonBase + 5), cx + cos(a) * (rayonBase + len + n * 50), cy + sin(a) * (rayonBase + len + n * 50));
  }
}

function sceneDeuxGrille() {
  if (currentAffichage === 0) affichageCarresNB_Destructure();
  else if (currentAffichage === 1) affichageCarres();
  else if (currentAffichage === 2) affichageEtoiles();
}

function affichageCarresNB_Destructure() {
  let level = amp.getLevel(); temps += level * 0.5 * playbackRate;
  let dis = lerp(0, map(level, 0, 0.4, 0, 0.9), 0.1);
  for (let x = marge; x < width - marge; x += grillePleine) {
    for (let y = marge; y < height - marge; y += grillePleine) {
      let tr = noise(x * zoom, y * zoom, temps); let nv = noise(x * zoom, y * zoom, temps) * 2;
      let alpha = map(dis, 0, 1, 80, 20); stroke(0, 0, 90, alpha);
      let off = map(y, marge, height - marge, 0, 1) * dis * 150; let vib = map(nv, 0, 2, -15, 15) * dis * 0.5;
      let sz = (tr > 0.6) ? 0.9 : (tr > 0.4 ? 0.6 : 0.3);
      fill(0, 0, (tr > 0.6) ? 90 : (tr > 0.4 ? map(tr, 0.4, 0.6, 50, 70) : 30), alpha);
      rect(x + vib, y + off + vib, grillePleine * sz, grillePleine * sz);
    }
  }
}

function affichageCarres() {
  let level = amp.getLevel(); temps += level * 0.5 * playbackRate;
  for (let x = marge; x < width - marge; x += grillePleine) {
    for (let y = marge; y < height - marge; y += grillePleine) {
      let t = noise(x * zoom, y * zoom, temps); noStroke();
      let H = isColorMode ? map(t, 0, 1, 0, 360) : 0; let S = isColorMode ? 100 : 0; let L = isColorMode ? 70 : map(t, 0, 1, 30, 90);
      let sz = (t > 0.6) ? 0.9 : (t > 0.4 ? 0.6 : 0.3);
      fill(H, S, L, isColorMode ? 100 : 80); rect(x, y, grillePleine * sz, grillePleine * sz);
    }
  }
}

function affichageEtoiles() {
  let level = amp.getLevel(); temps += level * 0.5 * playbackRate;
  for (let x = marge; x < width - marge; x += grillePleine) {
    for (let y = marge; y < height - marge; y += grillePleine) {
      let t = noise(x * zoom, y * zoom, temps); noStroke(); textAlign(CENTER, CENTER);
      let H = isColorMode ? map(t, 0, 1, 0, 360) : 0; let S = isColorMode ? 100 : 0; let L = isColorMode ? 70 : map(t, 0, 1, 30, 90);
      let sz = (t > 0.6) ? 18 : (t > 0.4 ? 12 : 6);
      fill(H, S, L, isColorMode ? 100 : 80); textSize(sz); text('*', x + grillePleine / 2, y + grillePleine / 2);
    }
  }
}







function mousePressed() {
  
  
  
  if (!isSoundStarted) {
    if (getAudioContext().state !== 'running') getAudioContext().resume();
    currentSoundGlobal.loop();
    isSoundStarted = true;
    return;
  }
  
 
 
 
 
  if (currentSoundGlobal.isPlaying()) currentSoundGlobal.pause();
  else currentSoundGlobal.loop();
}






function keyPressed() {
 
 
 //touche pour cjangement anims //


 
  if (key === 'n' || key === 'N') {
    isGlobalGlitchActive = !isGlobalGlitchActive;
  }





  if (key === 'p' || key === 'P') {
    if (activeMode === 1) switchTo3D();
    else switchTo2D();
    return;
  }
  




  if (key === 'm' || key === 'M') {
      if (isSoundStarted) {
          let wasPlaying = currentSoundGlobal.isPlaying();
          if (wasPlaying) currentSoundGlobal.stop();
          
          currentSoundGlobal = (currentSoundGlobal === soundGreenGlobal) ? soundSheepGlobal : soundGreenGlobal;
          
          if (wasPlaying) currentSoundGlobal.loop();
      }
  }
  


  if (activeMode === 1) {
      if (keyCode === ENTER) {
        currentScene = (currentScene === 1) ? 2 : 1;
        if (currentScene === 2) { currentAffichage = 0; isColorMode = false; }
      }


      if (currentScene === 2) {
        if (key == '0') { currentAffichage = 0; isColorMode = false; }
        else if (key == '1') { currentAffichage = 1; isColorMode = !isColorMode; }
        else if (key == '2') { currentAffichage = 2; isColorMode = !isColorMode; }
      }



      if (keyCode === RIGHT_ARROW) playbackRate = min(playbackRate + 0.1, 3.0);
      if (keyCode === LEFT_ARROW) playbackRate = max(playbackRate - 0.1, 0.1);
      if (keyCode === DOWN_ARROW) playbackRate = 1.0;
  }
}

function windowResized() {
  if (activeMode === 1) {
    resizeCanvas(windowWidth, windowHeight);
    rayonBase = min(width, height) * 0.3;
  }
}

// anim3



function createSketch3D() {
  const s = (p) => {
    let grille = 20;
    let marge = 50; // modif marge à 90? 
    
    let amp3D, fft3D;
    let zoomPerlin = 0.009;
    let temps = 0;
    let rotationBase = 0;
   
   
   
   
    let rotationVitesse = 0.5;
    let zoomCamera = 0;
    let sensibiliteZoom = 2;
    let isBWMode = false;
    



    p.setup = () => {
      p.colorMode(p.HSL, 360, 100, 100, 100);
      p.angleMode(p.DEGREES);
      p.rectMode(p.CENTER);
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      p.frameRate(30);
      
      amp3D = new p5.Amplitude();
      fft3D = new p5.FFT();
    };






    p.draw = () => {
      fft3D.analyze();
      let level = amp3D.getLevel();
      let bass = fft3D.getEnergy("bass");

      if (isBWMode) p.background(0, 0, 100); 
      else p.background(270, 50, 5);




      p.push();
      p.translate(0, 0, -500 + zoomCamera);
      p.rotateX(p.map(p.mouseY, 0, p.height, 20, 70));
      p.rotateZ(p.map(p.mouseX, 0, p.width, -20, 20));

      temps += level * rotationVitesse * 0.5;





      grille3D(level, bass);

      if (isBWMode && level > 0.05) {
        drawVerticalRedLines(level);
      }

      if (isGlobalGlitchActive) {
        p.push();
        p.translate(0, 0, 50); 
        grilleSigneRouge3D(level);
        p.pop();
      }




      rotationBase += 0.2;
      p.rotateY(rotationBase);
      p.pop();
      


      p.push();
      p.fill(isBWMode ? 0 : 100);
      p.textAlign(p.CENTER, p.CENTER);
      
      
      
      p.translate(0, 200, 0);
      p.textSize(12);
      
      let musicName = (currentSoundGlobal === soundGreenGlobal) ? "GREEN" : "SHEEP";
      p.text(`Musique: ${musicName} (M) | Mode N&B: ${isBWMode ? "ON" : "OFF"} (L)`, 0, 0);
      



      if(isGlobalGlitchActive) {
          p.fill(0, 100, 50); 
          p.text("OVERLAY ROUGE GLOBAL: ON (N)", 0, 20);
      } else {
           p.fill(isBWMode ? 0 : 100);
           p.text("Appuyez sur 'M ou N' pour Overlay Rouge", 0, 20);
      }
      p.pop();
    };

    p.keyPressed = () => {
       if (p.key === 'l' || p.key === 'L') {
         isBWMode = !isBWMode;
       }
    };

    p.mouseWheel = (event) => {
      zoomCamera -= event.delta * sensibiliteZoom;
      zoomCamera = p.constrain(zoomCamera, -2000, 1500);
      return false;
    };




    
    //anim3bis 



    function grille3D(level, bass) {
      let startX = -p.width / 2 + marge;
      
      
      
    let startY = -p.height / 2 + marge;
      let forceVibration = p.map(bass, 0, 255, 0.0, 1.0);

      for (let x = startX; x < p.width / 2 - marge; x += grille) {
        for (let y = startY; y < p.height / 2 - marge; y += grille) {
          let paramX = x * zoomPerlin;
        
        
        
        let paramY = y * zoomPerlin;
          let noiseVal = p.noise(paramX, paramY, temps);
          let angleNoise = noiseVal * 360;

          p.push();
          let h = p.map(noiseVal, 0, 1, -100, 100);
          p.translate(x, y, h);
          p.rotateY(angleNoise);


          p.rotateX(angleNoise);
          p.rotateZ(forceVibration * 180);
          let taillePulse = p.map(level, 0, 0.2, 0.8, 2.0);
          p.scale(taillePulse);

          if (isBWMode) {
            p.fill(0, 0, 100);
            p.stroke(0, 0, 0);
            p.strokeWeight(2);
          } else {
            let hueValue = angleNoise % 360;
            let lumValue = p.map(bass, 0, 255, 20, 80);
            p.fill(hueValue, 80, lumValue, 80);
            p.noStroke();
          }

          p.box(grille - 2);
          p.pop();
        }
      }
    }

    function drawVerticalRedLines(level) {
      p.push();
      p.stroke(0, 100, 50); 
     
     
     
      p.strokeWeight(2);
      p.noFill();
     
         p.translate(0, 0, 200); 
      p.translate(-p.width/2, -p.height/2);

      let espacement = grille * 4; 

      for (let x = 0; x < p.width; x += espacement) {
         p.beginShape();
         for (let y = 0; y < p.height; y += 20) {
            let noiseX = p.noise(x * zoomPerlin, y * zoomPerlin, temps) * 200 * level * 2;
            let threshold = p.noise(x * zoomPerlin, y * zoomPerlin, temps);
            
            if(threshold > 0.4) {
               p.vertex(x + noiseX, y); 
            } else {
               p.vertex(x, y); 
            }
         }
         p.endShape();
      }
      p.pop();
    }

    function grilleSigneRouge3D(level) {
       p.stroke(0, 100, 50); 
       p.strokeWeight(2);
       p.noFill();

       let startX = -p.width / 2 + marge;
       let startY = -p.height / 2 + marge;
       let agitation = level * 50;

       for (let x = startX; x < p.width / 2 - marge; x += grille) {
          p.beginShape();
          for (let y = startY; y < p.height / 2 - marge; y += grille) {
             let n = p.noise(x * 0.02, y * 0.02, temps * 2);
             let zOffset = p.map(n, 0, 1, -50, 50) + agitation;
             if (level > 0.3 && p.random() > 0.9) {
                 p.vertex(x + p.random(-10, 10), y, zOffset);
             } else {
                 p.vertex(x, y, zOffset);
             }
          }
          p.endShape();
       }





       for (let y = startY; y < p.height / 2 - marge; y += grille) {
          p.beginShape();
          for (let x = startX; x < p.width / 2 - marge; x += grille) {
             let n = p.noise(x * 0.02, y * 0.02, temps * 2);
             let zOffset = p.map(n, 0, 1, -50, 50) + agitation;
             p.vertex(x, y, zOffset);
          }
          p.endShape();
       }
    }

    p.mousePressed = () => {
      if (currentSoundGlobal.isPlaying()) currentSoundGlobal.pause();
      else currentSoundGlobal.loop();
    };

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
  };

  return new p5(s);
}