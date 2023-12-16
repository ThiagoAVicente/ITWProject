let TeamVM = function () {
  let self = this;
  console.log("started");

  self.PageSize = ko.observable(20);
  self.BaseUri = ko.observable("http://192.168.160.58/NBA/API/States/");
  self.Records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.HasPrevious = ko.observable(false);
  self.TotalRecords = ko.observable(50);
  self.HasNext = ko.observable(false);
  self.totalPages = ko.observable(50);
  self.displayName = "States";
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

  self.active = function (page) {
    let composedUri =
      self.BaseUri() + "?page=" + page + "&pageSize=" + self.PageSize();
    console.log("Acessando: " + composedUri);

    $.ajax({
      type: "GET",
      url: composedUri,
      dataType: "json",
      success: function (data) {
        hideLoading();
        self.Records(data.Records);
        self.HasNext(data.HasNext);
        self.HasPrevious(data.HasPrevious);
        self.currentPage(data.CurrentPage);
        self.PageSize(data.PageSize);
        self.totalPages(data.TotalPages);
      },
      error: function () {
        console.error("Data not found!");
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
    self.active(1);
  } else {
    self.active(pag);
  }

  console.log("page: " + pag);
};
$(document).ready(function () {
  ko.applyBindings(new TeamVM());
  ActiveAutocomplete(
    "#search",
    "http://192.168.160.58/NBA/API/States/Search?q=",
    "./stateDetails.html?",
    "name",
    "id"
  );
});
