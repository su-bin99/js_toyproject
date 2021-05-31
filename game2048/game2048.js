const table = document.getElementById("table");
const score = document.getElementById("score");

let data = [];
const history = [];

const put2ToRandomCell = () => {};

const draw = () => {};

const gameStart = () => {
  //table -> fragment(가상의태그) -> tr -> td
  //fragment는 메모리에만 저장함!
  //직접 하나씩 다 append하면 그때마다 렌더링해버려서 성능이 좋지 못함

  const fragment = document.createDocumenFragment();
  [1, 2, 3, 4].forEach(function () {
    const rowData = [];
    data.push(rowData);
    const tr = document.createElement("tr");
    [1, 2, 3, 4].forEach(() => {
      rowData.push(0);
      const td = document.createElement("td");
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  });
  table.appendChild(fragment);

  put2ToRandomCell();
  draw();
};

gameStart();
