window.error_mobile = false;

$('#zphone').click(
    function () {
        check_mobile();
        if (error_mobile) {
            return false;
        }
        //发送验证码
        // $.get('/todo/send_message', {mobile: $('#mobile').val()}, function (msg) {
        //     alert(jQuery.trim(msg.msg));
        //     if (msg.msg == '提交成功') {
        //         RemainTime();
        //     }
        // });
          $.ajax({
        url: '/todo/send_message/',
        type: 'GET',
        data: {
            mobile: $('#mobile').val(),
            csrfmiddlewaretoken: document.querySelector('[name="csrfmiddlewaretoken"]').value,
        },
        headers: {'X-CSRFToken': document.querySelector('[name="csrfmiddlewaretoken"]').value},
    }).success(function (data) {
        window.datas = data;
        RemainTime();
        console.log('success', data);
    }).fail(function (data) {
        console.log('ajax fail: ', data);
    }).error(function (data) {
        console.log('ajax error:', data);
    });
    });

//按钮倒计时
let iTime = 60;
sTime = ''

function RemainTime() {
    if (iTime == 0) {
        document.getElementById('zphone').disabled = false;
        sTime = "获取验证码";
        iTime = 60;
        document.getElementById('zphone').value = sTime;
        return;
    } else {
        document.getElementById('zphone').disabled = true;
        sTime = "重新发送(" + iTime + ")";
        iTime--;
    }
    setTimeout(function () {
        RemainTime()
    }, 1000)
    document.getElementById('zphone').value = sTime;
}

// 检查用户输入的手机号是否合法
function check_mobile() {

    let re = /^1[345678]\d{9}$/; //校验手机号
    let mobile = $('#mobile');
    if (re.test(mobile.val())) {
        // mobile.next().hide();
        window.error_mobile = false;
        // document.getElementById('zphone').disabled = false;
    } else {
        // $('#mobile').next().html('你输入的手机格式不正确')
        // $('#mobile').next().show();
        let error_tip = $('.error-tip');
        error_tip.text('你输入的手机格式不正确 !');
        error_tip.css('display', 'block');
        window.error_mobile = true;
        // document.getElementById('zphone').disabled = true;
    }
}