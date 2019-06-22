let storage = window.localStorage;
let items = [];
let timeOutEvent = 0;
let filter = 'All';
let item_num = 0;

function addTodo() {
    let add_todo = document.querySelector('#add-todo');
    let content = add_todo.value;
    if(typeof(content) === 'undefined' || content.length === 0 || content === ''){
        console.log('value is empty');
        return;
    }
    let priority = 0;
    if(content.endsWith('!')){
        for(let i = content.length - 1; i >= 0; i--){
            if(content[i] === '!'){
                priority++;
            }
        }
    }
    priority = Math.min(priority, 4);
    let item = {};
    item.id = 'item' + item_num;
    item_num++;
    storage.setItem('item_num', item_num);
    item.content = content;
    item.completed = false;
    item.priority = priority;
    items.push(item);
    update();
    add_todo.value= '';
      $.ajax({
        url: '/todo/event/list/',
        type: 'POST',
        data: {
            content: content,
            priority: priority,
            start: new Date().getTime() / 1000,
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('data', data);
        item.id = 'item' + data.id;
        item.querySelector('.toggle').addEventListener('change', function () {
            updateTodo(item.id, this.checked);
        }, false);

        item.querySelector('.destroy').addEventListener('click', function () {
            removeTodo(item.id);
        }, false);
    }).fail(function (data) {
        console.log('fail to add data', data);
    }).error(function (data) {
        console.log(data);
    });
}

function delTodo() {

}

function modTodo() {

}

function toggleAll() {
    for(let i in items){
        let item = items[i];
        item.completed = !item.completed;
    }
    update();
}

function clearAll() {
    items = [];
    storage.clear();
    update();
}

function clearCompleted() {
    let new_items = [];
    for(let i in items){
        let item = items[i];
        if(!item.completed){
            new_items.push(item);
        }
    }
    items = new_items;
    update();
}

function update(){
    let html_content = '';
    let item_count = 0;
    for(let i in items){
        let item = items[i];
        if(item.completed && filter === 'Todo'){
            continue;
        }else if(!item.completed && filter === 'Did'){
            continue;
        }
        if(!item.completed){
            item_count++;
        }
        html_content += '  <li id="' +  item.id + '"class="' + (item.completed ? 'completed': '') +  '">\n' +
            '                <input type="checkbox"' +  (item.completed ? 'checked': '') + '>\n' +
            '                <input type="text" value="' + item.content +
            '" readonly>\n' +
            '                <button class="destroy"></button>\n' +
            '            </li>';
    }
    document.querySelector('.todo-list').innerHTML = html_content;
    document.querySelectorAll('.todo-list li input[type="checkbox"]').forEach(function (value, key, parent) {
        value.addEventListener('touchstart', function (ev) {
            if(!this.checked){
                this.parentElement.classList.add('completed');
                this.checked = true;
            }else{
                this.parentElement.classList.remove('completed');
                this.checked = false;
            }
            let item = items[key];
            item.completed = !item.completed;
            update();
            ev.preventDefault();
        });
    });
    document.querySelectorAll('.todo-list li input[type="text"]').forEach(function (value, key, parent) {
        let item = items[key];
        function editItem(){
            console.log('into edit');
            value.focus();
            value.readOnly = false;
        }
        value.addEventListener('keyup', function (ev) {
            if(ev.keyCode === 13){
                item.content = value.value;
                value.readOnly = true;
                value.blur();
                update();
                   $.ajax({
                    url: '/todo/event/mod/',
                    type: 'POST',
                    data: {
                        id: parseInt(value.parentElement.id.split('item')[1]),
                        content: value.value,
                        csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
                    },
                    headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
                }).success(function (data) {
                    window.datas = data;
                }).fail(function (data) {
                    console.log(data);
                }).error(function (data) {
                    console.log(data);
                });
            }
        }, false);
        value.addEventListener('touchstart', function (ev) {
            timeOutEvent = setTimeout(editItem, 300);
            ev.preventDefault();
        }, false);
        value.addEventListener('touchmove', function (ev) {
            clearTimeout(timeOutEvent);
            timeOutEvent = 0;
        }, false);
        value.addEventListener('touchend', function (ev) {
            clearTimeout(timeOutEvent);
        }, false);
    });
    document.querySelectorAll('.todo-list li button').forEach(function (value, key) {
       let sx, sy, ex, ey, swipe_x, swipe_y;
        value.addEventListener('touchstart', function (ev) {
           sx = ev.changedTouches[0].pageX;
           sy = ev.changedTouches[0].pageY;
           swipe_x = true;
           swipe_y = true;
           if(this.classList.contains('swipe-left')){
               console.log('into swipe-left touch start');
               let conf = confirm('Are you sure to delete this event?');
               if(conf){
                   // remove the item
                   items.splice(key, 1);
                   update();
               }
           }
           ev.preventDefault();
       }, false);
        value.addEventListener('touchmove', function (ev) {
            ex = ev.changedTouches[0].pageX;
            ey = ev.changedTouches[0].pageY;
            if(swipe_x && Math.abs(ex - sx) - Math.abs(ey - sy) > 0){
                ev.stopPropagation();
                if(ex - sx > 10){
                    ev.preventDefault();
                    this.classList.remove('swipe-left');
                }
                if(sx - ex > 10){
                    ev.preventDefault();
                    this.classList.add('swipe-left');
                }
                swipe_y = false;
            }
        }, false);
    });
    document.querySelector('.todo-sum').textContent =
        (item_count > 0 ? item_count + '': 'no') +
        (item_count > 1 ? ' items ' : ' item ' ) + 'left';
    if(item_count < items.length){
        document.querySelector('#clear-completed').style.visibility = 'visible';
    }else{
        document.querySelector('#clear-completed').style.visibility = 'hidden';
    }
    let store_items = Object.assign([], items);
    for(let i in store_items){
        let store_item = store_items[i];
        store_item = JSON.stringify(store_item);
        store_items[i] = store_item;
    }
    storage.setItem('items', store_items.join('/'));
}

function heatmap_init(data) {

    let cal = new CalHeatMap();
    let date = new Date;
    date.setDate(date.getDate() - 364);
    date.setHours(0, 0, 0, 0);
    // let datas = [{date: 1559179698, value: 25},];
    let parser = function (data) {
        let stats = {};
        for (let d in data) {
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
        legend: [3, 5, 10, 15],
        highlight: ["now"],
        legendHorizontalPosition: "right",
        legendVerticalPosition: "top",
        data: data,
        afterLoadData: parser
    };
    cal.init(heatmap_option);
}


// operations of charts
function line_init(data) {
    console.log(data, typeof (data));
    let line_option = {
        title: {
            text: 'Event Billboard',
            subtext: 'Everyone achieve high but at her own pace.'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Todo', 'Did']
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
            data: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Todo',
                type: 'line',
                smooth: true,
                data: data.todo_data
            },
            {
                name: 'Did',
                type: 'line',
                smooth: true,
                data: data.done_data
            }]
    };
    window.boxChart = echarts.init(document.querySelector("#box"));
    window.boxChart.setOption(line_option);
    window.onresize = window.boxChart.resize;
}


window.onload = function () {
    item_num = storage.getItem('item_num');
    if(item_num === null){
        item_num = 0;
    }
    items = storage.getItem('items');
    if(items == null){
        items = [];
    }else{
        let store_items = items.split('/');
        items = [];
        for(let i in store_items){
            let store_item = store_items[i];
            items.push(JSON.parse(store_item));
        }
    }
    update();
    document.querySelector('#add-todo').addEventListener('keyup', function (ev) {
        if(ev.keyCode === 13){
            addTodo();
        }
    }, false);
    document.querySelector('#clear-all').addEventListener('touchstart', function (ev) {
        clearAll();
        ev.preventDefault();
    }, false);
    document.querySelector('#clear-completed').addEventListener('touchstart', function (ev) {
        clearCompleted();
        ev.preventDefault();
    }, false);
    document.querySelector('.toggle-all').addEventListener('touchstart', function (ev) {
        toggleAll();
    }, false);
    document.querySelectorAll('.todo-filter ul li').forEach(function (value) {
        value.addEventListener('touchstart', function (ev) {
            filter = value.textContent;
            document.querySelectorAll('.todo-filter ul li').forEach(function (value) {
                value.classList.remove('filter-selected');
            });
            value.classList.add('filter-selected');
            update();
        }, false);
    });
         $.ajax({
            url: '/todo/api/events/year/',
            type: 'GET',
            headers: {'X-CSRFToken': $('[name="csrfmiddlewaretoken"]').value},
        }).success(function (data) {
            window.datas = data;
            console.log('cal heat map data', data);
            heatmap_init(data.data);
        }).fail(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        });
            $.ajax({
            url: '/todo/api/events/weekSum/',
            type: 'GET',
            headers: {'X-CSRFToken': $('[name="csrfmiddlewaretoken"]').value},
        }).success(function (data) {
            window.datas = data;
            console.log('line data', data);
            line_init(data);
        }).fail(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        });
            monthCalInit();
};

