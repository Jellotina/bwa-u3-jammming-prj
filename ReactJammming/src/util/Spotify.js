let accessToken;
let expirationTime;
const urlString = window.location.href;
const clientId = "8e9526faf0d04696b93dba651d424f46";
const redirectUri = "http://jammmingwithreact.surge.sh/";


const Spotify = {

  getAccessToken() {
    //If user has already recieved an access token, return it
    if (accessToken) { return accessToken; }
    else {
      //Check the current URL to see if the access token and its timer exist.
      if ( urlString.match(/access_token=([^&]*)/)  &&  urlString.match(/expires_in=([^&]*)/) ) {
        accessToken = urlString.match(/access_token=([^&]*)/)[1];
        expirationTime = urlString.match(/expires_in=([^&]*)/)[1];
        //Sets access token to expire after a duration of time
        window.setTimeout(() => accessToken = '', expirationTime*1000);
        //Clears the parameters from the URL, so the app doesn't try grabbing the access token after it has expired.
        //History.pushState() changes the referrer that gets used in the HTTP header; it becomes the URL of the document whose window is 'this' at the time of creation of the XMLHttpRequest object.
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        //If the accessToken variable is empty and not in the URL, the user is taken to a page where they can login and grant Jammming access to Spotify
      let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
      }
    }
  },

  search(term) {
    accessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {return response.json();
    }).then(jsonResponse => {
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(track => ({
            id : track.id,
            name : track.name,
            artist : track.artists[0].name,
            album : track.album.name,
            uri : track.uri}));
        }})
  },

  async savePlaylist(playlistName, trackUris) {
    if (!playlistName || !trackUris){return}
    accessToken = this.getAccessToken();
    let userId;
    let playlistId;
    try {

 //Get userId
    let response = await fetch('https://api.spotify.com/v1/me', {headers: {Authorization: `Bearer ${accessToken}`}});
    if (!response.ok) {
       alert('There was an error retrieving your user ID.');
       return;
     }
    let jsonResponse = await response.json();
    userId = jsonResponse.id;

 //Using userId, a playlist is saved to the user's Spotify account

    let nameResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name: playlistName})
    });

    if (!nameResponse.ok) {
       alert('There was an error posting the playlist name.');
       return;
    }
    jsonResponse = await nameResponse.json();
    playlistId = jsonResponse.id;

  //URIs are passed to the saved playlist

  	let uriResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uris: trackUris})
    });
    if (!uriResponse.ok) {
      alert('Error posting the playlist tracks.');
      return;
    }
  } //end of try
  catch(error) {console.log(error); return;}
  return 'Done';
}//end of savePlaylist
};//end of Spotify

export default Spotify;
