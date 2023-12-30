let now = new Date();
let nowYear = now.getFullYear();
let nowMonth = now.getMonth() + 1;
let today = [now.getFullYear(), now.getMonth() + 1, now.getDate()];

let schedules =
  localStorage.getItem("schedules") === null ? {} : JSON.parse(localStorage.getItem("schedules"));
let calendarTable = document.querySelector(".calendar-table");

let calendarBodyTable = document.querySelector("#calendar-table-body");

const getDateOfMonth = (year, month) => {
  let totalDate = new Date(year, month, 0).getDate();
  return totalDate;
};

const drawCalendar = () => {
  let firstDay = new Date(nowYear, nowMonth - 1, 1).getDay();
  let totalRow = Math.ceil((firstDay + getDateOfMonth(nowYear, nowMonth)) / 7);
  let past = 7 - firstDay;
  let monthToEng = nowMonth + "월";
  if (nowMonth % 2 === 1) calendarTable.classList.add("odd");
  else calendarTable.classList.remove("odd");
  document.getElementById("year").innerText = nowYear.toString();
  let temp = "";
  monthToEng.split("").forEach((e) => {
    temp += `<span>${e}</span>`;
  });
  document.getElementById("month").innerHTML = temp;

  let weekRow = document.getElementById("days");

  while (calendarBodyTable.rows.length > 0) {
    calendarBodyTable.deleteRow(calendarBodyTable.rows.length - 1);
  }

  let firstRow = calendarBodyTable.insertRow();
  for (let i = 0; i < firstDay; i++) {
    let fisstCell = firstRow.insertCell();
    let emptyCell = weekRow.insertCell();
    emptyCell.classList.add("week-cell");
    fisstCell.classList.add("cell-empty");
    fisstCell.innerHTML = "일월화수목금토"[i];
  }

  for (let i = firstDay; i < 7; i++) {
    let weekCell = weekRow.insertCell();
    weekCell.classList.add("week-cell");
    weekCell.innerHTML = "일월화수목금토"[i];
  }

  for (let i = 0; i < 7; i++) {
    weekRow.removeChild(document.getElementsByClassName("week-cell")[0]);
  }

  for (let i = 1; i <= 7 - firstDay; i++) {
    let nowCols = firstRow.insertCell();
    let nowText = document.createElement("p");
    nowText.innerHTML = i;
    nowCols.appendChild(nowText);
    nowCols.classList.add("cell");
    let targetSchedules = schedules[padInt(nowYear.toString()) + "-" + padInt(nowMonth.toString())];
    if (
      targetSchedules &&
      targetSchedules[padInt(nowText.innerHTML.toString())] &&
      Object.values(targetSchedules[padInt(nowText.innerHTML.toString())]).length > 0
    ) {
      nowCols.classList.add("haveSchedule");
    }
    if (i === 7 - firstDay) nowText.classList.add("sat");
    if (i === 1 - firstDay) nowText.classList.add("sun");
    nowCols.addEventListener("click", (e) => {
      if (e.target.nodeName === "TD") {
        clicked(nowText);
      }
    });
    if ([nowYear, nowMonth, i] == [...today]) nowCols.classList.add("today");
  }

  for (let i = 1; i < totalRow; i++) {
    let nowRow = calendarBodyTable.insertRow();
    for (let j = 0; j < 7; j++) {
      let nowCols = nowRow.insertCell();
      let nowText = document.createElement("p");
      nowCols.classList.add("cell");
      nowText.innerHTML = past + 1;
      if (j === 0) nowText.classList.add("sun");
      if (j === 6) nowText.classList.add("sat");
      nowCols.appendChild(nowText);
      let targetSchedules =
        schedules[padInt(nowYear.toString()) + "-" + padInt(nowMonth.toString())];
      if (
        targetSchedules &&
        targetSchedules[padInt(nowText.innerHTML.toString())] &&
        Object.values(targetSchedules[padInt(nowText.innerHTML.toString())]).length > 0
      ) {
        nowCols.classList.add("haveSchedule");
      }
      past++;
      nowCols.addEventListener("click", (e) => {
        if (e.target.nodeName !== "DIV") {
          clicked(nowText);
        }
      });

      if (nowYear === today[0] && nowMonth === today[1] && past === today[2])
        nowCols.classList.add("today");

      if (past >= getDateOfMonth(nowYear, nowMonth)) break;
    }
  }

  let nextPage = document.querySelector("#next");
  nextPage.addEventListener("click", next, false);
  let prevPage = document.querySelector("#prev");
  prevPage.addEventListener("click", prev, false);
};

const prev = () => {
  if (nowMonth > 1) nowMonth--;
  else {
    nowYear--;
    nowMonth = 12;
  }
  drawCalendar();
  drawSchedule();
};

const next = () => {
  if (nowMonth < 12) nowMonth++;
  else {
    nowYear++;
    nowMonth = 1;
  }
  drawCalendar();
  drawSchedule();
};

const padInt = (num) => {
  let res = num.length < 2 ? "0" + num : num;
  return res;
};

