
const themodule = mozjpeg_enc();

async function loadImage(src) {
  // Load image
  const img = document.createElement('img');
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  // Make canvas same size as image
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

async function compressFileJpeg2(file, quality = 50) {
  let {name, type} = file;
  // get image size
  let img = new Image();
  img.src = URL.createObjectURL(file);
  
  const image = await loadImage(img.src);
  const result = themodule.encode(image.data, image.width, image.height, {
    quality,
    baseline: false,
    arithmetic: false,
    progressive: true,
    optimize_coding: true,
    smoothing: 0,
    color_space: 3,
    quant_table: 3,
    trellis_multipass: false,
    trellis_opt_zero: false,
    trellis_opt_table: false,
    trellis_loops: 1,
    auto_subsample: true,
    chroma_subsample: 2,
    separate_chroma_quality: false,
    chroma_quality: 75,
  });

  return new File([result], name, {type});
}
function compressFile2(quality) {
  return async (file) => {
    let result;

    switch(file.type){
      case "image/jpeg":
        result = await compressFileJpeg2(file, quality);
        break;
      default:
        result = file;
    }

    return result;
  }
}

class NextInputFileCompressorElement extends HTMLInputElement {
 static get is () {
    return 'next-input-file-compressor';
  }

  getFiles(_quality) {
    const quality = _quality || Number(this.getAttribute('quality') || 100);
    const files = Array.from(this.files);
    return Promise.all(files.map(compressFile2(quality)))
  }

  valuesAsUint8ArrayPromise(){
    return this.valuesAsArrayBufferPromise()
      .then(arr => arr.map(e => new Uint8Array(e)));
  }

  valuesAsArrayBufferPromise() {
    return this.type === 'file'
      ? Promise.all([...this.files].map(file => file.arrayBuffer()))
      : Promise.reject(`type "${this.type}" not support this method`);
  }
}

customElements.define(NextInputFileCompressorElement.is, NextInputFileCompressorElement, {extends: 'input'})