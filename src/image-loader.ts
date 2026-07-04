export const loadImage = (
  src: string,
  callback: (image: HTMLImageElement) => void,
) => {
  console.log("im loading an iamge");
  const image = new Image();
  image.onload = () => {
    callback(image);
  };
  image.src = src;
};

export const loadImagePromise = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    try {
      loadImage(src, (image) => resolve(image));
    } catch (error) {
      reject(error);
    }
  });
};
