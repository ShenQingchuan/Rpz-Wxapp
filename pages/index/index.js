//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    truename: '',
    truenameRules: [{
      required: true,
      type: 'string',
      min: 2,max: 5,message: "长度在2-5个汉字之间"}],
    inMask: true,

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      });
    }
  },

	//工作日程路由跳转函数
	goCalendarPage(){
		wx.navigateTo({
			url: '/pages/calendar/calendar',
		});
	},

	//页面准备就绪时的生命周期函数：
	onReady(){

		// 检查 session 过期与否
		wx.checkSession({
			success: res=>{
				console.log("INFO - session_key 有效...");
				this.getOpenID();
        // 如果存储过实名制信息，则可以去掉遮罩了
        if (wx.getStorageSync('truename').length != 0) {
          this.setData({ inMask: false });
        }
			},
			fail: err=>{
				console.log("ERROR - session key 过期...");
				this.getOpenID();
			}
		});
		
	},


	// 根据解析得到的 openid数据 写入本页面对象的 AppData
	// 本方法能确保 index 页面的 AppData 中、本地 wxStorage 有正确的用户 openid 字符串
	getOpenID() {
		let app = getApp();
		if (wx.getStorageSync('openid').length == 0) {
			wx.login({
				success: (res) => {    //请求自己后台获取用户openid
					console.log('INFO - 开始请求解析以取得openid');
					wx.request({
						method: 'GET',
						url: 'http://localhost:9090/v1/weixin/openid',
						// url: 'https://api.sicnurpz.online/v1/weixin/openid',
						data: {
							appid: 'wx811aaed72af43da5',
							secret: '8b101090e568d97e266cf8a0d6d3028e',
							code: res.code
						},
						success: response => {
              console.log(response);
							let openid = response.data.bundle_data.wx_bundle.openid;
              if (response.data.bundle_data.officer_realname_status) {
                // 如果 后端mongodb中该干事实名信息已存在
                this.setData({
                  inMask: !response.data.bundle_data.officer_realname_status
                }); // 取消遮罩
                wx.setStorageSync('truename', 'any:yes');
              }
              
							//可以把openid存到本地缓存，方便以后调用
							wx.setStorageSync('openid', openid);

							app.globalData.user_openid = openid;
              console.log('getOpenID 执行成功...');
						},
						fail: error => {
							console.log('[ERROR] - openid 解析失败...');
						}
					});
				}
			});
		} else {
			app.globalData.user_openid = wx.getStorageSync('openid');
		}
	},

  // 在用户没有给后台提供本openid的真实姓名前 点击遮罩而触发的绑定事件：
  showMaskToast() {
    wx.lin.showToast({
      title: '请先告诉我你的真实姓名~',
      icon: 'error',
      iconStyle: 'color:orange; size: 60',
    })
  },

  // 正在输入真实姓名的监听事件：
  onInputTrueName(e) {
    this.setData({
      truename: e.detail.detail.value
    });
  },

  /**
	 * 输入真实姓名结果校验的方法：
	 */
  validate(e) {
    if (e.detail.isError) {
      for (let i = 0; i < e.detail.errors.length; i++) {
        wx.lin.showToast({
          title: e.detail.errors[i].message,
          icon: 'error',
          iconStyle: 'color: red; size: 60',
        });
      }
      this.setData({
        truename: ''
      });
    }
  },

  // 提交真实姓名按钮点击事件：
  submitTrueName() {
    let openid = wx.getStorageSync('openid')
    wx.request({
      url: 'http://localhost:9090/v1/weixin/initOfficer',
      // url: 'https://api.sicnurpz.online/v1/weixin/initOfficer',
      method: 'POST',
      data: {
        "openid": openid,
        "truename": this.data.truename
      },
      success: response => {
        //后台创建本干事实名信息成功，撤下 mask
        if(response.statusCode !== 406) {
          this.setData({
            inMask: false
          });
          wx.setStorage({
            key: 'truename',
            data: this.data.truename
          });
          wx.lin.showToast({
            title: '创建实名信息成功！',
            icon: 'success',
            iconStyle: 'color: green; size: 60',
          });
        } else {
          wx.lin.showToast({
            title: '创建实名信息请求失败！',
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
        }
      },
      fail: error => {
        wx.lin.showToast({
          title: '创建实名信息请求失败！',
          icon: 'error',
          iconStyle: 'color: red; size: 60',
        });
      }
    })
  }

})
