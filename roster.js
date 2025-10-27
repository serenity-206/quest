// === 生徒名簿データ（1年A組） ===
const studentRoster = {
  "1年-A組": [
    { number: 1, name: "青木美優" },
    { number: 2, name: "赤坂陽菜" },
    { number: 3, name: "浅野颯太" },
    { number: 4, name: "池田結衣" },
    { number: 5, name: "石井陽翔" },
    { number: 6, name: "伊藤健" },
    { number: 7, name: "上野心" },
    { number: 8, name: "大野結菜" },
    { number: 9, name: "岡田紗季" },
    { number: 10, name: "加藤未来" },
    { number: 11, name: "木村美月" },
    { number: 12, name: "小林大地" },
    { number: 13, name: "斎藤蒼" },
    { number: 14, name: "佐々木蓮" },
    { number: 15, name: "佐藤花子" },
    { number: 16, name: "清水海斗" },
    { number: 17, name: "鈴木一郎" },
    { number: 18, name: "高橋美咲" },
    { number: 19, name: "田中太郎" },
    { number: 20, name: "土屋悠真" },
    { number: 21, name: "中村葵" },
    { number: 22, name: "西村蒼" },
    { number: 23, name: "野口結月" },
    { number: 24, name: "長谷川凛" },
    { number: 25, name: "原田結月" },
    { number: 26, name: "藤田陸" },
    { number: 27, name: "松本ひかり" },
    { number: 28, name: "三浦悠" },
    { number: 29, name: "村上大和" },
    { number: 30, name: "山本翔" }
  ]
};

// === 担任情報の取得 ===
const teacherRoster = JSON.parse(localStorage.getItem("teacherRoster")) || {};
const teacher = teacherRoster["1年-A組"];

// === DOM要素の取得 ===
const generateBtn = document.getElementById("generateRoster");
const rosterDisplay = document.getElementById("rosterDisplay");
const teacherNameDisplay = document.getElementById("teacherNameDisplay");

// === 担任名の表示 ===
teacherNameDisplay.textContent = teacher?.name || "未登録";

// === 生徒名簿の保存と表示 ===
generateBtn.addEventListener("click", () => {
  localStorage.setItem("studentRoster", JSON.stringify(studentRoster));
  displayRoster(studentRoster["1年-A組"]);
  alert("生徒名簿を保存しました");
});

// === 生徒名簿の表示（表形式・CSS対応） ===
function displayRoster(roster) {
  rosterDisplay.innerHTML = "";

  const table = document.createElement("table");
  table.className = "roster-table";

  // ヘッダー行
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const thNumber = document.createElement("th");
  thNumber.textContent = "出席番号";

  const thName = document.createElement("th");
  thName.textContent = "氏名";

  headerRow.appendChild(thNumber);
  headerRow.appendChild(thName);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // データ行
  const tbody = document.createElement("tbody");
  roster.forEach(student => {
    const row = document.createElement("tr");

    const tdNumber = document.createElement("td");
    tdNumber.textContent = student.number;

    const tdName = document.createElement("td");
    tdName.textContent = student.name;

    row.appendChild(tdNumber);
    row.appendChild(tdName);
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  rosterDisplay.appendChild(table);
}


// === 初期表示（保存済みがあれば表示） ===
const savedRoster = JSON.parse(localStorage.getItem("studentRoster")) || {};
if (savedRoster["1年-A組"]) {
  displayRoster(savedRoster["1年-A組"]);
}
