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
