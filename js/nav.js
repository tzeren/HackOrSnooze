"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  hidePageComponents();
  getAndShowStoriesOnStart()
  // putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show favorites list */

function favoritesList(evt){
  console.debug("favoritesList", evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$body.on("click", "#fav-list", favoritesList);

/** Show my stories */

function myStoriesList(evt){
  console.debug("myStoriesList", evt);
  hidePageComponents();
  putMyStoriesOnPage();
}
$body.on("click", "#myStory-list", myStoriesList);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  // console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function addStoryClick(){
  // console.log ('ADD STORY', currentUser);
  if (currentUser === undefined){
    alert ('LOGIN FIRST!!!!');
    return;
  }
  hidePageComponents();
  $newStoryForm.show();
}

$body.on("click", '#add-story', addStoryClick);

async function updateUser(){
  console.log ('UPDATE USER');
  hidePageComponents();

  let myToken = {
    "token" : localStorage.getItem("token")
  };
  let myUsername = localStorage.getItem("username");
  

  let userInfo = await axios.get(`${BASE_URL}/users/${myUsername}`, {params:myToken});
  console.log ('GET USER', userInfo);
  $('#update-user-name').val(`${userInfo.data.user.name}`);
  $('#update-user-password').val(`${userInfo.data.user.password}`);
  $updateUserForm.show();
}

$body.on("click", '#nav-user-profile', updateUser);




