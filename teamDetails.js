var viewModel;

let TeamDVM = function () {
  var self = this;
  self.BaseUri = ko.observable("http://192.168.160.58/NBA/API/Teams/");
  self.Id = ko.observable("");
  self.Seasons = ko.observable([]);
  self.Players = ko.observable([]);
  self.displayName = "Team Details";
  self.logo = ko.observable("");
  self.acronym = ko.observable("");
  self.stateName = ko.observable("");
  self.city = ko.observable("");
  self.history = ko.observable("");
  self.Divisionname = ko.observable("");
  self.DivisionId = ko.observable("");
  self.ConferenceName = ko.observable("");
  self.ConferenceId = ko.observable("");

  // list of players for autocomplete
  self.PlayersArray = ko.computed(function () {
    var playersArray = self.Players();
    var length = playersArray.length;
    var list = [];
    for (var i = 0; i < length; i++) {
      list.push({
        id: playersArray[i].Id,
        label: playersArray[i].Name,
      });
    }
    return list;
  });

  self.conference = ko.computed(function () {
    if (self.ConferenceName() == "") {
      return "N/A";
    }
    return self.ConferenceName() + " - " + self.ConferenceId();
  });

  self.division = ko.computed(function () {
    if (self.Divisionname() == "") {
      return "N/A";
    }
    return self.Divisionname() + " - " + self.DivisionId();
  });

  self.Seasons1 = ko.computed(function () {
    var seasonsArray = self.Seasons();
    var length = seasonsArray.length;

    if (length > 0) {
      return seasonsArray.slice(0, Math.floor(length / 2));
    }

    return [];
  });

  self.Seasons2 = ko.computed(function () {
    var seasonsArray = self.Seasons();
    var length = seasonsArray.length;

    if (length > 0) {
      return seasonsArray.slice(Math.floor(length / 2), length);
    }

    return [];
  });

  self.active = function (id, acr) {
    let composedUri = self.BaseUri() + id + "?acronym=" + acr;
    console.log("Acessando: " + composedUri);

    $.ajax({
      type: "GET",
      url: composedUri,
      dataType: "json",
      success: function (data) {
        hideLoading();
        self.Id(data.Id);
        self.Seasons(data.Seasons);
        self.Players(data.Players);
        self.acronym(data.Acronym);
        self.stateName(data.StateName);
        self.city(data.City);
        self.history(data.History);
        self.Divisionname(data.DivisionName);
        self.ConferenceName(data.ConferenceName);
        self.ConferenceId(data.ConferenceId);
        self.DivisionId(data.DivisionId);

        if (data.Logo == null) {
          console.log("Logo not found");
          self.logo("images/notfound.png");
        } else {
          self.logo(data.Logo);
        }
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
    let acr = paramters[1].split("=")[1];
    console.log(id);
    console.log(acr);
    self.active(id, acr);
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

  showLoading();
  getPage();
};

$(document).ready(function () {
  viewModel = new TeamDVM();
  ko.applyBindings(viewModel);
  AutocompleteLst(viewModel.PlayersArray, "#search", "2");
});

function showSearch() {
  $("#searchBar").removeClass("d-none");
}

function hideSearch() {
  $("#searchBar").addClass("d-none");
}
