// components/action-list/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		public_actions: [],
		manage_actions: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		
	},

	ready: function() {
		this.setData({
			public_actions: [
				{
					'title': '展讲轮值表', 'icon': 'history',
					'tag-content': null, 'tag-color': null,
					'url': '/pages/speechSchedule/speechSchedule'
				},
				{
					'title': '评价打分器', 'icon': 'success',
					'tag-content': null, 'tag-color': null,
					'url': null
				},
			],

			manage_actions: [
				{
					'title': '添加新的日程', 'icon': 'edit',
					'tag-content': null, 'tag-color': null,
					'url': '/pages/addNewTodo/addNewTodo'
				},
			]
		})
	}

})
