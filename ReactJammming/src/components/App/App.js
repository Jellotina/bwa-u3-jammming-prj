import React from 'react';
import './App.css';

import Spotify from '../../util/Spotify'
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {

      //List returned by the Spotify API
      searchResults : [],
      //List of tracks saved to the user's playlist
      playlistTracks : [] ,
      playlistName : "New Playlist"
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

//Remove a track from the playlistTracks state when user selects '+'. This method is implemented in Track.js.
//The find() method searches playlistTracks for a track matching the id of the selected track. A successful find breaks out of the function, otherwise the current track concatenates to the array.
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    else {
      this.setState(
        {playlistTracks : this.state.playlistTracks.concat(track)})
    }
  }

//Remove a track from the playlistTracks state when user selects '-'. This method is implemented in Track.js.
//The filter() method creates a new array of all <Track> instances that pass the test implemented by the provided function.
  removeTrack(track) {
    const filteredTracks = this.state.playlistTracks.filter(array => {
      return array.id !== track.id;
    })
    this.setState({playlistTracks : filteredTracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName : name})
  }

  search(term) {
    Spotify.search(term).then(searchTracks => {
      this.setState({searchResults : searchTracks});
    })
  }

  savePlaylist() {
    const playlistUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, playlistUris).then(response => {
      if (response) {
    this.setState(
      {playlistName : "New Playlist",
      playlistTracks : [] });
    }});
 }

    render() {
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
              <SearchBar onSearch={this.search}/>
              <div className="App-playlist">
                <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/> {/*SearchResults communicates to TrackList, which communicates to Track*/}
                <Playlist playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onSave={this.savePlaylist}/>
              </div>
            </div>
        </div>
       )
     }
   }


export default App;
