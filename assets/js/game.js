var tbl = document.createElement('table');
tbl.setAttribute('style', 'border-collapse: collapse; border-style: hidden; border-spacing: 0px')
var tbody = document.createElement('tbody');
var tr = document.createElement('tr');
var td = document.createElement('td');

var hasState = [];
var entry = [];
var currentCount = 0;
var playerCount = 0;
var stateVictory = false;
// Flag to check if the current player is 'X' or 'O'.
var checkPlayer = true;
var result = undefined;
var waitResponse = false;

draw();
window.addEventListener('click', function () {
    if (result != null) {
        if (waitResponse)
            clear();
        else
            waitResponse = true;
    }
})

function draw() {
    for (let i = 0; i < 3; i++) {
        tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            hasState[currentCount] = false;
            td = document.createElement('td');
            td.setAttribute('style', 'padding: 0; border: solid 0.6rem black;');
            let tileSpace = document.createElement('div');
            tileSpace.id = currentCount;
            tileSpace.classList.add('flex');
            tileSpace.setAttribute('style', 'min-height: 15rem; min-width: 15rem; cursor: pointer;');
            tileSpace.addEventListener('click', function () {
                if (!hasState[tileSpace.id]) {
                    if (!stateVictory) {
                        tileSpace.innerHTML = playerState(tileSpace.id);
                        hasState[tileSpace.id] = true;
                        playerCount++;
                        result = checkVictory();
                        if (result != null)
                            console.log(result);
                    }
                }
            });
            td.appendChild(tileSpace);
            tr.appendChild(td);
            currentCount++;
        }
        tbody.appendChild(tr);
    }
    tbl.appendChild(tbody);
    document.getElementById('playable').appendChild(tbl);
}

function clear() {
    for (let c = 0; c <= 8; c++) {
        let node = document.getElementById(c);
        node.innerHTML = "";
    }
    if (stateVictory)
        document.getElementById("red-line").classList.toggle("toggle");
    reset();
}

function reset() {
    hasState = [];
    entry = [];
    currentCount = 0;
    playerCount = 0;
    stateVictory = false;
    checkPlayer = true;
    result = undefined;
    waitResponse = false;
}

function playerState(num) {
    if (checkPlayer) {
        checkPlayer = false;
        entry[num] = 'X';
    }
    else {
        checkPlayer = true;
        entry[num] = 'O';
    }
    return entry[num];
}

// Win conditions: it must meet the condition for victory to occur.
// For example, diagonals always need the center piece to match the corresponding corner.
function checkVictory() {
    let text = undefined;
    // Check row
    for (let j = 0; j < 9; j += 3)
        if (entry[j] != null)
            if (entry[j] === entry[j + 1] && entry[j] === entry[j + 2]) {
                stateVictory = true;
                text = 'Player ' + entry[j] + ' has won!';
            }
    // Check column
    for (let i = 0; i < 3; i++)
        if (entry[i] != null)
            if (entry[i] === entry[i + 3] && entry[i] === entry[i + 6]) {
                stateVictory = true;
                text = 'Player ' + entry[i] + ' has won!';
            }
    // Check diagonals
    let a = 0;
    if (entry[a + 4] != null)
        if (entry[a] === entry[a + 4] && entry[a] === entry[a + 8]) {
            stateVictory = true;
            text = 'Player ' + entry[a + 4] + ' has won!';
        }
        else if (entry[a + 2] === entry[a + 4] && entry[a + 2] === entry[a + 6]) {
            stateVictory = true;
            text = 'Player ' + entry[a + 4] + ' has won!';
        }
    if (!stateVictory) {
        if (playerCount == 9)
            text = 'Nobody won!';
    }
    else
        document.getElementById("red-line").classList.toggle("toggle");
    return text;
}