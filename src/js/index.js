import { Application, TilingSprite } from 'pixi.js';
import { positionsConfig } from './positionsConfig';
import * as PIXI from 'pixi.js';

//define absolute path for images
const basePath = location.href.substring(0, location.href.lastIndexOf('/') + 1);

const sceneSize = {
  SCENE_WIDTH: 2800,
  SCENE_HEIGHT: 800,
};

const stageSize = {
  STAGE_WIDTH: 1600,
  STAGE_HEIGHT: 800,
};

//PIXI initialization =====
let app = new Application({
  view: document.getElementById('pixi-canvas'),
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0xffffff,
  width: stageSize.STAGE_WIDTH,
  height: stageSize.STAGE_HEIGHT,
});

// Enable interactivity!
app.stage.interactive = true;

const charTextureInits = {};
const charTextureFinals = {};

// Make sure the whole canvas area is interactive, not just the circle.
app.stage.hitArea = app.screen;

//import images
const bgLayer0Texture = PIXI.Texture.from(basePath + '/assets/l0/bg_0.png');
const bgLayer1Texture = PIXI.Texture.from(basePath + '/assets/l1/bg_1.png');
const bgLayer2Texture = PIXI.Texture.from(basePath + '/assets/l2/bg_2.png');
const bgLayer3Texture = PIXI.Texture.from(basePath + '/assets/l3/bg_3.png');
const hejkal0 = PIXI.Texture.from(basePath + '/assets/l1/items/hejkal_0.png');
const hejkal1 = PIXI.Texture.from(basePath + '/assets/l1/items/hejkal_1.png');
const certi0 = PIXI.Texture.from(
  basePath + '/assets/l2/items/certi_rodinka_0.png'
);
const certi1 = PIXI.Texture.from(
  basePath + '/assets/l2/items/certi_rodinka_1.png'
);
const ded0 = PIXI.Texture.from(basePath + '/assets/l2/items/ded_vseved_0.png');
const ded1 = PIXI.Texture.from(basePath + '/assets/l2/items/ded_vseved_1.png');
const jezibaba0 = PIXI.Texture.from(
  basePath + '/assets/l2/items/jezibaba_0.png'
);
const jezibaba1 = PIXI.Texture.from(
  basePath + '/assets/l2/items/jezibaba_1.png'
);
const vodnik0 = PIXI.Texture.from(basePath + '/assets/l2/items/vodnik_0.png');
const vodnik1 = PIXI.Texture.from(basePath + '/assets/l2/items/vodnik_0.png');
const drak0 = PIXI.Texture.from(basePath + '/assets/l3/items/drak_0.png');
const drak1 = PIXI.Texture.from(basePath + '/assets/l3/items/drak_1.png');

//import background layer images

const bgLayer0 = new TilingSprite(
  bgLayer0Texture,
  app.screen.width,
  app.screen.height
);

const bgLayer1 = new TilingSprite(
  bgLayer1Texture,
  app.screen.width,
  app.screen.height
);

const bgLayer2 = new TilingSprite(
  bgLayer2Texture,
  app.screen.width,
  app.screen.height
);

const bgLayer3 = new TilingSprite(
  bgLayer3Texture,
  app.screen.width,
  app.screen.height
);

//How fast will the layers move?
let bgX = 0;
let currentX = 0;

let bgSpeed = 1;
let bgMoving = false;

app.stage.addChild(bgLayer0, bgLayer1, bgLayer2, bgLayer3);

const characterSprites = {};

//Add characters to the background

function addCharactersToScene(positionsConfig) {
  for (const { items, name } of positionsConfig) {
    if (items) {
      //check necessary because not all arrays have the items property
      for (const { id, x, y } of items) {
        charTextureInits[id] = PIXI.Texture.from(
          basePath + `assets/${name}/items/${id}_0.png`
        );
        const character = new PIXI.Sprite(charTextureInits[id]);
        charTextureFinals[id] = PIXI.Texture.from(
          basePath + `assets/${name}/items/${id}_1.png`
        );

        // Set the character's position relative to the background layer
        switch (name) {
          case 'l1':
            character.position.set(x + bgLayer1.x, y);
            bgLayer1.addChild(character);
            break;
          case 'l2':
            character.position.set(x + bgLayer2.x, y);
            bgLayer2.addChild(character);
            break;
          case 'l3':
            character.position.set(x + bgLayer3.x, y);
            bgLayer3.addChild(character);
            break;
          default:
            console.log(`invalid name ${name}`);
        }

        // Add the character sprite to the characterSprites object
        characterSprites[id] = character;

        // Add mouseover and mouseout event listeners
        character.interactive = true;
        character.buttonMode = true;
        character.on('mouseover', () => {
          character.texture = charTextureFinals[id];
        });
        character.on('mouseout', () => {
          character.texture = charTextureInits[id];
        });
      }
    }
  }
}

