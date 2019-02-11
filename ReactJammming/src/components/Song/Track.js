import React from 'react';
import './Song.css'

class Song extends React.Component {
  constructor(props){
    super(props);  
    this.addSong=this.addSong.bind(this);
    this.removeSong=this.removeSong.bind(this);
  }

  addSong() {
    this.props.onAdd(this.props.song);
  }

  removeSong() {
    this.props.onRemove(this.props.song);
  }

  render() {
    return (
      <div className="Song">
        <div className="Song-information">
          <h3>Song name</h3>
          <p>Musician | Album</p>
        </div>

      {/*This will display a "-" if Song is on the playlist, and a "+" if Song is on the songlist*/}
        <a className="Song-action" onClick={this.addSong}>
        {this.props.isPlaylistSong ? "-" : "+"}</a>
      </div>
    )
  }
}

export default Song;
