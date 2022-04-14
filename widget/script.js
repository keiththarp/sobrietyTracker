// Variables for containers
const landingView = document.querySelector("#landing-view");
const userDisplay = document.querySelector("#user-display");
const soberPickerView = document.querySelector("#sober-picker-view")
const consecutiveSoberDisplay = document.querySelector("#consecutive-sober-display");
const relapseView = document.querySelector("#relapse-view");

let loggedInUser;
let userSoberDate;
let userSoberDateId;
let consecutiveSoberDays;

/* *** unused likely deletable ********

let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
let day = new Date().getDate();

let today = `${year}/${month}/${day}`;
************************************** */

//Calculate consecutive sober days
calcConsecutiveSoberDays = () => {
  consecutiveSoberDays = Math.floor((Date.now() - userSoberDate) / (1000 * 60 * 60 * 24));
};

// Remove views for conditional rendering
clearSoberPickerView = () => soberPickerView.setAttribute("class", "clear-view");
clearLandingView = () => landingView.setAttribute("class", "clear-view");
clearRelapseView = () => relapseView.setAttribute("class", "clear-view");

// Open views for conditional rendering
openSoberPicker = () => soberPickerView.setAttribute("class", "container-fluid sober-picker-view")

// On click function for date picker
saveSoberDate = () => {
  const enteredSoberDate = document.getElementById("sober-date").valueAsNumber;
  buildfire.userData.save(
    {
      soberDate: enteredSoberDate,
    }, "userSoberDate", (err, result) => {
      if (err) {
        return console.error(err)
      } else {
        console.log(result);
        userSoberDate = enteredSoberDate;
        clearSoberPickerView();
        clearRelapseView();
        landing();
      }
    });
};

updateSoberDate = () => {
  openSoberPicker();
}

recentRelapse = () => {
  buildfire.userData.delete(userSoberDateId, "userSoberDate", (err, result) => {
    if (err) {
      return console.error(err)
    } else {
      console.log(result);
      clearLandingView();
      // openRelapseView();
    }
  })
}

updateSoberDate

saveCheckIn = () => {
  clearLandingView();
  clearRelapseView();
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
        landing();
      });
      // set logged in user and check for sobriety date.
    } else {

      loggedInUser = user.username;
      buildfire.userData.get("userSoberDate", (err, result) => {
        if (err) {
          return console.error(err);
        } else if (!result.data.soberDate) {
          console.log("No sober date");
          console.log(result);
        } else {
          console.log("Sober Date");
          console.log(result);
          userSoberDate = result.data.soberDate;
          userSoberDateId = result.id;
          calcConsecutiveSoberDays();
          clearSoberPickerView();

          // Adding during design
          // clearLandingView();
          consecutiveSoberDisplay.innerHTML = `${consecutiveSoberDays}`;
        }
      })
    }
  });
}


landing()