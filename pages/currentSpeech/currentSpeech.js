// pages/currentSpeech/currentSpeech.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 从上页给的options传来的数据
    current_speechid: '',
    current_title: '',
    current_speaker: '',
    current_end_time: '',
    current_sicnuid: '',

    // 签到相关
    didMeSign: false,
    input_name: '',
    input_sicnuid: '',
    signedList: [],
    name_rules: [{
      required: true,
      min: 2,
      max: 5,
      message: '姓名长度限制2-5个数字！'
    }],
    sicnuid_rules: [{
      required: true,
      min: 10,
      max: 12,
      message: '学号是10-12个数字！'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    this.setData({
      current_speechid: options.cur_speechid,
      current_end_time: options.cur_endtime,
      current_title: options.cur_title,
      current_speaker: options.cur_speaker,
      current_sicnuid: options.cur_sicnuid,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.flushCurrentSignedList();
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

  /**
   * 刷新当前进行中的展讲的 签到列表
   */
  flushCurrentSignedList: function() {
    wx.request({
      url: 'http://localhost:9090/v1/weixin/speech/signedList/' + this.data.current_speechid,
      // url: 'https://api.sicnurpz.online/v1/weixin/speech/signedList/' + this.data.current_speechid,
      method: 'GET',
      success: (res) => {
        if (wx.$ratelimitGuard(res.statusCode)) return;
        // console.log(res.data);
        res.data.bundle_data.result.forEach(item => {
          // （暂时不考虑同名同姓）如果签到表中有当前用户的名字则认为已经签到
          if (item.name == wx.getStorageSync("truename")) {
            this.setData({
              didMeSign: true
            });
          }
        });
        this.setData({
          signedList: res.data.bundle_data.result
        });
        wx.$successToast('刷新签到表成功!');
      },
      fail: (err) => {
        console.log(err.errMsg);
        wx.$errorToast(`刷新签到列表出错! `);
      },
    })
  },

  /**
   * 签到提交请求之前的检验工作
   */
  onSignStart: function () {
    if (this.data.input_sicnuid === "") {
      wx.$errorToast(`签到前必须填写学号!`); return;
    }
    if (this.data.current_sicnuid === this.data.input_sicnuid) {
      wx.$errorToast(`不需要也不能签到自己的展讲!`); return;
    } 
    this.submitSign();
  },

  /**
   * 提交签到请求
   */
  submitSign: function() {
    wx.request({
      // url: 'http://localhost:9090/v1/weixin/speech/signIn',
      url: 'https://api.sicnurpz.online/v1/weixin/speech/signIn',
      method: 'POST',
      data: {
        speechid: this.data.current_speechid,
        name: this.data.input_name,
        sign_sicnuid: this.data.input_sicnuid,
        openid: wx.getStorageSync("openid"),
        own_sicnuid: wx.getStorageSync("sicnuid"),
      },
      success: (res) => {
        if (wx.$ratelimitGuard(res.statusCode)) return;
        if (res.statusCode < 300 && res.statusCode >= 200) {
          // console.log(err.errMsg);
          // 签到成功会返回当前的签到列表
          this.setData({
            didMeSign: true,
            signedList: res.data.bundle_data.result,
            input_sicnuid: '',
          });
          wx.$successToast(`签到成功!`);
        } else if (res.statusCode === 406) {
          // 406 说明 POST 请求提交字段不完整
          wx.$errorToast(`签到失败!提交数据不完整`);
          this.clearForm();
        } else if (res.statusCode === 404) {
          // 406 说明 POST 请求提交字段不完整
          wx.$errorToast(`签到干事不存在！`);
          this.clearForm();
        }
      },
      fail: (err) => {
        console.log(err.errMsg);
        wx.$errorToast(`签到出错! 原因: ${err.errMsg}`);
      }
    });
  },

  /**
   * 填写学号、姓名的绑定事件：
   */
  inputSignSicnuid: function(e) {
    this.setData({
      input_sicnuid: e.detail.value
    });
  },
  inputSignName: function(e) {
    this.setData({
      input_name: e.detail.value
    });
  },

  /**
   * 检验填写的学号、姓名：
   */
  validate_sicnuid_input: function(e) {
    if (e.detail.isError) {
      for (let i = 0; i < e.detail.errors.length; i++) {
        wx.$errorToast(e.detail.errors[i].message);
      }
      this.setData({
        input_sicnuid: '',
      });
    }
  },
  validate_name_input: function (e) {
    if (e.detail.isError) {
      for (let i = 0; i < e.detail.errors.length; i++) {
        wx.$errorToast(e.detail.errors[i].message);
      }
      this.setData({
        input_name: '',
      });
    }
  },

  /**
   * 本人签到时一键填入用户信息
   */
  selfSignInput: function () {
    this.setData({
      input_name: wx.getStorageSync("truename"),
      input_sicnuid: wx.getStorageSync("sicnuid"),
    });
  },
  /**
   * 清空输入框
  */
  clearForm: function () {
    this.setData({
      input_name: '',
      input_sicnuid: '',
    })
  },

})