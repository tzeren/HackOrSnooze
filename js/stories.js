"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let updStoryId = '';

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  console.log ('get and show stories');
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story,list) {
  let delIcon = '';
  let favIcon = '';
  const hostName = story.getHostName();
  let favFlag = currentUser.favorites.find(n => n.storyId === story.storyId);
  if (list === 3){
    delIcon = "<large class='delIcon'>&#x1F5D1</large> <large class='editIcon'>&#xBB</large>";
  }

  if (favFlag){
    favIcon = "<large class='favorite-star'>&#9733</large> <large class='favorite-star hide-fav'>&#9734</large>";
  } else {
    favIcon = "<large class='favorite-star  hide-fav'>&#9733</large> <large class='favorite-star'>&#9734</large>";
  }

  return $(`
      <li id="${story.storyId}">
        ${delIcon}
        ${favIcon}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {

  $allStoriesList.empty();
  $favStoriesList.empty();
  $myStoriesList.empty();
  $newStoryForm.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story,1);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets favorite stories from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {

  $favStoriesList.empty();
  $myStoriesList.empty();
  $newStoryForm.hide();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story,2);
    $favStoriesList.append($story);
  }

  $favStoriesList.show();
}

/** Gets my stories from server, generates their HTML, and puts on page. */

function putMyStoriesOnPage() {

  $myStoriesList.empty();
  $favStoriesList.empty();
  $newStoryForm.hide();
  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story,3);
    $myStoriesList.append($story);
    }

  $myStoriesList.show();
}

async function submitStoryForm(evt){
  evt.preventDefault();

  let myToken = localStorage.getItem("token");
  let myUsername = localStorage.getItem("username");
  let newStory = {
    'token' : myToken,
    'story' : {
      'author' : $('#story-author').val(),
      'title' : $('#story-title').val(),
      'url' : $('#story-URL').val()      
    }
  }

  if (updStoryId === ''){
    console.log ('ADD', updStoryId);
    await StoryList.addStory(myUsername, newStory);
  } else {
    let updRes = await StoryList.updateStory(updStoryId, newStory);
    console.log ('UPDATE RESPONSE',updRes);
    updStoryId = '';
    currentUser = await User.loginViaStoredCredentials(myToken, myUsername);
    console.log ('UPDATE 2', currentUser.ownStories);
    putMyStoriesOnPage();
  }
  $('#story-author').val('');
  $('#story-title').val('');
  $('#story-URL').val('');
}

async function selectFavorite(evt){
  evt.preventDefault;

  evt.target.classList.toggle('hide-fav');
  if (evt.target.nextElementSibling.classList[0] === 'favorite-star') {
    evt.target.nextElementSibling.classList.toggle('hide-fav');
  } else if (evt.target.previousElementSibling.classList[0] === 'favorite-star') {
    evt.target.previousElementSibling.classList.toggle('hide-fav');
  }

  let myToken = {
    "token" : localStorage.getItem("token")
  };
  
  let myUsername = localStorage.getItem("username");
  let myStoryId = evt.target.parentElement.id;
 
  if (evt.target.innerText === '★') {
    let resp = await axios.delete(`${BASE_URL}/users/${myUsername}/favorites/${myStoryId}`, {data:myToken});
    currentUser.favorites = resp.data.user.favorites.map(s => new Story(s));
  } else {
    let resp = await axios.post(`${BASE_URL}/users/${myUsername}/favorites/${myStoryId}`, myToken);
    currentUser.favorites = resp.data.user.favorites.map(s => new Story(s));
  }

}

$body.on('click', '#submit-form', submitStoryForm);

$body.on('click', '.favorite-star', selectFavorite);

$body.on('click', '.delIcon', StoryList.deleteStory);

$body.on('click', '.editIcon', StoryList.editStory);