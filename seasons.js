let viewmodel;

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

let SeasonsVm = function () {
  let self = this;

  self.BaseUri = "http://192.168.160.58/NBA/API/Seasons";

  self.CurrentPage = ko.observable("");
  self.TotalRecords = ko.observable("");
  self.HasPrevious = ko.observable(false);
  self.HasNext = ko.observable(false);
  self.totalPages = ko.observable("");
  self.PageSize = ko.observable(50);

  self.NextPage = ko.computed(function () {
    return self.CurrentPage() * 1 + 1;
  });
  self.PreviousPage = ko.computed(function () {
    return self.CurrentPage() * 1 - 1;
  });

  self.Records = ko.observable([]);

  self.activate = function (pg) {
    let composedUri =
      self.BaseUri + "?page=" + pg + "&pagesize=" + self.PageSize();
    console.log("Accessing: " + composedUri);

    $.ajax({
      url: composedUri,
      method: "GET",
      datatype: "json",
      success: function (data) {
        hideLoading();
        self.CurrentPage(data.CurrentPage);
        self.TotalRecords(data.TotalRecords);

        self.HasNext(data.HasNext);
        self.HasPrevious(data.HasPrevious);

        self.totalPages(data.TotalPages);
        self.PageSize(data.PageSize);

        self.Records(data.Records);

        console.log("Sucess: ", data);
      },
      error: function () {
        hideLoading();
        throw new Error("Error, couldn't access data.");
      },
    });
  };

  showLoading();
  self.activate(getPage() || 1);
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

function getPage() {
  let pg;
  let url = String(window.location.search);

  if (url.includes("?")) {
    let SepUrl = url.split("?")[1].split("&");
    console.log(SepUrl);

    SepUrl.forEach((element) => {
      if (element.includes("page")) {
        pg = element.split("=")[1];
      }
    });
  }

  return pg;
}

$("document").ready(function () {
  viewmodel = new SeasonsVm();
  ko.applyBindings(viewmodel);
  GetDataPlayers();
  ActiveAutocomplete(
    "#search",
    "http://192.168.160.58/NBA/API/Seasons/Search?q=",
    "./seasonDetails.html?id=",
    "id",
    "id"
  );
});

function showSearch() {
  $("#searchBar").removeClass("d-none");
}

function hideSearch() {
  $("#searchBar").addClass("d-none");
}

//Statistics things~

//Charts

function GetDataPlayers() {
  console.log("Getting data.");
  let dataToUse = [];
  let dataTitle = [];
  $.ajax({
    url: "http://192.168.160.58/NBA/API/Statistics/NumPlayersBySeason",
    method: "GET",
    datatype: "json",
    success: function (RawData) {
      RawData.forEach(function (data) {
        if (data.SeasonType == "Regular Season") {
          dataToUse.push(data.Players);
          dataTitle.push(data.Season);
        }
      });
      console.log(dataTitle);
      console.log(dataToUse);
      launchGraf(dataToUse, dataTitle, "bar", "Players");
    },
    error: function () {
      throw new Error("Failed getting data.");
    },
  });
}
