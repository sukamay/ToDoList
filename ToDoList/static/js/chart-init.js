!function(e) {
    "use strict";
    var t = angular.module("app", ["djng.urls", "nvd3"]);
    t.run(["$rootScope", "$filter", function(o, a) {
        o.defaultErrorInfo = "CN" === e ? "发生了一些错误，请稍后重试！" : "Something went wrong. Please try again.",
            o.defaultSuccessInfo = "CN" === e ? "恭喜，操作成功！" : "Congratulations! Your operation succeeds.",
            o.colors = {
                black: "#000",
                red: "#dd4b39",
                yellow: "#FBBC05",
                blue: "#3b5998",
                lightblue: "#007bb6"
            },
            o.status = [{
                name: "Accepted",
                code: "10",
                typeclass: "progress-bar-success"
            }, {
                name: "Timeout",
                code: "30",
                typeclass: "progress-bar-warning"
            }],
            o.getStatus = function(e) {
                var t = a("filter")(o.status, {
                    code: e
                });
                return e && t.length ? t[0].typeclass : "progress-bar-danger"
            }
    }
    ]),
        t.config(["$interpolateProvider", "$httpProvider", function(e, t) {
            e.startSymbol("{[{").endSymbol("}]}"),
                t.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest",
                t.defaults.headers.delete = {
                    "Content-Type": "application/json"
                },
                t.defaults.headers.patch = {
                    "Content-Type": "application/json"
                },
                t.defaults.xsrfCookieName = "csrftoken",
                t.defaults.xsrfHeaderName = "X-CSRFToken"
        }
        ])
}(window.LeetCodeData.regionInfo);