function monthCalInit() {
    let cur = new Date();
    let cur_year = cur.getFullYear();
        let container = document.createElement("div");
        container.classList.add("calendar");
        container.innerHTML = " <div class=\"header\">\n" +
            "            <div class=\"text\" data-render=\"month-year\"></div>\n" +
            "        </div>\n" +
            "        <div class=\"months\" data-flow=\"left\">\n" +
            "            <div class=\"month month-a\">\n" +
            "                <div class=\"render render-a\"></div>\n" +
            "            </div>\n" +
            "            <div class=\"month month-b\">\n" +
            "                <div class=\"render render-b\"></div>\n" +
            "            </div>\n" +
            "        </div>";
        let t = new Calendar({
            RenderID: ".render-a",
            Format: "M",
            DaysOfWeek: ['日','一','二','三','四','五','六'],
            // Months: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','一月','十二月']
        }, cur, container);
        document.getElementById("calendar-panel").appendChild(t.getContainer());
        t.showCurrent();
        t.checkActive();



    let e = document.querySelectorAll(".header [data-action]");
    for (let i = 0; i < e.length; i++) e[i].onclick = function () {
        if (document.querySelector(".calendar .header").setAttribute("class", "header"), "true" == document.querySelector(".months").getAttribute("data-loading")) return document.querySelector(".calendar .header").setAttribute("class", "header active"), !1;
        let e;
        document.querySelector(".months").setAttribute("data-loading", "true"),
            this.getAttribute("data-action").includes("prev") ? (t.prevMonth(), e = "left") : (t.nextMonth(), e = "right"), t.checkActive(), document.querySelector(".months").setAttribute("data-flow", e), document.querySelector('.month[data-active="true"]').addEventListener("webkitTransitionEnd", function () {
            document.querySelector(".months").removeAttribute("data-loading")
        }), document.querySelector('.month[data-active="true"]').addEventListener("transitionend", function () {
            document.querySelector(".months").removeAttribute("data-loading")
        })
    }
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let prev_month = month - 1;
    let prev_year = year;
    if (prev_month < 1) {
        prev_month = 12;
        prev_year = year - 1;
    }
    if (month === 12) {
        month = 1;
        year += 1;
    } else {
        month += 1;
    }
    $.ajax({
        url: '/todo/api/events/month/',
        type: 'GET',
        data: {
            min_date: [prev_year, prev_month, 1].join('-'),
            max_date: [year, month, 1].join('-'),
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('month data', data);
        initYearCal();
    }).fail(function (data) {
        console.log('ajax fail: ', data);
    }).error(function (data) {
        console.log('ajax error:', data);
    });

}


function initYearCal() {
    let month = new Date().getMonth();
    let cells = document.querySelector(' [data-month="'+month+'"]');
    console.log(cells);
    let data_group = {};
    for(let i = 0; i < window.datas.length; i++){
        let data = window.datas[i];
        let day = data.start.slice(8,10);
        if(typeof(data_group[day]) == 'undefined'){
            data_group[day] = [data];
        }else{
            data_group[day].push(data);
        }
    }
    for(let key in data_group){
        let cell = cells.querySelector('[title="' + key + '"] span');
        if(cell) {
            cell.classList.add('has-todo');
        }
    }
    document.querySelectorAll('.has-todo').forEach(function (value, key, parent) {
        value.addEventListener('mouseover', function () {
            let tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.parentNode.removeChild(tooltip);
            }
            tooltip = document.createElement('div');
            let day = this.innerText;
            let items = data_group[day];
            if(typeof(items) == 'undefined' ){
                return false;
            }
            tooltip.id = 'tooltip';
            tooltip.classList.add('tooltip');
            tooltip.style.display = 'block';
            tooltip.style.top = (-73 - 32 * items.length) + 'px';
            let html_content = '<span class="tooltip-span">2019年6月' + day + '日</span><span class="tooltip-span">共有'+ items.length + '件事情</span>'
            + '<ul class="events">';
            for(let j = 0; j < items.length; j++){
                let item = items[j];
                html_content += '<li><span class="little-head q' + item.priority +
                    '"></span><span>' + item.content + '</span></li>';
            }
            html_content += '</ul>';
            tooltip.innerHTML = html_content;
            $(this).parent().append(tooltip);
        });
        value.addEventListener('mouseout', function () {
            let tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    });
    window.data_group = data_group;
}

