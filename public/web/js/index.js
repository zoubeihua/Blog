function longtab(type){
    var login = document.getElementById('login');
    var reg = document.getElementById('reg');
    if(type == 1){
        login.className = '';
        reg.className = 'hidden';
    }else{
        login.className = 'hidden';
        reg.className = '';
    }
}
//注册
function register(){
    var username = document.getElementsByName('username')[0].value;
    var password = document.getElementsByName('password')[0].value;
    var requestData = {'username':username,'password':password}
    $.ajax({
        type:'POST',
        url:'/api/user/register',
        data:requestData,
        dataType:'json',
        success:function(result){
            alert(result.message);
            if(!result.code){
               setTimeout(function() {
                    longtab(1);
               }, 1000);
            }
        }
    })
}

// 登录
function login(){
    var username = document.getElementsByName('username')[0].value;
    var password = document.getElementsByName('password')[0].value;
    var loginInfo = document.getElementById('loginInfo');
    var userInfo = document.getElementById('userInfo');
    var myname = document.getElementById('myname');
    var requestData = {'username':username,'password':password}
    $.ajax({
        type:'POST',
        url:'/api/user/login',
        data:requestData,
        dataType:'json',
        success:function(result){
            alert(result.message);
            if(!result.code){
                setTimeout(function() {
                 window.location.reload();
                }, 1000);
            }
        }
    })
}

//退出
function logout(){
    $.ajax({
        type:'get',
        url:'/api/user/logout',
        success:function(result){
            if(!result.code){
                window.location.reload();
            }
        }
    })
}