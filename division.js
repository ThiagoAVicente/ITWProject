let viewModel;

let divisionViewModel = function () {
  let self = this;

  self.Divisions = ko.observableArray([]);
  self.selectedDivision = ko.observable("");
  self.Teams = ko.observableArray([]);

  self.activate = function () {
    $.ajax({
      url: "http://192.168.160.58/NBA/API/Divisions",
      type: "GET",
      dataType: "JSON",
      success: function (data) {
        hideLoading();
        self.Divisions(data.Records);
      },
    });
  };

  showLoading();
  self.activate();
};

$(document).ready(function () {
  viewModel = new divisionViewModel();
  ko.applyBindings(viewModel);
});

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

let selected = null;

function getTeams(id, event) {
  console.log(id);
  viewModel.selectedDivision(id);
  showLoading();
  $.ajax({
    url: "http://192.168.160.58/NBA/API/Divisions/" + id,
    type: "GET",
    dataType: "JSON",
    success: function (data) {
      hideLoading();
      viewModel.Teams(data.Teams);
      console.log("Found: " + data.Teams.length + " teams.");
    },
  });
}
