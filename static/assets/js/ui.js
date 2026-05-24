function formatNumber(num) {
    if (num == 0) return "0";
    else if (num < 1000000) return `${parseInt(num / 1000)}k`;
    else return `${(num / 1000000).toFixed(2)}M`;
}

//--------------------------------------------------------------------------------------------//

const sidebarTabMain = document.getElementById("sidebar-tab-main");
const sidebarTabAI = document.getElementById("sidebar-tab-ai");
const gridMain = document.getElementById("grid-tasks");
const gridAI = document.getElementById("grid-ai");

function tabToggle() {
    gridMain.classList.toggle("selected");
    gridAI.classList.toggle("selected");
    sidebarTabMain.classList.toggle("selected")
    sidebarTabAI.classList.toggle("selected")
}
sidebarTabMain.addEventListener("click", () => {
    if (!sidebarTabMain.classList.contains("selected")) tabToggle();
});
sidebarTabAI.addEventListener("click", () => {
    if (!sidebarTabAI.classList.contains("selected")) tabToggle();
});

sidebarTabMain.classList.add("selected")
gridMain.classList.add("selected");

document.getElementById("sidebar-theme").addEventListener("click", () => {
    if (localStorage.getItem("theme") == "dark") {
        document.documentElement.dataset.theme = "light";
        localStorage.setItem("theme", "light")
    }
    else {
        document.documentElement.dataset.theme = "dark";
        localStorage.setItem("theme", "dark")
    }
})

document.getElementById("sidebar-logout").addEventListener("click", () => {
    window.location.href = "/logout";
});

//--------------------------------------------------------------------------------------------//

const velocityChart = document.getElementById("block-velocity").querySelector(".chart");

const textReBugRateLeft = document.getElementById("rebugrate-number-left");
const textReBugRateMiddle = document.getElementById("rebugrate-number-middle");
const textReBugRateRight = document.getElementById("rebugrate-number-right");
const reBugRateBar = document.getElementById("rebugrate-bar");
const taskrateChart = document.getElementById("chart-circle");
const taskRateNumber = document.getElementById("chart-number");
const releaseRateNumber = document.getElementById("releaserate-number");
const bugRateNumber = document.getElementById("bugrate-number");

var maxTasks = 0;
var chartSprints = [];

function tasksTotal() {
    var bugs = 0;
    var returnedBugs = 0;
    var tasksTotal = 0;
    var tasksCompleted = 0;
    var releases = 0;
    chartSprints.forEach((sprint) => {
        bugs += sprint.bugs;
        returnedBugs += sprint.returned_bugs;
        tasksTotal += sprint.tasks_total;
        tasksCompleted += sprint.tasks_completed;
        releases += sprint.releases;
    });
    textReBugRateLeft.textContent = `${parseInt(returnedBugs / bugs * 100)}%`;
    textReBugRateMiddle.textContent = `${returnedBugs} из ${bugs}`;
    textReBugRateRight.textContent = `${100 - parseInt(returnedBugs / bugs * 100)}%`;
    reBugRateBar.style.setProperty("--rebugrate", parseInt(returnedBugs / bugs * 100));

    var tasks_completed_percentage = parseInt(tasksCompleted / tasksTotal * 100);
    taskrateChart.style.setProperty("--taskrate",tasks_completed_percentage);
    taskRateNumber.textContent = `${tasks_completed_percentage}%`

    var releases_avg = parseInt(releases / sprints.length);
    var bugs_avg = parseInt(bugs / sprints.length);
    releaseRateNumber.textContent = releases_avg;
    bugRateNumber.textContent = bugs_avg;
    document.getElementById("block-releaserate").querySelector(".block-subtitle").textContent = "в среднем за спринт";
    document.getElementById("block-bugrate").querySelector(".block-subtitle").textContent = "в среднем за спринт";
}
function taskSelected(sprintIndex) {
    var sprint = chartSprints[sprintIndex];
    textReBugRateLeft.textContent = `${parseInt(sprint.returned_bugs / sprint.bugs * 100)}%`;
    textReBugRateMiddle.textContent = `${sprint.returned_bugs} из ${sprint.bugs}`;
    textReBugRateRight.textContent = `${100 - parseInt(sprint.returned_bugs / sprint.bugs * 100)}%`;
    reBugRateBar.style.setProperty("--rebugrate", parseInt(sprint.returned_bugs / sprint.bugs * 100));

    var tasks_completed_percentage = parseInt(sprint.tasks_completed / sprint.tasks_total * 100);
    taskrateChart.style.setProperty("--taskrate",tasks_completed_percentage);
    taskRateNumber.textContent = `${tasks_completed_percentage}%`

    releaseRateNumber.textContent = sprint.releases;
    bugRateNumber.textContent = sprint.bugs;
    document.getElementById("block-releaserate").querySelector(".block-subtitle").textContent = "в этом спринте";
    document.getElementById("block-bugrate").querySelector(".block-subtitle").textContent = "в этом спринте";
}

