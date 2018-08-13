// 进度条模块
(function ($, root) {
    var $scope = $(document.body);
    var curDuration;
    var frameId;
    var startTime, lastPer = 0;
    // 渲染每一首歌的总时间
    function renderAllTime(time) {
        // console.log(lastPer);
        lastPer = 0;
        curDuration = time;
        // 时间格式转换
        time = formatTime(time);
        $scope.find('.all-time').html(time);
    }
    // 时间格式转换
    function formatTime(t) {
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }
    //开始时间
    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        startTime = new Date().getTime();
        // console.log(lastPer);
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPer + (curTime - startTime) / (curDuration * 1000);
            if (percent <= 1) {
                update(percent);
                frameId = requestAnimationFrame(frame);
                // console.log('new:' + frameId);
            } else {
                cancelAnimationFrame(frameId);
            }
        }
        frame();
    }
    // 停止计时
    function stop() {
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000);
    }
    // 更新区域   左侧时间+进度条运动
    function update(per) {
        var curTime = curDuration * per;
        curTime = formatTime(curTime);
        $scope.find('.cur-time').html(curTime);
        var perX = (per - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    }
    root.pro = {
        renderAllTime: renderAllTime,
        update:update,
        start: start,
        stop: stop
    }
})(window.Zepto, window.player || (window.player = {}));