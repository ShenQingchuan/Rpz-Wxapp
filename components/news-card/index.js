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
      title: '欢迎使用 · 在计协',
			main_content: '这是帮助计协干事成长的小工具，快来探索吧 ~',
			action_content: '"菜单选项"',
			cover_url: 'http://p3.pstatp.com/large/pgc-image/152032717533441a89fe83f.png'
		});
	}
})
