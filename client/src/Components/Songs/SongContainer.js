import React from "react";

const SongContainer = ( {searchResults , chooseTrack} ) => {



    // If title have more than 30 characters then we will substring the title
const shortenTitle = (title)  => {
   
    if (title.length > 30) {
       
        return title.substring(0, 30) + '...';
    } else {
        
        return title;
    }
}

const playSong = (track) => {
    chooseTrack(track);
}


    return (
        <section id="songSection">
        <h4 className="listh4">List of Songs</h4>
        
        
       

        

        {/* <!-- Section for List of Songs --> */}
        <ul id="songsList">
        {
            searchResults.map((track) => (
                
                <li key={track.id}  id="songCard" className="songCard" >
                <button id="songCardBtn" className="songCardBtn" onClick={() => playSong(track)}  >
                    <img 
                        src={track.albumUri}
                        className="songImg"
                        alt="Song Image"
                    />
                    <div id="cardInfo">
                        <h5 className="songName">{shortenTitle(track.title)}</h5>
                        <small className="singerName">{track.artist}</small>
                    </div>
                </button>
                <hr/>
                </li>
                
                
            ))
        }
        

        </ul>

        
    </section>
    )
}

export default SongContainer; 