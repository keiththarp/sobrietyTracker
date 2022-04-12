// Variables for containers
const landingContainer = document.querySelector("#landing-view");
const userDisplay = document.querySelector("#user-display");
const soberPickerView = document.querySelector("#sober-picker-view")

let loggedInUser;
let userSoberDate;
let userSoberDateId;
let today = new Date();

// Remove views for conditional rendering
clearSoberPickerView = () => soberPickerView.setAttribute("class", "clear-sober-picker-view");
clearLandingView = () => landingContainer.setAttribute("class", "clear-landing-view");

// On click function for date picker
saveSoberDate = () => {
  const enteredSoberDate = document.getElementById("sober-date").value;
  buildfire.userData.save(
    {
      soberDate: enteredSoberDate,
    }, "userSoberDate", (err, result) => {
      if (err) {
        return console.error(err)
      } else {
        console.log(result);
        clearSoberPickerView();
      }
    });
};

recentRelapse = () => {
  buildfire.userData.delete(userSoberDateId, "userSoberDate", (err, result) => {
    if (err) {
      return console.error(err)
    } else {
      console.log(result);
    }
  })
}

saveCheckIn = () => {
  clearLandingView();
  document.querySelector("#sober-date-display").innerHTML = userSoberDate;
};

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
      console.log(today);
      buildfire.userData.get("userSoberDate", (err, result) => {
        if (err) {
          return console.error(err);
        } else if (!result.data.soberDate) {
          console.log(result);
        } else {
          console.log(result);
          userSoberDate = result.data.soberDate;
          userSoberDateId = result.id;
          clearSoberPickerView();
        }
      })
    }
  });
}


landing()