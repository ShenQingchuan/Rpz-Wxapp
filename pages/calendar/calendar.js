// pages/calendar/calendar.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 此处为日历自定义配置字段
		calendarConfig: {
			multi: true, // 是否开启多选,
			inverse: true, // 单选模式下是否支持取消选中,
			takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
			disablePastDay: true, // 是否禁选过去的日期
			firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
			onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 注意：若想初始化时不默认选中当天，则将该值配置为除 undefined 以外的其他非值即可，如：空字符串, 0 ,false等。
      */
			noDefault: false, // 初始化后是否自动选中当天日期，优先级高于defaultDay配置，两者请勿一起配置
		}
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
		this.calendar.setTodoLabels({
			// 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
			circle: true,
			days: [
				{ year: 2019, month: 7, day: 28,}
			],
		});
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

	// 日历组件初始化，必须要带的一些内置功能函数：
	/**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当mulit为true时，allSelectedDays有值）
   */
  afterTapDay(e) {
		// => { currentSelect: {}, allSelectedDays: [] }
	},
  /**
   * 当改变月份时触发
   * current 当前年月
   * next 切换后的年月
   */
	whenChangeMonth(e) {
		// => { current: { month: 3, ... }, next: { month: 4, ... }}
	},
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
	onTapDay(e) {
		// => { year: 2019, month: 12, day: 3, ...}
	},
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
	afterCalendarRender(e) {
		
	}
})