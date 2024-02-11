var backgroundContainer = document.getElementById("backgroundContainer");

// Function to change the background image dynamically
function setBackgroundImage() {
  let backgroundURL;
  const fallBackURL = "./img/background2.jpg";
  buildfire.datastore.get("backgroundImage", (err, result) => {
    if (err) {
      return console.error("Error while retrieving background image data", err);
    }
    backgroundURL = result.data.url;
    console.log("image URL " + backgroundURL);
    backgroundContainer.style.backgroundImage = `url("${
      backgroundURL || fallBackURL
    }")`;
  });
}

setBackgroundImage();
