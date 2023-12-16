let stateDVM = function () {
  var self = this;
  self.BaseUri = ko.observable("http://192.168.160.58/NBA/API/States/");
  self.Teams = ko.observable([]);
  self.Id = ko.observable("");
  self.Name = ko.observable("");
  self.Flag = ko.observable("");
  self.Arenas = ko.observable([]);

  //map

  self.active = function (id) {
    let composedUri = self.BaseUri() + id;
    console.log("Accessing: " + composedUri);
    self.Id(id);

    $.ajax({
      type: "GET",
      url: composedUri,
      dataType: "json",
      success: function (data) {
        hideLoading();
        self.Teams(data.Teams);
        self.Name(data.Name);
        self.Flag(data.Flag);
        console.log(data);
        getMapCoordenates(data.Name);
      },
      error: function () {
        hideLoading();
        console.error("Data not found!");
      },
    });
  };

  function getPage() {
    var currentUrl = String(window.location.search);
    let paramters = currentUrl.split("?")[1].split("&");
    console.log(paramters);
    id = paramters[0];
    console.log(id);
    self.active(id);
  }

  showLoading();
  getPage();
};

$(document).ready(function () {
  var viewModel = new stateDVM();
  ko.applyBindings(viewModel);
});

//Getting map coordenates using https://opencagedata.com/api#quickstart

const key = "a7ea9f7215e74fd2995267101f5d5815";
const url = "https://api.opencagedata.com/geocode/v1/json?key=" + key + "&q=";

function getMapCoordenates(address) {
  $.ajax({
    url: url + address,
    dataType: "json",
    success: function (data) {
      console.log(data);
      console.log(data.results[0].geometry);
      let lat = data.results[0].geometry.lat;
      let lng = data.results[0].geometry.lng;
      console.log(lat + " " + lng);
      initializeMap(lat, lng);
    },
    error: function () {
      console.error("Data not found!");
    },
  });
}

function showLoading() {
  $("#myModal").modal("show", {
    backdrop: "static",
    keyboard: false,
  });
}
function hideLoading() {
  $("#myModal").on("shown.bs.modal", function (e) {
    $("#myModal").modal("hide");
  });
}

//initialize leaflet map
function initializeMap(lat, lng, name) {
  var map = L.map("map").setView([lat, lng], 6);
  var marker = L.marker([lat, lng]).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  }).addTo(map);
}