const saveSchedule = () => {
  let date = document.querySelector("#target-date").innerText;
  let content = document.getElementById("schedule-input-content").value;
  let time = document.querySelector("#schedule-input-time").value;
  let [targetYear, targetMonth, targetDay] = date.split("-");
  let yearAndMonth = targetYear + "-" + targetMonth;
  let daySchedule = schedules[yearAndMonth] === undefined ? {} : schedules[yearAndMonth];
  let timeSchedule = daySchedule[targetDay] === undefined ? {} : daySchedule[targetDay];
  timeSchedule[time.replace(":", "")] = content;
  daySchedule[targetDay] = timeSchedule;
  schedules[yearAndMonth] = daySchedule;
  if (content !== "" && time !== "") localStorage.setItem("schedules", JSON.stringify(schedules));
};

let button = document.querySelector("#submit-button");
button.addEventListener("click", saveSchedule);
document.querySelector("#reset-button").addEventListener("click", () => {
  document.querySelector(".schedule-maker").classList.remove("show");
});
document.querySelector("#reset-button2").addEventListener("click", () => {
  document.querySelector(".schedule-changer").classList.remove("show");
});

window.onload = () => {
  drawCalendar();
  drawSchedule();
};

const clicked = (cell) => {
  let clickedDate = Number(cell.innerText);
  document.querySelector(".schedule-maker").classList.add("show");
  document.querySelector("#target-date").innerText =
    padInt(nowYear.toString()) +
    "-" +
    padInt(nowMonth.toString()) +
    "-" +
    padInt(clickedDate.toString());
};

const replaceSchedule = () => {
  let date = document.querySelector("#target-change-date").innerText;
  let content = document.getElementById("schedule-change-input-content").value;
  let time = document.querySelector("#schedule-change-input-time").value;
  let [targetYear, targetMonth, targetDay] = date.split("-");
  let yearAndMonth = targetYear + "-" + targetMonth;
  let daySchedule = schedules[yearAndMonth] === undefined ? {} : schedules[yearAndMonth];
  let timeSchedule = daySchedule[targetDay] === undefined ? {} : daySchedule[targetDay];
  timeSchedule[time.replace(":", "")] = content;
  daySchedule[targetDay] = timeSchedule;
  schedules[yearAndMonth] = daySchedule;

  localStorage.setItem("schedules", JSON.stringify(schedules));
};

const changeSchedule = (schedule) => {
  const copy = schedule.firstChild.innerText;
  let clickedDate = schedule.parentNode.firstChild.innerText.slice(
    0,
    schedule.parentNode.firstChild.innerText.length - 1
  );
  document.querySelector(".schedule-changer").classList.add("show");
  document.querySelector("#target-change-date").innerText =
    padInt(nowYear.toString()) +
    "-" +
    padInt(nowMonth.toString()) +
    "-" +
    padInt(clickedDate.toString());
  document.querySelector("#schedule-change-input-content").value = schedule.lastChild.innerText;

  document.querySelector("#change-button").addEventListener("click", () => {
    let content = document.getElementById("schedule-change-input-content").value;
    let time = document.querySelector("#schedule-change-input-time").value;
    if (content !== "" && time !== "") {
      delete schedules[padInt(nowYear.toString()) + "-" + padInt(nowMonth.toString())][
        padInt(clickedDate.toString())
      ][schedule.firstChild.innerText.slice(0, 2) + schedule.firstChild.innerText.slice(4, 6)];
      localStorage.setItem("schedules", JSON.stringify(schedules));
      replaceSchedule();
    }
  });

  document.querySelector("#delete-button").addEventListener("click", () => {
    delete schedules[padInt(nowYear.toString()) + "-" + padInt(nowMonth.toString())][
      padInt(clickedDate.toString())
    ][schedule.firstChild.innerText.slice(0, 2) + schedule.firstChild.innerText.slice(4, 6)];
    localStorage.setItem("schedules", JSON.stringify(schedules));

    window.location.reload();
  });
};

const drawSchedule = () => {
  let scheduleList = document.querySelector("#schedules-box");
  while (scheduleList.childNodes.length > 0) {
    scheduleList.removeChild(scheduleList.childNodes[0]);
  }

  let targetSchedules = schedules[padInt(nowYear.toString()) + "-" + padInt(nowMonth.toString())];
  let bar = document.createElement("div");

  Object.entries(targetSchedules)
    .sort((a, b) => a[0] - b[0])
    .forEach(([key, value]) => {
      if (Object.keys(value).length > 0) {
        let workDay = document.createElement("div");

        workDay.classList.add("work-day");

        let barTitle = document.createElement("h2");
        barTitle.classList.add("bar-title");
        barTitle.innerText = key.substring(0, 2) + "일";
        workDay.append(barTitle);
        Object.entries(value)
          .sort((a, b) => a[0] - b[0])
          .forEach(([time, content]) => {
            let list = document.createElement("div");
            list.classList.add("schedule-item");
            let barTime = document.createElement("p");
            let barContent = document.createElement("p");
            list.addEventListener("click", () => {
              changeSchedule(list);
            });
            barContent.innerText = content;
            barTime.innerText = time.slice(0, 2) + "시 " + time.slice(2, 4) + "분";
            list.append(barTime, barContent);
            workDay.append(list);
          });
        bar.append(workDay);
      }
    });
  scheduleList.appendChild(bar);
};