//--------------------------------------------------------------------------------------------//

const tokensChart = document.getElementById("block-tokens").querySelector(".chart");

const AICostPerSprintNumber = document.getElementById("cost-per-sprint-number");
const AICostPerSprintNumberSmall = document.getElementById("block-cost-per-sprint").querySelector(".block-subtitle");
const AICostPerTaskNumber = document.getElementById("cost-per-task-number");
const AICostPerTaskNumberSmall = document.getElementById("block-cost-per-task").querySelector(".block-subtitle");
const AIChartModels = document.getElementById("chart-models");

var maxTokens = 0;
var chartDays = []; 

var ai_total_stats = [];
var AIStatsMode = "total";
var AIChartMode = "tokens";

function AIChartDisplayTokens() {
    if (AIStatsMode == "total") {
        var chart_models = ai_total_stats.sort((a, b) => b.tokens - a.tokens);
        var tokens_total = ai_total_stats.reduce((a,b) => a + b.tokens, 0);
    }
    else {
        var chart_models = [...chartDays[AIStatsMode].usage];
        chart_models.forEach((m, index) => {m.model = index});
        chart_models = chart_models.sort((a, b) => b.tokens - a.tokens);
        var tokens_total = chart_models.reduce((a,b) => a + b.tokens, 0);
    }
    AIChartModels.querySelectorAll(".chart-model").forEach((model, index) => {
        var percentage = model.querySelector(".model-percentage");
        percentage.classList.remove("color-0", "color-1", "color-2");
        percentage.classList.add(`color-${chart_models[index].model}`);
        var percentageNumber = parseInt(chart_models[index].tokens / tokens_total * 100);
        percentage.textContent = `${percentageNumber}%`;
        if (index < 2) document.getElementById("chart-pie").style.setProperty(`--chart-${index}`, percentageNumber);
        model.querySelector(".model-name").textContent = ai_models[chart_models[index].model].name;
        var tokens = chart_models[index].tokens;
        model.querySelector(".model-number").textContent = formatNumber(tokens);
    });
}

function AIChartDisplayCost() {
    if (AIStatsMode == "total") {
        var chart_models = ai_total_stats.sort((a, b) => b.cost - a.cost);
        var cost_total = ai_total_stats.reduce((a,b) => a + b.cost, 0);
    }
    else {
        var chart_models = [...chartDays[AIStatsMode].usage];
        chart_models.forEach((m, index) => {m.model = index});
        chart_models = chart_models.sort((a, b) => b.cost - a.cost);
        var cost_total = chart_models.reduce((a,b) => a + b.cost, 0);
    }
    AIChartModels.querySelectorAll(".chart-model").forEach((model, index) => {
        var percentage = model.querySelector(".model-percentage");
        percentage.classList.remove("color-0", "color-1", "color-2");
        percentage.classList.add(`color-${chart_models[index].model}`);
        var percentageNumber = parseInt(chart_models[index].cost / cost_total * 100);
        percentage.textContent = `${percentageNumber}%`;
        if (index < 2) document.getElementById("chart-pie").style.setProperty(`--chart-${index}`, percentageNumber);
        model.querySelector(".model-name").textContent = ai_models[chart_models[index].model].name;
        var cost = chart_models[index].cost;
        model.querySelector(".model-number").textContent = `${cost}$`;
    });
}

