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
		actions: [],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

	},

	ready: function() {
		this.setData({
			actions: [
				{ 'title': '展讲轮值表', 'icon': 'history',
				 'tag-content': 'NEW', 'tag-color': '#F4516c'},
				{ 'title': '评价打分器', 'icon': 'success', 
				'tag-content': null, 'tag-color': null},
			],
		})
	}

})
