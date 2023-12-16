let position = "C";

let Positionmodel = function () {
  let self = this;
  self.Records = ko.observableArray([]);
  self.Players = ko.observableArray([]);

  self.Load = function () {
    $.ajax({
      url: "http://192.168.160.58/NBA/API/Positions",
      method: "get",
      success: function (data) {
        hideLoading();
        self.Records(data.Records);
        console.log("worked");
        console.log(data);
      },
    });
  };

  self.LoadPlayers = function (position) {
    $.ajax({
      url: "http://192.168.160.58/NBA/API/Positions/" + position,
      method: "get",
      success: function (data) {
        self.Players(data.Players);
        console.log("Sucess getting players");
        console.log(data);
      },
    });
  };

  showLoading();
  self.Load();
  self.LoadPlayers(position);
};
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

$(document).ready(function () {
  let save = [];

  let viewModel = new Positionmodel();
  ko.applyBindings(viewModel);
  $("#selectPosition").on("change", function () {
    showLoading();
    save = [];
    position = translat($("#selectPosition").val());
    console.log(position);
    viewModel.LoadPlayers(position);
  });

  $("#search").autocomplete({
    source: function (request, response) {
      if (request.term.length == 1 || save.length === 0) {
        //Search for new data
        console.log("searching for new data");
        SearcUri = "http://192.168.160.58/NBA/API/Positions/" + position;
        console.log("accessing:" + SearcUri);
        $.ajax({
          url: SearcUri,
          method: "GET",
          dataType: "json",
          success: function (data) {
            let result = [];

            if (data.Players.length) {
              data.Players.forEach(function (item) {
                if (
                  item.Name.toUpperCase().includes(request.term.toUpperCase())
                ) {
                  let obj = {
                    label: item.Name,
                    id: item.Id,
                  };
                  if (result.length < 10) {
                    result.push(obj);
                  }
                  //save data
                  save.push(obj);
                }
              });

              console.log(result);
            } else {
              console.log("No data received.");
            }
            response(result);
          },
          error: function () {
            console.log("Error ");
          },
        });
      } else {
        //Use saved data to search
        console.log("using saved data:" + save.length + " items");
        let saveResult = [];
        save.forEach(function (item) {
          if (item.label.toUpperCase().includes(request.term.toUpperCase())) {
            saveResult.push(item);
          }
        });
        response(saveResult.slice(0, 10));
      }
    },
    select: function (event, ui) {
      window.location.href = "./playerDetails.html?id=" + ui.item.id;
    },
  });
});



function translat(pos) {
  console.log("Computing: " + pos);
  let acro = pos[0];
  pos = pos.toUpperCase().split("-");

  if (pos.length > 1) {
    acro = pos[0][0] + "-" + pos[1][0];
  }
  return acro;
}
