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

    // 签到相关
    didMeSign: false,
    signedList: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      current_speechid: options.cur_speechid,
      current_end_time: options.cur_endtime,
      current_title: options.cur_title,
      current_speaker: options.cur_speaker,
    });
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

  }
})