// pages/speechJudge/speechJudge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needJudge: [],
    selectedJudgeIndex: 0,
    
    canIJudgeIt: false,
    myAudienceIndex: 0,
    mySignStatus: '',
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

          // 确定默认项（数组第一项）本用户是否可以打分
          this.flushCanIJudgeIt();
          this.reflectSignStatus();
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
    this.flushCanIJudgeIt();
    this.reflectSignStatus()
  },


  /**
   * 已签到状态的反射，正常签到亦或是补签、代签等
   */
  reflectSignStatus: function () {
    let _status = '';
    const _s = this.data.needJudge[this.data.selectedJudgeIndex]['audiences'][this.data.myAudienceIndex]['status'];
    switch (_s) {
      case 1:  // 正常签到
        _status = '已正常签到'; break;
      case 2:
        _status = '已补签'; break;
      case 3:
        _status = '他人已代签'; break;
      default:
        _status = '签到未完成'; break;
    }
    this.setData({
      mySignStatus: _status,
    });
  },
  
  /**
   * 只有自己签到了的展讲项目才能打分
   */
  flushCanIJudgeIt: function () {
    const _index = this.data.selectedJudgeIndex;
    for (let i = 0; i < this.data.needJudge[_index]['audiences'].length; i++) {
      if (this.data.needJudge[_index]['audiences'][i].sicnuid === wx.getStorageSync('sicnuid')) {
        this.setData({
          canIJudgeIt: true,
          myAudienceIndex: i,
        });
        break;
      }
    }
  },

  /**
   * 
   */
  submitSupplementSign: function () {
    wx.request({
      url: 'http://localhost:9090/v1/weixin/speech/supplementSign',
      // url: 'https://api.sicnurpz.online/v1/weixin/speech/supplementSign',
      method: 'POST',
      data: {
        'openid': wx.getStorageSync('openid'),
        'name': wx.getStorageSync('truename'),
        'sicnuid': wx.getStorageSync('sicnuid'),
        'aim_id': this.data.needJudge[this.data.selectedJudgeIndex]['_id'],
      },
      success: (res) => {
        if(res.statusCode >= 200 && res.statusCode < 300) {
          console.log(res.data);
          //补签成功则本用户可以对该次展讲进行打分
          this.setData({
            canIJudgeIt: true,
          });
          wx.$successToast('补签成功!');
        } else {
          wx.$errorToast('补签失败!');
        }
      },
      fail: (err) => {
        console.log(err.errMsg);
        wx.$errorToast('补签出错了!');
      }
    })
  },

})