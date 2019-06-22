// operations of items
let guid = 0;
const CL_COMPLETED = 'completed';
const CL_SELECTED = 'selected';
const CL_EDITING = 'editing';
const TIME_EDITING = 'editing';

let items = [];

function getDigitalID(name, prefix) {
    return parseInt(name.split(prefix)[1]);
}

function update() {
    let items = document.querySelectorAll('.todo-list li');
    let filter = document.querySelector('.filters li a.selected').innerHTML;
    let leftNum = 0;
    let item, i, display;

    for (i = 0; i < items.length; ++i) {
        item = items[i];
        if (!item.classList.contains(CL_COMPLETED)) leftNum++;

        // filters
        display = 'none';
        if (filter === '总览'
            || (filter === '待完成' && !item.classList.contains(CL_COMPLETED))
            || (filter === '已完成' && item.classList.contains(CL_COMPLETED))
        ) {
            display = 'block';
        }
        item.style.display = display;
    }

    let completedNum = items.length - leftNum;
    let count = document.querySelector('.todo-count');
    // count.innerHTML = (leftNum || 'No') + (leftNum > 1 ? ' items' : ' item') + ' left';
    if (leftNum > 0) {
        count.textContent = '加油！今天还有 ' + leftNum + ' 件事情！';
    } else {
        count.textContent = '👏今天是个好日子！';
    }

    let clearCompleted = document.querySelector('.clear-completed');
    clearCompleted.style.visibility = completedNum > 0 ? 'visible' : 'hidden';

    let toggleAll = document.querySelector('.toggle-all');
    toggleAll.style.visibility = items.length > 0 ? 'visible' : 'hidden';
    toggleAll.checked = items.length === completedNum;
}


function initTodo() {
    let todoList = document.querySelector('.todo-list');

    let items = document.querySelectorAll('.todo-list li');
    items.forEach(function (item) {
        item.style.display = 'block';
        console.log(item);


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
                    $.ajax({
                        url: '/todo/event/mod/',
                        type: 'POST',
                        data: {
                            id: parseInt(item.id.split('item')[1]),
                            content: label.textContent,
                            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
                        },
                        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
                    }).success(function (data) {
                        window.datas = data;
                        console.log('data', data);
                    }).fail(function (data) {
                        console.log(data);
                    }).error(function (data) {
                        console.log(data);
                    });
                }
            }, false);

            item.appendChild(edit);
            edit.focus();
        }, false);

        item.querySelector('.toggle').addEventListener('change', function () {
            let item_id = $(this).parents('li')[0].id;
            updateTodo(item_id);
        }, false);

        item.querySelector('.destroy').addEventListener('click', function () {
            let item_id = $(this).parents('li')[0].id;
            removeTodo(item_id);
        }, false);
    });
    update();
}

let timeOutEvent = 0;

function longPress() {
    timeOutEvent = 0;
}