function AITotal() {
    document.getElementById("block-cost-per-sprint").querySelector(".block-title").textContent = "Стоимость ИИ за спринт";
    document.getElementById("block-cost-per-task").querySelector(".block-title").textContent = "Стоимость ИИ за задачу";
    document.getElementById("block-cost-per-task").querySelector(".block-number").style.height = "";
    const last_sprint = [...sprints].reverse()[0];
    const prev_sprint = [...sprints].reverse()[1];
    AICostPerSprintNumber.textContent = `${last_sprint.ai_cost_total}$`;
    AICostPerTaskNumber.textContent = `${last_sprint.ai_cost_per_task}$`;
    var costPerSprintDiff = last_sprint.ai_cost_total - prev_sprint.ai_cost_total;
    AICostPerSprintNumberSmall.classList.remove("red", "green");
    if (costPerSprintDiff > 0) {
        AICostPerSprintNumberSmall.classList.add("red");
        AICostPerSprintNumberSmall.innerHTML = `на ${(costPerSprintDiff / prev_sprint.ai_cost_total * 100).toFixed(2)}% выше прошлого спринта<br>(+${costPerSprintDiff}$)`;
    }
    else if (costPerSprintDiff < 0) {
        AICostPerSprintNumberSmall.classList.add("green");
        AICostPerSprintNumberSmall.innerHTML = `на ${Math.abs(costPerSprintDiff / prev_sprint.ai_cost_total * 100).toFixed(2)}% ниже прошлого спринта<br>(${costPerSprintDiff}$)`;
    }
    else AICostPerSprintNumberSmall.innerHTML = 'без изменений<br>в сравнении с прошлым спринтом';
    var costPerTaskDiff = last_sprint.ai_cost_per_task - prev_sprint.ai_cost_per_task;
    AICostPerTaskNumberSmall.classList.remove("red", "green");
    if (costPerTaskDiff > 0) {
        AICostPerTaskNumberSmall.classList.add("red");
        AICostPerTaskNumberSmall.innerHTML = `на ${(costPerTaskDiff / prev_sprint.ai_cost_per_task * 100).toFixed(2)}% выше прошлого спринта<br>(+${costPerTaskDiff}$)`;
    }
    else if (costPerTaskDiff < 0) {
        AICostPerTaskNumberSmall.classList.add("green");
        AICostPerTaskNumberSmall.innerHTML = `на ${Math.abs(costPerTaskDiff / prev_sprint.ai_cost_per_task * 100).toFixed(2)}% ниже прошлого спринта<br>(${costPerTaskDiff}$)`;
    }
    else AICostPerTaskNumberSmall.innerHTML = 'без изменений<br>в сравнении с прошлым спринтом';
    if (ai_usage_days.length == 0) {
        document.getElementById("tokens-per-model-chart").style.display = "none";
        return
    }
    if (AIChartMode == "tokens") AIChartDisplayTokens();
    if (AIChartMode == "cost") AIChartDisplayCost();
}

