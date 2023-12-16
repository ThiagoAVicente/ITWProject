let Seasondetails = function () {
  let self = this;

  self.BaseUri = "http://192.168.160.58/NBA/API/Seasons/";
  self.Id = ko.observable("");
  self.Season = ko.observable("");
  self.Teams = ko.observable([]);
  self.Players = ko.observable([]);

  // list of players and players for autocomplete
  self.TeamsArray = ko.computed(function () {
    var teamsArray = self.Teams();
    var length = teamsArray.length;
    var list = [];
    for (var i = 0; i < length; i++) {
      list.push({
        id: teamsArray[i].Id,
        label: teamsArray[i].Name,
        acronym: teamsArray[i].Acronym,
      });
    }
    return list;
  });

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

  self.active = function (id) {
    let composedUri = self.BaseUri + id;
    console.log(composedUri);

    $.ajax({
      url: composedUri,
      method: "GET",
      datatype: "json",
      success: function (data) {
        hideLoading();
        self.Id(data.Id);
        self.Season(data.Season);
        self.Teams(data.Teams);
        self.Players(data.Players);

        console.log("Success: ", data);
      },
      error: function () {
        throw new Error(" Faill accessing data. ");
      },
    });
  };

  showLoading();
  self.active(getId());
};

function getId() {
  let url = String(window.location.search);
  return url.split("?")[1];
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

$("document").ready(function () {
  let viewModel = new Seasondetails();
  ko.applyBindings(viewModel);
  AutocompleteLst(viewModel.TeamsArray, "#searchTeams", "1");
  AutocompleteLst(viewModel.PlayersArray, "#searchPlayers", "2");
});
