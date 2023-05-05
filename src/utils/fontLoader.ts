/**return font instance or error */
export function loadFont(name: string, url: string) {
  return new Promise<FontFace | Error>((res, rej) => {
    const newFont = new FontFace(name, `url(${url})`);
    newFont
      .load()
      .then(function (loaded) {
        document.fonts.add(loaded);

        res(newFont);
      })
      .catch(function (error) {
        rej(error);
      });
  });
}
