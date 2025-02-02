/**
 * Converts a File object to a base64 encoded string.
 *
 * @param file - The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      //The file is now a base64 string.
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Computes target canvas dimensions for a 4:5 aspect ratio.
 *
 * NOTE: This function currently returns fixed dimensions (400x500).
 * If you’re feeling fancy, feel free to make this dynamic.
 *
 * @param origWidth - Original width of the image.
 * @param origHeight - Original height of the image.
 * @returns A tuple [width, height] for the canvas.
 */
const compute4by5Dimensions = (
  origWidth: number,
  origHeight: number,
): [number, number] => {
  console.log('original dimensions', origHeight, origWidth);
  return [400, 500];
};

/**
 * Draws a blurred cover background from an image or video onto the canvas.
 *
 * This creates a visually appealing background effect by drawing a blurred version of the media.
 *
 * @param ctx - The 2D rendering context.
 * @param img - The image or video element.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 */
function drawBlurredCoverBackground(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  ctx.save();
  ctx.filter = 'blur(20px)';

  const canvasRatio = canvasWidth / canvasHeight;
  const imageRatio = img.width / img.height;

  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas: scale height to canvas height.
    drawHeight = canvasHeight;
    drawWidth = img.width * (drawHeight / img.height);
    offsetX = (canvasWidth - drawWidth) / 2;
  } else {
    // Image is taller than canvas: scale width to canvas width.
    drawWidth = canvasWidth;
    drawHeight = img.height * (drawWidth / img.width);
    offsetY = (canvasHeight - drawHeight) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  ctx.restore();
}

/**
 * Draws an image or video onto the canvas in "contain" mode,
 * ensuring the entire media fits within the canvas while preserving its aspect ratio.
 *
 * @param ctx - The 2D rendering context.
 * @param img - The image or video element.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 */
function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const canvasRatio = canvasWidth / canvasHeight;
  const imageRatio = img.width / img.height;

  let finalW: number, finalH: number;
  if (imageRatio > canvasRatio) {
    finalW = canvasWidth;
    finalH = img.height * (finalW / img.width);
  } else {
    finalH = canvasHeight;
    finalW = img.width * (finalH / img.height);
  }

  const offsetX = (canvasWidth - finalW) / 2;
  const offsetY = (canvasHeight - finalH) / 2;

  ctx.drawImage(img, offsetX, offsetY, finalW, finalH);
}

/**
 * Resizes an image file to a 4:5 aspect ratio and returns a base64 encoded JPEG.
 *
 * @param file - The image file to resize.
 * @returns A promise that resolves with the resized image as a base64 string.
 */
export const resizeImageTo4by5 = async (file: File): Promise<string> => {
  const base64 = await fileToBase64(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const [canvasWidth, canvasHeight] = compute4by5Dimensions(
        img.width,
        img.height,
      );

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get 2D context from canvas.'));
        return;
      }

      // Draw a blurred background to cover the canvas.
      drawBlurredCoverBackground(ctx, img, canvasWidth, canvasHeight);

      // Draw the actual image over the blurred background.
      drawImageContain(ctx, img, canvasWidth, canvasHeight);

      const finalBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(finalBase64);
    };

    img.onerror = reject;
    img.src = base64;
  });
};

/**
 * Generates a thumbnail for a video file by capturing a frame at time 0.
 * The thumbnail is resized to a 4:5 aspect ratio and returned as a base64 encoded JPEG.
 *
 * @param file - The video file.
 * @returns A promise that resolves with the video thumbnail as a base64 string.
 */
export const generateVideoThumbnail = async (file: File): Promise<string> => {
  const videoURL = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoURL;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = 0;
    };

    video.onseeked = () => {
      const [canvasWidth, canvasHeight] = compute4by5Dimensions(
        video.videoWidth,
        video.videoHeight,
      );

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(videoURL);
        return reject(
          new Error('Could not get 2D context for video thumbnail.'),
        );
      }
      // Draw a blurred background for the video thumbnail.
      drawBlurredCoverBackgroundVideo(ctx, video, canvasWidth, canvasHeight);
      // Draw the video frame in "contain" mode.
      drawImageContainVideo(ctx, video, canvasWidth, canvasHeight);

      const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.8);

      URL.revokeObjectURL(videoURL);
      resolve(thumbnailBase64);
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(videoURL);
      reject(err);
    };
  });
};

/**
 * Draws a blurred cover background for a video element onto the canvas.
 *
 * Works similarly to drawBlurredCoverBackground, but uses video metadata.
 *
 * @param ctx - The 2D rendering context.
 * @param video - The video element.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 */
const drawBlurredCoverBackgroundVideo = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
) => {
  ctx.save();

  ctx.filter = 'blur(20px)';

  const canvasRatio = canvasWidth / canvasHeight;
  const videoRatio = video.videoWidth / video.videoHeight;

  let drawW = canvasWidth;
  let drawH = canvasHeight;
  let offsetX = 0,
    offsetY = 0;

  if (videoRatio > canvasRatio) {
    drawH = canvasHeight;
    drawW = video.videoWidth * (drawH / video.videoHeight);
    offsetX = (canvasWidth - drawW) / 2;
  } else {
    drawW = canvasWidth;
    drawH = video.videoHeight * (drawW / video.videoWidth);
    offsetY = (canvasHeight - drawH) / 2;
  }

  ctx.drawImage(video, offsetX, offsetY, drawW, drawH);
  ctx.restore();
};

/**
 * Draws a video element onto the canvas in "contain" mode,
 * ensuring the entire video frame fits within the canvas while preserving its aspect ratio.
 *
 * @param ctx - The 2D rendering context.
 * @param video - The video element.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 */
const drawImageContainVideo = (
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
) => {
  const canvasRatio = canvasWidth / canvasHeight;
  const videoRatio = video.videoWidth / video.videoHeight;

  let finalW = canvasWidth;
  let finalH = canvasHeight;
  let offsetX = 0,
    offsetY = 0;

  if (videoRatio > canvasRatio) {
    finalW = canvasWidth;
    finalH = video.videoHeight * (finalW / video.videoWidth);
    offsetY = (canvasHeight - finalH) / 2;
  } else {
    finalH = canvasHeight;
    finalW = video.videoWidth * (finalH / video.videoHeight);
    offsetX = (canvasWidth - finalW) / 2;
  }

  ctx.drawImage(video, offsetX, offsetY, finalW, finalH);
};
