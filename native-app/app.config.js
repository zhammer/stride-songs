export default {
  name: "Stride Songs",
  slug: "stride-songs",
  scheme: "stridesongs",
  extra: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    API_BASE_URL: process.env.API_BASE_URL,
  },
};
