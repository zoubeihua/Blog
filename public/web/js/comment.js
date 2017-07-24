function Config() {
    this.commCotent = null;
    this.commList = null;
    this.commArr = [];
    this.settings = {
        getComment: function () { }
    }
}
Config.prototype.comments = function (opt) {
    var That = this;
    this.commCotent = document.getElementById(opt.commCotentId);
    this.commList = document.getElementById(opt.commListId);
    extend(this.settings, opt);
    this.settings.getComment(this.commCotent.value);
    this.commArr.push(this.commCotent.value);

}
Config.prototype.CreaElm = function (obj) {
    this.commList.innerHTML = '';
    $('#commlen').html(obj.length)
    for (var i = 0; i < obj.length; i++) {
        var creaLi = document.createElement('li');
        creaLi.className = "clearfix";
        // this.commList.insertBefore(creaLi, this.commList.childNodes[0]);
        this.commList.appendChild(creaLi);

        var creaImg = document.createElement('img');
        creaImg.src = '/public/web/images/s8.jpg';
        creaLi.appendChild(creaImg);

        var creaP = document.createElement('p');
        creaP.innerHTML = obj[i].commContent;
        creaLi.appendChild(creaP);

        var creaT = document.createElement('p');
        creaT.className = 'times'
        creaT.innerHTML = Formdate(obj[i].commenTime);
        creaLi.appendChild(creaT);
    }
}
function comment() {
    var comm = new Config();
    var commCont;
    var contentid = document.getElementById('contentid').value
    comm.comments({
        commCotentId: 'commCotent',
        commListId: 'commList',
        getComment: function (obj) {
            commCont = obj
        }
    })
    var requestData = {
        commentid: contentid,
        commContent: commCont
    }

    $.ajax({
        type: 'POST',
        url: '/api/comment',
        data: requestData,
        dataType: 'json',
        success: function (result) {
            comm.CreaElm(result.data.comments.reverse());
        }
    })
}

$.ajax({
        type: 'GET',
        url: '/api/commentlist',
        data:{commentid:document.getElementById('contentid').value},
        success: function (result) {
            $('#commlen').html(result.data.length)
            var comm = new Config();
                comm.comments({
                commCotentId: 'commCotent',
                commListId: 'commList'
         })
       
            comm.CreaElm(result.data.reverse());
        }
    })
window.onload = function(){
    var init = new Init();
    init.page({
        id:'pages',
        curpage:1,
        limitPage:3,
        pageCount:8
    })
}
     
/**
 * 时间格式
 */
function Formdate(date){
    var Time = new Date(date);
    return Time.getFullYear() + '-' + (Time.getMonth()+1) + '-' + Time.getDate() + '\t' + Time.getHours() + ':' + Time.getMinutes() + ':' + Time.getSeconds(); 
}
function extend(setingobj, optobj) {
    for (var attr in optobj) {
        setingobj[attr] = optobj[attr];
    }
}