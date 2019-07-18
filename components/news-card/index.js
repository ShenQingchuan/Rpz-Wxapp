// components/news-card/news-card.js
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
		title: '',
		main_content: '',
		action_content: '',
		cover_url: ''
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		
	},

	/* ready: 在组件在视图层布局完成后执行 */
	ready: function(){
		this.setData({
			title: '放暑假啦！',
			main_content: '你准备怎样度过暑假?\n各组都有对应的学习任务哟 ~',
			action_content: '"我的任务"',
			cover_url: 'http://p3.pstatp.com/large/pgc-image/152032717533441a89fe83f.png'
		});
	}
})
