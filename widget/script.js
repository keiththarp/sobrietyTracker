// Variables for containers
const landingContainer = document.querySelector("#landing-view");
const userDisplay = document.querySelector("#user-display");

let loggedInUser;

// Upon arrival to plugin 
landing = () => {
  // Is current user logged in?
  buildfire.auth.getCurrentUser((err, user) => {
    if (err) {
      return console.error(err);
      // If not - force login
    } else if (!user) {
      buildfire.auth.login({ allowCancel: false }, (err, user) => {
        console.log(err, user);
      });
      // set logged in user and check for sobriety date.
    } else {
      loggedInUser = user.username;
      userDisplay.innerHTML = `${loggedInUser}`;
    }
  });
}

removeModal = () => {
  landingContainer.setAttribute("class", "clear-landing-view")
}

landing()