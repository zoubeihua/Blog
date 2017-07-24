/**
 * curpage:当前页
 * limitPage:每页显示多少条数据
 * PageCount:总页数
 */
function Init(){
    this.obj = null;//分页的父元素
    this.crprev = null;//上页
    this.crfirst = null;//首页
    this.crnext = null;//下页
    this.crlast = null; //尾页
    this.creflag = true;//创建上页下页首页尾页开关
    this.crenextflag = true;
    this.setting = {};
}
Init.prototype.page = function(opt){
    var _this = this;
    this.obj = document.getElementById(opt.id);
    extend(this.setting,opt);
    for(var i = 0; i < opt.pageCount; i++){
        var index = i + 1;
        var creaElmA = document.createElement('a');
        creaElmA.innerHTML = index;
        creaElmA.id = index;
        creaElmA.onclick = function(){
            _this.curClick(this);
        }
        this.obj.appendChild(creaElmA);
        if(creaElmA.id == opt.curpage){
            creaElmA.className = 'curpage';
        }
    }
    if(opt.curpage<= 1){
        if(this.crprev){
            this.obj.removeChild(this.crprev)
            this.obj.removeChild(this.crfirst)
        }
        
    }else{
       _this.creaprev();
    }
    if(opt.curpage >= opt.pageCount){
        if(this.crnext){
            this.obj.removeChild(this.crnext)
            this.obj.removeChild(this.crlast)
        }
    }else{
        _this.creanext();
    }
}
//创建上一页和首页
Init.prototype.creaprev = function(){
    this.crprev = document.createElement('a');
    this.crprev.innerHTML = '<';
    this.crprev.title = '上一页';
    this.crfirst = document.createElement('a');
    this.crfirst.innerHTML = '<<';
    this.crfirst.title = '首页';
    this.obj.insertBefore(this.crprev,this.obj.children[0]);
    this.obj.insertBefore(this.crfirst,this.obj.children[0]);
}
//创建下页和尾页
Init.prototype.creanext = function(){
    this.crnext = document.createElement('a');
    this.crnext.innerHTML = '>';
    this.crnext.title = '下一页';
    this.crlast = document.createElement('a');
    this.crlast.innerHTML = '>>';
    this.crlast.title = '尾页';
    this.obj.appendChild(this.crnext);
    this.obj.appendChild(this.crlast);
    
}
//点击每页
Init.prototype.curClick = function(obja){
    var page =  this.setting.curpage = obja.id;
    if(page <= 1){
        if(this.crprev){
            this.creflag = true;
            this.obj.removeChild(this.crprev)
            this.obj.removeChild(this.crfirst)
        }
    }else{
        if(this.creflag){
            this.creaprev();
            this.creflag = false;
        }
    }
    if(this.setting.curpage >= this.setting.pageCount){
       if(this.crnext){
            this.crenextflag = true;
            this.obj.removeChild(this.crnext);
            this.obj.removeChild(this.crlast);
       }
    }else{
        if(this.crenextflag){
            this.creanext();
            this.crenextflag = false;
        }   
    }
    for(var elm in this.obj.children){
        this.obj.children[elm].className = ''
    }
    obja.className = 'curpage';
           
}
function extend(thisseting,opt){
    for(var attr in opt){
        thisseting[attr] = opt[attr];
    }
}