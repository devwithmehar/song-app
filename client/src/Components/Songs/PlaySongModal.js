import React, {useState, useEffect} from "react";
import Player from "../Player";

const PlaySongModal = ({accessToken , trackUri, playingTrack, lyrics}) => {
const [isExpanded, setIsExpanded] = useState(false);


useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // This use Effect will update the height of songsList when song modal gets expanded or collapsed.
  useEffect(() => {

    if(playingTrack === undefined || playingTrack === null) return;

    if(playingTrack){
        const songsList = document.getElementById('songsList');
        const songModal = document.getElementById('songModal');
        
        // Height from top of the page to the top of the songsList element
        const songsListTop = songsList.getBoundingClientRect().top;
        

        // Get the height of screen 
        const viewportHeight = window.innerHeight;

         //Get the height of songsList from top to bottom 
        const heightFromTopToScreenEnd = viewportHeight - songsListTop;

        if(window.innerWidth < 768 && !isExpanded){
            const heightOfSongModal = songModal.offsetHeight;

            songsList.style.height = `${heightFromTopToScreenEnd - heightOfSongModal - 5}px`;

        }
        else{
            songsList.style.height = `${heightFromTopToScreenEnd}px`;
            
        }
    }


  },[isExpanded, playingTrack])


const shrinkModal = () => {
    setIsExpanded(false);
}

const expandModal = () => {
    setIsExpanded(true);
}
    

    if(playingTrack) {

        
            return(
                <>
                 <section id="songModal" className="songModal" >

                 <nav className="downArrowNav">
                    {
                        isExpanded ? 
                        <button  className="material-symbols-outlined" id="downArrowBtn" onClick={() => shrinkModal()} >
                        arrow_drop_down
                        </button>
                        :
                        <button  className="material-symbols-outlined" id="downArrowUp" onClick={() => expandModal()} >
                        arrow_drop_up
                       </button>
                    }
                 </nav>
     
                 {
                    isExpanded ? 
                    <>
                     

                    
     
                    <div id="playingSongInfo">
                        {
                            lyrics
                        }
                        
                    </div>

                   
                    </>
                    :
                    <></>
                 }
     
               
     
              
                 <Player accessToken={accessToken} trackUri={trackUri} />
              
     
             
     
                 </section>
                
                </>
             )
        
        

        
    }
    else {
        return(
            <>
            

            <section id="playSongModal" >
            
                <h2 className="initialMssg">Please Select the song</h2>

            </section>
        </>
        )
    }

    
}

export default PlaySongModal;