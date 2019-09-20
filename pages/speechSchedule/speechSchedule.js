// pages/speechSchedule/speechSchedule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    myhistory: [],

    // 倒计时组件是否开启
    currentCountdownOpenStatus: false,
    nextCountdownOpenStatus: false,

    // 当前展讲详情：
    currentExists: false,
    current_speechid: '',
    current_end_time: '',
    current_speaker: '某展讲人..',
    current_title: '某主题..',

    // 下次展讲详情：
    next_start_time: '',
    next_speaker: '待更新...',
    next_title: '待更新...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.flushSpeechScore();
    this.flushNextSpeech();
    this.flushMyHistoryList();
    this.flushCurrentSpeech();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  trimTime: function(time_string) {
    let _d = new Date(time_string);
    const result = _d.toLocaleDateString().split('/').join('-')
      + ' ' + _d.toTimeString().split(' ')[0];
    console.log(result);
    return result;
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
        if (res.statusCode === 429) {
          wx.lin.showToast({
            title: '请求太快啦！',
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
          return;
        }
        if (res.data.bundle_data.result instanceof Object) {
          this.setData({score: 300});
          // 提示 初始化展讲积分成功
          wx.lin.showToast({
            title: '初始化展讲积分成功!',
            icon: 'success',
          });
        } else {
          this.setData({
            score: res.data.bundle_data.result
          });
          // 提示 展讲积分刷新成功
          wx.lin.showToast({
            title: '刷新展讲积分成功!',
            icon: 'success',
          });
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
        if (res.statusCode === 429) {
          wx.lin.showToast({
            title: '请求太快啦！',
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
          return;
        }
        // console.log(res.data);
        let _result = res.data.bundle_data.result;
        _result.forEach(item => {
          const _start = new Date(item.start_time);
          const _end = new Date(item.end_time);
          item['timeGap'] = ` ${_start.toLocaleDateString()} ${_start.toLocaleTimeString('chinese', { hour12: false })} - ${_end.toLocaleTimeString('chinese', { hour12: false })}`
        });
        this.setData({
          myhistory: _result
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
   * 查询最近 [下] 一次的展讲时间
   */
  flushNextSpeech: function() {
    wx.request({
      // url: 'http://localhost:9090/v1/weixin/speech/getNext',
      url: 'https://api.sicnurpz.online/v1/weixin/speech/getNext',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 429) {
          wx.lin.showToast({
            title: '请求太快啦！',
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
          return;
        }
        if (res.statusCode < 300 && res.statusCode >= 200) {
          if (Object.keys(res.data.bundle_data.result).length > 0) { // 确实查询到了结果
            // console.log(res.data.bundle_data.result);
            const start_time_src = res.data.bundle_data.result.start_time.toString().split('T');
            const start_time_lit = start_time_src[0] + ' ' + start_time_src[1].split('.')[0];
            // 写入下次展讲的相关数据
            this.setData({
              next_title: res.data.bundle_data.result.title,
              next_speaker: res.data.bundle_data.result.speaker,
              next_start_time: start_time_lit,
              nextCountdownOpenStatus: true
            });
          }
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
    });
  },

  /**
   * 查询当前正在进行的展讲
   */
  flushCurrentSpeech: function() {
    wx.request({
      // url: 'http://localhost:9090/v1/weixin/speech/getCurrent',
      url: 'https://api.sicnurpz.online/v1/weixin/speech/getCurrent',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 429) {
          wx.lin.showToast({
            title: '请求太快啦！',
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
          return;
        }
        // console.log(res.data);
        if (res.statusCode == 204) {
          // 说明当前并没有展讲进行中...
          this.setData({
            currentExists: false,
            current_end_time: '',
            current_speaker: '无',
            current_title: '无',
          });
        } else {
          // 说明有数据，那么为其准备显示需要的数据：
          const result = res.data.bundle_data.result;
          this.setData({
            currentExists: true,
            currentCountdownOpenStatus: true,
            current_speechid: result._id,
            current_end_time: this.trimTime(result.end_time),
            current_speaker: result.speaker,
            current_title: result.title,
          });
        }
      },
      fail: (err) => {
        console.log(err.errMsg);
        wx.lin.showToast({
          title: '获取当前进行展讲出错!',
          icon: 'error',
        });
      },
    });
  },

  /**
   * 跳转到正在进行中的展讲的页面
   */
  jumpToCurrentSpeechPage: function() {
    wx.navigateTo({
      url: '/pages/currentSpeech/currentSpeech' +
        `?cur_title=${this.data.current_title}` +
        `&cur_speaker=${this.data.current_speaker}` +
        `&cur_endtime=${this.data.current_end_time}` +
        `&cur_speechid=${this.data.current_speechid}`,
    });
  },

})