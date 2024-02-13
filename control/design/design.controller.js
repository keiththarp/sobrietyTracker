const newBackground = () => {
  buildfire.imageLib.showDialog({}, (err, result) => {
    if (err) return console.error(err);
    buildfire.datastore.save(
      {
        name: "Background Image",
        url: result.selectedFiles[0],
        chosen: "upload",
      },
      "backgroundImage",
      (err, res) => {
        if (err)
          return console.error("Error while saving your new image data", err);
      }
    );
  });
};

buildfire.datastore.get("backgroundImage", (err, result) => {
  if (err) {
    return console.error("Error while retrieving background image data", err);
  }
  chosen = result.data.chosen;
  if (chosen === "upload") return;
  changeButtonClass(chosen);
});

const chooseBackground = (source, chosen) => {
  buildfire.datastore.save(
    { name: "Background Image", url: source, chosen: chosen },
    "backgroundImage",
    (err, res) => {
      if (err)
        return console.error("Error while saving your new image data", err);
      changeButtonClass(chosen);
    }
  );
};

function changeButtonClass(chosen) {
  var buttons = document.querySelectorAll(".image-button-container button");
  buttons.forEach((button, index) => {
    if (index === chosen) {
      button.classList.remove("button");
      button.classList.add("chosen-bg-button");
    } else {
      button.classList.remove("chosen-bg-button");
      button.classList.add("button");
    }
  });
}
