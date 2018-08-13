var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var controlManger;
var audio = new root.audioControl();
var flag = false;
function bindEvent(data) {
    $scope.on("play:change",function(event,index){
        audio.getAudio(songList[index].audio);
        if(audio.stats == "play" || flag){
            audio.play();
            // root.pro.start();
            $scope.find('.play-btn').addClass("pause")
            flag = false;
        }
        root.pro.renderAllTime(songList[index].duration);
        root.render(songList[index]);
    })
    // 移动端click有300ms 延迟
    $scope.on("click", ".prev-btn", function () {
        // if (index === 0) {
        //     index = songList.length - 1;
        // }else{
        //     index--;
        // }
        var index = controlManger.prev();
        root.pro.start(0);
        flag = true;
        $scope.trigger("play:change",index);
    })
    $scope.on("click", ".next-btn", function () {
        // if(index === songList.length - 1){
        //     index = 0;
        // }else{
        //     index++;
        // }
        var index = controlManger.next();
        root.pro.start(0);
        flag = true;
        $scope.trigger("play:change",index);
    })
    $scope.on("click",".play-btn",function(){
        if(audio.status=="play"){
            audio.pause();
            root.pro.stop();
        }else{
            audio.play();
            root.pro.start();
        }
        $(this).toggleClass("pause");
    })
    $scope.on("click",".list-btn",function(){
        root.playList(data);
        $scope.on("click",".play-list li",function(){
            var index = $(this).index();
            $(this).addClass("now-play").siblings().removeClass("now-play");      
            flag = true;
            $scope.trigger("play:change",index);
        })
        $scope.on("click",".play-list .close-list",function(){
            $scope.find('.play-list').css({"display":"none"});
        })
    })
}
function bindTouch(){
    var $slider = $scope.find('.slider-pointer');
    var offset = $scope.find('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;
    $slider.on('touchstart',function(){
        root.pro.stop();
    }).on('touchmove',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left)/width;
        if(per > 0 && per <= 1){
            root.pro.update(per);
        }
    }).on('touchend',function(e){
        var x = e.changedTouches[0].clientX;
        var per = (x - left)/width;
        if(per > 0 && per <= 1){
            var curTime = per * songList[controlManger.index].duration;
            audio.playTo(curTime);
            $scope.find('.play-btn').addClass('pause');
            root.pro.start(per);
        }
    })
}
function getData(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            root.render(data[0]);
            songList = data;
            bindEvent(data);
            bindTouch();
            controlManger = new root.controlManger(data.length);
            // console.log(data[0]);
            $scope.trigger("play:change",0);
        },
        error: function () {
            console.log("error");
        }
    })
}

getData("../mock/data.json");
