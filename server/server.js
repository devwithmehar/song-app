require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const request = require('request');
const SpotifyWebApi = require("spotify-web-api-node")
// const Token = require('./Token.js');

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000

let spotify_client_id = process.env.CLIENT_ID;
let spotify_client_secret = process.env.CLIENT_SECRET;
let redirect_uri = process.env.REDIRECT_URI;


var credentials = {
  clientId: spotify_client_id,
  clientSecret: spotify_client_secret,
  redirectUri: redirect_uri
};

var spotifyApi = new SpotifyWebApi(credentials);

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


app.get('/login', function(req, res) {


  var state = generateRandomString(16);
  var scope = 'streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state';

  const data = {
    client_id: spotify_client_id,
    response_type: 'code',
    redirect_uri: redirect_uri,
    state: state,
    scope: scope
  }

  const formBody = Object.keys(data).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
}).join('&');

  res.redirect('https://accounts.spotify.com/authorize?' + formBody);
});




app.post('/login/auth', async(req, res) =>{
  try {
    const code = await req.body.code;
    const url = 'https://accounts.spotify.com/api/token';

    const data = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    }

    const formBody = Object.keys(data).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');

  const credentials = `${spotify_client_id}:${spotify_client_secret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  

    const response = await fetch(url,{
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64')
      },
      body: formBody
    })

    

    const result = await response.json();

    // Check if the response contains an error
    if (result.error === 'invalid_grant' && result.error_description === 'Authorization code expired') {
      return res.status(400).json({ error: 'Authorization code expired' });
    }

    res.status(200).send(result);

    
  } catch (error) {
    res.status(500).status(error);
  }
})



app.post('/refresh',async(req,res) => {
   try {

    const refreshToken = await req.body.refresh_token;

 

    const url = "https://accounts.spotify.com/api/token";


    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: spotify_client_id
    }

    const formBody = Object.keys(data).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
  }).join('&');

  const response = await fetch(url,{
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${spotify_client_id}:${spotify_client_secret}`).toString('base64')
    },
    body: formBody
  })

  

  const result = await response.json();
  res.status(200).send(result);

    
   } catch (error) {
      console.log('Error is', error);
   }  
})

app.get("/lyrics", async (req, res) => {
  
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.title)) || "No Lyrics Found"
  res.json({ lyrics })
})



app.listen(port, () => {
    console.log(`App is listening to the Port ${port}`);
})