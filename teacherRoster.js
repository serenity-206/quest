const teacherRoster = {
  "1年-A組": { name: "田中一郎", id: "T1A001", password: "pass1A" },
  "1年-B組": { name: "佐藤花子", id: "T1B001", password: "pass1B" },
  "1年-C組": { name: "鈴木健太", id: "T1C001", password: "pass1C" },

  "2年-A組": { name: "高橋美咲", id: "T2A001", password: "pass2A" },
  "2年-B組": { name: "伊藤翔太", id: "T2B001", password: "pass2B" },
  "2年-C組": { name: "渡辺結衣", id: "T2C001", password: "pass2C" },

  "3年-A組": { name: "山本大地", id: "T3A001", password: "pass3A" },
  "3年-B組": { name: "中村葵", id: "T3B001", password: "pass3B" },
  "3年-C組": { name: "小林悠真", id: "T3C001", password: "pass3C" }
};

// 保存処理（初回のみ実行）
localStorage.setItem("teacherRoster", JSON.stringify(teacherRoster));
