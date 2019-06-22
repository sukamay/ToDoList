// let $ = function (sel) {
//     return document.querySelector(sel);
// };
// let $All = function (sel) {
//     return document.querySelectorAll(sel);
// };
let guid = 0;
const CL_COMPLETED = 'completed';
const CL_SELECTED = 'selected';
const CL_EDITING = 'editing';
const TIME_EDITING = 'editing';

let items = [];

function update() {
    let items = $All('.todo-list li');
    let filter = $('.filters li a.selected').innerHTML;
    let leftNum = 0;
    let item, i, display;

    for (i = 0; i < items.length; ++i) {
        item = items[i];
        if (!item.classList.contains(CL_COMPLETED)) leftNum++;

        // filters
        display = 'none';
        if (filter === 'All'
            || (filter === 'Active' && !item.classList.contains(CL_COMPLETED))
            || (filter === 'Completed' && item.classList.contains(CL_COMPLETED))
        ) {
            display = 'block';
        }
        item.style.display = display;
    }

    let completedNum = items.length - leftNum;
    let count = $('.todo-count');
    count.innerHTML = (leftNum || 'No') + (leftNum > 1 ? ' items' : ' item') + ' left';

    let clearCompleted = $('.clear-completed');
    clearCompleted.style.visibility = completedNum > 0 ? 'visible' : 'hidden';

    let toggleAll = $('.toggle-all');
    toggleAll.style.visibility = items.length > 0 ? 'visible' : 'hidden';
    toggleAll.checked = items.length === completedNum;
}

function addTodo(msg) {
    let todoList = $('.todo-list');

    let item = document.createElement('li');
    let id = 'item' + guid++;
    item.setAttribute('id', id);
    item.innerHTML = [
        '<div class="view">',
        '  <input class="toggle" type="checkbox">',
        '  <label class="todo-label">' + msg + '</label>',
        '  <button class="destroy"></button>',
        '</div>'
    ].join('');

    let label = item.querySelector('.todo-label');
    label.addEventListener('dblclick', function () {
        item.classList.add(CL_EDITING);

        let edit = document.createElement('input');
        let finished = false;
        edit.setAttribute('type', 'text');
        edit.setAttribute('class', 'edit');
        edit.setAttribute('value', label.innerHTML);

        function finish() {
            if (finished) return;
            finished = true;
            item.removeChild(edit);
            item.classList.remove(CL_EDITING);

        }

        edit.addEventListener('blur', function () {
            finish();
        }, false);

        edit.addEventListener('keyup', function (ev) {
            if (ev.keyCode === 27) { // Esc
                finish();
            } else if (ev.keyCode === 13) {
                label.innerHTML = this.value;
                finish();
            }
        }, false);

        item.appendChild(edit);
        edit.focus();
    }, false);

    item.querySelector('.toggle').addEventListener('change', function () {
        updateTodo(id, this.checked);
    }, false);

    item.querySelector('.destroy').addEventListener('click', function () {
        removeTodo(id);
    }, false);

    todoList.insertBefore(item, todoList.firstChild);
    update();
}

function updateTodo(itemId, completed) {
    let item = $('#' + itemId);
    if (completed) item.classList.add(CL_COMPLETED);
    else item.classList.remove(CL_COMPLETED);
    update();
}

function removeTodo(itemId) {
    let todoList = $('.todo-list');
    let item = $('#' + itemId);
    todoList.removeChild(item);
    update();
}

function clearCompletedTodoList() {
    let todoList = $('.todo-list');
    let items = todoList.querySelectorAll('li');
    for (let i = items.length - 1; i >= 0; --i) {
        let item = items[i];
        if (item.classList.contains(CL_COMPLETED)) {
            todoList.removeChild(item);
        }
    }
    update();
}

function toggleAllTodoList() {
    let items = $All('.todo-list li');
    let toggleAll = $('.toggle-all');
    let checked = toggleAll.checked;
    for (let i = 0; i < items.length; ++i) {
        let item = items[i];
        let toggle = item.querySelector('.toggle');
        if (toggle.checked !== checked) {
            toggle.checked = checked;
            if (checked) item.classList.add(CL_COMPLETED);
            else item.classList.remove(CL_COMPLETED);
        }
    }
    update();
}

// import * as echarts from "./cal-heatmap.min";

