import { useState, useEffect, useRef } from "react"
import useAuth from "../useAuth"
import Player from "./Player"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node";
import Aside from "./Aside";
import PlaySongModal from './Songs/PlaySongModal';
import axiosInstance from "../axiosConfig";



const spotifyApi = new SpotifyWebApi({
  clientId:  process.env.REACT_APP_CLIENT_ID, 
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
});




export default function Dashboard({ code }) {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack , setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState('');


    useEffect(() => {
        if (accessToken) {
            spotifyApi.setAccessToken(accessToken);
        }
    }, [accessToken]);

    useEffect(() => { 
        if(!accessToken) return;
        if (searchResults.length > 0)  return; 

        const fetchTracks = async () => {
      
           setSearchResults(await getSearchResults(generateRandomWord(3)));
        }

        fetchTracks();

    },[searchResults]);
    
    
    useEffect(() => { 
        if(!search) return setSearchResults([]);
        if(!accessToken) return;

        let cancel = false;

        if (cancel) return;

        const fetchSearchResults = async () => {
            const results = await getSearchResults(search);
            setSearchResults(results);
        };
    
        fetchSearchResults();

        return () => {
            cancel = true;
        };

    }, [search, accessToken]);


    useEffect(() => {
        if(!playingTrack) return;

        axiosInstance.get('/lyrics',{
            params: {
                title: playingTrack.title,
                artist: playingTrack.artist,
            }
        }).then(res => {
            setLyrics(res.data.lyrics);
        })


    },[playingTrack]);

    // This function makes a request to the Spotify API to get search results for the given search query.
    const getSearchResults = async (search) => {
        try {
            const response = await spotifyApi.searchTracks(search);
            const tracks = response.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, current) => {
                    return smallest.height < current.height ? smallest : current;
                }, track.album.images[0]);
    
                return {
                    id: track.id,
                    title: track.name,
                    artist: track.artists[0].name,
                    uri: track.uri,
                    album: track.album.name,
                    albumUri: smallestAlbumImage.url
                };
            });

    
            return tracks;
    
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    

    const generateRandomWord = (length) => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        let randomWord = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * alphabet.length);
            randomWord += alphabet[randomIndex];
        }
    
        return randomWord;
    }
   

    const chooseTrack = (track) => {
        setPlayingTrack(track);
        setSearch('');
        setLyrics('');
    }
  

  return (
    <main>
        <Aside search= {search} setSearch={setSearch} searchResults={searchResults} chooseTrack={chooseTrack}  />
        <PlaySongModal accessToken={accessToken} trackUri={playingTrack?.uri} playingTrack={playingTrack} lyrics={lyrics} />
    </main>
  )
}