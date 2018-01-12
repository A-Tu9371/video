function Select() {
  this.memberId = '';
}
Select.prototype = {
  constructor: Select,
  init: function() {
    var that = this;
    that.memberId = that.getURLParameter('memberId');
    $('.entry').on('click', function() {
      var type = $(this).data('type');
      location.href = 'reservation.html?memberId=' + that.memberId + '&type=' + type;
    })
  },
  initShare: function() {
    var that = this;
    /**
     * 微信自定义分享
     */
    var shareUrl = window.location.href, // 分享链接   「美着呢」
      activityTitle = that.shareObj.title, // 分享标题
      activityDesc = that.shareObj.content, // 分享描述
      imgUrl = that.shareObj.thumImageSrc; // 分享图标

    var currentUrl = location.href.split('#')[0]; // 当前页面url，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败
    var url = that.fnGetAllIp('user/loginByWebchat?type=8&questionId=') + that.questionId;

    //自定义微信分享
    // url:处理微信分享的请求， debug：是否开启调试模式，自定义分享链接， 分享标题， 分享简介
    that.share(url, false, shareUrl, activityTitle, activityDesc, imgUrl);
  },
  share: function(url, isDebug, shareUrl, activityTitle, activityDesc, imgUrl) {
    var shareIcon = imgUrl;
    if (shareIcon == "") {
      shareIcon = "";
    }
    $.ajax({
      type: 'POST',
      url: url,
      dataType: "json",
      success: function(data) {
        wx.config({
          debug: isDebug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.wxResult.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.wxResult.nonceStr, // 必填，生成签名的随机串
          signature: data.wxResult.signature, // 必填，签名，见附录1
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.checkJsApi({
          jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
          success: function(res) {}
        });

        wx.ready(function() {
          // 分享到朋友圈
          wx.onMenuShareTimeline({
            title: activityTitle, // 分享标题
            link: shareUrl, // 分享链接
            imgUrl: shareIcon, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });

          // 分享给朋友
          wx.onMenuShareAppMessage({
            title: activityTitle, // 分享标题
            desc: activityDesc, // 分享描述
            link: shareUrl, // 分享链接
            imgUrl: shareIcon, // 分享图标
            success: function() {
              // 用户确认分享后执行的回调函数
            },
            cancel: function() {
              // 用户取消分享后执行的回调函数
            }
          });
        });
        wx.error(function(res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      },
      error: function() {}

    });
  },
  /* 获取url参数 */
  getURLParameter: function(paramName, str) {

    var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      var temp = decodeURI(r[2]);
      if (temp != null && temp.indexOf("null") < 0 && temp.toString().length > 0) {
        return temp;
      } else {
        return str;
      }
    } else {
      return str;
    }

  },
  /* 设置元素高度  */
  fnGetFlowPx: function(nPx, designWidth) {
    return document.documentElement.clientWidth * nPx / designWidth + 'px'
  },
  /* http 转换 https */
  fnGetHttpOrHttps: function(sUrl) {
    return sUrl.replace(/(http.?\:)(.+)/, function(sNative, child1, child2) {
      return "" + location.protocol + child2;
    });
  },
  /* 获取动态ip */
  fnGetAllIp: function() {
    var that = this;
    var sAfterUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

    var pathName = document.location.pathname;
    var projectName = pathName.substring(0, pathName.substr(1).indexOf("/") + 1) + "/";
    return that.fnGetHttpOrHttps("http://" + location.host + projectName + sAfterUrl);
  },
}

window['select'] = new Select();
select.init();
