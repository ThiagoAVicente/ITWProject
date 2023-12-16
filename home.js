$(document).ready(function () {
  $("#Xmas").modal("show");
  ko.applyBindings(new HomeVm());
  startGame();
  InitSnow();
});

//Board search
let HomeVm = function () {
  //
  let self = this;
  let search = $("#search");
  //
  let save = [];
  //
  self.categories = ["Teams", "Seasons", "Players", "Arenas", "States"];
  self.suggestions = ko.observableArray([]);
  //
  self.Word = ko.observable("");
  self.records = ko.observableArray([]);
  //
  search.on("keyup", function () {
    self.Word(search.val());
    if (search.val().length === 1 || save.length === 0) {
      console.log("searching for new data...");
      let ideias = [];
      let completedRequests = 0;
      let maxItems = 2 * self.categories.length;

      self.categories.forEach(function (category) {
        $.ajax({
          url:
            "http://192.168.160.58/NBA/API/" +
            category +
            "/Search?q=" +
            search.val(),
          method: "GET",
          dataType: "json",
          success: function (data) {
            save = [];
            data.forEach(function (item) {
              let obj = {
                Name: item.Name,
                Id: item.Id,
                Acronym: item.Acronym,
                Category: category,
                link1:
                  "./" +
                  category.replace(/s$/, "") +
                  "Details.html?id=" +
                  item.Id,
                link2:
                  "./" + category.replace(/s$/, "") + "Details.html?" + item.Id,
                link3:
                  "./" +
                  category.replace(/s$/, "") +
                  "Details.html?" +
                  item.Id +
                  "&acronym=" +
                  item.Acronym,
              };
              save.push(obj);
            });
            //calculates the amount of itens to add, if data.lenth is bigger than maxItems, it will add maxItems, if not, it will add data.length
            let itemsToAdd = Math.min(data.length, maxItems - ideias.length);
            for (let i = 0; i < itemsToAdd; i++) {
              let item = data[i];
              let obj = {
                Name: item.Name,
                Id: item.Id,
                Acronym: item.Acronym,
                Category: category,
                link1:
                  "./" +
                  category.replace(/s$/, "") +
                  "Details.html?id=" +
                  item.Id,
                link2:
                  "./" + category.replace(/s$/, "") + "Details.html?" + item.Id,
                link3:
                  "./" +
                  category.replace(/s$/, "") +
                  "Details.html?" +
                  item.Id +
                  "&acronym=" +
                  item.Acronym,
              };
              ideias.push(obj);
            }
          },
          complete: function () {
            completedRequests++;
            if (completedRequests === self.categories.length) {
              self.suggestions(ideias);
              console.log("Data received: " + ideias.length + "/10");
            }
          },
        });
      });
    } else if (search.val().length > 1) {
      console.log("using saved data: " + save.length + " items");
      let saveRet = save.filter((item) =>
        item.Name.toLowerCase().includes(search.val().toLowerCase())
      );
      self.suggestions(saveRet.slice(0, 10));
    }
  });
};

//start the game
function startGame() {
  //ball
  let ball = $("#game-Main");
  let ballW = ball.width();
  let ballH = ball.height();

  //window
  let window = $("#game");

  //board
  let Board = $(".boardBgLight");
  let BoardW = Board.width();
  let BoardH = Board.height();

  let direction = null;
  let isJumping = false;
  let falling = false;
  let jumpHeight = 20;
  let fallSpeed = 10;
  let groundLevel = BoardH - ballH * 2 + 20;

  $(document).on("keydown", function (e) {
    //check wich key was pressed
    if (e.key === "d") {
      direction = "right";
      ball.removeClass("rotated-image");
    } else if (e.key === "a") {
      direction = "left";
      ball.addClass("rotated-image");
    } else if (e.key === "w" && !isJumping && !falling) {
      isJumping = true;
    }
  });

  //check wich key was released
  $(document).on("keyup", function (e) {
    if (e.key === "d" || e.key === "a") {
      direction = null;
    }
  });

  //update ball position frame by frame using requestAnimationFrame
  function update() {
    let x = ball.position().left;
    let y = ball.position().top;

    //check if ball is moving and update position
    if (direction === "right" && x + ballW < BoardW) {
      x += 6;
    } else if (direction === "left" && x > 0) {
      x -= 6;
    }

    //check if ball is jumping or falling and update position
    if (isJumping) {
      y -= jumpHeight;
      jumpHeight -= 1;
      if (jumpHeight <= 0) {
        isJumping = false;
        falling = true;
        jumpHeight = 20;
      }
    } else if (falling) {
      y += fallSpeed;
      fallSpeed += 1;
      if (y >= groundLevel) {
        falling = false;
        fallSpeed = 0;
        y = groundLevel;
      }
    }

    //update ball position
    ball.css("left", x + "px");
    ball.css("top", y + "px");

    //call update function again
    requestAnimationFrame(update);
  }

  update();
}

//snow
function InitSnow() {
  let snowflakes = document.querySelectorAll(".sf");
  //random delay for each snowflake
  snowflakes.forEach(function (snowflake) {
    let randomDelay = Math.random() * 8;
    snowflake.style.animationDelay = -randomDelay + "s";
  });
}
