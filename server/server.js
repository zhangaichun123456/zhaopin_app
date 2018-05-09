const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userRouter = require('./user.js')
const app = express()
// work with express
const model = require('./model')
const Chat = model.getModel('chat')

const server = require('http').Server(app)
const io = require('socket.io')(server)
// io是全局的请求
// socket是当前链接的请求
io.on('connection',function(socket){
	// 监听前端事件
	socket.on('sendmsg',function(data){
        const {from,to,msg,create_time} = data
        const chatid = [from,to].sort().join('_')
        Chat.create({chatid,from,to,content:msg,create_time},function(err,doc){
        	// 全局广播事件
            io.emit('resvmsg',Object.assign({},doc._doc))
        })
	})
})



app.use(cookieParser()) //支持解析cookie
app.use(bodyParser.json()) //支持发送post
app.use('/user', userRouter)


server.listen(9099, function() {
	console.log("好了")
})