function addTodo(msg) {
    let todoList = document.querySelector('.todo-list');

    let item = document.createElement('li');
    // let id = 'item' + guid++;
    // item.setAttribute('id', id);
    item.innerHTML = [
        '<div class="view">',
        '  <input class="toggle" type="checkbox">',
        '  <label class="todo-label">' + msg + '</label>',
        '  <button class="destroy"></button>',
        '</div>'
    ].join('');

    let label = item.querySelector('.todo-label');

    function editItem(){
        console.log('into edit status');
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
                $.ajax({
                    url: '/todo/event/mod/',
                    type: 'POST',
                    data: {
                        id: parseInt(item.id.split('item')[1]),
                        content: label.textContent,
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

        item.appendChild(edit);
        edit.focus();
    }

    label.addEventListener('dblclick', editItem, false);
    label.addEventListener('touchstart', function (ev) {
        timeOutEvent = setTimeout(editItem, 300);
        ev.preventDefault();
    });

    label.addEventListener('touchmove', function (ev) {
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
    });

    label.addEventListener('touchend', function (ev) {
        clearTimeout(timeOutEvent);
    });


    todoList.insertBefore(item, todoList.firstChild);
    update();
    $.ajax({
        url: '/todo/event/list/',
        type: 'POST',
        data: {
            content: msg,
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
        console.log(data);
    }).error(function (data) {
        console.log(data);
    });

}

function updateTodo(itemId) {
    // let item = document.querySelector('#' + itemId);
    // if (completed) item.classList.add(CL_COMPLETED);
    // else item.classList.remove(CL_COMPLETED);
    let item = $('#' + itemId);
    item.toggleClass(CL_COMPLETED);
    let status = 0;
    if (item.hasClass(CL_COMPLETED)) {
        status = 1;
    }
    update();
    $.ajax({
        url: '/todo/event/mod/',
        type: 'POST',
        data: {
            id: parseInt(itemId.split('item')[1]),
            status: status,
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('data', data);
    }).fail(function (data) {
        console.log(data);
    }).error(function (data) {
        console.log(data);
    });
}

function removeTodo(itemId) {
    let todoList = document.querySelector('.todo-list');
    let item = document.querySelector('#' + itemId);
    todoList.removeChild(item);
    update();
    $.ajax({
        url: '/todo/event/del/',
        type: 'POST',
        data: {
            id: parseInt(itemId.replace('item', '')),
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('del data', data);
    }).fail(function (data) {
        console.log(data);
    }).error(function (data) {
        console.log(data);
    });
}

function clearCompletedTodoList() {
    let todoList = document.querySelector('.todo-list');
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
    let items = document.querySelectorAll('.todo-list li');
    let toggleAll = document.querySelector('.toggle-all');
    let id = [];
    let checked = toggleAll.checked;
    for (let i = 0; i < items.length; ++i) {
        let item = items[i];
        let toggle = item.querySelector('.toggle');
        if (toggle.checked !== checked) {
            toggle.checked = checked;
            if (checked) item.classList.add(CL_COMPLETED);
            else item.classList.remove(CL_COMPLETED);
        }
        id.push(parseInt(item.id.split('item')[1]));
    }
    update();


    $.ajax({
        url: '/todo/event/toggleAll/',
        type: 'POST',
        data: {
            id: id.join('/'),
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('data', data);
    }).fail(function (data) {
        console.log(data);
    }).error(function (data) {
        console.log(data);
    });
}

// operations of charts
function line_init(data) {
    console.log(data, typeof (data));
    let line_option = {
        title: {
            text: '启示录',
            subtext: '今日事，今日毕'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['待完成', 'doing', '已完成']
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
        series: [
            {
                name: '待完成',
                type: 'line',
                smooth: true,
                data: data.todo_data
            },
            {
                name: '已完成',
                type: 'line',
                smooth: true,
                data: data.done_data
            }]
    };
    let boxChart = echarts.init(document.querySelector("#box"));
    boxChart.setOption(line_option);
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

$(function () {
    let times = 0;
    $('body').mouseover(function (e) {
        console.log('mouseover function ');
        times++;
        $.ajax({
            url: '/todo/api/events/year/',
            type: 'GET',
            headers: {'X-CSRFToken': $('[name="csrfmiddlewaretoken"]').value},
        }).success(function (data) {
            window.datas = data;
            console.log('data', data);
            heatmap_init(data.data);
            $(this).unbind(e);
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
            console.log('data', data);
            line_init(data);
            $(this).unbind(e);
        }).fail(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        });
        if (times > 0) {
            $(this).unbind(e);
        }
    });
});


window.onload = function init() {
    let todo_list = document.querySelectorAll('.todo-list li');
    todo_list.forEach(function (value) {
        value.style.display = 'block';
    });
    let newTodo = document.querySelector('.new-todo'); // add todos
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

    let clearCompleted = document.querySelector('.clear-completed');
    clearCompleted.addEventListener('click', function () {
        clearCompletedTodoList();
    }, false);

    let toggleAll = document.querySelector('.toggle-all');
    toggleAll.addEventListener('change', function () {
        toggleAllTodoList();
    }, false);

    let filters = document.querySelectorAll('.filters li a');
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
    let times = document.querySelectorAll('.time input');
    // console.log('times: ', times);
    times.forEach(function (time, ind, pra) {
        function finish() {
            time.classList.remove(TIME_EDITING);
            let start_time = parseInt(time.parentElement.querySelector('.time-text').textContent);
            let url = '/todo/event/' + (time.tagName === '' ? 'list/' : 'mod/');
            let id = time.hasAttribute('id') ? getDigitalID(time.id, 'time') : -1;
            if (time.textContent.length === 0) {
                time.placeholder = "todo";
                if (id !== -1) {
                    url = '/todo/event/del/';
                } else {
                    return;
                }
            }
            $.ajax({
                url: url,
                type: 'POST',
                data: {
                    id: id,
                    content: time.value,
                    start: new Date().setHours(start_time, 0, 0),
                    end: new Date().setHours(start_time + 1, 0, 0),
                    csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
                },
                headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
            }).success(function (data) {
                window.datas = data;
                console.log('data', data);
                time.tagName = 'mod';
                time.id = 'time' + data.id;
            }).fail(function (data) {
                console.log(data);
            }).error(function (data) {
                console.log(data);
            });
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

    initTodo();
    update();
    resizeTimeList();
};

function resizeTimeList() {
    let todo_apps = $('.todo-app');
    if (todo_apps[0].clientWidth < todo_apps[1].clientWidth) {
        $('#date-list-am').collapse('hide');
        $('#date-list-pm').collapse('hide');
    } else {
        $('#date-list-am').collapse('show');
        $('#date-list-am li').css('display', 'block');
        $('#date-list-pm').collapse('show');
        $('#date-list-pm li').css('display', 'block');
    }
}

window.onresize = function () {
    resizeTimeList();
};