var questions = ["Inside which HTML element do we put the JavaScript?",
"What is the correct syntax for referring to an external script called 'script.js'?",
"How do you write 'Hello World' in an alert box?",
"How do you create a function in JavaScript?",
"How do you call a function named 'myFunction'?",
"How can you add a comment in a JavaScript?",
"How do you find the number with the highest value of x and y?",
"How do you round the number 7.25, to the nearest integer?",
"How does a FOR loop start?",
"How does a WHILE loop start?"];

var choices = [["<scripting>", "<js>", "<script>", "<javascript>", "<main>"],
["<script src='script.js'>", "<script href='script.js'>", "<script name='script.js'>", "<script loc='script.js'>"],
["msgBox('Hello World');", "alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');"], 
["function = myFunction()", "function myFunction()", "function:myFunction()", "function = (myFunction)"],
["myFunction()", "call myFunction()", "call function myFunction()", "goto myFunction"],
["<!--This is a comment-->", "//This is a comment", "'This is a comment'", "#This is a comment"],
["Math.ceil(x, y)", "Math.max(x, y)", "ceil(x, y)", "top(x, y)"],
["round(7.25)", "Math.rnd(7.25)", "Math.round(7.25)", "rnd(7.25)"],
["while i = 1 to 10", "while {i < 10};", "while (i <= 10; i++)", "while (i <= 10)"],
["for (i <= 5; i++)", "for (i = 0; i <= 5; i++)", "for (i = 0; i <= 5)", "for i = 1 to 5"]];

var answers = ["btn-select2", "btn-select0", "btn-select3", "btn-select1", "btn-select0", "btn-select1",
"btn-select1", "btn-select2", "btn-select3", "btn-select2"]
// this is a flag to prevent being able to push 'view high scores' 
// mulitple times or during quiz
var inProgress = 0; 
var timer = 600;
var qCount = 0; //question counter

// get previous high scores if they exist
var scores = localStorage.getItem("scores");
if (scores === null || !scores) {
    var scores = [];
}
else {
    scores = JSON.parse(scores);
    // thought it would be good to sort the scores low to high
    // new scores will initially be added to bottom of the list
    // but then sorted on reload
    scores.sort(function(a, b) {
        return a[1] - b[1];
    });
}

// sstart the quiz and the timer
$("#start").on("click", function() {
    inProgress = 1;
    var myTimer = setInterval(function() {
    $(".rText").text("Time: " + timer)
    if (timer <= 0){
        quizOver(timer);
    }
    else {
        timer--;
    }
    }, 1000);
    
    //create inital list which takes more work than the rest 
    createList(qCount); 

    $("[id*='btn-select']").on("click", function(event) {
        qCount++;
        if (qCount === 10) {
            quizOver();
        }
        else {
        createList(qCount);
        var selection = (event.target.id).toString();
            // check answer        
            if (selection === answers[qCount-1]) {
                $("#answer").text("Correct!");
            }
            else {
                $("#answer").text("Wrong!");
                timer-=10;
            }
        }
    });
    
    // submit inits for high score, looks like (from the criteria) there's no 
    // limit on how many scores can be saved
    $(document).on("click", "#btn-submit", function() {
        clearInterval(myTimer);
        var inits = $("#inits").val();
        scores.push([inits, timer]);
        highScores();
    });

    // display ext question and generate button list for answering
    function createList(qCount) {
        if (qCount === 0) {
            $("h1").text(questions[qCount]);
            $("#intro").remove();
            $("#start").remove();
            for (var i = 0; i < 4; i++) {
                $("#wrapper").append("<button type='button' id='btn-select" + i + "'" + "class='btn btn-primary btn-lg d-grid col-lg-8 col-md-6' col-sm-4></button>");
            }
            populateList();
        }
        else {
            $("h1").text(questions[qCount]);
            populateList();
        }
        function populateList() {
            $("#btn-select0").text(choices[qCount][0]);
            $("#btn-select1").text(choices[qCount][1]);
            $("#btn-select2").text(choices[qCount][2]);
            $("#btn-select3").text(choices[qCount][3]);
        };
    };

    // when timer is at 0 or all questions answered
    function quizOver() {
        clearInterval(myTimer);
        var currentScore = timer;
        $("h1").text("All done!");
        $("[id*='btn-select']").remove();
        $("h1").after("<p></p>");
        $("p").text("Your final score is " + timer + ".")
        $("#wrapper").append("Enter initials: ", "<input type='text' id='inits' class='hs_info' placeholder='Enter your initials'> </input>", "<button type='button' id='btn-submit' class='btn btn-primary btn-md hs_info'>Submit</button>");
        $("#answer").text(""); 
    };
});

// display and save high scores
function highScores() {
    $("#wrapper").remove();
    $("h1").text("High scores");
    $("h1").append("<ol></ol>");

    for (var i = 0; i < scores.length; i++) {
        $("ol").append("<li class='hsList'>" + scores[i].join("  --  ") + "</li>");
    }
    $("#hrrule").before("<button type='button' id='btn-goback' class='btn btn-primary btn-lg px-4 gap-3'>Go Back</button>");
    $("#hrrule").before("<button type='button' id='btn-clearScores' class='btn btn-primary btn-lg px-4 gap-3'>Clear High Scores</button>");
    $("#btn-submit").remove();
    $("p").text("");

    localStorage.setItem("scores", JSON.stringify(scores));
};

// go back to home
$(document).on("click", "#btn-goback", function () {
    window.location.reload();
});

// clear high scores
$(document).on("click", "#btn-clearScores", function () {
    localStorage.removeItem("scores");
    $("ol").remove();
});

// view high scores if the quiz isn't underway 
// and prevent multiple clicks
$(document).on("click", "#viewHighScores", function() {    
    if (inProgress === 1) {
        return false;
    }
    else {
        highScores();
        $("#viewHighScores").click(false);
    }
});
