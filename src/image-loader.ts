export const loadImage = (
  src: string,
  callback: (image: HTMLImageElement) => void,
) => {
  const image = new Image();
  image.onload = () => {
    callback(image);
  }
  image.src = src;
};