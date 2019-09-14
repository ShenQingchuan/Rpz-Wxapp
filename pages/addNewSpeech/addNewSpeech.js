// pages/addNewSpeech/addNewSpeech.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    speaker: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    group: '',

    //表单的InputRules:
    title_rule:[{ required: true, min: 5,max: 15,message: '长度需要在5-15个字符之间'}],
    speaker_rule: [{ required: true, min: 2, max: 5, message: '姓名为2-5个字符' }],
    location_rule:[{ required: true }],
    date_rule: [{ required: true, pattern: "/^\\d{4}\/\\d{2}\/\\d{2}$/", message: '日期输入有误！' }],
    start_time_rule: [{ required: true, pattern: "/^\\d\\d:\\d\\d$/", message: '时间输入有误！' }],
    end_time_rule: [{ required: true, pattern: "/^\\d\\d:\\d\\d$/", message: '时间输入有误！' }],
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
   * 四个Input输入框、文本域textarea和单选框组的输入事件绑定
   */
  inputSpeechTitle: function(e) { this.setData({ title: e.detail.detail.value}); },
  inputSpeakerTitle: function (e) { this.setData({ speaker: e.detail.detail.value }); },
  inputSpeechDate: function(e) { this.setData({ date: e.detail.detail.value}); },
  inputSpeechStartTime: function (e) { this.setData({ start_time: e.detail.detail.value}); },
  inputSpeechEndTime: function (e) { this.setData({ end_time: e.detail.detail.value }); },
  inputSpeechLocation: function (e) { this.setData({ location: e.detail.detail.value }); },
  // textarea 输入绑定
  inputSpeechDescription: function(e) { this.setData({ description: e.detail.detail.value}); },
  // 单选框组输入绑定
  inputSpeechGroup: function (e) { this.setData({ group: e.detail.value }); },

  /**
	 * 输入结果校验的方法：
	 */
  validate: function(e) {
    if (e.detail.isError) {
      for (let i = 0; i < e.detail.errors.length; i++) {
        wx.lin.showToast({
          title: e.detail.errors[i].message,
          icon: 'error',
          iconStyle: 'color: red; size: 60',
        });
      }
      this.clearForm();
    }
  },

  /**
   * 如果有一个输入错误就清空表单
   */
  clearForm: function() {
    this.setData({
      title: '',
      speaker: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      location: '',
    });
  },

  /**
   * 提交新建展讲项目点表单
   */
  submitNewSpeech: function() {
    wx.request({
      // url: 'http://localhost:9090/v1/weixin/speech/newSpeech',
      url: 'https://api.sicnurpz.online/v1/weixin/speech/newSpeech',
      method: "POST",
      data: {
        title: this.data.title,
        speaker: this.data.speaker,
        description: this.data.description,
        date: this.data.date,
        start_time: this.data.start_time,
        end_time: this.data.end_time,
        location: this.data.location,
        group: this.data.group,
      },
      success: (res) => {
        // console.log(res.data);
        if(res.statusCode < 300) {
          wx.lin.showToast({
            title: '新的展讲项目提交成功, 准备开始审核...',
            icon: 'success',
            iconStyle: 'color: #34bfa3; size: 60',
          });
          this.clearForm();
        } else {
          wx.lin.showToast({
            title: `提交出错! 错误代码: ${res.data.error_code}`,
            icon: 'error',
            iconStyle: 'color: red; size: 60',
          });
        }
      },
      fail: (err) => {
        // console.log(err.errMsg);
        wx.lin.showToast({
          title: `提交失败! 原因: ${err.errMsg}`,
          icon: 'error',
          iconStyle: 'color: red; size: 60',
        });
      }
    });
  },

})