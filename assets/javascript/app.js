$(document).ready(function () {

    // Trivia data object =======================================================================================
    var triviaGame = {
        // Questions. All a1 answers are the correct answer.
        question1: {
            q: "Who has the most wins as a head coach in the NFL?",
            a1: "Don Shula",
            a2: "Tom Landry",
            a3: "Curly Lambeau",
            a4: "George Halas",
        },
        question2: {
            q: "Which NFL team features a helmet decal only on one side of the helmet?",
            a1: "Pittsburgh Steelers",
            a2: "Houston Texans",
            a3: "Jacksonville Jaguars",
            a4: "Tennessee Titans",
        },
        question3: {
            q: "Who is the last non-quarterback to win NFL MVP?",
            a1: "Adrian Peterson",
            a2: "Ray Lewis",
            a3: "Shaun Alexander",
            a4: "LaDainian Tomlinson",
        },
        question4: {
            q: "How many Heisman Trophy winners have gone on to be MVP of the Super Bowl?",
            a1: "4",
            a2: "3",
            a3: "2",
            a4: "5",
        },
        question5: {
            q: "This current NFL quarterback, a 2010 Pro Bowler, never started a game at QB in college",
            a1: "Matt Cassel",
            a2: "Matt Moore",
            a3: "Matt Schaub",
            a4: "Matt Flynn",
        },
        question6: {
            q: "4 of the first 5 picks in the 1989 draft -- Troy Aikman, Barry Sanders, Derrick Thomas and Deion Sanders -- are in the Hall of Fame. Who was the bust?",
            a1: "Tony Mandarich",
            a2: "Keith McCants",
            a3: "Blair Thomas",
            a4: "Aundray Bruce",
        },
        question7: {
            q: "Which of these teams was NOT an original NFL team that moved over to the AFC?",
            a1: "Raiderss",
            a2: "Browns",
            a3: "Colts",
            a4: "Steelers",
        },
        question8: {
            q: "Who is the only player enshrined in Canton AND in the CFL Hall of Fame?",
            a1: "Warren Moon",
            a2: "Joe Theismann",
            a3: "Fred Biletnikoff",
            a4: "Doug Flutie",
        },
        question9: {
            q: "This state has produced more pro football Hall of Famers than any other state",
            a1: "Pennsylvania",
            a2: "Texas",
            a3: "Ohio",
            a4: "California",
        },
        question10: {
            q: "Who is the only Super Bowl MVP to have played on the losing team?",
            a1: "Chuck Howley",
            a2: "Dan Marino",
            a3: "Larry Fitzgerald",
            a4: "Steve McNair",
        },
        questionTime: 10,
        currentTime: 10,
        answerTime: 5,
        questionCounter: 1,
        questionsRight: 0,
        questionsWrong: 0,
        answered: false,
        buttonTimeOut: null,
        answerTimeOut: null,
        timerRunning: false,
        intervalHolder: null,
        questionWriter: function (question) {
            // Shuffle button divs. Adapted from https://stackoverflow.com/questions/18508742/multiple-ids-in-a-single-javascript-click-event
            $("#answers-div").each(function () {
                var buttons = $(this).find('button');
                for (var i = 0; i < buttons.length; i++) {
                    $(buttons[i]).remove();
                }
                // Fisher-Yates shuffle algorithm
                var i = buttons.length;
                if (i == 0) {
                    return false;
                }
                while (--i) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var tempi = buttons[i];
                    var tempj = buttons[j];
                    buttons[i] = tempj;
                    buttons[j] = tempi;
                }
                for (var i = 0; i < buttons.length; i++) {
                    $(buttons[i]).appendTo(this);
                }
            });
            // Push question and answer text to the document
            $("#question").empty().text(question.q);
            $("#a1").empty().text(question.a1);
            $("#a2").empty().text(question.a2);
            $("#a3").empty().text(question.a3);
            $("#a4").text(question.a4);
            this.answered = false;
        },
        nextQuestion: function (number) {
            $(".btn").removeClass("btn-success btn-danger btn-warning");
            $("#message-area").empty();
            if (this.questionCounter <= 10) {
                var currentQuestion = triviaGame["question" + number];
                this.questionWriter(currentQuestion);
                this.timer();
                this.buttonTimeOut = setTimeout(this.wrong, (1000 * triviaGame.questionTime));
            } else {
                this.endGame();
            }
        },
        right: function () {
            clearInterval(triviaGame.intervalHolder);
            triviaGame.questionsRight++;
            triviaGame.questionCounter++;
            $("#message-area").html(
                `<p>Correct!</p>`
            )
            var tempNext = function () {
                triviaGame.nextQuestion(triviaGame.questionCounter);
            }
            this.answerTimeOut = setTimeout(tempNext, 1000 * 3);
        },
        wrong: function () {
            clearInterval(triviaGame.intervalHolder);
            $("#a1").addClass("btn-warning");
            triviaGame.questionCounter++;
            triviaGame.questionsWrong++;
            $("#message-area").html(
                `<p>Incorrect!</p>`
            )
            var tempNext = function () {
                triviaGame.nextQuestion(triviaGame.questionCounter);
            }
            this.answerTimeOut = setTimeout(tempNext, 1000 * 3);
        },
        gameStart: function () {
            // Clear the game variables (for restart) and display the game area (for start)
            this.questionCounter = 1;
            this.questionsRight = 0;
            this.questionsWrong = 0;
            this.answered = false;
            $("#question, #answers-div, #timer-area").show();
            $("#control-buttons, #message-area").empty();
            // Load the first question
            this.questionWriter(triviaGame.question1);
            // Start the timer
            this.timer();
            this.buttonTimeOut = setTimeout(this.wrong, 1000 * (triviaGame.questionTime));

        },
        openScreen: function () {
            $("#question, #answers-div, #timer-area").hide();
            $("#control-buttons").html(
                `<button id="start-game" class="btn btn-large btn-primary">START GAME</button>`
            )
        },
        timer: function () {
            triviaGame.currentTime = 10;
            $("#timer").text(triviaGame.currentTime);
            triviaGame.intervalHolder = setInterval(triviaGame.count, 1000);
        },
        count: function () {
            triviaGame.currentTime--;
            $("#timer").text(triviaGame.currentTime);
        },
        endGame: function () {
            $("#question, #answers-div, #timer-area").hide();
            $("#control-buttons").html(
                `<button id="start-game" class="btn btn-large btn-primary">RESTART GAME</button>`
            )
            $("#message-area").html(
                `<h4>Game Stats</h4>
                <p>Correct: ${triviaGame.questionsRight}</p>
                <p>Incorrect: ${triviaGame.questionsWrong}</p>`
            )
        }

    } // End trivia data object =======================================================================================

    // Load the start button
    triviaGame.openScreen();

    // Click in the answers-div
    $("#answers-div").on("click", ".btn", function () {
        var $this = this;
        var clickedId = $($this).attr("id");

        if (!triviaGame.answered) {
            triviaGame.answered += true;
            clearTimeout(triviaGame.buttonTimeOut);
            if (clickedId === "a1") {
                $($this).addClass("btn-success");
                triviaGame.right();
            }
            if (clickedId != "a1") {
                $($this).addClass("btn-danger");
                triviaGame.wrong();
            }
        }
    });

    // Start game click
    $("#control-buttons").on("click", "#start-game", function () {
        triviaGame.gameStart();
    });
});