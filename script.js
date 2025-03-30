// function formatTime(seconds) {
//     let hrs = Math.floor(seconds / 3600);
//     let mins = Math.floor((seconds % 3600) / 60);
//     let secs = seconds % 60;
//     return `${hrs}h ${mins}m ${secs}s`;
// }

// function addTask() {
//     let taskText = document.getElementById("taskInput").value;
//     if (!taskText) return;

//     let taskDiv = document.createElement("div");
//     taskDiv.classList.add("task");
    
//     let timer = 0;
//     let countdown = 0;
//     let interval;
    
//     taskDiv.innerHTML = `
//         <p><strong>${taskText}</strong></p>
//         <p>Stopwatch: <span class="stopwatch">0s</span></p>
//         <p>Countdown: <span class="countdown">0h 0m 0s</span></p>
//         <input type="number" placeholder="Hours" class="hours">
//         <input type="number" placeholder="Minutes" class="minutes">
//         <input type="number" placeholder="Seconds" class="seconds">
//         <br>
//         <button class="start">Start</button>
//         <button class="stop">Stop</button>
//         <button class="reset">Reset</button>
//         <button class="submit">Submit</button>
//         <button class="delete">Delete</button>
//     `;

//     document.getElementById("taskList").appendChild(taskDiv);

//     let stopwatchDisplay = taskDiv.querySelector(".stopwatch");
//     let countdownDisplay = taskDiv.querySelector(".countdown");
//     let startButton = taskDiv.querySelector(".start");
//     let stopButton = taskDiv.querySelector(".stop");
//     let resetButton = taskDiv.querySelector(".reset");
//     let submitButton = taskDiv.querySelector(".submit");
//     let deleteButton = taskDiv.querySelector(".delete");

//     startButton.onclick = function() {
//         let hours = parseInt(taskDiv.querySelector(".hours").value) || 0;
//         let minutes = parseInt(taskDiv.querySelector(".minutes").value) || 0;
//         let seconds = parseInt(taskDiv.querySelector(".seconds").value) || 0;
//         countdown = hours * 3600 + minutes * 60 + seconds;
        
//         if (!interval) {
//             interval = setInterval(() => {
//                 timer++;
//                 stopwatchDisplay.textContent = formatTime(timer);
//                 countdown--;
//                 countdownDisplay.textContent = formatTime(countdown);
//                 if (countdown <= 0) {
//                     clearInterval(interval);
//                     interval = null;
//                 }
//             }, 1000);
//         }
//     };

//     stopButton.onclick = function() {
//         clearInterval(interval);
//         interval = null;
//     };

//     resetButton.onclick = function() {
//         clearInterval(interval);
//         interval = null;
//         timer = 0;
//         countdown = 0;
//         stopwatchDisplay.textContent = '0h 0m 0s';
//         countdownDisplay.textContent = '0h 0m 0s';
//     };

//     submitButton.onclick = function() {
//         clearInterval(interval);
//         interval = null;
//         taskDiv.classList.add("completed");
//     };

//     deleteButton.onclick = function() {
//         taskDiv.remove();
//     };

//     document.getElementById("taskInput").value = "";
// }
document.addEventListener("DOMContentLoaded", loadTasks);

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task").forEach(taskDiv => {
        tasks.push({
            text: taskDiv.querySelector("strong").textContent,
            timerStart: taskDiv.dataset.timerStart || null, // Stopwatch start time
            countdownEnd: taskDiv.dataset.countdownEnd || null, // Countdown end time
            completed: taskDiv.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        addTask(task.text, task.timerStart, task.countdownEnd, task.completed);
    });
}

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
}

function addTask(taskText, timerStart = null, countdownEnd = null, completed = false) {
    if (!taskText) return;

    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (completed) taskDiv.classList.add("completed");

    let now = Date.now();

    let timer = timerStart ? Math.floor((now - parseInt(timerStart)) / 1000) : 0;
    let countdown = countdownEnd ? Math.max(0, Math.floor((parseInt(countdownEnd) - now) / 1000)) : 0;

    taskDiv.innerHTML = `
        <p><strong>${taskText}</strong></p>
        <p>Stopwatch: <span class="stopwatch">${formatTime(timer)}</span></p>
        <p>Countdown: <span class="countdown">${formatTime(countdown)}</span></p>
        <input type="number" placeholder="Hours" class="hours">
        <input type="number" placeholder="Minutes" class="minutes">
        <input type="number" placeholder="Seconds" class="seconds">
        <br>
        <button class="start">Start</button>
        <button class="stop">Stop</button>
        <button class="reset">Reset</button>
        <button class="submit">Submit</button>
        <button class="delete">Delete</button>
    `;

    document.getElementById("taskList").appendChild(taskDiv);
    let stopwatchDisplay = taskDiv.querySelector(".stopwatch");
    let countdownDisplay = taskDiv.querySelector(".countdown");

    let startButton = taskDiv.querySelector(".start");
    let stopButton = taskDiv.querySelector(".stop");
    let resetButton = taskDiv.querySelector(".reset");
    let submitButton = taskDiv.querySelector(".submit");
    let deleteButton = taskDiv.querySelector(".delete");

    function updateTimers() {
        let now = Date.now();
        if (taskDiv.dataset.timerStart) {
            timer = Math.floor((now - parseInt(taskDiv.dataset.timerStart)) / 1000);
            stopwatchDisplay.textContent = formatTime(timer);
        }
        if (taskDiv.dataset.countdownEnd) {
            countdown = Math.max(0, Math.floor((parseInt(taskDiv.dataset.countdownEnd) - now) / 1000));
            countdownDisplay.textContent = formatTime(countdown);
            if (countdown <= 0) {
                taskDiv.dataset.countdownEnd = null;
                countdownDisplay.textContent = "Time's up!";
                saveTasks();
            }
        }
    }

    let interval = setInterval(updateTimers, 1000);

    startButton.onclick = function() {
        if (!taskDiv.dataset.timerStart) {
            taskDiv.dataset.timerStart = Date.now();
        }

        let hours = parseInt(taskDiv.querySelector(".hours").value) || 0;
        let minutes = parseInt(taskDiv.querySelector(".minutes").value) || 0;
        let seconds = parseInt(taskDiv.querySelector(".seconds").value) || 0;

        if (!taskDiv.dataset.countdownEnd) {
            taskDiv.dataset.countdownEnd = Date.now() + (hours * 3600 + minutes * 60 + seconds) * 1000;
        }

        saveTasks();
    };

    stopButton.onclick = function() {
        delete taskDiv.dataset.timerStart;
        delete taskDiv.dataset.countdownEnd;
        saveTasks();
    };

    resetButton.onclick = function() {
        delete taskDiv.dataset.timerStart;
        delete taskDiv.dataset.countdownEnd;
        stopwatchDisplay.textContent = '0h 0m 0s';
        countdownDisplay.textContent = '0h 0m 0s';
        saveTasks();
    };

    submitButton.onclick = function() {
        taskDiv.classList.add("completed");
        saveTasks();
    };

    deleteButton.onclick = function() {
        taskDiv.remove();
        saveTasks();
    };

    saveTasks();
}

document.querySelector(".start").addEventListener("click", function () {
    let taskText = document.getElementById("taskInput").value;
    addTask(taskText);
});

document.getElementById("taskInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask(this.value);
    }
});