!function(_) {
    "use strict";
    var e = angular.module("app");
    e.controller("PublicProfileController", ["$scope", "$http", function(y, v) {
        var C = this;
        $(".ranking").popover({
            html: !0
        }),
            $(".btn-link").popover(),
            C.init = function(e, t, n, r, a, i, o, s, l, c, u, m, f, p) {
                y.heatmap_title = "CN" === _ ? "加载提交记录中..." : "Loading Submissions...";
                var g = new CalHeatMap
                    , h = new Date;
                h.setDate(h.getDate() - 364),
                    h.setHours(0, 0, 0, 0),
                    g.init({
                        itemSelector: "#cal-heatmap",
                        itemName: ["submission"],
                        domain: "week",
                        subDomain: "day",
                        start: h,
                        tooltip: !0,
                        domainLabelFormat: function(e) {
                            return 1 <= e.getDate() && e.getDate() <= 7 ? e.getMonth() + 1 : ""
                        },
                        subDomainTitleFormat: {
                            empty: "CN" === _ ? "无{date}的提交记录" : "No submissions on {date}",
                            filled: "CN" === _ ? "{date}，{count}个提交记录" : "{count} {name} {connector} {date}"
                        },
                        subDomainDateFormat: function(e) {
                            return e.toDateString().split(" ").slice(1)
                        },
                        range: 53,
                        domainGutter: 0,
                        legend: [10, 20, 30, 40],
                        highlight: ["now"],
                        legendHorizontalPosition: "right",
                        legendVerticalPosition: "top"
                    });
                var d = "/api/user_submission_calendar/" + e + "/";
                v.get(d).then(function(e) {
                    var n = e.data;
                    n = JSON.parse(JSON.parse(n));
                    var r = 0
                        , a = 5;
                    Object.keys(n).forEach(function(e) {
                        var t = new Date(1e3 * e);
                        h <= t && (r += n[e]),
                        n[e] > a && (a = n[e])
                    });
                    var t = 0 === r ? "submission" : "submissions";
                    y.heatmap_title = r + " " + t + " in the last year",
                    "CN" === _ && (y.heatmap_title = "在过去一年内，有" + r + "个提交记录"),
                        g.setLegend([Math.floor(a / 5), Math.floor(2 * a / 5), Math.floor(3 * a / 5), Math.floor(4 * a / 5)]),
                        g.update(n)
                }, function(e) {
                    y.heatmap_title = "Loading Submissions Error: " + e.statusText,
                    "CN" === _ && (y.heatmap_title = "载入提交记录失败：" + e.statusText)
                }),
                    C.progress_data = [{
                        key: "CN" === _ ? "通过" : "Accepted",
                        count: t
                    }, {
                        key: "CN" === _ ? "其他" : "Other",
                        count: i
                    }],
                0 < n && C.progress_data.push({
                    key: "CN" === _ ? "答案错误" : "Wrong Answer",
                    count: n
                }),
                0 < r && C.progress_data.push({
                    key: "CN" === _ ? "执行错误" : "Runtime Error",
                    count: r
                }),
                0 < a && C.progress_data.push({
                    key: "CN" === _ ? "超出时间限制" : "TLE",
                    count: a
                }),
                    m = m || [],
                    C.ranking_data = [{
                        values: [],
                        key: "CN" === _ ? "评级" : "Rating",
                        color: "#ff7f0e"
                    }],
                    m.forEach(function(e, t) {
                        var n = {
                            x: t,
                            y: parseInt(e[0]),
                            contest_title: p[t]
                        };
                        C.ranking_data[0].values.push(n)
                    }),
                    C.changePieChart(),
                    C.changeLineChart(),
                    C.displayRanking(o, s),
                    C.full_star_count = parseInt(l),
                    C.half_star_count = parseInt(c),
                    C.empty_star_count = parseInt(u),
                    C.genMIData(f)
            }
            ,
            C.genMIData = function(r) {
                for (var e = [], t = 0; t < r.percentiles.length; t++)
                    e.push({
                        x: t + 1,
                        y: r.percentiles[t]
                    });
                C.mi_top_tags = function() {
                    for (var e = [], t = r.top_tags, n = 0; n < t.length; n++)
                        e.push(t[n][0] + " (" + t[n][1] + ")");
                    return e.join(" , ")
                }(),
                    C.miprogress_data = e.length ? [{
                        values: e,
                        key: "CN" === _ ? "模拟面试" : "Mock Interview"
                    }] : null,
                    C.miprogress_options = {
                        chart: {
                            type: "lineChart",
                            height: 250,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 55
                            },
                            useInteractiveGuideline: !0,
                            showLabels: !0,
                            xAxis: {
                                axisLabel: "CN" === _ ? "时间" : "Time",
                                tickFormat: function(e) {
                                    return d3.format(",f")(e)
                                }
                            },
                            yDomain: [0, 100],
                            yAxis: {
                                axisLabel: "CN" === _ ? "我的名次（百分比）" : "Your Percentile %",
                                axisLabelDistance: -10,
                                tickFormat: function(e) {
                                    return d3.format(",f")(e)
                                }
                            }
                        },
                        title: {
                            enable: 0 !== e.length,
                            text: "Overall Percentile: " + r.avg_percentile + "%"
                        }
                    }
            }
            ,
            C.displayRanking = function(e, t) {
                parseInt(e) > parseInt(t) ? C.ranking = "~" + t.toLocaleString() : C.ranking = e.toLocaleString()
            }
            ,
            C.getNumber = function(e) {
                return new Array(e)
            }
            ,
            C.changePieChart = function() {
                C.progress_options = {
                    chart: {
                        type: "pieChart",
                        color: ["#34A853", "#EA4335", "#4285F4", "#FBBC05", "grey"],
                        height: 350,
                        margin: {
                            top: 0,
                            right: 0,
                            bottom: -20,
                            left: 0
                        },
                        valueFormat: function(e) {
                            return d3.format(",f")(e)
                        },
                        x: function(e) {
                            return e.key
                        },
                        y: function(e) {
                            return e.count
                        },
                        showLabels: !0,
                        labelType: "percent",
                        donut: !0,
                        legend: {
                            margin: {
                                top: 10,
                                right: 10,
                                bottom: 0,
                                left: 0
                            }
                        },
                        callback: function() {
                            d3.selectAll(".nv-pieLabels text").style("font-weight", "bold").style("font-size", "12px").style("fill", "white")
                        }
                    }
                }
            }
            ,
            C.changeLineChart = function() {
                C.ranking_options = {
                    chart: {
                        type: "lineChart",
                        height: 450,
                        margin: {
                            top: 20,
                            right: 20,
                            bottom: 40,
                            left: 55
                        },
                        x: function(e) {
                            return e.x
                        },
                        y: function(e) {
                            return e.y
                        },
                        useInteractiveGuideline: !1,
                        xAxis: {
                            axisLabel: "CN" === _ ? "竞赛次数" : "Contest Number"
                        },
                        yAxis: {
                            axisLabel: "CN" === _ ? "评级" : "Rating",
                            tickFormat: function(e) {
                                return d3.format(".00f")(e)
                            },
                            axisLabelDistance: -10
                        },
                        tooltip: {
                            contentGenerator: function(e) {
                                return '<div><p style="text-align: left;">' + e.point.contest_title + '</p></div><div><p style="text-align: left;">' + ("CN" === _ ? "评级：" : "Rating: ") + "<strong>" + e.point.y + "</strong></p></div>"
                            }
                        }
                    },
                    title: {
                        enable: !0,
                        text: "CN" === _ ? "竞赛评级历史" : "Contest Rating History"
                    }
                }
            }
    }
    ]),
        e.controller("ProfileController", ["$scope", "$location", "djangoUrl", "$http", function(e, t, n, r) {
            var a = this;
            a.new_email = "",
                a.success = !1,
                a.warning = !1,
                a.error = !1,
                a.message_info = "",
                a.emailUrl = n.reverse("emails"),
                a.successInfo = "",
                a.errorInfo = "",
                a.emailEdit = function() {
                    r.post(a.emailUrl, {
                        new_email: a.new_email
                    }).success(function(e) {
                        a.user.emails = e,
                            a.error = !1,
                            a.successInfo = "CN" === _ ? "您已成功添加一个电子邮箱，请及时查收发送至" + a.new_email + "的验证邮件。" : "You have added an email address successfully. Please verify it by clicking the link in the verification email we sent to " + a.new_email + ".",
                            a.new_email = "",
                            a.success = !0
                    }).error(function() {
                        a.new_email = "",
                            a.success = !1,
                            a.errorInfo = "CN" === _ ? "无效邮箱地址或该邮箱地址已经存在，请核对后重试！" : "Invalid email address or the email address already exists. Please choose a different email.",
                            a.error = !0
                    })
                }
                ,
                a.oneEmail = function() {
                    return 1 === a.user.emails.length
                }
                ,
                a.emailDelete = function(e) {
                    confirm("CN" === _ ? "确定要从您的账户中移除此电子邮箱吗？" : "Are you sure you want to remove this email from your account?") && r({
                        method: "delete",
                        url: n.reverse("emails", [e])
                    }).success(function(e) {
                        a.user.emails = e,
                            a.error = !1
                    }).error(function() {
                        a.success = !1,
                            a.errorInfo = "",
                            a.error = !0
                    })
                }
                ,
                a.setPrimary = function(e) {
                    r({
                        method: "patch",
                        url: n.reverse("emails", [e]),
                        data: {
                            primary: 1
                        }
                    }).success(function(e) {
                        a.user.emails = e,
                            a.error = !1
                    }).error(function() {
                        a.success = !1,
                            a.errorInfo = "",
                            a.error = !0
                    })
                }
                ,
                a.resendEmail = function(e) {
                    r({
                        method: "post",
                        url: n.reverse("verification"),
                        data: {
                            email: e
                        }
                    }).success(function() {
                        a.error = !1,
                            a.success = !0,
                            a.successInfo = "CN" === _ ? "验证邮件已寄出" : "Confirmation email sent."
                    }).error(function() {
                        a.success = !1,
                            a.errorInfo = "",
                            a.error = !0
                    })
                }
        }
        ])
}(window.LeetCodeData.regionInfo);

