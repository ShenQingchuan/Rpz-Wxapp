// pages/speechJudge/speechJudge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needJudge: [],
    selectedJudgeIndex: 0,
    canIJudgeIt: false,
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
    this.flushJudgeList();
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
   * 获取需要打分的展讲项目列表
   */
  flushJudgeList: function () {
    const _sicnuid = wx.getStorageSync('sicnuid');

    wx.request({
      url: `http://localhost:9090/v1/weixin/speech/judgeList`,
      // url: `https://api.sicnurpz.online/v1/weixin/speech/judgeList`,
      success: (res) => {
        // console.log(res.data);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.setData({
            needJudge: res.data.bundle_data.result,
          });
          wx.$successToast('获取可打分展讲列表成功');
        }
      },
      fail: (err) => {
        wx.$errorToast('获取需要打分的展讲列表出错');
      },
    })
  },

  /**
   * 选择要打分的展讲项目
   */
  onJudgeItemTap: function (e) {
    const _index = e.target.dataset['jkey'];
    this.setData({
      selectedJudgeIndex: _index,
    });
    // 只有自己签到了的展讲项目才能打分
    for(let i=0; i<this.data.needJudge[_index]['audiences'].length; i++) {
      if (this.data.needJudge[_index]['audiences'][i].sicnuid === wx.getStorageSync('sicnuid')) {
        this.setData({
          canIJudgeIt: true,
        });
        break;
      }
    }
  },

  /**
   * 
   */
  submitSupplementSign: function () {
    
  },

})