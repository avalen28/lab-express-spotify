require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

/* GET home page. */
app.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/*Search artist*/
app.get("/artist-search", (req, res, next) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    //.then((data) => console.log(res.json(data.body.artists.items)))
    .then((dataFromAPI) => {
      const artistArr = dataFromAPI.body.artists.items;
      //console.log(artistArr[0]);
      res.render("artist-search-results", { artistArr });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    //  .then((data) => res.json(data.body.items[0]));
    //.then((dataFromAPI) => res.json(dataFromAPI.body.items));
    .then((dataFromAPI) => {
      const albumsArr = dataFromAPI.body.items;
      //console.log("my selection", albumsArr[0]);
      res.render("albums", { albumsArr });
    })
    .catch((err) =>
      console.log("The error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;
  //console.log("en el req", albumId);
  spotifyApi.getAlbumTracks(albumId).then((dataFromAPI) => {
    const trackArr = dataFromAPI.body.items;
    console.log(trackArr[0]);
    res.render("tracks", { trackArr });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
