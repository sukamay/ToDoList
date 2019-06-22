// let data = [
//     {startDate: "2018-6-10", content: "事件1"},
//     {startDate: "2018-7-10", content: "事件1"},
//     {startDate: "2018-8-10", content: "事件1"},
//     {startDate: "2018-9-10", content: "事件1"},
//     {startDate: "2018-10-10", content: "事件1"},
//     {startDate: "2018-11-1", content: "事件2"},
//     {startDate: "2018-11-1", content: "事件11"},
//     {startDate: "2018-12-1", content: "事件12"},
//     {startDate: "2018-12-1", content: "事件13"},
//     {startDate: "2018-12-1", content: "事14"},
//     {startDate: "2019-1-10", content: "事件14"},
//     {startDate: "2019-2-10", content: "事件14"},
//     {startDate: "2019-3-10", content: "事件14"},
//     {startDate: "2019-4-10", content: "事件14"},
//     {startDate: "2019-5-10", content: "事件14"},
//     {startDate: "2019-6-10", content: "事件14"},
//     {startDate: "2019-7-10", content: "事件14"},
//     {startDate: "2019-8-10", content: "事件14"},
//     {startDate: "2019-9-10", content: "事件14"},
//     {startDate: "2019-10-10", content: "事件14"},
//     {startDate: "2019-11-10", content: "事件14"},
//     {startDate: "2019-12-10", content: "事件14"},
//     {startDate: "2020-1-10", content: "事件14"},
//     {startDate: "2020-2-10", content: "事件14"},
// ];

window.onload = function () {
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
        initCal();
    }).fail(function (data) {
        console.log('ajax fail: ', data);
    }).error(function (data) {
        console.log('ajax error:', data);
    });
};

const priority = ['不急', '一般', '稍急', '紧急'];
const repeat = ['无', '每日', '每周', '每月', '每年'];
const TOOL_EDIT = 'edit';