addCharactersToScene(positionsConfig);

//Update the position of the character based on how the background moves, to appear as if it stayed in the same position
function updateCharactersPosition(bgX) {
  for (const { items, name } of positionsConfig) {
    if (items) {
      // check necessary because not all arrays have the items property
      for (const { id, x, y } of items) {
        const character = characterSprites[id];

        if (character) {
          switch (name) {
            case 'l1':
              character.position.set(x + bgLayer1.x - bgX / 3, y);
              break;
            case 'l2':
              character.position.set(x + bgLayer2.x - bgX / 1.85, y);
              break;
            case 'l3':
              character.position.set(x + bgLayer3.x - bgX / 1.5, y);
              break;
            default:
              console.log(`invalid name ${name}`);
          }
        }
      }
    }
  }
}

//update character state on mouse overs
function updateCharactersTextures(mouseX, mouseY) {
  for (const { items, name } of positionsConfig) {
    if (items) {
      // check necessary because not all arrays have the items property
      for (const { id, x, y } of items) {
        const character = characterSprites[id];

        if (character) {
          const mouseOver =
            mouseX >= character.x &&
            mouseX <= character.x + character.width &&
            mouseY >= character.y &&
            mouseY <= character.y + character.height;

          if (mouseOver) {
            character.texture = charTextureFinals[id];
          } else {
            character.texture = charTextureInits[id];
          }
        }
      }
    }
  }
}

app.stage.on('mousemove', (e) => {
  const globalMousePosition = e.global;
  updateCharactersTextures(globalMousePosition.x, globalMousePosition.y);
});

let previousX = 0;

//change the background at different speeds, to achieve a parallax effect
function updateBg() {
  if (bgMoving) {
    bgX += bgSpeed;
    bgLayer3.tilePosition.x = bgX / 1.5;
    bgLayer2.tilePosition.x = bgX / 2;
    bgLayer1.tilePosition.x = bgX / 3;
    bgLayer0.tilePosition.x = 0;
  }
  //stop at the edges of the screen to prevent infinite scrolling
  const stopPosition = stageSize.STAGE_WIDTH + 200;
  const currentX = -bgX;

  if (Math.abs(bgX) >= stopPosition) {
    bgMoving = false;
    if (bgX > 0) {
      bgX = stopPosition;
    } else {
      bgX = -stopPosition;
    }
    bgLayer3.tilePosition.x = bgX / 1.5;
    bgLayer2.tilePosition.x = bgX / 2;
    bgLayer1.tilePosition.x = bgX / 3;
    bgLayer0.tilePosition.x = 0;
  }

  const stopPositionLeft = 0.01;
  if (bgX >= stopPositionLeft) {
    bgMoving = false;
    if (bgX > 0) {
      bgX = stopPositionLeft;
    } else {
      bgX = -stopPositionLeft;
    }
    bgLayer3.tilePosition.x = bgX / 1.5;
    bgLayer2.tilePosition.x = bgX / 2;
    bgLayer1.tilePosition.x = bgX / 3;
    bgLayer0.tilePosition.x = 0;
  }

  updateCharactersPosition(currentX, previousX);
}

//Switch direction upon mouse position
function switchDirection(e) {
  const mousePos = { x: e.clientX, y: e.clientY };
  const stageCenter = app.screen.width / 2;
  const distanceFromCenter = mousePos.x - stageCenter;
  const speedFactor = -distanceFromCenter / stageCenter;
  bgSpeed = speedFactor * 10;
  bgMoving = true;
}

document.addEventListener('mousemove', switchDirection);
app.ticker.add(updateBg); // Call updateBg function continuously to update the position of the background layers.