function AISelected() {
    document.getElementById("block-cost-per-sprint").querySelector(".block-title").textContent = "Стоимость ИИ за день";
    document.getElementById("block-cost-per-task").querySelector(".block-title").textContent = "Средняя стоимость на человека";
    document.getElementById("block-cost-per-task").querySelector(".block-number").style.height = "83px";
    var cost_total = chartDays[AIStatsMode].usage.reduce((a,b) => a + b.cost, 0);
    var cost_total_prev = chartDays[AIStatsMode + 1] ? chartDays[AIStatsMode + 1].usage.reduce((a,b) => a + b.cost, 0) : 0;
    AICostPerSprintNumber.textContent = `${cost_total}$`;
    AICostPerTaskNumber.textContent = `${chartDays[AIStatsMode].per_person}$`;
    if (chartDays[AIStatsMode + 1]) {
        var costPerDayDiff = (cost_total - cost_total_prev).toFixed(2);
        AICostPerSprintNumberSmall.classList.remove("red", "green");
        if (costPerDayDiff > 0) {
            AICostPerSprintNumberSmall.classList.add("red");
            AICostPerSprintNumberSmall.innerHTML = `на ${(costPerDayDiff /cost_total_prev * 100).toFixed(2)}% выше прошлого дня<br>(+${costPerDayDiff}$)`;
        }
        else if (costPerDayDiff < 0) {
            AICostPerSprintNumberSmall.classList.add("green");
            AICostPerSprintNumberSmall.innerHTML = `на ${Math.abs(costPerDayDiff / cost_total_prev * 100).toFixed(2)}% ниже прошлого дня<br>(${costPerDayDiff}$)`;
        }
        else AICostPerSprintNumberSmall.innerHTML = 'без изменений<br>в сравнении с прошлым днём';
        var costPerPersonDiff = (chartDays[AIStatsMode].per_person - chartDays[AIStatsMode + 1].per_person).toFixed(2);
        AICostPerTaskNumberSmall.classList.remove("red", "green");
        if (costPerPersonDiff > 0) {
            AICostPerTaskNumberSmall.classList.add("red");
            AICostPerTaskNumberSmall.innerHTML = `на ${(costPerPersonDiff / chartDays[AIStatsMode + 1].per_person * 100).toFixed(2)}% выше прошлого дня<br>(+${costPerPersonDiff}$)`;
        }
        else if (costPerPersonDiff < 0) {
            AICostPerTaskNumberSmall.classList.add("green");
            AICostPerTaskNumberSmall.innerHTML = `на ${Math.abs(costPerPersonDiff / chartDays[AIStatsMode + 1].per_person * 100).toFixed(2)}% ниже прошлого дня<br>(${costPerPersonDiff}$)`;
        }
        else AICostPerTaskNumberSmall.innerHTML = 'без изменений<br>в сравнении с прошлым днём';
    }
    else {
        AICostPerSprintNumberSmall.innerHTML = "";
        AICostPerTaskNumberSmall.innerHTML = "";
    }
    if (AIChartMode == "tokens") AIChartDisplayTokens();
    if (AIChartMode == "cost") AIChartDisplayCost();
}

document.getElementById("chart-toggler-tokens").addEventListener("click", (e) => {
    if (!e.target.classList.contains("selected")) {
        e.target.classList.add("selected");
        document.getElementById("chart-toggler-cost").classList.remove("selected");
        document.getElementById("chart-toggler-bg").classList.remove("right");
        AIChartMode = "tokens";
        AIChartDisplayTokens();
    }
})
document.getElementById("chart-toggler-cost").addEventListener("click", (e) => {
    if (!e.target.classList.contains("selected")) {
        e.target.classList.add("selected");
        document.getElementById("chart-toggler-tokens").classList.remove("selected");
        document.getElementById("chart-toggler-bg").classList.add("right");
        AIChartMode = "cost";
        AIChartDisplayCost();
    }
})

var username = "";
var sprints = [];
var ai_usage_days = [];
var ai_models = [];