!function(u, e) {
    "use strict";
    var n = u.module("djng.fileupload", ["ngFileUpload"]);
    n.directive("djngFileuploadUrl", ["Upload", function(c) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function(a, e, s, n) {
                n.$setViewValue({}),
                    e.data("area_label", e.val()),
                    s.currentFile ? (u.extend(a.$eval(s.ngModel), {
                        current_file: s.currentFile
                    }),
                        e.data("current_file", s.currentFile),
                        e.val(s.currentFile.substring(0, s.currentFile.indexOf(":"))),
                        e.addClass("djng-preset")) : e.addClass("djng-empty"),
                    a.uploadFile = function(e, n, t, r) {
                        var i = {
                            "file:0": e,
                            filetype: n
                        }
                            , o = u.element(document.querySelector("#" + t));
                        o.addClass("uploading"),
                            c.upload({
                                data: i,
                                url: s.djngFileuploadUrl
                            }).then(function(e) {
                                var n = e.data["file:0"]
                                    , t = o.data("current_file");
                                o.removeClass("uploading"),
                                n && (o.css("background-image", n.url),
                                    o.removeClass("djng-empty"),
                                    o.removeClass("djng-preset"),
                                    o.val(n.file_name),
                                    delete n.url,
                                    u.extend(a.$eval(r), n, t ? {
                                        current_file: t
                                    } : {}))
                            }, function(e) {
                                o.removeClass("uploading")
                            })
                    }
            }
        }
    }
    ]),
        n.directive("djngFileuploadButton", function() {
            return {
                restrict: "A",
                link: function(i, e, n) {
                    i.deleteImage = function(e, n) {
                        var t = i.$eval(n)
                            , r = u.element(document.querySelector("#" + e));
                        r.css("background-image", "none"),
                            r.addClass("djng-empty"),
                            r.removeClass("djng-preset"),
                            r.val(r.data("area_label")),
                        t && (t.temp_name = "delete")
                    }
                }
            }
        })
}(window.angular),
    function(f, l) {
        "use strict";
        var n = f.module("djng.forms", []);
        f.forEach(["input", "select", "textarea", "datalist"], function(e) {
            n.directive(e, ["$compile", function(a) {
                return {
                    restrict: "E",
                    require: ["?^form", "?^djngMultifieldsRequired"],
                    link: function(e, n, t, r) {
                        var i, o = r[0];
                        !o || f.isUndefined(o.$name) || "hidden" === n.prop("type") || f.isUndefined(t.name) || f.isDefined(t.ngModel) || (i = "dmy" + Math.abs(function(e) {
                            return e.split("").reduce(function(e, n) {
                                return (e = (e << 5) - e + n.charCodeAt(0)) & e
                            }, 0)
                        }(o.$name)) + "." + t.name.replace(/-/g, "_"),
                        r[1] && (i = i.concat("['" + t.value + "']")),
                            t.$set("ngModel", i),
                            a(n, null, 9999)(e))
                    }
                }
            }
            ])
        }),
            n.directive("djngError", function() {
                return {
                    restrict: "A",
                    require: "?^form",
                    link: function(e, n, t, r) {
                        var i, o = f.isElement(n) ? n[0] : null;
                        o && r && !f.isUndefined(t.name) && "bound-field" === t.djngError && ((i = r[t.name]).$setValidity("bound", !1),
                            i.$parsers.push(function(e) {
                                return e !== o.defaultValue && (i.$setValidity("bound", !0),
                                    n.removeAttr("djng-error")),
                                    e
                            }))
                    }
                }
            }),
            n.directive("ngModel", ["$log", function(u) {
                function d(e, n) {
                    f.isDefined(n) && (e.$setViewValue(n),
                    f.isObject(e.$options) && e.$commitViewValue())
                }
                return {
                    restrict: "A",
                    priority: 2,
                    require: ["ngModel", "^?form", "^?djngMultifieldsRequired"],
                    link: function(e, n, t, r) {
                        var i = f.isElement(n) ? n[0] : null
                            , o = r[0]
                            , a = r[1]
                            , s = r[2]
                            , c = e.$eval(t.ngModel);
                        if (i && a && !f.isDefined(c)) {
                            switch (i.tagName) {
                                case "INPUT":
                                    d(o, function(e) {
                                        switch (e.type) {
                                            case "radio":
                                                if (e.defaultChecked)
                                                    return e.defaultValue;
                                                break;
                                            case "checkbox":
                                                if (e.defaultChecked)
                                                    return !0;
                                                break;
                                            case "password":
                                                return null;
                                            default:
                                                if (e.defaultValue)
                                                    return e.defaultValue
                                        }
                                    }(i)),
                                    s && (s.subFields.push(o),
                                        o.$validators.multifield = s.validate);
                                    break;
                                case "SELECT":
                                    d(o, function(n) {
                                        var t = n.multiple ? [] : l;
                                        return f.forEach(n.options, function(e) {
                                            e.defaultSelected && (f.element(e).prop("selected", "selected"),
                                                n.multiple ? t.push(e.value) : t = e.value)
                                        }),
                                            t
                                    }(i));
                                    break;
                                case "TEXTAREA":
                                    d(o, function(e) {
                                        if (e.defaultValue)
                                            return e.defaultValue
                                    }(i));
                                    break;
                                default:
                                    u.log("Unknown field type: " + i.tagName)
                            }
                            a.$setPristine()
                        }
                    }
                }
            }
            ]),
            n.directive("djngMultifieldsRequired", function() {
                return {
                    restrict: "A",
                    require: "djngMultifieldsRequired",
                    controller: ["$scope", function(e) {
                        var t = this;
                        this.subFields = [],
                            this.validate = function() {
                                var n = !t.anyFieldRequired;
                                return f.forEach(t.subFields, function(e) {
                                    n = n || e.$viewValue
                                }),
                                n && f.forEach(t.subFields, function(e) {
                                    e.$setValidity("multifield", !0)
                                }),
                                    n
                            }
                    }
                    ],
                    link: function(e, n, t, r) {
                        r.anyFieldRequired = e.$eval(t.djngMultifieldsRequired)
                    }
                }
            }),
            n.directive("validateDate", function() {
                var i = null;
                return {
                    require: "?ngModel",
                    restrict: "A",
                    link: function(e, n, t, r) {
                        if (r) {
                            t.validateDate && (i = new RegExp(t.validateDate,"i"));
                            r.$parsers.push(function(e) {
                                var n = r.$isEmpty(e) || function(e) {
                                    var n, t;
                                    return !e || (t = new Date(e),
                                    !isNaN(t) && (!i || (n = i.exec(e)) && parseInt(n[2], 10) === t.getMonth() + 1))
                                }(e);
                                return r.$setValidity("date", n),
                                    n ? e : l
                            })
                        }
                    }
                }
            }),
            n.directive("validateEmail", function() {
                return {
                    require: "?ngModel",
                    restrict: "A",
                    link: function(e, n, t, r) {
                        if (r && r.$validators.email && t.emailPattern) {
                            var i = new RegExp(t.emailPattern,"i");
                            r.$validators.email = function(e) {
                                return r.$isEmpty(e) || i.test(e)
                            }
                        }
                    }
                }
            }),
            n.controller("FormUploadController", ["$scope", "$http", "$interpolate", "$parse", "$q", function(a, s, t, c, u) {
                var d = this;
                function o(e) {
                    return e && f.isArray(e.$viewChangeListeners)
                }
                function l(e) {
                    return e && "FormController" === e.constructor.name
                }
                this.endpointValidatedForms = {},
                    this.endpointFormsMap = {},
                    this.setEndpoint = function(e, n) {
                        d.endpointURL = t(decodeURIComponent(e)),
                            d.endpointScope = n
                    }
                    ,
                    this.uploadScope = function(e, n, t) {
                        var r, i = u.defer(), o = {};
                        if (!d.endpointURL)
                            throw new Error("Can not upload form data: Missing endpoint.");
                        return r = f.isObject(n) ? d.endpointURL(n) : d.endpointURL(),
                            ("GET" === e ? s({
                                url: r,
                                method: e,
                                params: t
                            }) : (f.isObject(t) && f.merge(o, t),
                                f.forEach(d.endpointFormsMap, function(e) {
                                    var t = {};
                                    f.forEach(e, function(e) {
                                        var n = a.$eval(e);
                                        n && (t[e] = n,
                                            f.merge(o, t))
                                    })
                                }),
                                s({
                                    url: r,
                                    method: e,
                                    data: o
                                }))).then(function(r) {
                                f.forEach(d.endpointFormsMap, function(e, n) {
                                    var t = c(n);
                                    d.clearErrors(t(a)),
                                    f.isObject(t(r.data)) && d.setModels(t(a), t(r.data)),
                                        t(a).$setSubmitted()
                                }),
                                    i.resolve(r)
                            }).catch(function(r) {
                                400 <= r.status && r.status <= 499 && (f.forEach(d.endpointFormsMap, function(e, n) {
                                    d.clearErrors(c(n)(a))
                                }),
                                    f.forEach(d.endpointFormsMap, function(e, n) {
                                        var t = c(n);
                                        f.isObject(t(r.data)) && d.setErrors(t(a), t(r.data)),
                                            t(a).$setSubmitted()
                                    })),
                                    i.reject(r)
                            }),
                            i.promise
                    }
                    ,
                    this.clearErrors = function(r) {
                        r.$message = "",
                        r.hasOwnProperty("$error") && f.isArray(r.$error.rejected) && f.forEach(r.$error.rejected.concat(), function(e) {
                            var n, t = e ? e.$name : null;
                            r.hasOwnProperty(t) && (o(n = r[t]) && f.isFunction(n.clearRejected) ? n.clearRejected() : l(n) && (n.$setValidity("rejected", !0),
                                f.forEach(n, function(e, n) {
                                    o(e) && e.clearRejected && e.clearRejected()
                                })))
                        })
                    }
                    ,
                    this.setErrors = function(r, e) {
                        function i(e) {
                            var n = e.$viewChangeListeners.push(e.clearRejected = function() {
                                    e.$message = "",
                                        e.$setValidity("rejected", !0),
                                        e.$viewChangeListeners.splice(n - 1, 1),
                                        delete e.clearRejected
                                }
                            )
                        }
                        f.forEach(e, function(e, n) {
                            var t;
                            0 < e.length && ("__all__" === n || "non_field_errors" === n ? (r.$message = e[0],
                                r.$setPristine(),
                                r.$setValidity("rejected", !1)) : r.hasOwnProperty(n) && ((t = r[n]).$message = e[0],
                                t.$setValidity("rejected", !1),
                                t.$setPristine(),
                                o(t) ? i(t) : f.forEach(t, function(e, n) {
                                    o(e) && i(e)
                                })))
                        })
                    }
                    ,
                    this.setModels = function(n, e) {
                        e.success_message && (n.$message = e.success_message),
                            f.forEach(e, function(r, e) {
                                var i = n[e];
                                o(i) ? (i.$setViewValue(r, "updateOn"),
                                f.isObject(i.$options) && i.$commitViewValue(),
                                    i.$render(),
                                    i.$validate(),
                                    i.$setUntouched(),
                                    i.$setPristine()) : l(i) && (f.forEach(i, function(e, n) {
                                    var t;
                                    o(e) && (t = e.$name.replace(i.$name + ".", ""),
                                    -1 === r.indexOf(t) && (t = null),
                                        e.$setViewValue(t, "updateOn"),
                                    f.isObject(e.$options) && e.$commitViewValue(),
                                        e.$render(),
                                        e.$validate(),
                                        e.$setUntouched())
                                }),
                                    i.$setPristine())
                            })
                    }
            }
            ]),
            n.directive("djngEndpoint", function() {
                return {
                    require: ["form", "djngEndpoint"],
                    restrict: "A",
                    controller: "FormUploadController",
                    scope: !0,
                    link: {
                        pre: function(e, n, t, r) {
                            if (!t.name)
                                throw new Error("Attribute 'name' is not set for this form!");
                            if (!t.djngEndpoint)
                                throw new Error("Attribute 'djng-endpoint' is not set for this form!");
                            r[1].setEndpoint(t.djngEndpoint, e)
                        },
                        post: function(e, n, t, r) {
                            var i = r[0];
                            e.hasError = function(e) {
                                if (f.isObject(i[e])) {
                                    if (i[e].$pristine && i[e].$error.rejected)
                                        return "has-error";
                                    if (i[e].$touched && i[e].$invalid)
                                        return "has-error"
                                }
                            }
                                ,
                                e.successMessageIsVisible = function() {
                                    return i.$message && !i.$error.rejected && i.$submitted
                                }
                                ,
                                e.rejectMessageIsVisible = function() {
                                    return i.$message && i.$error.rejected && i.$submitted
                                }
                                ,
                                e.getSubmitMessage = function() {
                                    return i.$message
                                }
                                ,
                                e.dismissSubmitMessage = function() {
                                    i.$error.rejected && i.$setValidity("rejected", !0),
                                        i.$setPristine()
                                }
                        }
                    }
                }
            }),
            n.directive("ngModel", ["djangoForm", function(s) {
                return {
                    restrict: "A",
                    require: ["^?djngFormsSet", "^?form", "^?djngEndpoint"],
                    link: function(n, e, t, r) {
                        var i, o = r[1];
                        function a(e) {
                            if (n.$id !== e.endpointScope.$id) {
                                if (n.hasOwnProperty(i) && (e.endpointScope[i] = n[i],
                                    delete n[i],
                                    !n[o.$name]))
                                    throw new Error("Failed to detach model scope and reappend to its parent.");
                                if (n.hasOwnProperty(o.$name) && (e.endpointScope[o.$name] = n[o.$name],
                                    delete n[o.$name],
                                    !n[o.$name]))
                                    throw new Error("Failed to detach form controller and/or to reappend to its parent.")
                            }
                            f.isArray(e.endpointFormsMap[o.$name]) || (e.endpointFormsMap[o.$name] = []),
                            i && -1 === e.endpointFormsMap[o.$name].indexOf(i) && e.endpointFormsMap[o.$name].push(i)
                        }
                        o && (i = s.getScopePrefix(t.ngModel),
                        r[0] && a(r[0]),
                        r[2] && a(r[2]),
                            e.on("change", function() {
                                o.$error.rejected && (o.$setValidity("rejected", !0),
                                    o.$submitted = !1,
                                    n.$apply())
                            }))
                    }
                }
            }
            ]),
            n.factory("djangoForm", ["$parse", function(r) {
                return {
                    getScopePrefix: function(e) {
                        var t, n = {};
                        return r(e).assign(n, !0),
                            f.forEach(n, function(e, n) {
                                t = n
                            }),
                            t
                    }
                }
            }
            ]),
            n.directive("button", ["$q", "$timeout", "$window", function(a, s, c) {
                return {
                    restrict: "E",
                    require: ["^?djngFormsSet", "^?form", "^?djngEndpoint"],
                    scope: !0,
                    link: function(r, n, e, t) {
                        var i, o = t[2] || t[0];
                        o && (e.urlParams && (i = r.$eval(e.urlParams)),
                            r.do = function(e, n) {
                                return a.resolve().then(e, n)
                            }
                            ,
                            r.fetch = function(e) {
                                return function() {
                                    return o.uploadScope("GET", i, e)
                                }
                            }
                            ,
                            r.create = function(e) {
                                return function() {
                                    return o.uploadScope("POST", i, e)
                                }
                            }
                            ,
                            r.update = function(e) {
                                return function() {
                                    return o.uploadScope("PUT", i, e)
                                }
                            }
                            ,
                            r.delete = function(e) {
                                return function() {
                                    return o.uploadScope("DELETE", i, e)
                                }
                            }
                            ,
                            r.disable = function() {
                                return function(e) {
                                    return r.disabled = !0,
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.isDisabled = function() {
                                return t[1] ? t[1].$invalid || r.disabled : t[0] ? !t[0].setIsValid || r.disabled : void 0
                            }
                            ,
                            r.spinner = function() {
                                return function(e) {
                                    return r.disabled = !0,
                                        f.forEach(n.find("i"), function(e) {
                                            (e = f.element(e)).data("remember-class") || e.data("remember-class", e.attr("class")),
                                                e.attr("class", "glyphicon glyphicon-refresh djng-rotate-animate")
                                        }),
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.showOK = function() {
                                return function(e) {
                                    return f.forEach(n.find("i"), function(e) {
                                        (e = f.element(e)).data("remember-class") || e.data("remember-class", e.attr("class")),
                                            e.attr("class", "glyphicon glyphicon-ok")
                                    }),
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.showFail = function() {
                                return function(e) {
                                    return f.forEach(n.find("i"), function(e) {
                                        (e = f.element(e)).data("remember-class") || e.data("remember-class", e.attr("class")),
                                            e.attr("class", "glyphicon glyphicon-remove")
                                    }),
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.restore = function() {
                                return function(e) {
                                    return r.disabled = !1,
                                        f.forEach(n.find("i"), function(e) {
                                            (e = f.element(e)).data("remember-class") && (e.attr("class", e.data("remember-class")),
                                                e.removeData("remember-class"))
                                        }),
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.emit = function(n, t) {
                                return function(e) {
                                    return r.$emit(n, t),
                                        a.resolve(e)
                                }
                            }
                            ,
                            r.reloadPage = function() {
                                return function(e) {
                                    c.location.reload()
                                }
                            }
                            ,
                            r.redirectTo = function(n) {
                                return function(e) {
                                    f.isDefined(e.data.success_url) ? c.location.assign(e.data.success_url) : c.location.assign(n)
                                }
                            }
                            ,
                            r.delay = function(t) {
                                return function(n) {
                                    return a(function(e) {
                                        r.timer = s(function() {
                                            r.timer = null,
                                                e(n)
                                        }, t)
                                    })
                                }
                            }
                            ,
                            r.scrollToRejected = function() {
                                return function(e) {
                                    var n, t, r;
                                    if (400 <= e.status && e.status <= 499)
                                        for (n in e.data) {
                                            if (r = null,
                                            e.data[n].__all__ && (r = (r = document.getElementsByName(n)[0]) ? r.getElementsByClassName("djng-line-spreader")[0] : null),
                                                !r)
                                                for (t in e.data[n])
                                                    if (r = document.getElementById("id_" + t))
                                                        break;
                                            if (r) {
                                                r.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "center",
                                                    inline: "nearest"
                                                });
                                                break
                                            }
                                        }
                                }
                            }
                            ,
                            r.$on("$destroy", function() {
                                r.timer && s.cancel(r.timer)
                            }))
                    }
                }
            }
            ]),
            n.directive("djngFormsSet", function() {
                return {
                    require: "djngFormsSet",
                    controller: "FormUploadController",
                    link: {
                        pre: function(e, n, t, r) {
                            if (!t.endpoint)
                                throw new Error("Attribute 'endpoint' is not set!");
                            r.setEndpoint(t.endpoint, e)
                        }
                    }
                }
            }),
            n.directive("form", function() {
                return {
                    restrict: "E",
                    require: ["^?djngFormsSet", "form"],
                    priority: 1,
                    link: function(e, n, t, r) {
                        var i = r[0]
                            , o = r[1];
                        if (i) {
                            if (!t.name)
                                throw new Error("Each <form> embedded inside a <djng-forms-set> must identify itself by name.");
                            e.$watch(t.name + ".$valid", function() {
                                i.endpointValidatedForms[o.$name] = o.$valid,
                                    i.setIsValid = !0,
                                    f.forEach(i.endpointValidatedForms, function(e) {
                                        i.setIsValid = i.setIsValid && e
                                    })
                            })
                        }
                    }
                }
            }),
            n.directive("djngBindIf", function() {
                return {
                    restrict: "A",
                    compile: function(e) {
                        return e.addClass("ng-binding"),
                            function(e, n, t) {
                                n.data("$binding", t.ngBind),
                                    e.$watch(t.djngBindIf, function(e) {
                                        e !== l && null !== e && n.text(e)
                                    })
                            }
                    }
                }
            })
    }(window.angular),
    function(o, e) {
        "use strict";
        o.module("djng.rmi", []).provider("djangoRMI", function() {
            var n, i;
            this.configure = function(e) {
                (function e(n) {
                        o.forEach(n, function(t, r) {
                            if (!o.isObject(t))
                                throw new Error("djangoRMI.configure got invalid data");
                            t.hasOwnProperty("url") ? (t.headers["X-Requested-With"] = "XMLHttpRequest",
                                    n[r] = function(e) {
                                        var n = o.copy(t);
                                        if ("POST" === n.method) {
                                            if (void 0 === e)
                                                throw new Error("Calling remote method " + r + " without data object");
                                            n.data = e
                                        } else
                                            "auto" === n.method && (void 0 === e ? n.method = "GET" : (n.method = "POST",
                                                n.data = e));
                                        return i(n)
                                    }
                            ) : e(t)
                        })
                    }
                )(n = e)
            }
                ,
                this.$get = ["$http", function(e) {
                    return i = e,
                        n
                }
                ]
        })
    }(window.angular),
    function(s, e) {
        "use strict";
        s.module("djng.urls", []).provider("djangoUrl", function() {
            var n = "/angular/reverse/";
            this.setReverseUrl = function(e) {
                n = e
            }
                ,
                this.$get = function() {
                    return new t(n)
                }
        });
        var t = function(i) {
            function o(e, n, t) {
                for (var r = function(e) {
                    var n = [];
                    for (var t in e)
                        e.hasOwnProperty(t) && n.push(t);
                    return n.sort()
                }(e), i = 0; i < r.length; i++)
                    n.call(t, e[r[i]], r[i]);
                return r
            }
            function a(e, n) {
                if (!n)
                    return e;
                var t = [];
                return o(n, function(e, n) {
                    null != e && (s.isObject(e) && (e = s.toJson(e)),
                        ("string" == typeof e || e instanceof String) && 0 === e.lastIndexOf(":", 0) ? t.push(encodeURIComponent(n) + "=" + e) : t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e)))
                }),
                e + (-1 === e.indexOf("?") ? "?" : "&") + t.join("&")
            }
            this.reverse = function(e, n) {
                var t = a(i, {
                    djng_url_name: e
                });
                if (Array.isArray(n))
                    return o(n, function(e) {
                        t = a(t, {
                            djng_url_args: e
                        })
                    }),
                        t;
                var r = {};
                return o(n, function(e, n) {
                    r["djng_url_kwarg_" + n] = e
                }),
                    s.equals(r, {}) ? t : a(t, r)
            }
        }
    }(window.angular),
    function(b, e) {
        "use strict";
        function t() {}
        var n = b.module("djng.websocket", []);
        n.service("$websocket", function() {
            var n;
            this.connect = function(e) {
                (n = new WebSocket(e)).onopen = this.onopen,
                    n.onmessage = this.onmessage,
                    n.onerror = this.onerror,
                    n.onclose = this.onclose
            }
                ,
                this.send = function(e) {
                    n.send(e)
                }
                ,
                this.close = function() {
                    n.close()
                }
        }),
            n.provider("djangoWebsocket", function() {
                var v, $ = {
                    log: t,
                    warn: t,
                    error: t
                }, j = null, n = b.injector(["ng"]).get("$log");
                this.setURI = function(e) {
                    return v = e,
                        this
                }
                    ,
                    this.setHeartbeat = function(e) {
                        return j = e,
                            this
                    }
                    ,
                    this.setLogLevel = function(e) {
                        switch (e) {
                            case "debug":
                                $ = n;
                                break;
                            case "log":
                                $.log = n.log;
                            case "warn":
                                $.warn = n.warn;
                            case "error":
                                $.error = n.error
                        }
                        return this
                    }
                    ,
                    this.$get = ["$websocket", "$q", "$timeout", "$interval", function(i, o, n, t) {
                        var a, s, c, u, d = !1, l = !1, r = !1, f = 0, m = null, p = 0;
                        function g() {
                            try {
                                if (3 < ++p)
                                    throw new Error("Too many missed heartbeats.");
                                i.send(j)
                            } catch (e) {
                                t.cancel(m),
                                    m = null,
                                    $.warn("Closing connection. Reason: " + e.message),
                                    i.close()
                            }
                        }
                        function e(e, n) {
                            r || b.equals(n, e) || i.send(b.toJson(e))
                        }
                        function h() {
                            c.$watchCollection(u, e)
                        }
                        return i.onopen = function(e) {
                            $.log("Connected"),
                                s.resolve(),
                                f = 0,
                            j && null === m && (p = 0,
                                m = t(g, 5e3))
                        }
                            ,
                            i.onclose = function(e) {
                                $.log("Disconnected"),
                                    s.reject(),
                                    f = Math.min(f + 1e3, 1e4),
                                    n(function() {
                                        i.connect(a)
                                    }, f)
                            }
                            ,
                            i.onerror = function(e) {
                                $.error("Websocket connection is broken!"),
                                    i.close()
                            }
                            ,
                            i.onmessage = function(n) {
                                var e;
                                if (n.data !== j) {
                                    try {
                                        e = b.fromJson(n.data)
                                    } catch (e) {
                                        return void $.warn("Data received by server is invalid JSON: " + n.data)
                                    }
                                    d && (r = !0,
                                        c.$apply(function() {
                                            b.extend(c[u], e)
                                        }),
                                        r = !1)
                                } else
                                    p = 0
                            }
                            ,
                            {
                                connect: function(e, n, t, r) {
                                    return c = e,
                                        function(e) {
                                            b.forEach(e, function(e) {
                                                "subscribe" === e.substring(0, 9) ? d = !0 : "publish" === e.substring(0, 7) && (l = !0)
                                            })
                                        }(r),
                                        c[u = n] = c[u] || {},
                                        function(e, n) {
                                            var t = [v, e, "?"];
                                            t.push(n.join("&")),
                                                a = t.join("")
                                        }(t, r),
                                        $.log("Connecting to " + a),
                                        s = o.defer(),
                                        i.connect(a),
                                    l && s.promise.then(h),
                                        s.promise
                                }
                            }
                    }
                    ]
            })
    }(window.angular),
    angular.module("djng", ["djng.forms", "djng.urls"]);
