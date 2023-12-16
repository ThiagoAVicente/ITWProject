let save = [];
let points = 0;

//Quiz pointing variables and related questions
let categories = {
  Teams: {
    Acronym: "Team acronym?",
    DivisionName: "Team division?",
    City: "Team city?",
    StateName: "Team state?",
  },
  Arenas: {
    StateName: "Arena from?",
    TeamName: "Arenas's team?",
    Capacity: "Capacity?",
  },
  Players: {
    PositionName: "Player position?",
    Height: "Player height?",
    CountryName: "Player's country?",
  },
};

$(document).ready(function () {
  startQuiz();
});

function startQuiz() {
  //Quiz pointing variables
  let started = false;

  //Options
  let op1 = $(".op-1").find("p");
  let op2 = $(".op-2").find("p");
  let op3 = $(".op-3").find("p");
  let op4 = $(".op-4").find("p");

  //Options colider
  let op1Col = $("#colider-1");
  let op2Col = $("#colider-2");
  let op3Col = $("#colider-3");
  let op4Col = $("#colider-4");

  //Quiz elements
  let label = $(".quiz-text");

  let Quiz = $(".Quiz");
  let plataform = $(".plataform");

  //Ball variables
  let ball = $("#game-Main");
  let ballWidth = ball.width();
  let ballHeight = ball.height();

  //Movemement variables
  let direction = null;
  let speed = 10;
  let fallSpeed = 0;
  let isFalling = false;
  let groundLevel = 100;

  //Spawning plataform variables
  let plataformWidth = plataform.width();
  let plataformPos = plataform.position();
  let plataformHeight = plataform.height();

  //Respawn
  let statPosition = ball.position();

  //move
  $(document).on("keydown", function (e) {
    if (e.key === "a") {
      ball.addClass("rotated-image");
      direction = "l";
    } else if (e.key === "d") {
      ball.removeClass("rotated-image");
      direction = "r";
    }
  });

  $(document).on("keyup", function (e) {
    if (e.key === "a" || e.key === "d") {
      direction = null;
    }
  });

  function move() {
    let x = ball.position().left;
    let y = ball.position().top;

    if (direction === "l") {
      x -= speed;
    } else if (direction === "r") {
      x += speed;
    }

    // Check if the ball is on the platform
    if (
      x + ballWidth > plataformPos.left &&
      x < plataformPos.left + plataformWidth &&
      y + ballHeight > plataformPos.top &&
      y + ballHeight < plataformPos.top + plataformHeight
    ) {
      // The ball is on the platform
      isFalling = false;
      groundLevel = plataformPos.top;
    } else {
      // The ball is not on the platform
      isFalling = true;
    }

    if (isFalling) {
      y += fallSpeed;
      fallSpeed += 0.15;
      if (y >= Quiz.height() - ballHeight * 1.8) {
        isFalling = false;
        fallSpeed = 0;
        checkPoint(x);
        x = statPosition.left;
        y = statPosition.top;
      }
    }

    ball.css("left", x);
    ball.css("top", y);

    requestAnimationFrame(move);
  }
  let rO;
  move();

  function checkPoint(x) {
    if (started) {
      var columns = [op1Col, op2Col, op3Col, op4Col];
      var options = [op1, op2, op3, op4];
      for (var i = 0; i < columns.length; i++) {
        if (
          x < columns[i].position().left + columns[i].width() &&
          x + ballWidth > columns[i].position().left &&
          rO == options[i].text()
        ) {
          points += 1;
        }
      }
    } else {
      started = true;
    }
    $(".Ltext").text("Points: " + points);
    findQuests();
  }

  function makeQuestions(usable, cat) {
    console.log(save.length);
    //tema
    let lst = Object.keys(categories[cat]);
    let themeQ = lst[Math.floor(Math.random() * lst.length)];
    console.log(themeQ);

    //opções
    let rOption = usable[Math.floor(Math.random() * usable.length)];
    rO = rOption[themeQ];
    console.log(rO);

    label.text(
      cat + "[" + rOption.Name + "]" + ":\n " + categories[cat][themeQ]
    );

    op1.text(usable[0][themeQ] || "None");
    usable.splice(0, 1);

    op2.text(usable[0][themeQ] || "None");
    usable.splice(0, 1);

    op3.text(usable[0][themeQ] || "None");
    usable.splice(0, 1);

    op4.text(usable[0][themeQ] || "None");
    usable.splice(0, 1);
  }

  function findQuests() {
    let usable = [];
    let lst = Object.keys(categories);

    if (save.length >= 4) {
      usable = save.splice(0, 4);
      makeQuestions(usable, cat);
    } else {
      cat = "Players"; //lst[Math.floor(Math.random() * 3)];
      $.ajax({
        url: "http://192.168.160.58/NBA/API/" + cat,
        method: "GET",
        datatype: "json",
        success: function (data) {
          console.log(data);
          save = data.Records;
          let i = Math.floor(Math.random() * (save.length - 4) + 4);
          usable = save.slice(i - 4, i);
          makeQuestions(usable, cat);
        },
      });
    }
  }
}
