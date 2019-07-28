//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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

	//路由跳转函数
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
						// url: 'http://localhost:9090/v1/openid',
						url: 'https://api.sicnurpz.online/v1/openid',
						data: {
							appid: 'wx811aaed72af43da5',
							secret: '8b101090e568d97e266cf8a0d6d3028e',
							code: res.code
						},
						success: response => {
							let openid = response.data.bundle_data.openid;
							//可以把openid存到本地缓存，方便以后调用
							wx.setStorageSync('openid', openid);
							app.globalData.user_openid = openid;
						},
						fail: error => {
							console.log('[ERROR] - openid 解析失败...');
						}
					});
				}
			});
		}
		else {
			app.globalData.user_openid = wx.getStorageSync('openid');
		}
	},

})
