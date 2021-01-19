window.saveDataAcrossSessions = true;

const lookDelay = 1000; // 1 second
const leftCutoff = window.innerWidth / 4;
const rightCutoff = window.innerWidth - window.innerWidth / 4;

let startLookTime = Number.POSITIVE_INFINITY;
let lookDirection = null;
let imageElement = getNewImage();
let nextImageElement = getNewImage(true);

webgazer
  .setGazeListener((data, timestamp) => {
    if (data == null || lookDirection === 'stop') {
      return;
    }

    if (
      data.x < leftCutoff &&
      lookDirection !== 'left' &&
      lookDirection !== 'reset'
    ) {
      startLookTime = timestamp;
      lookDirection = 'left';
    } else if (
      data.x > rightCutoff &&
      lookDirection !== 'right' &&
      lookDirection !== 'reset'
    ) {
      startLookTime = timestamp;
      lookDirection = 'right';
    } else if (data.x >= leftCutoff && data.x <= rightCutoff) {
      startLookTime = Number.POSITIVE_INFINITY;
      lookDirection = null;
    }

    if (startLookTime + lookDelay < timestamp) {
      if (lookDirection === 'left') {
        imageElement.classList.add('left');
      } else {
        imageElement.classList.add('right');
      }

      startLookTime = Number.POSITIVE_INFINITY
      lookDirection = 'stop';
      setTimeout(() => {
        imageElement.remove();
        nextImageElement.classList.remove('next');
        imageElement = nextImageElement;
        nextImageElement = getNewImage(true);
        lookDirection = 'reset';
      }, 200)
    }
  })
  .begin();

//webgazer.showVideoPreview(false).showPredictionPoints(false)

function getNewImage(next = false) {
  const img = document.createElement('img');
  img.src = 'https://picsum.photos/1000?' + Math.random();

  if (next) {
    img.classList.add('next');
  };

  document.body.append(img);
  return img;
}