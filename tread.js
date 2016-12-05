function treadBox(){

    this.win = $(window);
    this.treadMain = $('.tread-main');
    this.rows = 5;   //行数
    this.cols = 5;   //列数
    this.timer = null; //定时器
    this.lastDiv = null; // 最后一行
    this.queue = []; // 队列
    this.minute = 0; // 分数

}    
//初始化方法
treadBox.prototype.init = function(){

    this.setInt();
    this.begin();

}
//初始化数据
treadBox.prototype.setInt = function(){
    
    var divH = this.getH()/this.rows;
    this.divH = divH;

    var html = '<div class="tread-ss">';
    for( var i=0;i<this.rows;i++ ){
        html += '<div class="tread-box">';
        var ranNum = randomNum(0,this.cols-1);
        for( var j=0;j<this.cols;j++ ){

            if( i == this.rows-1 ){

                if( j == 2 ){

                    html += '<div class="yellow begin" style="height:'+ this.divH +'px;line-height:'+ this.divH +'px;">开始</div>';    
                
                }else{

                    html += '<div class="yellow" style="height:'+ this.divH +'px;line-height:'+ this.divH +'px;"></div>';    
                
                }
                
            }else if( ranNum == j ){
                
                html += '<div class="back" style="height:'+ this.divH +'px"></div>';

            }else{

                html += '<div class="white" style="height:'+ this.divH +'px"></div>';                
            
            }

        }

        html += '</div>';

    }
    html += '</div>';
    this.treadMain.html(html);
    this.insertDiv();

}
//插入div
treadBox.prototype.insertDiv = function(){
    
    var html = '<div class="tread-ss">';
    for( var i=0;i<this.rows;i++ ){
        html += '<div class="tread-box">';
        var ranNum = randomNum(0,this.cols-1);
        for( var j=0;j<this.cols;j++ ){

            if( ranNum == j ){
                
                html += '<div class="back" style="height:'+ this.divH +'px"></div>';

            }else{

                html += '<div class="white" style="height:'+ this.divH +'px"></div>';                
            
            }

        }

        html += '</div>';
        
    }
    html += '</div>';
    this.treadMain.prepend(html);

    this.getQueue();
}
//队列
treadBox.prototype.getQueue = function(){

    if( this.queue ){
        this.queue = [];
    }

    var len = $('.back').length;

    for( var i = 0;i<len;i++ ){
        this.queue.push( $('.back').eq(i) );
    }

    this.queue = this.queue.reverse();

}
//开始游戏事件
treadBox.prototype.begin = function(){

    this.begin = $('.begin');
    var that = this;
    console.log(this.begin);
    this.begin.tap(function(){
        console.log(11);
        that.getLastDiv();
        that.animate();
        that.bindBegin();

    });

}
//开始游戏事件；
treadBox.prototype.bindBegin = function(){
    
    var that = this;
    
    //白色方块 点击事件;
    $('.white').on('tap',function(){
      
        clickWhite();

    });

    //黑色方块 点击事件;
    clickBack();

    function clickBack(){
        if( that.queue[0] ){
            $(that.queue[0]).on('tap',function(){
                
                that.minute++;
                $(this).removeClass('back').addClass('white');

                //取消点击事件 添加"输"事件 (有问题)
                $(this).off('tap');
                $(this).on('tap',function(){
                    that.lose();
                });
                
                that.queue.shift();

                clickBack();
            
            });    
        }
        
    }

    function clickWhite(){
        
        that.lose();
        
    }
}
//运动方法
treadBox.prototype.animate = function(){
    var n = 0;
    var that = this;
    this.timer = setInterval(function(){
        
        n = n+40;
        
        //运动
        that.treadMain.css({
            'bottom': -n 
        });

        //超出屏幕
        that.fnExceed();

        //黑方框的碰撞检测
        that.collision();

    },150);

}
//获取最后一行
treadBox.prototype.getLastDiv = function(){
    
    this.lastDiv = this.treadMain.find('.tread-ss:last-child');

}
//超出添加
treadBox.prototype.fnExceed = function(){

    var winh = this.getH();

    if( parseFloat( this.lastDiv.offset().top ) > winh ){
        
        this.lastDiv.remove();
        this.lastDiv = '';
        this.getLastDiv();
        clearInterval( this.timer );
        this.treadMain.css('bottom',0);
        this.insertDiv();
        this.animate();
    }

}
//黑块触碰底部
treadBox.prototype.collision = function(){

    var winh = this.getH();

    if( this.queue[0] ){

        if( parseFloat( $(this.queue[0]).offset().top + $(this.queue[0]).height() ) > winh ){

            this.lose();

        }

    }

}
//输
treadBox.prototype.lose = function(){

    clearInterval( this.timer );
    alert('你输了!共得' + this.minute + '分');
    window.location.href = window.location.href;

}
//屏幕高
treadBox.prototype.getH = function(){

    return this.win.height();

}
//屏幕宽
treadBox.prototype.getW = function(){

    return this.win.width();

}
//随机方法;
function randomNum( start,end ){
    
    return parseInt(Math.random()*(end-start+1)+start);

}