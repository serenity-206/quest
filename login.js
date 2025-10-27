const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// 1年A組の名簿にIDとパスワードを追加
const studentRoster = {
  "1年-A組": [
    { number: 1, name: "青木美優", id: "1A001", password: "pass001" },
    { number: 2, name: "赤坂陽菜", id: "1A002", password: "pass002" },
    { number: 3, name: "浅野颯太", id: "1A003", password: "pass003" },
    { number: 4, name: "池田結衣", id: "1A004", password: "pass004" },
    { number: 5, name: "石井陽翔", id: "1A005", password: "pass005" },
    { number: 6, name: "伊藤健", id: "1A006", password: "pass006" },
    { number: 7, name: "上野心", id: "1A007", password: "pass007" },
    { number: 8, name: "大野結菜", id: "1A008", password: "pass008" },
    { number: 9, name: "岡田紗季", id: "1A009", password: "pass009" },
    { number: 10, name: "加藤未来", id: "1A010", password: "pass010" },
    { number: 11, name: "木村美月", id: "1A011", password: "pass011" },
    { number: 12, name: "小林大地", id: "1A012", password: "pass012" },
    { number: 13, name: "斎藤蒼", id: "1A013", password: "pass013" },
    { number: 14, name: "佐々木蓮", id: "1A014", password: "pass014" },
    { number: 15, name: "佐藤花子", id: "1A015", password: "pass015" },
    { number: 16, name: "清水海斗", id: "1A016", password: "pass016" },
    { number: 17, name: "鈴木一郎", id: "1A017", password: "pass017" },
    { number: 18, name: "高橋美咲", id: "1A018", password: "pass018" },
    { number: 19, name: "田中太郎", id: "1A019", password: "pass019" },
    { number: 20, name: "土屋悠真", id: "1A020", password: "pass020" },
    { number: 21, name: "中村葵", id: "1A021", password: "pass021" },
    { number: 22, name: "西村蒼", id: "1A022", password: "pass022" },
    { number: 23, name: "野口結月", id: "1A023", password: "pass023" },
    { number: 24, name: "長谷川凛", id: "1A024", password: "pass024" },
    { number: 25, name: "原田結月", id: "1A025", password: "pass025" },
    { number: 26, name: "藤田陸", id: "1A026", password: "pass026" },
    { number: 27, name: "松本ひかり", id: "1A027", password: "pass027" },
    { number: 28, name: "三浦悠", id: "1A028", password: "pass028" },
    { number: 29, name: "村上大和", id: "1A029", password: "pass029" },
    { number: 30, name: "山本翔", id: "1A030", password: "pass030" }
  ]
};

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputId = document.getElementById("loginId").value.trim();
  const inputPass = document.getElementById("loginPass").value.trim();

  const student = studentRoster["1年-A組"].find(s => s.id === inputId && s.password === inputPass);

  if (student) {
    const studentInfo = {
      name: student.name,
      grade: "1年",
      class: "A組",
      number: student.number
    };
    sessionStorage.setItem("loggedInStudent", JSON.stringify(studentInfo));
    window.location.href = "student.html";
  } else {
    loginMessage.textContent = "IDまたはパスワードが間違っています。";
  }
});
