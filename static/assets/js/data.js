const username = "Иван";
const sprints = [
    {date: "2.02", tasks_total: 93, tasks_completed: 71, bugs: 18, returned_bugs: 3, releases: 2, ai_cost_total: 2150, ai_cost_per_task: 28},
    {date: "14.02", tasks_total: 61, tasks_completed: 48, bugs: 27, returned_bugs: 6, releases: 4, ai_cost_total: 1980, ai_cost_per_task: 41},
    {date: "3.03", tasks_total: 34, tasks_completed: 29, bugs: 11, returned_bugs: 2, releases: 1, ai_cost_total: 2630, ai_cost_per_task: 55},
    {date: "19.03", tasks_total: 52, tasks_completed: 38, bugs: 35, returned_bugs: 9, releases: 3, ai_cost_total: 2290, ai_cost_per_task: 37},
    {date: "1.04", tasks_total: 44, tasks_completed: 31, bugs: 22, returned_bugs: 5, releases: 2, ai_cost_total: 1870, ai_cost_per_task: 24},
    {date: "15.04", tasks_total: 78, tasks_completed: 55, bugs: 39, returned_bugs: 11, releases: 5, ai_cost_total: 2810, ai_cost_per_task: 48},
    {date: "2.05", tasks_total: 49, tasks_completed: 42, bugs: 14, returned_bugs: 4, releases: 2, ai_cost_total: 2340, ai_cost_per_task: 61},
    {date: "18.05", tasks_total: 66, tasks_completed: 53, bugs: 30, returned_bugs: 7, releases: 3, ai_cost_total: 2560, ai_cost_per_task: 44},
];
const ai_usage_days = [
    {date: "19.05", per_person: 8.20, usage: [
        {tokens: 153000, cost: 28.50},
        {tokens: 71000, cost: 37.00},
        {tokens: 94000, cost: 15.00}
    ]},
    {date: "20.05", per_person: 11.30, usage: [
        {tokens: 108000, cost: 41.00},
        {tokens: 59000, cost: 19.50},
        {tokens: 82000, cost: 22.00}
    ]},
    {date: "21.05", per_person: 7.80, usage: [
        {tokens: 131000, cost: 35.00},
        {tokens: 74000, cost: 58.00},
        {tokens: 97000, cost: 9.50}
    ]},
    {date: "22.05", per_person: 12.60, usage: [
        {tokens: 162000, cost: 29.00},
        {tokens: 63000, cost: 11.00},
        {tokens: 88000, cost: 17.50}
    ]},
    {date: "23.05", per_person: 9.10, usage: [
        {tokens: 115000, cost: 38.00},
        {tokens: 78000, cost: 47.50},
        {tokens: 101000, cost: 14.00}
    ]},
    {date: "24.05", per_person: 10.40, usage: [
        {tokens: 127000, cost: 33.00},
        {tokens: 55000, cost: 21.00},
        {tokens: 86000, cost: 26.50}
    ]},
    {date: "25.05", per_person: 8.90, usage: [
        {tokens: 144000, cost: 30.50},
        {tokens: 69000, cost: 16.00},
        {tokens: 93000, cost: 39.00}
    ]},
    {date: "26.05", per_person: 13.70, usage: [
        {tokens: 178000, cost: 44.00},
        {tokens: 61000, cost: 18.50},
        {tokens: 91000, cost: 11.00}
    ]}
];
const ai_models = [
    {name: "GPT-5.3"}, 
    {name: "Gemini 3 Pro"}, 
    {name: "Claude Opus 4.7"}
];