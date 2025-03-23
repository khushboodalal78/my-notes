function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
}

function addTask() {
    let taskText = document.getElementById("taskInput").value;
    if (!taskText) return;

    let taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    
    let timer = 0;
    let countdown = 0;
    let interval;
    
    taskDiv.innerHTML = `
        <p><strong>${taskText}</strong></p>
        <p>Stopwatch: <span class="stopwatch">0s</span></p>
        <p>Countdown: <span class="countdown">0h 0m 0s</span></p>
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

    startButton.onclick = function() {
        let hours = parseInt(taskDiv.querySelector(".hours").value) || 0;
        let minutes = parseInt(taskDiv.querySelector(".minutes").value) || 0;
        let seconds = parseInt(taskDiv.querySelector(".seconds").value) || 0;
        countdown = hours * 3600 + minutes * 60 + seconds;
        
        if (!interval) {
            interval = setInterval(() => {
                timer++;
                stopwatchDisplay.textContent = formatTime(timer);
                countdown--;
                countdownDisplay.textContent = formatTime(countdown);
                if (countdown <= 0) {
                    clearInterval(interval);
                    interval = null;
                }
            }, 1000);
        }
    };

    stopButton.onclick = function() {
        clearInterval(interval);
        interval = null;
    };

    resetButton.onclick = function() {
        clearInterval(interval);
        interval = null;
        timer = 0;
        countdown = 0;
        stopwatchDisplay.textContent = '0h 0m 0s';
        countdownDisplay.textContent = '0h 0m 0s';
    };

    submitButton.onclick = function() {
        clearInterval(interval);
        interval = null;
        taskDiv.classList.add("completed");
    };

    deleteButton.onclick = function() {
        taskDiv.remove();
    };

    document.getElementById("taskInput").value = "";
}