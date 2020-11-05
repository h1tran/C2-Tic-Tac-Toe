var tbl = document.createElement('table');
tbl.id = 'table';
tbl.setAttribute('style', 'border-collapse: collapse; border-style: hidden; border-spacing: 0px');
var tbody = document.createElement('tbody');
var tr = document.createElement('tr');
var td = document.createElement('td');

var divResult = document.createElement('div');
divResult.id = 'result';
divResult.classList.add('roboto', 'flex', 'opacity', 'initial-result');
divResult.setAttribute('style', 'font-size: 1.4rem; width: 100%; position: absolute; z-index: 5; top: 20.2rem;');

var divParent = document.createElement('div');
divParent.classList.add('flex', 'roboto', 'user-select');
divParent.setAttribute('style', 'position: absolute; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 3; display: none; cursor: pointer;');
divParent.addEventListener('click', function () {
    divParent.style.display = 'none';
})

divParent.appendChild(document.getElementById('instructions'));
document.body.appendChild(divParent);

var hasState = [];
var entry = [];
var currentCount = 0;
var playerCount = 0;
var stateVictory = false;
// Flag to check if the current player is 'X' or 'O'.
var checkPlayer = true;
var result = undefined;
var waitResponse = false;
var toggleNight = false;

var boxes = document.querySelectorAll('#night, #content');

draw();
document.getElementById('body').addEventListener('click', function () {
    if (result != null) {
        if (waitResponse)
            clear();
        else
            waitResponse = true;
    }
})

var tooltips = document.querySelectorAll('#info, #moon, #bot');
for (let b = 0; b < tooltips.length; b++) {
    tooltips[b].children[1].addEventListener('mouseenter', function () {
        tooltips[b].children[0].classList.toggle('toggle-menu');
    })
    tooltips[b].children[1].addEventListener('mouseleave', function () {
        tooltips[b].children[0].classList.toggle('toggle-menu');
    })
}

function draw() {
    for (let i = 0; i < 3; i++) {
        tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            hasState[currentCount] = false;
            td = document.createElement('td');
            if (!toggleNight)
                td.setAttribute('style', 'padding: 0; border: solid 0.7rem black;');
            else
                td.setAttribute('style', 'padding: 0; border: solid 0.7rem #f9d276;');
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
                        if (result != null) {
                            document.body.classList.toggle('body-click');
                            setTimeout(function () {
                                var resultText = document.createElement('div');
                                if (toggleNight)
                                    resultText.setAttribute('style', 'color: #f9d276; background-color: #313131; padding: 2rem 7rem; border: solid 1px #f9d276;');
                                else
                                    resultText.setAttribute('style', 'color: black; background-color: white; padding: 2rem 7rem; border: solid 1px black;');
                                resultText.innerHTML = result;
                                divResult.classList.add('toggle-result');
                                divResult.appendChild(resultText);
                            }, 150)
                            setTimeout(function () {
                                document.body.classList.toggle('body-click');   
                            }, 450)
                        }
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
    document.getElementById('playable').appendChild(divResult);
}

function clear() {
    let node = document.getElementById("table");
    node.querySelectorAll('*').forEach(element => element.remove());
    if (stateVictory)
        document.getElementById("red-line").classList.toggle("toggle");
    reset();
    draw();
    divResult.classList.remove('toggle-result');
    divResult.innerHTML = "";
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
    document.getElementById("red-line").setAttribute('style', 'top: auto; bottom: auto; left: auto; right: auto; transform: rotate(0deg);');
    // Check row
    for (let j = 0; j < 9; j += 3)
        if (entry[j] != null)
            if (entry[j] === entry[j + 1] && entry[j] === entry[j + 2]) {
                stateVictory = true;
                text = 'Player ' + entry[j] + ' has won!';
                document.getElementById("red-line").setAttribute('style', 'width: 46.4rem; transform: rotate(0deg);');
                switch (j) {
                    case 0:
                        document.getElementById("red-line").setAttribute('style', 'top: 7.2rem;');
                        break;
                    case 6:
                        document.getElementById("red-line").setAttribute('style', 'bottom: 7.2rem;');
                        break;
                }
            }
    // Check column
    for (let i = 0; i < 3; i++)
        if (entry[i] != null)
            if (entry[i] === entry[i + 3] && entry[i] === entry[i + 6]) {
                stateVictory = true;
                text = 'Player ' + entry[i] + ' has won!';
                document.getElementById("red-line").setAttribute('style', 'width: 46.4rem; transform: rotate(90deg);');
                switch (i) {
                    case 0:
                        document.getElementById("red-line").setAttribute('style', 'transform: translateX(-33.8%) rotate(90deg);');
                        break;
                    case 2:
                        document.getElementById("red-line").setAttribute('style', 'transform: translateX(33.8%) rotate(90deg);');
                        break;
                }
            }
    // Check diagonals
    let a = 0;
    if (entry[a + 4] != null)
        if (entry[a] === entry[a + 4] && entry[a] === entry[a + 8]) {
            stateVictory = true;
            text = 'Player ' + entry[a + 4] + ' has won!';
            document.getElementById("red-line").setAttribute('style', 'width: 64rem; transform: rotate(45deg);');
        }
        else if (entry[a + 2] === entry[a + 4] && entry[a + 2] === entry[a + 6]) {
            stateVictory = true;
            text = 'Player ' + entry[a + 4] + ' has won!';
            document.getElementById("red-line").setAttribute('style', 'width: 64rem; transform: rotate(135deg);');
        }
    if (!stateVictory) {
        if (playerCount == 9)
            text = 'Nobody won!';
    }
    else {
        document.getElementById("red-line").classList.toggle("toggle");
    }
    return text;
}

function nightMode() {
    if (!toggleNight) {
        toggleNight = true;
        for (let a = 0; a < boxes.length; a++)
            boxes[a].style.color = '#f9d276';
        boxes[1].setAttribute('style', 'color: #f9d276; background-color: #313131; border: solid 1px #f9d276;');
        document.getElementById('body').style.backgroundColor = 'black';
        tbl.setAttribute('style', 'color: #f9d276; border-collapse: collapse; border-style: hidden; border-spacing: 0px');
    } else {
        toggleNight = false;
        for (let a = 0; a < boxes.length; a++)
            boxes[a].style.color = 'black';
        boxes[1].setAttribute('style', 'background-color: white; border: solid 1px black;');
        document.getElementById('body').style.backgroundColor = 'white';
        tbl.setAttribute('style', 'color: black; border-collapse: collapse; border-style: hidden; border-spacing: 0px');
    }
    clear();
}

function instructions() {
    divParent.style.display = 'block';
}