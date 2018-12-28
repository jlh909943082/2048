function isWeixin() {
  return new Promise((resolve, reject) => {
    var ua = navigator.userAgent.toLowerCase();
    // if(ua.match(/MicroMessenger/i)=='micromessenger'){
    if (true) {
      resolve()
    } else {
      reject()
    }
  })
}

function canBeginGame() {
  $(document).ready(function () {
    //显示错误的信息
    function showErr(msg) {
      $(".errtip").text(msg).fadeIn();
      setTimeout(function () {
        $(".errtip").fadeOut();
      }, 2000)
    }
    
    //获取地址栏参数的方法
    function GetQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    
    //获取地址栏参数
    let uinfo_json;
    if (GetQueryString('uinfo_json')) {
      sessionStorage.setItem("uinfo_json", GetQueryString('uinfo_json'));
      uinfo_json = JSON.parse(GetQueryString('uinfo_json'));
    } else {
      uinfo_json = JSON.parse(sessionStorage.getItem("uinfo_json"));
    }
    console.log(uinfo_json)
    // 初始化昵称和头像
    if (uinfo_json && uinfo_json.nickname) {
      $(".nickname span").text(uinfo_json.nickname);
    }
    if (uinfo_json && uinfo_json.headimgurl) {
      $(".nickname img").attr("src", uinfo_json.headimgurl);
    }
    
    //获得每一关的信息
    $.ajax({
      url: "http://ggapi.bayuenet.com:8080/SGame/getDuNaiUserInfo",
      type: "post",
      dataType: "json",
      // beforeSend: function(xhr) {
      //   xhr.setRequestHeader("ACCESSTOKEN:'123'");
      //   xhr.setRequestHeader("CLIENTONE:'123'");
      //   xhr.setRequestHeader("TIMESTAMP:'123'");
      // },
      // headers:{'ACCESSTOKEN':'123','CLIENTONE':'123','TIMESTAMP':'123'},
      data: {
        apiversion: "v.1.0",
        apisafecode: "Game.Test",
        uuid: "1C5D2643ACA48C3BDA3251E4C4A75303",
        openid: uinfo_json.openid
      },
      success: function (data) {
        var results = data.return_data;
        var codesObj = [];
        var checkPoints = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth","Eleventh","Twelfth"];
        for (var i = 0; i < 13; i++) {
          let checkPoint = checkPoints[i];
          let prevPoint = checkPoints[i-1];
          let nextPoint = checkPoints[i+1];
          //解锁条件：上一关的最高分大于现在这关的解锁分
          if(i === 0 || (+results[prevPoint+"HBestCode"]) >= (+results[checkPoint+"HOpenCode"])) {
            //已解锁
            $(".points li").eq(i).data("open",true);
            $(".points li").eq(i).data("openScore",results[nextPoint+"HOpenCode"]);
            let img = $(".points li").eq(i).children("img");
            img.attr("src",img.data("img"))
          }else {
          //  还未解锁
            $(".points li").eq(i).data("open",false);
          }
        }
      }
    })
    
    //开启关闭背景音乐
    $(".selfInfo .bgm").on("click", function () {
      $(this).toggleClass("active")
      //  todo
      
      
    })
    //绑定手机
    $(".selfInfo .bondPhone").on("click", function () {
      $(".mask.bondPhoneFrame").show();
    })
    //获取验证码
    $(".mask .inputItem button").on("click", function () {
      let phone = $(".mask .inputItem .phone").val();
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone.trim()))) {
        showErr("请输入正确的手机号")
        return;
      }
      //  todo
      
      
    })
    //关闭按钮
    $(".mask .closeBtn").on("click", function () {
      $(".mask .inputItem input").val("");
      $(".mask").hide();
    })
    //确认提交按钮
    $(".mask .confirmBtn").on("click", function () {
      let phone = $(".mask .inputItem .phone").val();
      let code = $(".mask .inputItem .code").val();
      if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone.trim()))) {
        showErr("请输入正确的手机号")
        return;
      }
      if (!code.trim()) {
        showErr("请输入正确的验证码")
        return;
      }
      //todo
      
      
      $(".mask .inputItem input").val("");
      $(".mask").hide();
    })
    
    //  进入下一关
    $(".points li").on("click", function () {
      //表示第几关
      var index = $(".points li").index($(this));
      if($(this).data("open")) {
      //  已解锁
        let openScore = $(this).data("openScore");
        location.href = "./index.html?pointIndex=" + index + "&openScore=" + openScore;
      }else {
      //  未解锁
        showErr("此关还未解锁");
      }
    })
  });
}

isWeixin()
  .then(canBeginGame)
  .catch(() => {
    document.querySelector(".cannotBegin").style.display = "block";
  })