async function getData() {
    const serverResponse = await fetch('/dashboard-data');
    const serverData = await serverResponse.json(); 
    
    username = serverData.username;
    sprints = serverData.sprints;
    ai_usage_days = serverData.ai_usage_days;
    ai_models = serverData.ai_models;

    maxTasks = Math.max(...[...sprints].reverse().slice(0,7).map(s => s.tasks_completed));
    chartSprints = [...sprints].reverse();
    maxTokens = Math.max(...[...ai_usage_days].reverse().slice(0,7).map(s => s.usage.reduce((a, b) => a + b.tokens, 0)));
    chartDays = [...ai_usage_days].reverse(); 

    ai_models.forEach((model,index) => {
        ai_total_stats.push({model: index, tokens: 0, cost: 0});
    });
    chartDays.forEach((day) => {
        ai_models.forEach((model, index) => {
            ai_total_stats[index].tokens += day.usage[index].tokens;
            ai_total_stats[index].cost += day.usage[index].cost;
        });
    });

    chartSprints.slice(0,7).forEach((sprint, index) => {
        var chartBlock = document.createElement("div");
        chartBlock.classList.add("chart-block");
        chartBlock.style.setProperty("--tasks", parseInt(sprint.tasks_completed / maxTasks * 100));
        var chartBlockLine = document.createElement("div");
        chartBlockLine.classList.add("chart-block-line");
        chartBlockLine.textContent = sprint.tasks_completed;
        var chartBlockDate = document.createElement("div");
        chartBlockDate.classList.add("chart-block-date");
        chartBlockDate.textContent = sprint.date;
        chartBlock.appendChild(chartBlockLine);
        chartBlock.appendChild(chartBlockDate);
        velocityChart.insertBefore(chartBlock,velocityChart.firstChild);
        chartBlock.addEventListener("click", (e) => {
            if (e.currentTarget.classList.contains("selected")) {
                e.currentTarget.classList.remove("selected");
                tasksTotal();
            }
            else {
                velocityChart.querySelectorAll(".chart-block").forEach((b) => b.classList.remove("selected"));
                e.currentTarget.classList.add("selected");
                taskSelected(index);
            }
        })
    })

    chartDays.slice(0,7).forEach((day, index) => {
        var tokenUsage = day.usage.reduce((a,b) => a + b.tokens, 0);
        var tokenUsageLastDay = chartDays[index + 1] ? chartDays[index + 1].usage.reduce((a,b) => a + b.tokens, 0) : 0;
        var chartBlock = document.createElement("div");
        chartBlock.classList.add("chart-block");
        chartBlock.style.setProperty("--tasks", parseInt(tokenUsage / maxTokens * 100));
        var chartBlockLine = document.createElement("div");
        chartBlockLine.classList.add("chart-block-line");
        var numberLarge = document.createElement("div");
        numberLarge.classList.add("number-large");
        numberLarge.textContent = formatNumber(tokenUsage);
        var numberSmall = document.createElement("div");
        numberSmall.classList.add("number-small");
        if (chartDays[index + 1]) {
            if (tokenUsage - tokenUsageLastDay > 0) {
                numberSmall.classList.add("red");
                numberSmall.textContent = `+${((tokenUsage - tokenUsageLastDay) / tokenUsageLastDay * 100).toFixed(2)}%`;
            }
            else if (tokenUsage - tokenUsageLastDay == 0) {
                numberSmall.classList.add("green");
                numberSmall.textContent = `+0.00%`;
            }
            else {
                numberSmall.classList.add("green");
                numberSmall.textContent = `${((tokenUsage - tokenUsageLastDay) / tokenUsageLastDay * 100).toFixed(2)}%`;
            };
        }
        chartBlockLine.appendChild(numberLarge);
        chartBlockLine.appendChild(numberSmall);
        var chartBlockDate = document.createElement("div");
        chartBlockDate.classList.add("chart-block-date");
        chartBlockDate.textContent = day.date;
        chartBlock.appendChild(chartBlockLine);
        chartBlock.appendChild(chartBlockDate);
        tokensChart.insertBefore(chartBlock,tokensChart.firstChild);
        chartBlock.addEventListener("click", (e) => {
            if (e.currentTarget.classList.contains("selected")) {
                e.currentTarget.classList.remove("selected");
                AIStatsMode = "total";
                AITotal();
            }
            else {
                tokensChart.querySelectorAll(".chart-block").forEach((b) => b.classList.remove("selected"));
                e.currentTarget.classList.add("selected");
                AIStatsMode = index;
                AISelected();
            }
        })
    })

    document.getElementById("username").textContent = username;

    tasksTotal();
    AITotal();
}

getData();