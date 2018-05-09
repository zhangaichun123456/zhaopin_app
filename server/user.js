const express = require('express')
const utils = require('utility') //密码加密用的
const Router = express.Router()
const model = require('./model')
const User = model.getModel('user')
const Chat = model.getModel('chat')
const _filter = {
	'pwd': 0,
	"__v": 0
}
// Chat.remove({}, function(e, d) {})
Router.get('/list', function(req, res) {
	// 清空所有的数据
	// User.remove({}, function(e, d) {})
	const {
		type
	} = req.query
	User.find({
		type
	}, function(err, doc) {
		return res.json({
			code: 0,
			data: doc
		})
	})
})
//获取用户聊天列表
Router.get('/getmsglist', function(req, res){
	// 从user的id查出用户的名字和头像并保存
	const user = req.cookies.userid
	User.find({},function(e,d){
		let users = {}
		d.forEach(v=>{
			users[v._id] = {name:v.user,avatar:v.avatar}
		})
		// 从聊天chat里面查出聊天记录,查找发送我的和我发送的
		Chat.find({'$or':[{from:user},{to:user}]},function(err,doc){
			if(!e){
				return res.json({code:0,msgs:doc,users:users})
			}
		})
	})
	

})

Router.post('/readmsg', function(req, res){
   const userid = req.cookies.userid
   const {from} = req.body
   Chat.update({from,to:userid},{read:true},{'multi':true},function(e,d){
   	console.log(d)
   	  if(!e){
   	  	return res.json({code:0,num:d.nModified})
   	  }
   	  return res.json({code:1,msg:'修改失败'})
   })
})

Router.post('/update', function(req, res) {
	const userid = req.cookies.userid
	if (!userid) {
		return json.dumps({
			code: 1
		})
	}
	const body = req.body
	User.findByIdAndUpdate(userid, body, function(err, doc) {
		const data = Object.assign({}, {
			user: doc.user,
			type: doc.type
		}, body)
		return res.json({
			code: 0,
			data
		})
	})
})

// 登录接口
// findOne 第一个字段查询条件，第二个字段显示条件
// 写数据是在res，读数据是在req
Router.post('/login', function(req, res) {
	const {
		user,
		pwd
	} = req.body

	User.findOne({
		user,
		pwd: md5Pwd(pwd)
	}, _filter, function(e, d) {
		if (!d) {
			return res.json({
				code: 1,
				msg: '用户名 或密码错误'
			})
		}
		res.cookie('userid', d._id)
		return res.json({
			code: 0,
			data: d
		})
	})
})
//注册接口
Router.post('/register', function(req, res) {
	const {
		user,
		pwd,
		type
	} = req.body

	User.findOne({
		user
	}, function(err, doc) {
		if (doc) {
			return res.json({
				code: 1,
				msg: '用户名重复'
			})
		}

		const userModel = new User({
			user,
			type,
			pwd: md5Pwd(pwd)
		})
		userModel.save(function(e, d) {
			if (e) {
				return res.json({
					code: 1,
					msg: '后端出错了'
				})
			}
			const {
				user,
				type,
				_id
			} = d
			res.cookie('userid', _id)
			return res.json({
				code: 0,
				data: {
					user,
					type,
					_id
				}
			})
		})
	})
})

Router.get('/info', function(req, res) {
	const {
		userid
	} = req.cookies
	if (!userid) {
		return res.json({
			code: 1
		})
	}
	User.findOne({
		_id: userid
	}, _filter, function(err, doc) {
		if (err) {
			return res.json({
				code: 0,
				msg: '后端出错了'
			})
		}
		if (doc) {
			return res.json({
				code: 0,
				data: doc
			})
		}
	})

})


// 密码md5加密加重复杂度
function md5Pwd(pwd) {
	const salt = 'afdsjfklajfksljfkajf'
	return utils.md5(utils.md5(pwd + salt))
}

module.exports = Router