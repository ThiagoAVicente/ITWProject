// ViewModel KnockOut
var vm = function () {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  var self = this;
  self.baseUri = ko.observable("http://192.168.160.58/NBA/API/Arenas");
  self.displayName = "NBA Arenas List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(20);
  self.totalRecords = ko.observable(50);
  self.hasPrevious = ko.observable(false);
  self.hasNext = ko.observable(false);
  self.previousPage = ko.computed(function () {
    return self.currentPage() * 1 - 1;
  }, self);
  self.nextPage = ko.computed(function () {
    return self.currentPage() * 1 + 1;
  }, self);
  self.fromRecord = ko.computed(function () {
    return self.previousPage() * self.pagesize() + 1;
  }, self);
  self.toRecord = ko.computed(function () {
    return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
  }, self);
  self.totalPages = ko.observable(0);
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

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getArenas...");
    var composedUri =
      self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, "GET").done(function (data) {
      hideLoading();
      self.records(data.Records);
      self.currentPage(data.CurrentPage);
      self.hasNext(data.HasNext);
      self.hasPrevious(data.HasPrevious);
      self.pagesize(data.PageSize);
      self.totalPages(data.TotalPages);
      self.totalRecords(data.TotalRecords);
      getFavs();
    });
  };

  //--- Internal functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
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

  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //--- start ....
  showLoading();
  var pg = getUrlParameter("page");
  console.log(pg);
  if (pg == undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
};

var storedFavorites = localStorage.getItem("Favorites");
var Favourites = ko.observableArray(
  storedFavorites ? JSON.parse(storedFavorites) : []
);

getFavs = function () {
  if (Favourites().length > 0) {
    let rows = document.querySelectorAll("tr.dataRow");
    console.log(rows);
    $(rows).each(function (index, row) {
      let dataComp = getData($(row));
      Favourites().forEach((element) => {
        if (parseInt(element.Id) == parseInt(dataComp.Id)) {
          $(row).find("td:last").find("button").addClass("text-danger");
        }
      });
    });
  }
};

$(document).on("click", ".FavAdd", function () {
  this.classList.add("text-danger");
  let row = $(this).closest("tr");
  let info = getData(row);
  var isElementPresent = Favourites().some(function (item) {
    return item.Id === info.Id;
  });
  if (!isElementPresent) {
    Favourites.push(info);
    updateLocalStorage();
  }
});

$(document).ready(function () {
  ko.applyBindings(new vm());

  ActiveAutocomplete(
    "#search",
    "http://192.168.160.58/NBA/API/Arenas/Search?q=",
    "./arenaDetails.html?id=",
    "name",
    "id"
  );
});

function getData(row) {
  let id = row.find("td:eq(0)").text();
  let name = row.find("td:eq(1)").text();
  let state = row.find("td:eq(2)").text();
  let team = row.find("td:eq(3)").text();
  let location = row.find("td:eq(4)").text();
  return { Id: id, name: name, state: state, team: team, location: location };
}

$(document).on("click", ".del", function () {
  let row = $(this).closest("tr");
  let info = getData(row);
  var updatedFavourites = Favourites().filter(function (item) {
    return JSON.stringify(item) !== JSON.stringify(info);
  });

  Favourites(updatedFavourites);
  updateLocalStorage();
  let rows = document.getElementsByTagName("tr");

  $(rows).each(function (index, row) {
    let dataComp = getData($(row));
    if (parseInt(dataComp.Id) == parseInt(info.Id)) {
      console.log(
        $(row).find("td:last").find("button").removeClass("text-danger")
      );
    }
  });
  row.remove();
});

function updateLocalStorage() {
  localStorage.setItem("Favorites", ko.toJSON(Favourites));
}