function charts_init() {
    line_init();
    heatmap_init();
    map_init();
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

let option1 = {
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

let map_option = {
    title : {
        text: 'iphone销量',
        subtext: '纯属虚构',
        left: 'center'
    },
    tooltip : {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data:['iphone3','iphone4','iphone5']
    },
    visualMap: {
        min: 0,
        max: 2500,
        left: 'left',
        top: 'bottom',
        text:['高','低'],           // 文本，默认为数值文本
        calculable : true
    },
    toolbox: {
        show: true,
        orient : 'vertical',
        left: 'right',
        top: 'center',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series : [
        {
            name: 'iphone3',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:[
                {name: '北京',value: Math.round(Math.random()*1000)},
                {name: '天津',value: Math.round(Math.random()*1000)},
                {name: '上海',value: Math.round(Math.random()*1000)},
                {name: '重庆',value: Math.round(Math.random()*1000)},
                {name: '河北',value: Math.round(Math.random()*1000)},
                {name: '河南',value: Math.round(Math.random()*1000)},
                {name: '云南',value: Math.round(Math.random()*1000)},
                {name: '辽宁',value: Math.round(Math.random()*1000)},
                {name: '黑龙江',value: Math.round(Math.random()*1000)},
                {name: '湖南',value: Math.round(Math.random()*1000)},
                {name: '安徽',value: Math.round(Math.random()*1000)},
                {name: '山东',value: Math.round(Math.random()*1000)},
                {name: '新疆',value: Math.round(Math.random()*1000)},
                {name: '江苏',value: Math.round(Math.random()*1000)},
                {name: '浙江',value: Math.round(Math.random()*1000)},
                {name: '江西',value: Math.round(Math.random()*1000)},
                {name: '湖北',value: Math.round(Math.random()*1000)},
                {name: '广西',value: Math.round(Math.random()*1000)},
                {name: '甘肃',value: Math.round(Math.random()*1000)},
                {name: '山西',value: Math.round(Math.random()*1000)},
                {name: '内蒙古',value: Math.round(Math.random()*1000)},
                {name: '陕西',value: Math.round(Math.random()*1000)},
                {name: '吉林',value: Math.round(Math.random()*1000)},
                {name: '福建',value: Math.round(Math.random()*1000)},
                {name: '贵州',value: Math.round(Math.random()*1000)},
                {name: '广东',value: Math.round(Math.random()*1000)},
                {name: '青海',value: Math.round(Math.random()*1000)},
                {name: '西藏',value: Math.round(Math.random()*1000)},
                {name: '四川',value: Math.round(Math.random()*1000)},
                {name: '宁夏',value: Math.round(Math.random()*1000)},
                {name: '海南',value: Math.round(Math.random()*1000)},
                {name: '台湾',value: Math.round(Math.random()*1000)},
                {name: '香港',value: Math.round(Math.random()*1000)},
                {name: '澳门',value: Math.round(Math.random()*1000)}
            ]
        },
        {
            name: 'iphone4',
            type: 'map',
            mapType: 'china',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:[
                {name: '北京',value: Math.round(Math.random()*1000)},
                {name: '天津',value: Math.round(Math.random()*1000)},
                {name: '上海',value: Math.round(Math.random()*1000)},
                {name: '重庆',value: Math.round(Math.random()*1000)},
                {name: '河北',value: Math.round(Math.random()*1000)},
                {name: '安徽',value: Math.round(Math.random()*1000)},
                {name: '新疆',value: Math.round(Math.random()*1000)},
                {name: '浙江',value: Math.round(Math.random()*1000)},
                {name: '江西',value: Math.round(Math.random()*1000)},
                {name: '山西',value: Math.round(Math.random()*1000)},
                {name: '内蒙古',value: Math.round(Math.random()*1000)},
                {name: '吉林',value: Math.round(Math.random()*1000)},
                {name: '福建',value: Math.round(Math.random()*1000)},
                {name: '广东',value: Math.round(Math.random()*1000)},
                {name: '西藏',value: Math.round(Math.random()*1000)},
                {name: '四川',value: Math.round(Math.random()*1000)},
                {name: '宁夏',value: Math.round(Math.random()*1000)},
                {name: '香港',value: Math.round(Math.random()*1000)},
                {name: '澳门',value: Math.round(Math.random()*1000)}
            ]
        },
        {
            name: 'iphone5',
            type: 'map',
            mapType: 'china',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:[
                {name: '北京',value: Math.round(Math.random()*1000)},
                {name: '天津',value: Math.round(Math.random()*1000)},
                {name: '上海',value: Math.round(Math.random()*1000)},
                {name: '广东',value: Math.round(Math.random()*1000)},
                {name: '台湾',value: Math.round(Math.random()*1000)},
                {name: '香港',value: Math.round(Math.random()*1000)},
                {name: '澳门',value: Math.round(Math.random()*1000)}
            ]
        }
    ]
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
    // let datas = [
    //     {date: 1559179698240, value: 15},
    //     {date: 1559179698, value: 25},
    //     {date: 1559642774.806, value: 10}
    // ];
    // let datas = document.getElementById('heatmap_data').textContent;
    let parser = function(data){
        let stats = {};
        for( let d in data){
            stats[data[d].date] = data[d].value;
        }
        return stats;
    };

    let heatmap_option = {
        itemSelector: "#cal-heatmap",
        itemName: ["business"],
        domain: "week",
        subDomain: "day",
        start: date,
        tooltip: true,
        domainLabelFormat: function (e) {
            return 1 <= e.getDate() && e.getDate() <= 7 ? e.getMonth() + 1 : ""
        },
        subDomainTitleFormat: {
            empty: "CN" === '' ? "无{date}的记录" : "Take a relax on {date}",
            filled: "CN" === '' ? "{date}，{count}个记录" : "{count} business be ran {connector} {date}"
        },
        subDomainDateFormat: function (e) {
            return e.toDateString().split(" ").slice(1)
        },
        range: 53,
        domainGutter: 0,
        legend: [10, 20, 30, 40],
        highlight: ["now"],
        legendHorizontalPosition: "right",
        legendVerticalPosition: "top",
        data: window.datas,
        afterLoadData: parser
    };
    cal.init(heatmap_option);
}

function map_init(){
    $('#map').style.width = window.getComputedStyle($('.done-panel'), null).width;
    $('#map').style.height = window.getComputedStyle($('.done-panel'), null).height;
    let chart = echarts.init(document.getElementById('map'), 'light');
    chart.setOption(map_option);
}



window.onload = function init() {
    let newTodo = $('.new-todo'); // add todos
    newTodo.addEventListener('keyup', function (ev) {
        // Enter
        if (ev.keyCode !== 13) return;

        let msg = newTodo.value;
        if (msg === '') {
            console.warn('msg is empty');
            return;
        }

        addTodo(msg);
        newTodo.value = '';
    }, false);

    let clearCompleted = $('.clear-completed');
    clearCompleted.addEventListener('click', function () {
        clearCompletedTodoList();
    }, false);

    let toggleAll = $('.toggle-all');
    toggleAll.addEventListener('change', function () {
        toggleAllTodoList();
    }, false);

    let filters = $All('.filters li a');
    for (let i = 0; i < filters.length; ++i) {
        (function (filter) {
            filter.addEventListener('click', function () {
                for (let j = 0; j < filters.length; ++j) {
                    filters[j].classList.remove(CL_SELECTED);
                }
                filter.classList.add(CL_SELECTED);
                update();
            }, false);
        })(filters[i])
    }
    let times = $All('.time input');
    // console.log('times: ', times);
    times.forEach(function (time, ind, pra) {
        function finish() {
            if (time.textContent.length === 0) {
                time.placeholder = "todo";
            }
            time.classList.remove(TIME_EDITING);
        }

        time.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                if (ind + 1 < pra.length) {
                    console.log(pra[ind + 1]);
                    pra[ind + 1].focus();
                    pra[ind + 1].classList.add(TIME_EDITING);
                }
                finish();
            }
        }, false);
        time.addEventListener('blur', function () {
            finish();
        }, false);
        time.addEventListener('mouseover', function () {
            time.classList.add(TIME_EDITING);
        }, false);
        time.addEventListener('mouseout', function () {
            finish();
        })
    });

    update();
      $.ajax({
        url: '/todo/api/events/year/',
        type: 'GET',
        headers: {'X-CSRFToken': $('[name="csrfmiddlewaretoken"]').value},
        success: function (data) {
            window.datas = data;
        }
    });

    charts_init();
    // let boxChart = init($("#box"));
    // boxChart.setOption(option1);
};



