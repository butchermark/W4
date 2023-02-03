"use strict";
const dateinput = document.querySelector("#date-input");
const weightinput = document.querySelector("#kg-input");
let filterDuration = "week";
const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
let weightdatearray = [];
function addNewData(newdate, newweight) {
    let newData = {
        date: newdate,
        weight: newweight,
    };
    weightdatearray.push(newData);
    localStorage.setItem("weightdate", JSON.stringify(weightdatearray));
    chart.updateOptions({
        xaxis: {
            categories: getDataFromTable("date", filterDuration),
        },
        series: [
            {
                data: getDataFromTable("number", filterDuration),
            },
        ],
    });
    chart.updateXa;
    setTableData();
}
function whenGetData() {
    if (localStorage.getItem("weightdate")) {
        let variable = [];
        variable = JSON.parse(localStorage.getItem("weightdate") || "");
        variable.forEach((data) => {
            let newdata = {
                date: new Date(data.date),
                weight: data.weight,
            };
            weightdatearray.push(newdata);
        });
    }
}
function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
}
function getTime() {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    return minutes === 60
        ? `${hours + 1}:00`
        : `${hours}:${padTo2Digits(minutes)}`;
}
function setTableData() {
    const table = document.querySelector("#table");
    weightdatearray.sort(function (a, b) {
        return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    });
    /*
    let weightarray: Array<any> = [];
  
    const temporaryWeightArray = localStorage.getItem("weightdate");
    if (temporaryWeightArray) {
      console.log(localStorage.getItem("weightdate"));
      weightarray = JSON.parse(temporaryWeightArray);
      weightarray = weightarray.map((x) => x.weight);
    }
    */
    let output = "";
    for (let i = 0; i < weightdatearray.length; i++) {
        output += `<tr>
                <td>${weightdatearray[i].weight} kg</td> `;
        // mai nap
        if (weightdatearray[i].date.getDate() === new Date().getDate()) {
            output += `<td class="row-second-element"> today at ${getTime()}</td>`;
            output += `</tr>`;
        }
        //tegnap
        else if (weightdatearray[i].date.getDate() === new Date().getDate() - 1) {
            output += `<td class="row-second-element"> yesterday at ${getTime()}</td>`;
        }
        //ha nem az idei év
        else if (new Date().getFullYear() !== weightdatearray[i].date.getFullYear()) {
            output += `<td class="row-second-element">${weightdatearray[i].date.getDate()} ${monthNames[weightdatearray[i].date.getMonth()]} ${weightdatearray[i].date.getFullYear()} at ${getTime()}</td>`;
        }
        // idén de nem tegnap
        else if (weightdatearray[i].date.getDate() >= new Date().getDate() - 2) {
            output += `<td class="row-second-element">${weightdatearray[i].date.getDate()} ${monthNames[weightdatearray[i].date.getMonth()]} at ${padTo2Digits(weightdatearray[i].date.getHours())}:${padTo2Digits(weightdatearray[i].date.getMinutes())}</td>`;
        }
        output += `</tr>`;
        if (i === 9) {
            break;
        }
    }
    table.innerHTML = output;
}
function setFilterDuration(button) {
    switch (button) {
        case "Week":
            filterDuration = "week";
            break;
        case "Month":
            filterDuration = "month";
            break;
        case "Year":
            filterDuration = "year";
            break;
        case "Lifetime":
            filterDuration = "lifetime";
            break;
    }
    chart.updateOptions({
        xaxis: {
            categories: getDataFromTable("date", filterDuration),
        },
        series: [
            {
                data: getDataFromTable("number", filterDuration),
            },
        ],
    });
    chart.updateXa;
}
function getDataFromTable(data, filter) {
    const currentweight = document.querySelector("#current-weight-kg");
    const weightatperiodstart = document.querySelector("#weight-at-period-start-kg");
    const progressweight = document.querySelector("#progress-kg");
    let array = [];
    let dataToPush = 999;
    let i = 0;
    switch (filter) {
        case "week":
            if (weightdatearray.length > 7) {
                dataToPush = 7;
            }
            else {
                dataToPush = weightdatearray.length;
            }
            break;
        case "month":
            if (weightdatearray.length > 31) {
                dataToPush = 31;
            }
            else {
                dataToPush = weightdatearray.length;
            }
            break;
        case "year":
            if (weightdatearray.length > 365) {
                dataToPush = 365;
            }
            else {
                dataToPush = weightdatearray.length;
            }
            break;
        case "lifetime":
            dataToPush = weightdatearray.length;
            break;
    }
    if (data === "date") {
        for (let i = 0; i < dataToPush; i++) {
            array.push(padTo2Digits(weightdatearray[i].date.getDate()) +
                " " +
                monthNames[weightdatearray[i].date.getMonth()]);
        }
    }
    else if (data === "number") {
        for (let i = 0; i < dataToPush; i++) {
            array.push(weightdatearray[i].weight);
        }
        let currentWeight = array[array.length - 1];
        let weightAtStart = array[0];
        let progress;
        if (currentWeight >= weightAtStart) {
            progress = "+" + Math.abs(weightAtStart - currentWeight);
        }
        else {
            progress = "-" + Math.abs(weightAtStart - currentWeight);
        }
        if (currentweight.innerText == "-") {
            currentweight.innerText = "-";
        }
        else {
            currentweight.innerText = currentWeight + " kg";
        }
        if (weightatperiodstart.innerText == "-") {
            weightatperiodstart.innerText = "-";
        }
        else {
            weightatperiodstart.innerText = weightAtStart + " kg";
        }
        if (progressweight.innerText == "-") {
            progressweight.innerText = "-";
        }
        else {
            progressweight.innerText = progress + " kg";
        }
    }
    return array;
}
function restrictFutureDates() {
    const today = new Date();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();
    let year = today.getFullYear().toString();
    if (parseInt(month) < 10)
        month = "0" + month.toString();
    if (parseInt(day) < 10)
        day = "0" + day.toString();
    var maxDate = year + "-" + month + "-" + day;
    dateinput.setAttribute("max", maxDate);
}
function addEventListeners() {
    const form = document.querySelector("#form-div");
    const chartbuttons = document.querySelectorAll(".chart-buttons");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (isNaN(parseInt(dateinput.value))) {
            alert("Can't type nothing in date");
        }
        else {
            if (weightinput.value == "0") {
                alert("Can't type 0 in weight");
            }
            else if (weightinput && weightinput.value) {
                addNewData(new Date(dateinput.value + " " + getTime()), parseInt(weightinput.value));
            }
            else {
                alert("Can't type nothing in weight");
            }
        }
    });
    chartbuttons.forEach((button) => {
        button.addEventListener("click", () => setFilterDuration(button.innerText));
    });
}
addEventListeners();
setTableData();
whenGetData();
restrictFutureDates();
let chartOptions = {
    chart: {
        toolbar: {
            show: false,
        },
        type: "line",
    },
    series: [
        {
            name: "weight",
            data: getDataFromTable("number", filterDuration),
        },
    ],
    xaxis: {
        categories: getDataFromTable("date", filterDuration),
    },
};
// @ts-ignore
let chart = new ApexCharts(document.querySelector("#chart-diagramm"), chartOptions);
chart.render();
setTableData();
