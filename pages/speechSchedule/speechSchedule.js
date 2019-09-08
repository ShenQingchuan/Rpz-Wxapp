// pages/speechSchedule/speechSchedule.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    score: 0,
    myhistory: [],

    // 下次展讲详情：
    next_start_time: '2019-12-31 12:00',
    next_speaker: '待更新...',
    next_title: '待更新...',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
    this.flushSpeechScore();
    this.flushLatestSpeech();
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

  /**
   * 刷新干事展讲积分方法：
  */
  flushSpeechScore: function() {
    const _openid = wx.getStorageSync('openid');
    wx.request({
      // url: `http://localhost:9090/v1/weixin/speech/score?openid=${_openid}`,
      url: `https://api.sicnurpz.online/v1/weixin/speech/score?openid=${_openid}`,
      method: 'GET',
      success: (res) => {
        if (res.data.bundle_data.result instanceof Object) {
          this.setData({score: 2000});
          // 提示 初始化展讲积分成功
          wx.lin.showToast({title: '初始化展讲积分成功!',icon: 'success',});
        } else {
          this.setData({score: res.data.bundle_data.result});
          // 提示 展讲积分刷新成功
          wx.lin.showToast({title: '刷新展讲积分成功!',icon: 'success',});
        }
      },
      fail: (err) => {
        // 在控制台打印错误信息
        console.log(err.errMsg);
        wx.lin.showToast({
          title: '刷新展讲积分失败!',
          icon: 'error',
        });
      }
    });
  },

  /**
   * 刷新自己的展讲历史记录：
   */
  flushMyHistoryList: function() {
    const _openid = wx.getStorageSync('openid');
    wx.request({
      // url: `http://localhost:9090/v1/weixin/speech/myHistory?openid=${_openid}`,
      url: `https://api.sicnurpz.online/v1/weixin/speech/myHistory?openid=${_openid}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          myhistory: res.data.bundle_data.result
        });
        wx.lin.showToast({
          title: '刷新个人展讲历史记录成功!',
          icon: 'success',
        });
      },
      fail: (err) => {
        // 在控制台打印错误信息
        console.log(err.errMsg);
        wx.lin.showToast({
          title: '刷新个人展讲历史记录失败!',
          icon: 'error',
        });
      }
    });
  },

  /**
   * 查询最近一次的展讲时间
   */
  flushLatestSpeech: function() {
    wx.request({
      // url: 'http://localhost:9090/v1/weixin/speech/getLatest',
      url: 'https://api.sicnurpz.online/v1/weixin/speech/getLatest',
      method: 'GET',
      success: (res) => {
        if(res.statusCode < 300 && res.statusCode >= 200) {
          const start_time_src = res.data.bundle_data.result.start_time.toString().split('T');
          const start_time_lit = start_time_src[0] + ' ' + start_time_src[1].split('.')[0];
          // 写入下次展讲的相关数据
          this.setData({
            next_title: res.data.bundle_data.result.title,
            next_speaker: res.data.bundle_data.result.speaker,
            next_start_time: start_time_lit
          });
        } else {
          wx.lin.showToast({
            title: `获取下次展讲失败!错误代码: ${res.data.error_code}`,
            icon: 'error',
          });
        }
      },
      fail: (err) => {
        console.log(err.errMsg);
        wx.lin.showToast({
          title: '获取下次展讲信息出错!',
          icon: 'error',
        });
      },
    })
  },

})