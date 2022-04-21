// Variables for containers
const appView = document.querySelector(".app-view");
const userDisplay = document.querySelector("#user-display");
const soberPickerView = document.querySelector("#sober-picker-view")
const consecutiveSoberDisplay = document.querySelector("#consecutive-sober-display");
const relapseView = document.querySelector("#relapse-view");
const iconDisplayBox = document.querySelector("#icon-display-box");
const soberDateDisplayBox = document.querySelector("#sober-date-display-box");
const yearsIconTally = document.querySelector("#years-icon-tally");
const monthsIconTally = document.querySelector("#months-icon-tally");
const weeksIconTally = document.querySelector("#weeks-icon-tally");
const daysIconTally = document.querySelector("#days-icon-tally");
const badgeDisplay = document.querySelector("#badge-display");
const badgeBox = document.querySelector("#badge-box");
const cashSavedDiv = document.querySelector("#cash-saved-div");
const cashSavedDisplay = document.querySelector("#cash-saved-display-box");

// Variables for state 
let loggedInUser;
let userSoberDate;
let UserDisplaySoberDate;
let userSoberDateId;
let consecutiveSoberDays;
let userAvgExpense;

//Calculate consecutive sober days
calcConsecutiveSoberDays = () => {
  consecutiveSoberDays = Math.floor((Date.now() - userSoberDate) / (1000 * 60 * 60 * 24));
  iconDays();
};

// Remove views for conditional rendering
clearSoberPickerView = () => {
  soberPickerView.setAttribute("class", "clear-view");
  appView.setAttribute("class", "app-view");
}
clearRelapseView = () => {
  relapseView.setAttribute("class", "clear-view");
  appView.setAttribute("class", "app-view");
}

// Open views for conditional rendering
openSoberPicker = () => {
  soberPickerView.setAttribute("class", "container-fluid sober-picker-view")
  appView.setAttribute("class", "clear-view");
};
openRelapseView = () => {
  relapseView.setAttribute("class", "container-fluid sober-picker-view")
  appView.setAttribute("class", "clear-view");
}

// On click function for date picker
saveSoberDate = () => {
  const datePicker = document.getElementById("sober-date");
  const expenseInput = document.getElementById("expense-input");
  const enteredSoberDate = datePicker.valueAsNumber;
  const displaySoberDate = datePicker.value;
  const avgExpense = expenseInput.value;
  buildfire.userData.save(
    {
      soberDate: enteredSoberDate,
      displaySoberDate: displaySoberDate,
      avgExpense: avgExpense,
    }, "userSoberDate", (err, result) => {
      if (err) {
        return console.error(err)
      } else {
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
      iconDisplayBox.innerHTML = '';
      openRelapseView();
    }
  })
}

// Upon arrival to plugin 
landing = () => {
  // Is current user logged in?
  buildfire.auth.getCurrentUser((err, user) => {
    if (err) {
      return console.error(err);
      // If not - force login
    } else if (!user) {
      buildfire.auth.login({ allowCancel: false }, (err, user) => {
        landing();
      });
      // set logged in user and check for sobriety date.
    } else {
      loggedInUser = user.username;
      buildfire.userData.get("userSoberDate", (err, result) => {
        if (err) {
          return console.error(err);
        } else if (!result.data.soberDate) {
          updateSoberDate();
        } else {
          console.log(result);
          userSoberDate = result.data.soberDate;
          UserDisplaySoberDate = result.data.displaySoberDate;
          userSoberDateId = result.id;
          userAvgExpense = result.data.avgExpense;
          calcConsecutiveSoberDays();
          clearSoberPickerView();

          const formattedDate = new Date(userSoberDate + 86400000);
          if (userAvgExpense) {
            cashSavedDisplay.innerHTML = userAvgExpense * consecutiveSoberDays;
          } else {
            cashSavedDiv.setAttribute("class", "clear-view");
          }
          consecutiveSoberDisplay.innerHTML = consecutiveSoberDays;
          soberDateDisplayBox.innerHTML = formattedDate.toLocaleDateString();
        }
      })
    }
  });
}

//Year - Month - Week - Day milestone icons & badge logic.
// Get the total sober days
const iconDays = () => {
  iconDisplayBox.innerHTML = "";
  badgeDisplay.innerHTML = "";
  let stars = consecutiveSoberDays;

  // Figuring out the year milestones is easy
  const yearMilestones = parseInt(stars / 365.25);

  // How many days are left after we calculate the years
  const lessThanYear = stars % 365.25;

  // Since we are not working with a strict calendar,
  // our years and months can be figured with fractions and will level out
  // over a short course of time.

  // So we divide 365.25 by 12 to get 30.4375 days per month.
  const monthMilestones = parseInt(lessThanYear / 30.4375);

  // How many days are left after removing the years and months
  const lessThanMonth = parseInt(lessThanYear % 30.4375);

  // From there, getting the weeks and days is pretty straight forward.
  const weekMilestones = parseInt(lessThanMonth / 7);
  const dayMilestones = parseInt(lessThanMonth % 7);

  // Badge logic
  if (consecutiveSoberDays < 10) badgeBox.setAttribute("class", "clear-view");
  if (consecutiveSoberDays >= 10) {
    badgeBox.setAttribute("Class", "ren-container badge-box");
    const tenDayImg = document.createElement('img');
    tenDayImg.src = "../widget/img/badges/10days.png";
    badgeDisplay.appendChild(tenDayImg);
  }
  if (consecutiveSoberDays >= 30) {
    const thirtyDayImg = document.createElement('img');
    thirtyDayImg.src = "../widget/img/badges/30days.png";
    badgeDisplay.appendChild(thirtyDayImg);
  }
  if (consecutiveSoberDays >= 60) {
    const sixtyDayImg = document.createElement('img');
    sixtyDayImg.src = "../widget/img/badges/60days.png";
    badgeDisplay.appendChild(sixtyDayImg);
  }
  if (consecutiveSoberDays >= 90) {
    const ninetyDayImg = document.createElement('img');
    ninetyDayImg.src = "../widget/img/badges/90days.png";
    badgeDisplay.appendChild(ninetyDayImg);
  }
  if (consecutiveSoberDays >= 182) {
    const sixMoImg = document.createElement('img');
    sixMoImg.src = "../widget/img/badges/6month.png";
    badgeDisplay.appendChild(sixMoImg);
  }
  if (consecutiveSoberDays >= 274) {
    const nineMoImg = document.createElement('img');
    nineMoImg.src = "../widget/img/badges/9month.png";
    badgeDisplay.appendChild(nineMoImg);
  }
  if (yearMilestones) {
    const yearImg = document.createElement('img');
    yearImg.src = "../widget/img/badges/1year.png";
    badgeDisplay.appendChild(yearImg);
  }

  // Set our icons labels display
  yearsIconTally.innerHTML = yearMilestones ? yearMilestones : "";
  monthsIconTally.innerHTML = monthMilestones ? monthMilestones : "";
  weeksIconTally.innerHTML = weekMilestones ? weekMilestones : "";
  daysIconTally.innerHTML = dayMilestones ? dayMilestones : "";

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