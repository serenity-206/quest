window.addEventListener("DOMContentLoaded", () => {
  // DOM要素の取得
  const form = document.getElementById("noteForm");
  const history = document.getElementById("history");
  const nameDisplay = document.getElementById("studentNameDisplay");
  const gradeDisplay = document.getElementById("gradeDisplay");
  const classDisplay = document.getElementById("classDisplay");
  const numberDisplay = document.getElementById("numberDisplay");

  // ログイン情報の取得
  const studentInfo = JSON.parse(sessionStorage.getItem("loggedInStudent"));
  if (!studentInfo) {
    alert("ログイン情報がありません。ログイン画面に戻ります。");
    window.location.href = "login.html";
    return;
  }

  // 生徒情報の表示
  nameDisplay.textContent = studentInfo.name;
  gradeDisplay.textContent = studentInfo.grade;
  classDisplay.textContent = studentInfo.class;
  numberDisplay.textContent = studentInfo.number;

  // 提出記録の読み込み
  let records = JSON.parse(localStorage.getItem("studentRecords")) || [];

  // 前登校日を計算（提出日の前日）
  function getPreviousSchoolDay(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0];
  }

  // 提出履歴の表示（本人分のみ）
  function renderHistory() {
    history.innerHTML = "";
    const myRecords = records.filter(r =>
      r.grade === studentInfo.grade &&
      r.class === studentInfo.class &&
      parseInt(r.number, 10) === parseInt(studentInfo.number, 10)
    );

    myRecords.forEach(record => {
      const entry = document.createElement("div");
      entry.className = "note-entry";
      entry.innerHTML = `
        <strong>記録対象日：${record.recordDate}</strong><br>
        <p>体調：${record.condition}</p>
        <p>メンタル：${record.mental}</p>
        <p>振り返り：${record.reflectionNote}</p>
        <p>既読：${record.read ? "✅" : "未読"}</p>
      `;
      history.appendChild(entry);
    });
  }

  // 提出処理
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitDate = document.getElementById("submitDate").value;
    const condition = parseInt(document.getElementById("condition").value, 10);
    const mental = parseInt(document.getElementById("mental").value, 10);
    const reflectionNote = document.getElementById("reflectionNote").value;

    const record = {
      name: studentInfo.name,
      grade: studentInfo.grade,               // 例: "1年"
      class: studentInfo.class,               // 例: "A組"
      number: parseInt(studentInfo.number, 10), // 数値に統一
      submitDate: submitDate,
      recordDate: getPreviousSchoolDay(submitDate),
      condition: condition,
      mental: mental,
      reflectionNote: reflectionNote,
      read: false
    };

    records.unshift(record);
    localStorage.setItem("studentRecords", JSON.stringify(records));
    renderHistory();
    form.reset();
  });

  // 初期表示
  renderHistory();
});
