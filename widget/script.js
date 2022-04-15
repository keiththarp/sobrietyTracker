// Variables for containers
const landingView = document.querySelector("#landing-view");
const userDisplay = document.querySelector("#user-display");
const soberPickerView = document.querySelector("#sober-picker-view")
const consecutiveSoberDisplay = document.querySelector("#consecutive-sober-display");
const relapseView = document.querySelector("#relapse-view");
const iconDisplayBox = document.querySelector("#icon-display-box");

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
  iconDays();
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

//This code contains the logic for the milestone icons.

// Get the total sober days
const iconDays = () => {
  let stars = consecutiveSoberDays;

  // Figuring out the year milestones is easy
  const yearMilestones = parseInt(stars / 365.25);

  // How many days are left after we calculate the years
  const lessThanYear = stars % 365.25;

  // Since we are not working with a strict calendar, allowing "off days"
  // our years and months can be figured with fractions and will level out
  // over a short course of time.

  // So we divide 365.25 by 12 to get 30.4375 days per month.
  const monthMilestones = parseInt(lessThanYear / 30.4375);

  // How many days are left after removing the years and months
  const lessThanMonth = parseInt(lessThanYear % 30.4375);

  // From there, getting the weeks and days is pretty straight forward.
  const weekMilestones = parseInt(lessThanMonth / 7);
  const dayMilestones = parseInt(lessThanMonth % 7);

  //Now we stick our icon variable in an array to loop through and create our icon display
  const milestonesArray = [
    {
      icon: yearMilestones,
      iconStyle: 'fa-medal',
      css: 'year-star'
    },
    {
      icon: monthMilestones,
      iconStyle: 'fa-star',
      css: 'month-star'
    },
    {
      icon: weekMilestones,
      iconStyle: 'fa-sun',
      css: 'week-star'
    },
    {
      icon: dayMilestones,
      iconStyle: 'fa-circle-check',
      css: 'day-star'
    }
  ];

  //Loop through our array to create the milestones display
  milestonesArray.forEach(element => {
    const { icon, iconStyle, css } = element;

    for (let i = 0; i < icon; i++) {
      el = document.createElement('i');
      el.classList.add('fa-solid', iconStyle, css);
      iconDisplayBox.appendChild(el);
    }
  });
};

landing()