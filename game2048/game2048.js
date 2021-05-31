const table = document.getElementById("table");
const score = document.getElementById("score");
const prevBtn = document.getElementById("prev_btn");
const freshBtn = document.getElementById("fresh_btn");
const topScore = document.getElementById("topScore");

let data = [];
let history = [];

const put2or4ToRandomCell = () => {
  const emptyCells = [];
  // emptyCells : [[i1, j1], [i2, j2] [i3, j3]] 이런식으로 이루어짐
  data.forEach((rowData, i) => {
    // 몇번째 줄! i가 그 인덱스
    rowData.forEach((cellData, j) => {
      // 몇번째 칸 ! j 가 그 인덱스
      if (!cellData) {
        emptyCells.push([i, j]);
      }
    });
  });
  if (emptyCells.length < 1) {
    return false;
  }
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  data[randomCell[0]][randomCell[1]] = (Math.floor(Math.random() * 2) + 1) * 2;
};

const draw = () => {
  console.log(data);
  data.forEach((rowData, i) => {
    rowData.forEach((cellData, j) => {
      const target = table.children[i].children[j];
      if (cellData > 0) {
        target.textContent = cellData;
        target.className = "color-" + cellData;
      } else {
        target.textContent = " ";
        target.className = " ";
      }
    });
  });
};

const gameStart = () => {
  //table -> fragment(가상의태그) -> tr -> td
  //fragment는 메모리에만 저장함!
  //직접 하나씩 다 append하면 그때마다 렌더링해버려서 성능이 좋지 못함
  data = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  if (table.firstChild == null) {
    const fragment = document.createDocumentFragment();
    [1, 2, 3, 4].forEach(function () {
      const tr = document.createElement("tr");
      [1, 2, 3, 4].forEach(() => {
        const td = document.createElement("td");
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    table.appendChild(fragment);
  }

  if (localStorage.getItem("table") == null) {
    put2or4ToRandomCell();
    draw();
  } else {
    history = JSON.parse(localStorage.getItem("history"));
    data = JSON.parse(localStorage.getItem("table"));
    score.textContent = localStorage.getItem("score");
    put2or4ToRandomCell();
    draw();
  }
};

const saveGame = () => {
  const prevTopScore = localStorage.getItem("topScore");
  if (prevTopScore == null) {
    localStorage.setItem("topScore", 0);
  } else {
    if (prevTopScore < score) {
      topScore.textContent = score.textContent;
      localStorage.setItem("topScore", topScore.textContent);
    }
  }
  localStorage.setItem("table", JSON.stringify(data));
  localStorage.setItem("score", score.textContent);
  localStorage.setItem("history", JSON.stringify(history));
};

gameStart();

const moveCells = (direction) => {
  if (history.length > 4) {
    history.shift();
  }
  history.push({
    table: JSON.parse(JSON.stringify(data)),
    score: score.textContent,
  });
  switch (direction) {
    case "left": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            // newData = [2, 2, 4]
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              // 이전 값과 지금 값이 같으면
              const nowscore = parseInt(score.textContent);
              score.textContent =
                nowscore + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(cellData);
            }
          }
        });
      });
      [1, 2, 3, 4].forEach((rowData, i) => {
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "right": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (rowData[3 - j]) {
            const currentRow = newData[i];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === rowData[3 - j]) {
              const nowscore = parseInt(score.textContent);
              score.textContent =
                nowscore + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[i].push(rowData[3 - j]);
            }
          }
        });
      });
      [1, 2, 3, 4].forEach((rowData, i) => {
        [1, 2, 3, 4].forEach((cellData, j) => {
          data[i][3 - j] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "up": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (cellData) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === cellData) {
              const nowscore = parseInt(score.textContent);
              score.textContent =
                nowscore + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(cellData);
            }
          }
        });
      });
      [1, 2, 3, 4].forEach((cellData, i) => {
        [1, 2, 3, 4].forEach((rowData, j) => {
          data[j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
    case "down": {
      const newData = [[], [], [], []];
      data.forEach((rowData, i) => {
        rowData.forEach((cellData, j) => {
          if (data[3 - i][j]) {
            const currentRow = newData[j];
            const prevData = currentRow[currentRow.length - 1];
            if (prevData === data[3 - i][j]) {
              const nowscore = parseInt(score.textContent);
              score.textContent =
                nowscore + currentRow[currentRow.length - 1] * 2;
              currentRow[currentRow.length - 1] *= -2;
            } else {
              newData[j].push(data[3 - i][j]);
            }
          }
        });
      });
      [1, 2, 3, 4].forEach((cellData, i) => {
        [1, 2, 3, 4].forEach((rowData, j) => {
          data[3 - j][i] = Math.abs(newData[i][j]) || 0;
        });
      });
      break;
    }
  }
  if (data.flat().includes(2048)) {
    // 승리
    draw();
    saveGame();
    setTimeout(() => {
      alert("축하합니다. 2048을 만들었습니다!");
    }, 0);
  } else if (!data.flat().includes(0)) {
    // 빈 칸이 없으면 패배
    alert(`패배했습니다... ${score.textContent}점`);
  } else {
    saveGame();
    put2or4ToRandomCell();
    draw();
  }
};

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") {
    moveCells("up");
  } else if (event.key === "ArrowDown") {
    moveCells("down");
  } else if (event.key === "ArrowLeft") {
    moveCells("left");
  } else if (event.key === "ArrowRight") {
    moveCells("right");
  }
});

let startCoord;
window.addEventListener("mousedown", (event) => {
  startCoord = [event.clientX, event.clientY];
});
window.addEventListener("mouseup", (event) => {
  const endCoord = [event.clientX, event.clientY];
  const diffX = endCoord[0] - startCoord[0];
  const diffY = endCoord[1] - startCoord[1];
  if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells("left");
  } else if (diffX > 0 && Math.abs(diffX) > Math.abs(diffY)) {
    moveCells("right");
  } else if (diffY > 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells("down");
  } else if (diffY < 0 && Math.abs(diffX) <= Math.abs(diffY)) {
    moveCells("up");
  }
});

prevBtn.addEventListener("click", () => {
  if (history.length < 1) {
    alert("5회이상 뒤로가기를 할 수 없습니다.");
  } else {
    const temp = history.pop();
    data = temp.table;
    score.textContent = temp.score;
    saveGame();
    draw();
  }
});

freshBtn.addEventListener("click", () => {
  score.textContent = "0";
  localStorage.clear();
  history = [];
  data = [];
  gameStart();
});
