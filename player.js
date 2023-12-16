var PlayerVM = function () {
  var self = this;
  console.log("Started");

  self.PageSize = ko.observable(20);
  self.BaseUri = ko.observable("http://192.168.160.58/NBA/API/Players");
  self.Records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.HasPrevious = ko.observable(false);
  self.HasNext = ko.observable(false);
  self.TotalRecords = ko.observable(50);
  self.totalPages = ko.observable(50);
  self.displayName = "Players";
  self.previousPage = ko.computed(function () {
    return self.currentPage() * 1 - 1;
  }, self);
  self.nextPage = ko.computed(function () {
    return self.currentPage() * 1 + 1;
  });
  self.pageArray = function () {
    var list = [];
    var size = Math.min(self.totalPages(), 9);
    var step;
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (var i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

  self.activate = function (id) {
    console.log("Getting 20 Players");
    var composedUri =
      self.BaseUri() + "?page=" + id + "&pageSize=" + self.PageSize();
    console.log("Opening: " + composedUri);

    $.ajax({
      type: "GET",
      url: composedUri,
      dataType: "json",
      success: function (data) {
        hideLoading();
        self.Records(data.Records);
        self.currentPage(data.CurrentPage);
        self.HasNext(data.HasNext);
        self.HasPrevious(data.HasPrevious);
        self.PageSize(data.PageSize);
        self.totalPages(data.TotalPages);
        self.TotalRecords(data.TotalRecords);
        self.PageSize(data.PageSize);
        console.log(self);
        console.log(self.currentPage);
      },
      error: function (xhr, status, error) {
        hideLoading();
        console.error("Error fetching data:", status, error);
      },
    });
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
    var currentUrl = window.location.search;
    console.log(currentUrl);
    var params = new URLSearchParams(currentUrl);
    return params.get("page");
  }

  showLoading();
  let pag = getPage() || undefined;
  if (pag == undefined) {
    self.activate(1);
  } else {
    self.activate(pag);
  }

  console.log("page: " + pag);
};

$(document).ready(function () {
  ko.applyBindings(new PlayerVM());
  ActiveAutocomplete(
    "#search",
    "http://192.168.160.58/NBA/API/Players/Search?q=",
    "./playerDetails.html?id=",
    "name",
    "id"
  );
});
