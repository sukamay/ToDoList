// import * as echarts from "./cal-heatmap.min";

export function init() {
    line_init();
    heatmap_init();
}

let option = {
    title: {
        text: 'what you have done the last week'
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        lineStyle: {
            color: 'blue'
        }
    },
    yAxis: {
        type: 'value',
        lineStyle: {
            color: 'blue'
        }
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        color: ['blue'],
        smooth: true,
    },
        {
            name: '注册人数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 4,
            color: ['blue'],
            itemStyle: {
                normal: {
                    color: 'blue',
                    borderColor: 'blue'
                }
            },
            data: [300, 232, 201, 154, 190, 330, 410, 150, 232, 201, 154, 190, 330, 410],
            smooth: true
        }]
};

export let option1 = {
    title: {
        text: 'what you do',
        subtext: 'fighting'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['todo', 'doing', 'did']
    },
    toolbox: {
        show: true,
        feature: {
            magicType: {show: true, type: ['stack', 'tiled']},
            saveAsImage: {show: true}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        name: 'todo',
        type: 'line',
        smooth: true,
        data: [10, 12, 21, 54, 260, 830, 710]
    },
        {
            name: 'doing',
            type: 'line',
            smooth: true,
            data: [30, 182, 434, 791, 390, 30, 10]
        },
        {
            name: 'did',
            type: 'line',
            smooth: true,
            data: [1320, 1132, 601, 234, 120, 90, 20]
        }]
};

function line_init() {
    let boxChart = echarts.init($("#box"));
    boxChart.setOption(option1);
}

function heatmap_init() {

    let cal = new CalHeatMap();
    let date = new Date;
    date.setDate(date.getDate() - 364);
    date.setHours(0, 0, 0, 0);
    let heatmap_option = {
        itemSelector: "#cal-heatmap",
        itemName: ["submission"],
        domain: "week",
        subDomain: "day",
        start: date,
        tooltip: !0,
        domainLabelFormat: function (e) {
            return 1 <= e.getDate() && e.getDate() <= 7 ? e.getMonth() + 1 : ""
        },
        subDomainTitleFormat: {
            empty: "CN" === '0' ? "无{date}的提交记录" : "No submissions on {date}",
            filled: "CN" === '0' ? "{date}，{count}个提交记录" : "{count} {name} {connector} {date}"
        },
        subDomainDateFormat: function (e) {
            return e.toDateString().split(" ").slice(1)
        },
        range: 53,
        domainGutter: 0,
        legend: [10, 20, 30, 40],
        highlight: ["now"],
        legendHorizontalPosition: "right",
        legendVerticalPosition: "top"
    };
    cal.init(heatmap_option);
}
