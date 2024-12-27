const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('download');
let frames = [];

uploadInput.addEventListener('change', (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    createGIF(files);
  }
});

function createGIF(files) {
  frames = [];
  const images = [];
  let loadedImages = 0;

  for (const file of files) {
    const img = new Image();
    img.onload = function() {
      loadedImages++;
      if (loadedImages === files.length) {
        generateGIF();
      }
    };
    img.src = URL.createObjectURL(file);
    images.push(img);
  }

  function generateGIF() {
    if (images.length === 0) return;

    // Set canvas size based on first image
    canvas.width = images[0].width;
    canvas.height = images[0].height;

    images.forEach(img => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';  // Add glowing effect
      ctx.drawImage(img, 0, 0);
      frames.push(canvas.toDataURL('image/png'));
    });

    // Make download button visible
    downloadButton.style.display = 'inline-block';
  }
}

downloadButton.addEventListener('click', () => {
  if (frames.length > 0) {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height
    });

    frames.forEach(frame => {
      gif.addFrame(frame, { delay: 500, copy: true });
    });

    // Make sure gif.render() is called correctly
    gif.on('finished', function(blob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'advanced_created.gif';
      a.click();
    });

    gif.render(); // Call render to create the GIF
  } else {
    alert('No frames to create GIF!');
  }
});
canvas.width = images[0].width;
canvas.height = images[0].height;
