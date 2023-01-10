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
    .then((dataFromAPI) => {
      const artistArr = dataFromAPI.body.artists.items;
      res.render("artist-search-results", { artistArr });
    })
    .catch((err) =>
      console.log("Error while searching artists occurred: ", err)
    );
});
app.get("/albums/:artistId", (req, res, next) => {
  const { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)

    .then((dataFromAPI) => {
      const albumsArr = dataFromAPI.body.items;
      res.render("albums", { albumsArr });
    })
    .catch((err) =>
      console.log("Error while searching albums occurred: ", err)
    );
});

app.get("/tracks/:albumId", (req, res, next) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((dataFromAPI) => {
      const trackArr = dataFromAPI.body.items;
      res.render("tracks", { trackArr });
    })
    .catch((err) => console.log("Error while searching album occurred: ", err));
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
