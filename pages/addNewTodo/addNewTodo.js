// pages/addNewTodo/addNewTodo.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 表单基本信息：
		title: '',
		content: '',
		year: null,
		month: null,
		day: null,
		time: '',
		access_type: '',

		// 是否已经经过商议允许提交该日程, 对应单选框的 checked
		accept_submit_license: false,

		// 以下是各个输入框的校验规则:
		title_rule: [{ required: true,min: 2,max: 20, message: '标题需要在2-20个字符之间！'}],
		content_rule: [{ required: true, min: 1, max: 65, message: '描述需要在1-65个字符之间' }],
		year_rule: [{ required: true, type: 'number', message: '年份输入有误' }],
		month_rule: [{ required: true, type: 'number', message: '月份输入有误！' }],
		day_rule: [{ required: true, type: 'number', message: '日期输入有误！' }],
		time_rule: [{ required: true, pattern: "/^\\d\\d:\\d\\d$/" , message: '时间输入有误！' }],

		validate_have_error: false,
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

	// 访问控制类型 - 单选框点击事件：
	onChangeAccessType(e) { this.setData({ access_type: e.detail.value, }) },

	/**
	 * 是否经过讨论 - 单选框组的点击事件：
	 */
	onChangeRadio(){
		this.setData({
			accept_submit_license: !this.accept_submit_license,
		});
	},

	/**
	 * 新日程的提交事件：
	 */
	onNewTodoSubmit(){
		let app = getApp();
		if(this.data.accept_submit_license === false) {
			// 如果没有经过讨论、不允许提交日程，并 toast 警告
      wx.$errorToast('请确保日程提交前经过审议');
		}
		else {
			let openid = wx.getStorageSync('openid');
			wx.request({
				// url: 'http://localhost:9090/v1/weixin/todo',
				url: 'https://api.sicnurpz.online/v1/weixin/todo',
				method: 'POST',
				data: {
					title: this.data.title,
					content: this.data.content,
					year: this.data.year,
					month: this.data.month,
					day: this.data.day,
					time: this.data.time,
					access_type: this.data.access_type,
					openid: app.globalData.user_openid
				},
				success: res => {
					//console.log(res);
          wx.$successToast(`新的日程记录添加成功！`);
					this.clearForm();	// 清除已经提交后的表单
				},
				fail: err => {
					//console.log(err);
          wx.$errorToast('记录插入失败！');
				}
			});
			
		}
	},

	/**
	 * 接下来的是一系列的 input 输入绑定事件：
	 */
	inputTitle(e){ this.setData({title: e.detail.value}); },
	inputContent(e) { this.setData({ content: e.detail.value }); },
	inputYear(e) { this.setData({ year: e.detail.value }); },
	inputMonth(e) { this.setData({ month: e.detail.value }); },
	inputDay(e) { this.setData({ day: e.detail.value }); },
	inputTime(e) { this.setData({ time: e.detail.value }); },
	inputAccessType(e) { this.setData({ access_type: e.detail.value }); },

	// 清空表单数据到初始状态:
	clearForm(){
		this.setData({
			title: '',
			content: '',
			year: null,
			month: null,
			day: null,
			time: '',
			access_type: '',
		});
	},

	/**
	 * 输入结果校验的方法：
	 */
	validate(e) { 
		if(e.detail.isError){
			for(let i=0; i<e.detail.errors.length; i++){
        wx.$errorToast(e.detail.errors[i].message);
			}
			/* 一旦发现有误，清空所有输入框中的数据 */
			this.clearForm();
		}
	},
	
})