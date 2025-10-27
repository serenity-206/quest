window.addEventListener("DOMContentLoaded", () => {
  // DOM要素の取得
  const recordList = document.getElementById("recordList");
  const filterForm = document.getElementById("filterForm");
  const gradeSelect = document.getElementById("filterGrade");
  const classSelect = document.getElementById("filterClass");
  const studentSelect = document.getElementById("studentSelect");
  const chartCanvas = document.getElementById("condition-chart");
  const alertMessage = document.getElementById("alert-message");
  const memoArea = document.getElementById("shared-memo");
  const saveMemoBtn = document.getElementById("save-memo");
  const historyList = document.getElementById("historyList");

  // データの取得
  let records = JSON.parse(localStorage.getItem("studentRecords")) || [];
  let rosterData = JSON.parse(localStorage.getItem("studentRoster")) || {};
  let chartInstance = null;
  let currentStudentKey = null;

  // メモ保存・読み込み（関数化）
  function saveSharedMemo(studentKey, memoText) {
    localStorage.setItem(`memo_${studentKey}`, memoText);
  }

  function loadSharedMemo(studentKey) {
    return localStorage.getItem(`memo_${studentKey}`) || "";
  }

  // 最新の提出記録を抽出（1人1件）
  function getLatestRecords() {
    const latest = {};
    records.forEach(record => {
      const key = `${record.grade}-${record.class}-${record.number}`;
      if (!latest[key] || new Date(record.recordDate) > new Date(latest[key].recordDate)) {
        latest[key] = record;
      }
    });
    return latest;
  }

  // 生徒一覧の更新
  function updateStudentOptions() {
    const grade = gradeSelect.value;
    const className = classSelect.value;
    const classKey = `${grade}-${className}`;
    const roster = rosterData[classKey] || [];

    studentSelect.innerHTML = '<option value="">選択してください</option>';
    roster.forEach(student => {
      const option = document.createElement("option");
      option.value = student.number;
      option.textContent = `${student.number}番 ${student.name}`;
      studentSelect.appendChild(option);
    });
  }

  // 提出状況一覧の表示
  function renderTeacherView(grade, className) {
    const classKey = `${grade}-${className}`;
    const roster = rosterData[classKey] || [];
    const latestRecords = getLatestRecords();
    recordList.innerHTML = "";

    roster.forEach(student => {
      const key = `${grade}-${className}-${student.number}`;
      const record = latestRecords[key];

      const entry = document.createElement("div");
      entry.className = "teacher-entry";

      if (record) {
        entry.innerHTML = `
          <div class="record-block">
            <strong>${record.recordDate}</strong><br>
            <p>${grade} ${className} ${student.number}番 ${student.name}</p>
            <p>体調：${record.condition}</p>
            <p>メンタル：${record.mental}</p>
            <p>振り返り：${record.reflectionNote}</p>
            <p>既読：${record.read ? "✅" : "未読"}</p>
            <button onclick="markAsRead('${key}')">既読にする</button>
            <button onclick="updateChartAndMemo('${grade}', '${className}', ${student.number}, '${student.name}')">履歴を見る</button>
          </div>
        `;
      } else {
        entry.innerHTML = `
          <div class="record-block">
            <p>${grade} ${className} ${student.number}番 ${student.name}：<strong>未提出</strong></p>
            <button onclick="updateChartAndMemo('${grade}', '${className}', ${student.number}, '${student.name}')">履歴を見る</button>
          </div>
        `;
      }

      recordList.appendChild(entry);
    });
  }

  // 既読処理
  window.markAsRead = function (key) {
    records = records.map(r => {
      const k = `${r.grade}-${r.class}-${r.number}`;
      return k === key ? { ...r, read: true } : r;
    });

    localStorage.setItem("studentRecords", JSON.stringify(records));

    const grade = gradeSelect.value;
    const className = classSelect.value;
    renderTeacherView(grade, className);
  };

  // 履歴・グラフ・メモ表示
  window.updateChartAndMemo = function (grade, className, number, name) {
    const studentRecords = records.filter(r =>
      r.grade === grade && r.class === className && r.number === number
    );

    if (studentRecords.length === 0) {
      alertMessage.textContent = "履歴がありません";
      memoArea.value = "";
      historyList.innerHTML = "";
      if (chartInstance) chartInstance.destroy();
      return;
    }

    drawChart(studentRecords);
    checkAbnormal(studentRecords);
    renderHistoryList(studentRecords, grade, className, number, name);

    currentStudentKey = `${grade}-${className}-${number}`;
    memoArea.value = loadSharedMemo(currentStudentKey);
  };

  // グラフ描画
  function drawChart(studentRecords) {
    const labels = studentRecords.map(r => r.recordDate);
    const data = studentRecords.map(r => parseInt(r.condition));

    const ctx = chartCanvas.getContext("2d");
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "体調スコア",
          data: data,
          borderColor: "blue",
          backgroundColor: "rgba(173, 216, 230, 0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "体調履歴グラフ"
          }
        },
        scales: {
          y: {
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  // 異常検知
  function checkAbnormal(studentRecords) {
    let consecutiveLow = 0;
    for (let r of studentRecords) {
      if (parseInt(r.condition) <= 2) {
        consecutiveLow++;
        if (consecutiveLow >= 2) {
          alertMessage.textContent = "⚠️ 異常検知：体調不良が連続しています";
          return;
        }
      } else {
        consecutiveLow = 0;
      }
    }
    alertMessage.textContent = "異常なし";
  }

  // 履歴一覧表示
  function renderHistoryList(studentRecords, grade, className, number, name) {
    historyList.innerHTML = "";

    const header = document.createElement("h3");
    header.textContent = `${grade} ${className} ${number}番 ${name} の履歴一覧`;
    historyList.appendChild(header);

    studentRecords.forEach(record => {
      const entry = document.createElement("div");
      entry.className = "note-entry";
      entry.innerHTML = `
        <strong>${record.recordDate}</strong><br>
        <p>体調：${record.condition}</p>
        <p>メンタル：${record.mental}</p>
        <p>振り返り：${record.reflectionNote}</p>
        <p>既読：${record.read ? "✅" : "未読"}</p>
      `;
      historyList.appendChild(entry);
    });
  }

  // メモ保存イベント
  saveMemoBtn.addEventListener("click", () => {
    if (!currentStudentKey) {
      alert("先に生徒を選択してください。");
      return;
    }
    saveSharedMemo(currentStudentKey, memoArea.value);
    alert("メモを保存しました");
  });

  // 学年・クラス変更時に生徒選択肢を更新
  gradeSelect.addEventListener("change", updateStudentOptions);
  classSelect.addEventListener("change", updateStudentOptions);

  // 表示ボタンで選択された生徒の履歴を表示
  filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const grade = gradeSelect.value;
    const className = classSelect.value;
    const number = parseInt(studentSelect.value, 10);
    const classKey = `${grade}-${className}`;
    const roster = rosterData[classKey] || [];
    const student = roster.find(s => s.number === number) || { name: "（未登録）" };

    updateChartAndMemo(grade, className, number, student.name);
    renderTeacherView(grade, className);
  });

  // 初期表示（ページ読み込み時）
  updateStudentOptions();
});
