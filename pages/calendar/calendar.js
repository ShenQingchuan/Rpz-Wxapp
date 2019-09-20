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
		},

		// 因为我们是直接请求加载当前月份的所有工作日程数据
		// 所以需要得到：日历初渲染时（刚进入本页面时）的年月
		curYear: 0,
		curMonth: 0,

		// 请求拿到数据之后必须先存放在 data Object中
		// 这个数据不能再 afterCalendarRender 日历渲染时使用
		curMonth_todos: [],	// 必须是数组类型, 作为视图层 wx:for 渲染的来源
		todo_days: [],	// 用于存放那些天是有 todo 的...
    // 把从api中查询过的某个月份的todos缓存进此cache对象当中
    todos_cache: {},

	},

	/**
	 * 获取当前月份的日程信息 ajax 请求
	 */
	ajaxForCurrentMonthTodo() {
    let that = this;
		wx.request({
			// url: 'http://localhost:9090/v1/weixin/todo',
			url: 'https://api.sicnurpz.online/v1/weixin/todo',
			method: 'GET',
			data: {
				openid: wx.getStorageSync('openid'),
				curYear: this.data.curYear,
				curMonth: this.data.curMonth,
			},
			success: res => {
				// console.log(res);
        if (wx.$ratelimitGuard(res.statusCode)) return;
        wx.$successToast('获取到如下日程信息');
				
        // 更新当前月份的日程信息和 todo_days，为标出是哪些天有待办事项做准备
				let temp_todo_days = [];
				for(let i=0; i<res.data.bundle_data.length; i++){
					// 注意去重处理
					if(temp_todo_days.indexOf(res.data.bundle_data[i]) === -1){
						temp_todo_days.push({
							year: res.data.bundle_data[i].year,
							month: res.data.bundle_data[i].month,
							day: res.data.bundle_data[i].day
						});
					}
				}
        // 检查是否待办事项过期，如果其 isOverDue 应为 true 卡片会变灰
        let temp_todo_objects = res.data.bundle_data;
				for(let item of temp_todo_objects) {
          item['isOverDue'] = that.isOverDue(item);
        }

        // 因为是进了本页有缓存，退出就清除，所以无论数组长度都添加缓存...
        let curMonthStamp = `${this.data.curYear}-${this.data.curMonth}`;
        if (temp_todo_objects.length > 0){
          // 将本月份获取到的 todo 表加载到缓存对象中
          this.data.todos_cache[curMonthStamp] = {
            curMonth_todos: temp_todo_objects,
            todo_days: temp_todo_days
          };
        } else if (temp_todo_objects.length === 0) {
          this.data.todos_cache[curMonthStamp] = {
            curMonth_todos: [],
            todo_days: temp_todo_days
          };
        }

        // 设置数据的常规操作，并在日历上把有待办事项的日期打上圈圈
				this.setData({
					curMonth_todos: temp_todo_objects,
					todo_days: temp_todo_days
				});
        this.drawCircleToDate();
			},
			fail: err => {
				console.log(err);
        wx.$errorToast('获取日程信息时发生错误！');
			}
		});
	},

	// 更新渲染给那些日期画圈圈
	drawCircleToDate() {
		this.calendar.setTodoLabels({
			// 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
			circle: true,
			days: this.data.todo_days,
		});
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
		// 1. 让日历上能打上圈圈
		// for each 把每一条的 date Object push 进 todo_days 数组
		this.ajaxForCurrentMonthTodo();
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
		// console.log(e);
		this.setData({
			curYear: e.detail.next.year,
			curMonth: e.detail.next.month
		});
    let curMonthStamp = `${e.detail.next.year}-${e.detail.next.month}`;
    let cache_unit = this.data.todos_cache[curMonthStamp];
    
    if(cache_unit === undefined) {
      // 如果没有缓存这个月的todos就去给api发请求
      this.ajaxForCurrentMonthTodo();
    } else {
      // 若有缓存则从缓存中读取
      // console.log(cache_unit);
      this.setData({
        curMonth_todos: cache_unit.curMonth_todos,
        todo_days: cache_unit.todo_days
      });
      this.drawCircleToDate();
    }
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
		console.log(e.detail.data.calendar);
		this.setData({
			curYear: e.detail.data.calendar.curYear,
			curMonth: e.detail.data.calendar.curMonth
		});
	},

  // 若待办事项已过期，则应该卡片变灰色
  isOverDue(item) {
    let now = new Date();
    let timestamp = `${item.year}/${item.month}/${item.day} ${item.time}:00`;
    let deadline = new Date(timestamp);

    return now > deadline;
  }

})