const newBackground = () => {
  buildfire.imageLib.showDialog({}, (err, result) => {
    if (err) return console.error(err);
    buildfire.datastore.save(
      { name: "Background Image", url: result.selectedFiles[0] },
      "backgroundImage",
      (err) => {
        if (err)
          return console.error("Error while saving your new image data", err);
      }
    );
  });
};
