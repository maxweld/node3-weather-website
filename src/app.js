const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express configuration
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Set up Handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    me: "David Maxwell",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help for Weather",
    me: "David maxwell",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Weather",
    me: "David maxwell",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error: "Location not recognised.",
        });
      }
      forecast(latitude, longitude, (error, { forecast } = {}) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          location,
          forecast,
        });
      });
    }
  );
});

app.get("/help/*", (req, res) => {
  res.render("pageNotFound", {
    title: "404",
    error: "Requested Help Article not found",
    me: "David Maxwell",
  });
});

app.get("*", (req, res) => {
  res.render("pageNotFound", {
    title: "404",
    error: "Requested Page Not Found",
    me: "David Maxwell",
  });
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});
