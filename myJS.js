//get previous theme
var Theme = localStorage.getItem("theme");

//set the theme
$().ready(function () {
  if (localStorage.getItem("theme") == "dark") {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    setLight();
  }

  document.getElementById("btnSwitch").addEventListener("click", () => {
    if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
      setLight();
    } else {
      setdark();
    }
  });
});

//Launch a chart using the given data
function launchGraf(data, labels, type, lab, rev = false) {
  var ctx = document.getElementById("Chart").getContext("2d");

  //graf options
  options = {
    scales: {
      x: {
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
      y: {
        reverse: rev,
        ticks: {
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  var myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: lab,
          data: data,
          borderWidth: 2,
        },
      ],
    },
    options: options,
    responsive: true,
    maintainAspectRatio: false,
  });
  window.addEventListener("resize", function () {
    myChart.resize();
  });
}

//Autocomplete with url
function ActiveAutocomplete(id, url, href, type, type2) {
  console.log("ActiveAutocomplete", url);

  let save = [];
  $(id).autocomplete({
    source: function (request, response) {
      if (request.term.length == 1 || save.length === 0) {
        save = [];
        SearcUri = url + request.term;
        console.log("accessing:" + SearcUri);
        $.ajax({
          url: SearcUri,
          method: "GET",
          dataType: "json",
          success: function (data) {
            let result = [];

            console.log("Using data: ", data.length, " items");

            if (data.length) {
              if (type == "id") {
                data.forEach(function (item) {
                  let obj = {
                    label: item.Id,
                    Id: item.Id,
                    acronym: item.Acronym,
                  };
                  save.push(obj);
                  if (result.length < 10) {
                    result.push(obj);
                  }
                });
              } else {
                data.forEach(function (item) {
                  let obj = {
                    label: item.Name,
                    Id: item.Id,
                    acronym: item.Acronym,
                  };
                  save.push(obj);
                  if (result.length < 10) {
                    result.push(obj);
                  }
                });
              }

              console.log(result);
            } else {
              alert("No data found");
              console.log("No data received.");
            }
            response(result);
          },
          error: function () {
            console.log("Error ");
          },
        });
      } else {
        console.log("using save: ", save.length, " items");
        let saveRes = $.ui.autocomplete.filter(save, request.term);
        response(saveRes.slice(0, 10));
      }
    },
    select: function (event, ui) {
      if (type2 == "id") {
        window.location.href = href + ui.item.Id;
      } else if (type2 == "name") {
        console.log(ui.item.name);
        window.location.href = href + ui.item.Name;
      } else {
        window.location.href =
          href + ui.item.Id + "&acronym=" + ui.item.acronym;
      }
    },
  });
}

//Autocomplete with a given list
function AutocompleteLst(Array, id, mode) {
  $(id).autocomplete({
    source: function (request, response) {
      console.log(id, " is working");
      // Filter the PlayersArray based on the search term
      var results = Array().filter(function (item) {
        return item.label.toLowerCase().includes(request.term.toLowerCase());
      });
      response(results.slice(0, 10));
    },
    select: function (event, ui) {
      window.location.href =
        mode == "1"
          ? "./teamDetails.html?" + ui.item.id + "&acronym=" + ui.item.acronym
          : "./playerDetails.html?id=" + ui.item.id;
    },
  });
}

//set to light mode
function setLight(b = null) {
  document.documentElement.setAttribute("data-bs-theme", "light");
  localStorage.setItem("theme", "light");
  $(".ui-autocomplete").css({
    "background-color": "#ffffff",
  });
  document.body.style.backgroundImage = "url(./images/bgl.jpg)";
}

//set to dark mode
function setdark(b = null) {
  document.documentElement.setAttribute("data-bs-theme", "dark");
  localStorage.setItem("theme", "dark");
  $(".ui-autocomplete").css({
    "background-color": "#2b2a2a",
  });
  document.body.style.backgroundImage = "url('./images/bgd.jpg')";
}
