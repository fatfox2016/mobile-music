(function ($, root) {
    var $scopt = $(document.body);
    function showList(data){
        var listStr = '',
            len = data.length;
        for(var i=0;i<len;i++){
            listStr += (function(j){
                return showInfo(data[j]);
            })(i);
        }
        $scopt.find('.play-list .music-info').html(listStr);
        $scopt.find('.play-list').css({"display":"block"});
    }
    function showInfo(info) {
        var str = '';
        return str = '<li><a href="javascript:void(0)">\
                        <span>' + info.song + '</span>\
                        <span>' + info.singer + '</span>\
                        <span>' + info.album + '</span>\
                    </a></li>'
    }
    root.playList = function playList(data){
        showList(data);
    }

})(window.Zepto, window.player || (window.player = {}))