$("#localWeather").submit(function (event) {
  event.preventDefault();
  getWeather();
});

$("#zip").on("keyup", function () {
  $("#apiError").hide();
  $("#alert").hide();
  var zipValidate = new RegExp(/(^\d{5})$/);
  var isValid = this.value.match(zipValidate);
  if (isValid) {
    $("#zipStatus").hide();
    $("#findWeather").removeAttr("disabled", true);
  } else {
    $("#zipStatus").show();
    $("#findWeather").attr("disabled", true);
    $(".results").hide();
  }
});

function getWeather() {
  $.ajax({
    url:
      "https://api.openweathermap.org/geo/1.0/zip?zip=" +
      document.getElementById("zip").value +
      "&appid=48ced08bac40a7979644285e22addce1",
    error: function (response) {
      console.log(response);
      $("#apiError").show();
      $("#errorCode").text(response.status + ": ");
      $("#errorMsg").text(response.statusText);
      return false;
    },
    success: function (response) {
      console.log(response);
      $(".results").show();
      $("#conditions").text("Conditions for " + response.name + "...");
      $.ajax({
        url:
          "https://api.openweathermap.org/data/3.0/onecall?lat=" +
          response.lat +
          "&lon=" +
          response.lon +
          "&exclude=minutely,hourly&appid=48ced08bac40a7979644285e22addce1&units=imperial",
        success: function (response) {
          console.log(response);
          $("#wind_speed").text(response.current.wind_speed);
          $("#wind_direction").text(response.current.wind_deg);
          $("#main_temp").text(response.current.temp);
          $("#weather_conditions").text(
            response.daily[0].summary +
              ". Currently it looks like there's " +
              response.current.weather[0].description +
              "."
          );
          if (response.alerts) {
            $("#alert").show();
            $("div#alert #sender_name").text(response.alerts[0].sender_name);
            $("div#alert #event").text(response.alerts[0].event);
            var start = new Date(response.alerts[0].start * 1000);
            var end = new Date(response.alerts[0].end * 1000);
            $("div#alert #start").text(start.toLocaleTimeString("default"));
            $("div#alert #end").text(end.toLocaleTimeString("default"));
            $("div#alert #description").text(response.alerts[0].description);
            $("div#alert #tags").text(response.alerts[0].tags[0]);
          }
        },
      });
    },
  });
}
