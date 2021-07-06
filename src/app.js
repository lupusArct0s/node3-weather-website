const path = require("path");
const express = require("express");
const hbs = require("hbs");
const forecast = require("./utils/forecast.js");
const geocode = require("./utils/geocode.js");

const app = express();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handelbars engine and views location
app.set("view engine", "hbs"); //npm hbs/handelbar for express
app.set("views", viewsPath); //Customs directory path to views (hbs)
hbs.registerPartials(partialsPath); //hbs path to partials

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Moritz Zünkeler",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "Moritz Zünkeler",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help message",
    message: "Your help message",
    name: "Moritz Zünkeler",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address!",
    });
  }

  geocode(
    req.query.address,
    (error, { longitude, latitude, location } = {}) => {
      if (error) {
        return res.send({
          error,
        });
      }

      forecast(longitude, latitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error,
          });
        }
        res.send({
          location,
          forecastData,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term",
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404page", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Moritz Zünkeler",
  });
});

app.get("*", (req, res) => {
  res.render("404page", {
    title: "404",
    errorMessage: "Page not found.",
    name: "Moritz Zünkeler",
  });
});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
