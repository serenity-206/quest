window.addEventListener("DOMContentLoaded", () => {
    const dateSelect = document.getElementById("dateSelect");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const classStats = document.getElementById("classStats");
    const alertClasses = document.getElementById("alertClasses");
    const classChart = document.getElementById("classChart");

    const records = JSON.parse(localStorage.getItem("studentRecords")) || [];
    const rosterData = JSON.parse(localStorage.getItem("studentRoster")) || {};
    let chartInstance = null;

    // クラス一覧を取得
    function getAllClassKeys() {
        return Object.keys(rosterData); // 例: ["1年-A組", "1年-B組"]
    }

    // クラスごとの提出率と平均体調を算出
    function analyzeClasses(targetDate = null) {
        classStats.innerHTML = "";
        alertClasses.innerHTML = "";

        const classResults = [];

        getAllClassKeys().forEach(classKey => {
            const roster = rosterData[classKey] || [];
            const [grade, className] = classKey.split("-");
            let submittedCount = 0;
            let totalCondition = 0;
            let abnormalCount = 0;

            roster.forEach(student => {
                const studentRecords = records.filter(r =>
                    r.grade === grade &&
                    r.class === className &&
                    r.number === student.number &&
                    (!targetDate || r.recordDate === targetDate)
                );

                const latest = studentRecords.sort((a, b) =>
                    new Date(b.recordDate) - new Date(a.recordDate)
                )[0];

                if (latest) {
                    submittedCount++;
                    totalCondition += parseInt(latest.condition, 10);

                    // 異常検知（体調2以下が連続）
                    const recent = studentRecords.slice(0, 2);
                    if (recent.length === 2 &&
                        recent.every(r => parseInt(r.condition) <= 2)) {
                        abnormalCount++;
                    }
                }
            });

            const submissionRate = roster.length > 0 ? Math.round((submittedCount / roster.length) * 100) : 0;
            const averageCondition = submittedCount > 0 ? (totalCondition / submittedCount).toFixed(2) : "-";

            classResults.push({
                classKey,
                submissionRate,
                averageCondition,
                abnormalCount
            });

            const stat = document.createElement("div");
            stat.className = "class-stat";
            stat.innerHTML = `
        <h3>${classKey}</h3>
        <p>提出率：${submissionRate}%</p>
        <p>平均体調スコア：${averageCondition}</p>
        <p>異常検知：${abnormalCount}人</p>
      `;
            classStats.appendChild(stat);

            if (abnormalCount > 0) {
                const alert = document.createElement("div");
                alert.className = "alert-class";
                alert.textContent = `⚠️ ${classKey} に異常検知あり（${abnormalCount}人）`;
                alertClasses.appendChild(alert);
            }
        });

        drawClassChart(classResults);
    }

    // クラス別体調スコアグラフ
    function drawClassChart(results) {
        const labels = results.map(r => r.classKey);
        const data = results.map(r => parseFloat(r.averageCondition) || 0);

        const ctx = classChart.getContext("2d");
        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [{
                    label: "平均体調スコア",
                    data: data,
                    backgroundColor: "rgba(100, 149, 237, 0.6)"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "クラス別平均体調スコア"
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }

    // 分析ボタンで実行
    analyzeBtn.addEventListener("click", () => {
        const selectedDate = dateSelect.value || null;
        analyzeClasses(selectedDate);
    });

    // 初期表示（全期間分析）
    analyzeClasses();
});
