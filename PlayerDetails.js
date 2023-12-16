let viewModel;
let PlayersRanking = {};

let PlayerDVM = function () {
  var self = this;
  self.BaseUri = ko.observable("http://192.168.160.58/NBA/API/Players/");
  self.Id = ko.observable("Unavailable");
  self.Name = ko.observable("Unavailable");
  self.Birth = ko.observable("Unavailable");
  self.Photo = ko.observable("Unavailable");
  self.Seasons = ko.observable([]);
  self.Teams = ko.observable([]);
  self.height = ko.observable("Unavailable");
  self.weight = ko.observable("Unavailable");
  self.position = ko.observable("Unavailable");
  self.countryId = ko.observable("Unavailable");
  self.countryName = ko.observable("Unavailable");
  self.school = ko.observable("Unavailable");
  self.Biography = ko.observable("Unavailable");
  self.DraftYear = ko.observable("");

  //ranking variablea
  self.fst = ko.observable("");
  self.snd = ko.observable("");
  self.trd = ko.observable("");
  self.frth = ko.observable("");
  self.ffth = ko.observable("");

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

  self.Birthdate = ko.computed(function () {
    if (self.Birth() != null && self.Birth() != "Unavailable") {
      let date = self.Birth().split("T")[0];
      return date;
    }
  });

  self.Text = ko.computed(function () {
    let txt =
      "Id: " +
      self.Id() +
      "<hr/>" +
      "Name: " +
      self.Name() +
      "<hr/>" +
      "Birth: " +
      self.Birthdate() +
      "<hr/>" +
      "Height: " +
      self.height() +
      "<hr/>" +
      "Weight: " +
      self.weight() +
      "<hr/>" +
      "Position: " +
      self.position() +
      "<hr/>" +
      "CountryId: " +
      self.countryId() +
      "<hr/>" +
      "CountryName: " +
      self.countryName() +
      "<hr/>" +
      "School: " +
      self.school() +
      "<hr/>" +
      "Biography: " +
      self.Biography() +
      "<hr/>" +
      "DraftYear: " +
      self.DraftYear();

    return txt;
  });

  self.active = function (id) {
    let composedUri = self.BaseUri() + id;
    console.log("Acessando: " + composedUri);
    self.Id(id);

    $.ajax({
      type: "GET",
      url: composedUri,
      dataType: "json",
      success: function (data) {
        hideLoading();
        self.Name(data.Name);
        self.Birth(data.Birthdate);
        self.Photo(data.Photo);
        self.Seasons(data.Seasons);
        self.Teams(data.Teams);
        self.height(data.Height);
        self.weight(data.Weight);
        self.position(data.PositionName);
        self.countryId(data.CountryId);
        self.countryName(data.CountryName);
        self.school(data.School);
        self.Biography(data.Biography);
        self.DraftYear(data.DraftYear);
        console.log(data);
        console.log(self.Seasons1());
        console.log(self.Seasons2());
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
    id = paramters[0].split("=")[1];
    console.log(id);
    self.active(id);

    //RankThings
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

  self.updateRanking = function () {
    if (self.Name() in PlayersRanking) {
      self.fst(PlayersRanking[self.Name()][1]);
      self.snd(PlayersRanking[self.Name()][2]);
      self.trd(PlayersRanking[self.Name()][3]);
      self.frth(PlayersRanking[self.Name()][4]);
      self.ffth(PlayersRanking[self.Name()][5]);
    }
  };

  showLoading();
  getPage();
};

$(document).ready(function () {
  viewmodel = new PlayerDVM();
  ko.applyBindings(viewmodel);
  getRanks();
  ApplyChart();
});

//Stattistics
let urlStats =
  "http://192.168.160.58/NBA/API/Statistics/PlayerRankBySeason?playerId=";

function ApplyChart() {
  console.log(
    "Doing chart for",
    viewmodel.Id(),
    "\nUsing:",
    urlStats + viewmodel.Id()
  );
  let dataValues = [];
  let labels = [];
  $.ajax({
    url: urlStats + viewmodel.Id(),
    method: "GET",
    dataType: "json",
    success: function (data) {
      data.forEach((element) => {
        dataValues.push(element.Rank);
        labels.push(element.Season);
      });
      launchGraf(dataValues, labels, "line", "Rank", true);
    },
  });
}

function getRanks() {
  $.ajax({
    url: "http://192.168.160.58/NBA/API//Statistics/Top5RankedPlayerByRegularSeason",
    type: "GET",
    dataType: "json",
    success: function (data) {
      ProcessInformation(data);
      viewmodel.updateRanking();
    },
  });

  function ProcessInformation(lst) {
    let Players = [];

    lst.forEach((element) => {
      Players.push(element.Players);
    });
    Players.forEach((element) => {
      element.forEach((info) => {
        if (info.PlayerName in PlayersRanking) {
          PlayersRanking[info.PlayerName] = updateDict(
            PlayersRanking[info.PlayerName],
            info.Rank
          );
        } else {
          PlayersRanking[info.PlayerName] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          PlayersRanking[info.PlayerName] = updateDict(
            PlayersRanking[info.PlayerName],
            info.Rank
          );
        }
      });
    });
  }

  function updateDict(Dict, rank) {
    Object.keys(Dict).forEach((key) => {
      if (key == rank) {
        Dict[key] += 1;
      }
    });
    return Dict;
  }
}
