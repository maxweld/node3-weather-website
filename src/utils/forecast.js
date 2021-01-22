const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=9000b2370ab6a7123e29d0372520efc5&query=${latitude},${longitude}&units=m`;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather services!", undefined);
    } else if (body.error) {
      console.log(body.error);
      console.log(url);
      callback("Weather unavailable for selected location.", undefined);
    } else {
      const data = body.current;
      callback(undefined, {
        forecast: `It is currently ${data.weather_descriptions[0]} with a temperature of ${data.temperature} degrees, although it feels more like ${data.feelslike} degrees.`,
      });
    }
  });
};

module.exports = forecast;
