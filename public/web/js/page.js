/**
 * Page参数定义
 * Page({
 * id:创建分页元素的id
 * curpage:当前分页或者后台传来的当前页
 * countpage:后台传来的总页数
 * })
 */

//构造函数
function Config(){
    this.obj = null;
    this.setting = {//默认参数
    }
}

Config.prototype.Page = function(opt){
    var That = this;
    var crEla = null;
    var index = null;
    this.obj = document.getElementById(opt.id);
    extend(this.setting,opt);
    for(var i = 0; i < opt.countpage; i++){
        index = i + 1;
        crEla = document.createElement('a');
        crEla.innerHTML = index;
        crEla.id = index;
        crEla.className = "";
        crEla.href = '?category='+ opt.category+'&page=' + index;
        this.obj.appendChild(crEla);
        if(crEla.id == opt.curpage){
            crEla.className = "curpage";
            crEla.href ="javascript:0;";
        }
    }
    if(opt.countpage > 1){
        crnext = document.createElement('a');
        crnext.innerHTML = '>';
        crnext.title = '下一页';
        crlast = document.createElement('a');
        crlast.innerHTML = '>>';
        crlast.title = '尾页';
        this.obj.insertBefore(crlast,this.obj.children[index]);
        this.obj.insertBefore(crnext,this.obj.children[index]);
        crnext.onclick = function(){
            That.next(this,That); //下一页
        }
        crlast.onclick = function(){
            That.last(this,That); //尾页
        }
    }
    if(opt.curpage > 1){
        crprev = document.createElement('a');
        crprev.innerHTML = '<';
        crprev.title = '上一页';
        crfirst = document.createElement('a');
        crfirst.innerHTML = '<<';
        crfirst.title = '首页';
        this.obj.insertBefore(crprev,this.obj.children[0]);
        this.obj.insertBefore(crfirst,this.obj.children[0]);
        crprev.onclick = function(){
            That.prev(this,That);//上一页
        }
        crfirst.onclick = function(){
            That.first(this,That);//首页
        }
    }
}

//下一页
Config.prototype.next = function(obj,opt){
    var pnext = opt.setting.countpage;
    var carrier = pnext;
    pnext++;
    if(pnext > opt.setting.curpage){
        pnext = carrier;
    }
    obj.href = '?category='+opt.setting.category+'&page=' + pnext;
}
//尾页
Config.prototype.last = function(obj,opt){
    var plast = opt.setting.countpage;
    obj.href = '?category='+opt.setting.category+'&page=' + plast;
}

//上一页
Config.prototype.prev = function(obj,opt){
    var pprev = opt.setting.curpage;
    pprev--;
    if(pprev < opt.setting.curpage){
        pprev = 1;
    }
   window.location.href = '?category='+opt.setting.category+'&page=' + pprev;
}
//首页
Config.prototype.first = function(obj,opt){
     window.location.href = '?category='+opt.setting.category+'&page=1';
}
//继承对象
function extend(thisobj,curobj){
    for(var attr in curobj){
        thisobj[attr] = curobj[attr];
    }
}