function addEvent(e) {

    let selected_cell = $('.selected-day .events');
    if (!selected_cell) {
        return false;
    }
    let tooltip = $('.add-tooltip');
    let start = $('.start-time .content span').text();
    start = start.slice(0,9) + '/' + start.slice(9,11) + '/' + start.slice(11,13);
    let end = $('.end-time .content span').text();
    end = end.slice(0,9) + '/' + end.slice(9,11) + '/' + end.slice(11,13);
    let item_priority = priority.indexOf($('.priority .dropdown-toggle').text());
    let content = tooltip.children('.name input').value;
    if(!content || content.length === 0 || content.replace(' ','')){
        let warn = document.createElement('span');
        warn.classList.add('warn');
        warn.classList.add('alert-warning');
        warn.innerText = '请输入待办事项';
        tooltip.prepend(warn);
        return false;
    }
    let item_repeat = repeat.indexOf($('.repeat .dropdown-toggle').text());
    // todo: add item
    let item = document.createElement('li');
    item.innerHTML = '<span class="little-head q' + item_priority +
        '"></span><span>' + content + '</span>';
    // todo: send ajax
    $.ajax({
        url: '/todo/event/list/',
        type: 'POST',
        data: {
            content: content,
            start: start,
            end: end,
            priority: item_priority,
            repeat: item_repeat,
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        console.log('data', data);
        item.id = 'item' + data.id;
    }).fail(function (data) {
        console.log(data);
    }).error(function (data) {
        console.log(data);
    });
    tooltip.parent().remove(tooltip);
    selected_cell.append(item);
}

function initCal() {

    $("#calendar").calendar({
            data: window.datas,
            mode: "month",
            //  maxEvent: 3,
            //showModeBtn: false
            //  newDate: "2018-04-1",
            cellClick: function (events) {
                //viewCell的事件列表
                // console.log(events);
                console.log('cell click', this);
                $('.calendar-date').removeClass('selected-day');
                $(this).children('.calendar-date').addClass('selected-day');
                // this.classList.add('selected');
            },
            // todo: add double click event of cell
            cellDblClick: function (events) {
                let tooltip = document.createElement('div');
                tooltip.classList.add('cal-tooltip');
                tooltip.style.display = 'block';

            },
            addClick: function (e) {
                let tooltip = document.createElement('div');
                tooltip.classList.add('add-tooltip');
                let pra = document.querySelector('.selected-day');
                let date;
                if (!pra) {
                    pra = document.querySelector('.calendar-today');
                    date = new Date().toLocaleDateString();
                } else {
                    date = pra.parentNode.title;
                }
                let html_content = ' <span class="name header"><input type="text" placeholder="待办事项" required'
                    + '></span> <table class="' + TOOL_EDIT + '">\n' +
                    '        <tr class="start-time">\n' +
                    '            <th class="header ">开始时间</th>\n' +
                    '            <th class="content"><span>' + date +
                    '</span><div class="hour dropdown">\n' +
                    '                  <span class="dropdown-toggle" data-toggle="dropdown">' + '00' +
                    '<span class="caret"></span></span>\n' +
                    '                <ul class="dropdown-menu">\n';
                for (let i = 0; i < 61; i++) {
                    html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                }
                html_content += '                </ul>\n' +
                    '            </div>\n' +
                    '                <div class="minute dropdown">\n' +
                    '                  <span class="dropdown-toggle" data-toggle="dropdown">' + '00'
                    + '<span class="caret"></span></span>\n' +
                    '                <ul class="dropdown-menu">\n';
                for (let i = 0; i < 61; i++) {
                    html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                }
                html_content +=
                    '                </ul>\n' +
                    '            </div>\n' +
                    '            </th>\n' +
                    '        </tr>\n' +
                    '        <tr class="end-time">\n' +
                    '            <th class="header">结束时间</th>\n' +
                    '            <th class="content"><span>' + date +
                    '</span><div class="hour dropdown">\n' +
                    '                <span class="dropdown-toggle" data-toggle="dropdown">' + '00' +
                    '<span class="caret"></span></span>\n' +
                    '                <ul class="dropdown-menu">\n';
                for (let i = 0; i < 61; i++) {
                    html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                }
                html_content +=
                    '                </ul>\n' +
                    '            </div>\n' +
                    '                <div class="minute dropdown">\n' +
                    ' <span class="dropdown-toggle" data-toggle="dropdown">' + '00' +
                    '<span class="caret"></span></span>\n' +
                    '                    <ul class="dropdown-menu">\n';
                 for (let i = 0; i < 61; i++) {
                    html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                }

                html_content +=
                    '                    </ul>\n' +
                    '                </div></th>\n' +
                    '        </tr>\n' +
                    '        <tr class="priority">\n' +
                    '            <th class="header">优先级</th>\n' +
                    '            <th class="content">\n' +
                    '                <div class="minute dropdown">\n' +
                    '<span class="dropdown-toggle" data-toggle="dropdown">' + '不急' +
                    '<span class="caret"></span></span>\n' +
                    '                    <ul class="dropdown-menu">\n' +
                    '                        <li>紧急</li>\n' +
                    '                        <li>稍急</li>\n' +
                    '                        <li>一般</li>\n' +
                    '                        <li>不急</li>\n' +
                    '                    </ul>\n' +
                    '                </div>\n' +
                    '            </th>\n' +
                    '        </tr>\n' +
                    '        <tr class="repeat">\n' +
                    '            <th class="header">重复</th>\n' +
                    '            <th class="content">\n' +
                    '                <div class="dropdown">\n' +
                    '\n' +
                    '                <span class="dropdown-toggle" data-toggle="dropdown">' + '无' +
                    '<span class="caret"></span></span>\n' +
                    '                <ul class="dropdown-menu">\n' +
                    '                    <li>无</li>\n' +
                    '                    <li>每日</li>\n' +
                    '                    <li>每周</li>\n' +
                    '                    <li>每月</li>\n' +
                    '                    <li>每年</li>\n' +
                    '                </ul>\n' +
                    '                </div>\n' +
                    '            </th>\n' +
                    '        </tr>\n' +
                    '    </table><input type="button" onclick="addEvent(this)" value="提交" required>';
                tooltip.innerHTML = html_content;
                tooltip.style.display = 'block';
                pra.appendChild(tooltip);
                         $('.dropdown-toggle').each(function (i, val, pra) {
                        val.addEventListener('click', function () {

                            let val = $(this).parents('.dropdown').children('.dropdown-menu');
                            let open = false;
                            if (val) {
                                if (val.hasClass('open') === false) {
                                    open = true;
                                }
                                $('.dropdown .dropdown-menu').removeClass('open');
                                if (open) {
                                    val.addClass('open');
                                }
                            }
                        }, false);
                    }, false);
                    $('.dropdown-menu li').each(function (i, val) {
                        val.addEventListener('click', function () {
                            window.editedTooltip = true;
                            let pra = $(this).parents('tr');
                            if (pra.hasClass('end-time')) {
                                let start_time = $('.start-time .content .dropdown-toggle').text();
                                let end_time = $('.end-time .content .dropdown-toggle').text();
                                if (end_time < start_time) {
                                    alert('结束时间应大于等于开始时间！');
                                    return false;
                                }
                            }
                            $(this).parents('.dropdown').children('.dropdown-toggle').text($(this).text());
                            $(this).parent().removeClass('open');
                            if (pra.hasClass('start-time')) {
                                data.start = data.start.slice(0, 10) + '/' + $('.start-time .hour .dropdown-toggle').text()
                                    + '/' + $('.start-time .minute .dropdown-toggle').text();
                            } else if (pra.hasClass('end-time')) {
                                data.start = data.end.slice(0, 10) + '/' + $('.end-time .hour .dropdown-toggle').text()
                                    + '/' + $('.end-time .minute .dropdown-toggle').text();
                            } else if (pra.hasClass('priority')) {
                                data.priority = $(this).parent().children('li').index($(this));
                            } else if (pra.hasClass('repeat')) {
                                data.repeat = $(this).parent().children('li').index($(this));
                            }
                        })
                    }, false);


            },
            eventsClick: function (e) {

                // todo: add keyup event
                let event = this;
                console.log('event', this);
                window.editedTooltip = false;

                let tooltip = document.querySelector('.cal-tooltip');
                if (tooltip) {
                    tooltip.parentNode.removeChild(tooltip);
                }

                function eventsKeyup(e) {
                    if (e.keyCode === 46 && window.editedTooltip === true) {
                        let con = confirm('确认删除该事件？');
                        if (con === true) {
                            // todo : send ajax,
                            $.ajax({
                                url: '/todo/event/del/',
                                type: 'POST',
                                data: {
                                    id: parseInt(tooltip.id.replace('tooltip', '')),
                                    csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
                                },
                                headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
                            }).success(function (data) {
                                $(tooltip).parent().removeChild($(tooltip));
                                console.log('del data', data);
                            }).fail(function (data) {
                                console.log('ajax fail ', data);
                            }).error(function (data) {
                                console.log('ajax error ', data);
                            });
                        }
                    }
                }


                // console.log('click', this);
                let data = findData('id', this.id);
                tooltip = document.createElement('div');
                tooltip.classList.add('cal-tooltip');
                tooltip.style.display = 'block';
                tooltip.id = 'tooltip' + this.id;
                // tooltip.innerHTML = '<ul><li class="header"><input type="text" value="' + data.content +
                //     '"></li><li><span tag="date" style="margin-left: 0;">'
                //     + $(this).parents('.calendar-cell')[0].title + '</span><span tag="time">' + '00:00' + '</span></li><li>'
                //     + '优先级:' + '<span tag="priority">' + '紧急' + '</span></li><li>'
                //     + '重复: <span tag="repeat">' + '无' + '</span></li><li>'
                //     + '</li></ul>';
                tooltip.innerHTML = '<ul><li class="header"><input type="text" value="' + data.content +
                    '"></li><span tag="date" style="margin-left: 0; margin-right: 10px;">' + data.start.slice(0, 10).split('-').join('/') +
                    '</span><span tag="time">' + data.start.slice(11, 16) + '-' + data.end.slice(11, 16) +
                    '</span></li><li>' + '优先级:<span tag="priority">' + priority[data.priority] +
                    '</span></li><li>' + '重复:<span tag="repeat">' + repeat[data.repeat] + '</span></li></ul>';
                // let htmlobj = $.ajax({
                //     url: '/query/event',
                //     async: false
                // });
                window.editData = {};
                tooltip.addEventListener('keyup', eventsKeyup, false);

                function tooltipMouseleave() {
                    console.log('tooltip mouseleave');
                    let val = document.querySelector('.cal-tooltip');
                    if (val) {
                        val.parentNode.removeChild(val);
                    }
                    // todo: add alert , are you sure to modify this?
                    if (window.editedTooltip) {
                        let con = confirm('确认修改该事件？');
                        if (con === true) {
                            let start_str = data.start.replace(/[T:-]/g, '/');
                            let end_str = data.end.replace(/[T:-]/g, '/');
                            let start_list = start_str.split('/');
                            let end_list = end_str.split('/');
                            let start = stringToDate(start_list);
                            let end = stringToDate(end_list);
                            // todo: send ajax
                            $.ajax({
                                url: '/todo/event/mod/',
                                type: 'POST',
                                data: {
                                    id: parseInt(tooltip.id.split('tooltip')[1]),
                                    start: start.getTime() / 1000,
                                    end: end.getTime() / 1000,
                                    priority: data.priority,
                                    content: data.content,
                                    csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
                                },
                                headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
                            }).success(function (data) {
                                // todo: update datas and li content
                                console.log('ajax success: ', data);
                                let mod_data = data.data;
                                $(event).html('<span class="little-head q' + mod_data.priority + '"></span><span>' +
                                    mod_data.content + '</span>');
                                updateData(event.id, mod_data);
                                window.editedTooltip = false;
                            }).fail(function (data) {
                                console.log('ajax fail: ', data);
                            }).error(function (data) {
                                console.log('ajax error: ', data);
                            });

                        }
                    }
                    // todo: add event keyup , remove when mouse leave
                    tooltip.removeEventListener('keyup', eventsKeyup);
                    window.editedTooltip = false;
                };
                tooltip.addEventListener('mouseleave', tooltipMouseleave, false);

                tooltip.addEventListener('click', function (e) {
                    if ($(tooltip).hasClass(TOOL_EDIT)) {
                        return;
                    }
                    console.log('tooltip click', this, this.type);
                    console.log('tooltip ', tooltip);
                    tooltip.classList.add('edit');
                    // let name = tooltip.querySelector('.header input').value;
                    // let date = tooltip.querySelector('[tag="date"]').textContent;
                    // let time = tooltip.querySelector('[tag="time"]').textContent;
                    // let time_hour = time.split(':')[0];
                    // let time_min = time.split(':')[1];
                    // let repeat = tooltip.querySelector('[tag="repeat"]').textContent;
                    // let prior = tooltip.querySelector('[tag="priority"]').textContent;
                    // console.log(name, date, time, repeat, prior);
                    console.log('tooltip click data:', data);
                    let html_content = ' <span class="name header"><input type="text" value="' + data.content
                        + '"></span> <table class="' + TOOL_EDIT + '">\n' +
                        '        <tr class="start-time">\n' +
                        '            <th class="header ">开始时间</th>\n' +
                        '            <th class="content"><span>' + data.start.slice(0, 10).split('-').join('/') +
                        '</span><div class="hour dropdown">\n' +
                        '                  <span class="dropdown-toggle" data-toggle="dropdown">' + data.start.slice(11, 13) +
                        '<span class="caret"></span></span>\n' +
                        '                <ul class="dropdown-menu">\n';
                    for (let i = 0; i < 61; i++) {
                        html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                    }

                    html_content += '                </ul>\n' +
                        '            </div>\n' +
                        '                <div class="minute dropdown">\n' +
                        '                  <span class="dropdown-toggle" data-toggle="dropdown">' + data.start.slice(14, 16)
                        + '<span class="caret"></span></span>\n' +
                        '                <ul class="dropdown-menu">\n';
                    for (let i = 0; i < 61; i++) {
                        html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                    }
                    html_content +=
                        '                </ul>\n' +
                        '            </div>\n' +
                        '            </th>\n' +
                        '        </tr>\n' +
                        '        <tr class="end-time">\n' +
                        '            <th class="header">结束时间</th>\n' +
                        '            <th class="content"><span>' + data.end.slice(0, 10).split('-').join('/') +
                        '</span><div class="hour dropdown">\n' +
                        '                <span class="dropdown-toggle" data-toggle="dropdown">' + data.end.slice(11, 13) +
                        '<span class="caret"></span></span>\n' +
                        '                <ul class="dropdown-menu">\n';
                    for (let i = 0; i < 61; i++) {
                        html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                    }
                    html_content +=
                        '                </ul>\n' +
                        '            </div>\n' +
                        '                <div class="minute dropdown">\n' +
                        ' <span class="dropdown-toggle" data-toggle="dropdown">' + data.end.slice(14, 16) +
                        '<span class="caret"></span></span>\n' +
                        '                    <ul class="dropdown-menu">\n';
                    for (let i = 0; i < 61; i++) {
                        html_content += '<li>' + (Array(2).join('0') + i).slice(-2) + '</li>';
                    }
                    html_content +=
                        '                    </ul>\n' +
                        '                </div></th>\n' +
                        '        </tr>\n' +
                        '        <tr class="priority">\n' +
                        '            <th class="header">优先级</th>\n' +
                        '            <th class="content">\n' +
                        '                <div class="minute dropdown">\n' +
                        '<span class="dropdown-toggle" data-toggle="dropdown">' + priority[data.priority] +
                        '<span class="caret"></span></span>\n' +
                        '                    <ul class="dropdown-menu">\n' +
                        '                        <li>紧急</li>\n' +
                        '                        <li>稍急</li>\n' +
                        '                        <li>一般</li>\n' +
                        '                        <li>不急</li>\n' +
                        '                    </ul>\n' +
                        '                </div>\n' +
                        '            </th>\n' +
                        '        </tr>\n' +
                        '        <tr class="repeat">\n' +
                        '            <th class="header">重复</th>\n' +
                        '            <th class="content">\n' +
                        '                <div class="dropdown">\n' +
                        '\n' +
                        '                <span class="dropdown-toggle" data-toggle="dropdown">' + repeat[data.repeat] +
                        '<span class="caret"></span></span>\n' +
                        '                <ul class="dropdown-menu">\n' +
                        '                    <li>无</li>\n' +
                        '                    <li>每日</li>\n' +
                        '                    <li>每周</li>\n' +
                        '                    <li>每月</li>\n' +
                        '                    <li>每年</li>\n' +
                        '                </ul>\n' +
                        '                </div>\n' +
                        '            </th>\n' +
                        '        </tr>\n' +
                        '    </table>';
                    $(this).html(html_content);
                    $('.dropdown-toggle').each(function (i, val, pra) {
                        val.addEventListener('click', function () {

                            let val = $(this).parents('.dropdown').children('.dropdown-menu');
                            let open = false;
                            if (val) {
                                if (val.hasClass('open') === false) {
                                    open = true;
                                }
                                $('.dropdown .dropdown-menu').removeClass('open');
                                if (open) {
                                    val.addClass('open');
                                }
                            }
                        }, false);
                    }, false);
                    $('.dropdown-menu li').each(function (i, val) {
                        val.addEventListener('click', function () {
                            window.editedTooltip = true;
                            let pra = $(this).parents('tr');
                            if (pra.hasClass('end-time')) {
                                let start_time = $('.start-time .content .dropdown-toggle').text();
                                let end_time = $('.end-time .content .dropdown-toggle').text();
                                if (end_time < start_time) {
                                    alert('结束时间应大于等于开始时间！');
                                    return false;
                                }
                            }
                            $(this).parents('.dropdown').children('.dropdown-toggle').text($(this).text());
                            $(this).parent().removeClass('open');
                            if (pra.hasClass('start-time')) {
                                data.start = data.start.slice(0, 10) + '/' + $('.start-time .hour .dropdown-toggle').text()
                                    + '/' + $('.start-time .minute .dropdown-toggle').text();
                            } else if (pra.hasClass('end-time')) {
                                data.start = data.end.slice(0, 10) + '/' + $('.end-time .hour .dropdown-toggle').text()
                                    + '/' + $('.end-time .minute .dropdown-toggle').text();
                            } else if (pra.hasClass('priority')) {
                                data.priority = $(this).parent().children('li').index($(this));
                            } else if (pra.hasClass('repeat')) {
                                data.repeat = $(this).parent().children('li').index($(this));
                            }
                        })
                    }, false);
                    $('.name input').each(function (i, val) {
                        val.addEventListener('change', function () {
                            console.log('input change');
                            window.editedTooltip = true;
                            data.content = this.value;
                        })
                    });
                    let ind = $(this).parent().children('li').index($(this));
                    this.style.top = -69 + ind * 21 + 'px';
                }, false);
                let ind = $(this).parent().children('li').index($(this));
                tooltip.style.top = -75 + ind * 21 + 'px';
                $(this).parents('.calendar-content').append(tooltip);
            },
            cellMouseLeave: function () {
                // console.log('cell mouseleave', this);
                // if(window.editedTooltip){
                //
                //     window.editedTooltip = false;
                // }
                if (!window.editedTooltip) {
                    let tooltip = document.querySelector('.cal-tooltip');
                    if (tooltip) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }
            }
        }
    )
    ;

    $('.dropdown-toggle').each(function (i, val) {
        val.addEventListener('click', function () {
            let val = $(this).parents('.dropdown').children('.dropdown-menu');
            if (val) {
                val.toggleClass('open');
            }
        }, false);
    });
}
;

function findData(tagname, tagvalue) {
    let datas = window.datas;
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (data[tagname] == tagvalue) {
            return data;
        }
    }
    return null;
}

function updateData(item_id, item) {
    let datas = window.datas;
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        if (data.id == item_id) {
            window.datas[i] = item;
        }
    }
}

function stringToDate(date_str) {
    let date_list;
    if(date_str.constructor === Array){
        date_list = date_str;
    }else if(date_str.constructor === String){
        date_list = date_str.split('/');
    }
    for (let i = 0; i < date_list.length; i++) {
        let date_item = date_list[i];
        date_list[i] = parseInt(date_item);
    }
    if (date_list.length === 3) {
        return new Date(date_list[0], date_list[1], date_list[2]);
    } else if (date_list.length === 5) {
        return new Date(date_list[0], date_list[1], date_list[2], date_list[3], date_list[4]);
    }
}
