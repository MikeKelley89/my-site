$("#zip").on("keyup", function () {
    var zipValidate = new RegExp(/(^\d{5})$/);
    var isValid = this.value.match(zipValidate);
    if (isValid) {
      $("#zipStatus").text("");
      $("#findWeather").removeAttr("disabled", true);
    } else {
      $("#findWeather").attr("disabled", true);
      $("#zipStatus").text("This is not a valid ZIP format (for this API)");
    }
  });

  $("#localWeather").submit(function (event) {
    event.preventDefault();
    getWeather();
  });

  function getWeather() {
    $.ajax({
      url:
        "https://api.openweathermap.org/geo/1.0/zip?zip=" +
        document.getElementById("zip").value +
        "&appid=48ced08bac40a7979644285e22addce1",
      success: function (response) {
        console.log(response);
        $("#location").text(response.name);
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
            $("#wind_speed_unit").text(" MPH");
            $("#wind_degree_unit").text(" degrees");
            $("#main_temp_unit").text(" F");
          },
        });
      },
    });
  }