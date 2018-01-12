function Reservation() {
  this.memberId = "583ba1dde7374718d0c4f773"; //测试号
  this.render = null;
  this.type = "";
  this.vueData = {};
  this.isPersonal = false;
  this.cityList = [];
}
Reservation.prototype = {
  constructor: Reservation,
  init: function() {
    var that = this;
    that.type = that.getURLParameter("type");
    if (that.type == 1) {
      that.isPersonal = true;
    }
    that.getCity();


  },
  getCity: function() {
    var that = this;
    $.ajax({
      type: "POST",
      url: 'https://mp.meidaojia.com/testMdj/wxMain/getCity',
      dataType: "json",
      data: {

      },
      timeout: 1E4,
      success: function(r) {
        if (!r.status) {
          that.cityList = r.data.cityList;
          that.handleRender(that.type);
        }
      }
    })
  },
  handleRender: function(type) {
    var that = this;
    that.vueData = {
      isPersonal: that.isPersonal,
      hasRecord: false, //有预约记录
      showForm: false,
      showPersonalQrcode: false,
      cityList: that.cityList,
      city: 0,
      mobile: "",
      note: ""
    };
    that.render = new Vue({
      el: '#wrap',
      data: that.vueData,
      methods: {
        // 团体预约
        reserve: function() {
          this.showForm = true;
        },
        cancel: function() {
          this.showForm = false;

        },
        submit: function() {
          if (!!that.checkTel(this.mobile)) {
            $.ajax({
              type: "POST",
              url: 'http://mp.meidaojia.com/testActivity/nianhui/saveAppoint',
              dataType: "json",
              data: {
                city: this.cityList[this.city - 1],
                note: this.note,
                mobile: this.mobile,
                memberId: that.memberId
              },
              timeout: 1E4,
              success: function(r) {
                if (!r.status) {
                  console.log(r);
                }
              }

            });
          } else {
            alert('联系方式不正确')
          }

        }
      }
    });
    that.bind_event();
  },
  bind_event: function() {
    var that = this;
    $('.city').on('change', function() {
      if ($(this).val() != 0) {
        $(this).css('color', '#333');
      } else {
        $(this).css('color', '#999');
      }

    })
  },
  checkTel: function(tel) {
    var mobile = /^1[3|4|5|7|8]\d{9}$/,
      phone = /^0\d{2,3}-?\d{7,8}$/;
    return mobile.test(tel) || phone.test(tel);
  },
  /* 设置元素高度  */
  fnGetFlowPx: function(nPx, designWidth) {
    return document.documentElement.clientWidth * nPx / designWidth + 'px';
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
};
window.reservation = new Reservation();
reservation.init();
