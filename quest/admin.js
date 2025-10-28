// === データの読み込み ===
let studentRoster = JSON.parse(localStorage.getItem("studentRoster")) || {};
let teacherRoster = JSON.parse(localStorage.getItem("teacherRoster")) || {};

// === クラス追加 ===
document.getElementById("addClassForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const grade = document.getElementById("newGrade").value.trim();
  const className = document.getElementById("newClass").value.trim();
  const key = `${grade}-${className}`;

  if (!studentRoster[key]) {
    studentRoster[key] = [];
    localStorage.setItem("studentRoster", JSON.stringify(studentRoster));
    updateClassSelector();
    alert(`${key} を追加しました`);
  } else {
    alert(`${key} はすでに存在します`);
  }
});

// === 生徒登録 ===
document.getElementById("addStudentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("studentName").value.trim();
  const number = parseInt(document.getElementById("studentNumber").value, 10);
  const id = document.getElementById("studentId").value.trim();
  const password = document.getElementById("studentPassword").value.trim();
  const grade = document.getElementById("studentGrade").value.trim();
  const className = document.getElementById("studentClass").value.trim();
  const key = `${grade}-${className}`;

  if (!studentRoster[key]) studentRoster[key] = [];
  studentRoster[key].push({ number, name, id, password });
  localStorage.setItem("studentRoster", JSON.stringify(studentRoster));
  updateClassSelector();
  alert(`生徒 ${name} を ${key} に登録しました`);
});

// === 担任登録 ===
document.getElementById("addTeacherForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("teacherName").value.trim();
  const id = document.getElementById("teacherId").value.trim();
  const password = document.getElementById("teacherPassword").value.trim();
  const classKey = document.getElementById("teacherClass").value.trim();

  teacherRoster[classKey] = { name, id, password };
  localStorage.setItem("teacherRoster", JSON.stringify(teacherRoster));
  displayTeachers();
  alert(`担任 ${name} を ${classKey} に登録しました`);
});

// === クラスセレクト更新 ===
function updateClassSelector() {
  const selector = document.getElementById("classSelector");
  selector.innerHTML = "";

  Object.keys(studentRoster).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    selector.appendChild(option);
  });

  displayRoster();
}

// === 生徒名簿表示・編集・削除 ===
document.getElementById("classSelector").addEventListener("change", displayRoster);
function displayRoster() {
  const key = document.getElementById("classSelector").value;
  const roster = studentRoster[key] || [];
  const container = document.getElementById("rosterDisplay");
  container.innerHTML = "";

  roster.forEach((student, index) => {
    const div = document.createElement("div");
    div.className = "student-entry";

    div.innerHTML = `
      <strong>${student.number}番 ${student.name}</strong><br>
      ID: ${student.id}<br>
      <button onclick="editStudent('${key}', ${index})">編集</button>
      <button onclick="deleteStudent('${key}', ${index})">削除</button>
    `;

    container.appendChild(div);
  });
}


function editStudent(classKey, index) {
  const student = studentRoster[classKey][index];
  const newName = prompt("名前を修正", student.name);
  const newNumber = prompt("出席番号を修正", student.number);
  const newId = prompt("IDを修正", student.id);
  const newPassword = prompt("パスワードを修正", student.password);

  if (newName && newId && newPassword) {
    studentRoster[classKey][index] = {
      name: newName.trim(),
      number: parseInt(newNumber, 10),
      id: newId.trim(),
      password: newPassword.trim()
    };
    localStorage.setItem("studentRoster", JSON.stringify(studentRoster));
    displayRoster();
    alert("修正しました");
  }
}

function deleteStudent(classKey, index) {
  if (confirm("この生徒を削除しますか？")) {
    studentRoster[classKey].splice(index, 1);
    localStorage.setItem("studentRoster", JSON.stringify(studentRoster));
    displayRoster();
    alert("削除しました");
  }
}

// === 担任表示・編集・削除 ===
function displayTeachers() {
  const container = document.getElementById("teacherDisplay");
  container.innerHTML = "";

  Object.keys(teacherRoster).forEach(classKey => {
    const teacher = teacherRoster[classKey];
    const div = document.createElement("div");
    div.className = "teacher-entry";

    const info = document.createElement("p");
    info.innerHTML = `<strong>${classKey}</strong><br>${teacher.name}（ID: ${teacher.id}）`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.addEventListener("click", () => editTeacher(classKey));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";
    deleteBtn.addEventListener("click", () => deleteTeacher(classKey));

    div.appendChild(info);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    container.appendChild(div);
  });
}

function editTeacher(classKey) {
  const teacher = teacherRoster[classKey];
  const newName = prompt("名前を修正", teacher.name);
  const newId = prompt("IDを修正", teacher.id);
  const newPassword = prompt("パスワードを修正", teacher.password);

  if (newName && newId && newPassword) {
    teacherRoster[classKey] = {
      name: newName.trim(),
      id: newId.trim(),
      password: newPassword.trim()
    };
    localStorage.setItem("teacherRoster", JSON.stringify(teacherRoster));
    displayTeachers();
    alert("担任情報を修正しました");
  }
}

function deleteTeacher(classKey) {
  if (confirm("この担任を削除しますか？")) {
    delete teacherRoster[classKey];
    localStorage.setItem("teacherRoster", JSON.stringify(teacherRoster));
    displayTeachers();
    alert("削除しました");
  }
}

// === 初期表示 ===
updateClassSelector();
displayTeachers();
