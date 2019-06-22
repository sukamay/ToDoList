window.today = new Date();

let Calendar = function (t, date, container) {
    this.divId = t.RenderID ? t.RenderID : '[data-render="calendar"]', this.DaysOfWeek = t.DaysOfWeek ? t.DaysOfWeek : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], this.Months = t.Months ? t.Months : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let e = date;
    this.CurrentMonth = e.getMonth(), this.CurrentYear = e.getFullYear();
    let r = t.Format;
    this.f = "string" == typeof r ? r.charAt(0).toUpperCase() : "M";
    this.container = container;
    this.container.id = this.divId;
    // console.log('container: ', this.container);
};
Calendar.prototype.nextMonth = function () {
    11 === this.CurrentMonth ? (this.CurrentMonth = 0, this.CurrentYear = this.CurrentYear + 1) : this.CurrentMonth = this.CurrentMonth + 1, this.divId = '[data-active="false"] .render', this.showCurrent()
}, Calendar.prototype.prevMonth = function () {
    0 === this.CurrentMonth ? (this.CurrentMonth = 11, this.CurrentYear = this.CurrentYear - 1) : this.CurrentMonth = this.CurrentMonth - 1, this.divId = '[data-active="false"] .render', this.showCurrent()
}, Calendar.prototype.previousYear = function () {
    this.CurrentYear = this.CurrentYear - 1, this.showCurrent()
}, Calendar.prototype.nextYear = function () {
    this.CurrentYear = this.CurrentYear + 1, this.showCurrent()
}, Calendar.prototype.showCurrent = function () {
    this.Calendar(this.CurrentYear, this.CurrentMonth)
}, Calendar.prototype.checkActive = function () {
    1 === this.container.querySelector(".months").getAttribute("class").includes("active") ? this.container.querySelector(".months").setAttribute("class", "months") : this.container.querySelector(".months").setAttribute("class", "months active"), "true" == this.container.querySelector(".month-a").getAttribute("data-active") ? (this.container.querySelector(".month-a").setAttribute("data-active", !1), this.container.querySelector(".month-b").setAttribute("data-active", !0)) : (this.container.querySelector(".month-a").setAttribute("data-active", !0), this.container.querySelector(".month-b").setAttribute("data-active", !1)),
    //     setTimeout(function () {
    //     this.container.querySelector(".calendar .header").setAttribute("class", "header active")
    // }, 200),
        this.container.querySelector(".header").setAttribute("class", "header active");
        this.container.setAttribute("data-theme", this.Months[parseInt(this.container.getAttribute("data-month"))].toLowerCase())
}, Calendar.prototype.Calendar = function (t, e) {
    "number" == typeof t && (this.CurrentYear = t), "number" == typeof t && (this.CurrentMonth = e);
    let r = (new Date).getDay(),
        n = (new Date).getMonth(),
        a = (new Date).getFullYear(),
        o = new Date(t, e, 1).getDay(),
        i = new Date(t, e + 1, 0).getDate(),
        u = 0 === e ? new Date(t - 1, 11, 0).getDate() : new Date(t, e, 0).getDate(),
        s = "<span>" + this.Months[e] + " &nbsp; " + t + "</span>",
        d = '<div class="table">';
    d += '<div class="row head">';
    for (let c = 0; c < 7; c++) d += '<div class="cell">' + this.DaysOfWeek[c] + "</div>";
    d += "</div>";
    for (let h, l = dm = "M" == this.f ? 1 : 0 == o ? -5 : 2, v = (c = 0, 0); v < 6; v++) {
        d += '<div class="row">';
        for (let m = 0; m < 7; m++) {
            if ((h = c + dm - o) < 1) d += '<div class="cell disable">' + (u - o + l++) + "</div>";
            else if (h > i) d += '<div class="cell disable">' + l++ + "</div>";
            else {
                d += '<div class="cell'
                    + ((new Date).getDate() == h && this.CurrentMonth == n && this.CurrentYear == a ? " active" : "")
                    + '" title="' + h + '"><span>' + h + "</span></div>", l = 1
            }
            c % 7 == 6 && h >= i && (v = 10), c++
        }
        d += "</div>"
    }
    d += "</div>", this.container.querySelector('[data-render="month-year"]').innerHTML = s, this.container.querySelector(this.divId).innerHTML = d, this.container.setAttribute("data-date", this.Months[e] + " - " + t), this.container.setAttribute("data-month", e)
}, Calendar.prototype.getContainer = function () {
    return this.container;
},


window.onload = function () {
    let cur = new Date();
    let cur_year = cur.getFullYear();
    for(let i = 0;i < 12; i++) {
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
        }, new Date(cur_year, i), container);
        console.log(t.getContainer());
        document.getElementById("calendar-panel").appendChild(t.getContainer());
        t.showCurrent();
        t.checkActive();
    }


    let e = document.querySelectorAll(".header [data-action]");
    for (i = 0; i < e.length; i++) e[i].onclick = function () {
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
};

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
    // let cells =
}
