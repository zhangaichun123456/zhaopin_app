import React from 'react'
import { NavBar,List,InputItem,Icon } from 'antd-mobile';

import {connect} from 'react-redux'
import {sendMsg,getMsgList,resvMsg,readMsg} from '../../redux/chat.redux'
import {getChatId} from '../../util'


@connect(
	state => state,{sendMsg,getMsgList,resvMsg,readMsg}
)
class Chat extends React.Component{
	constructor(props) {
		super(props);
		this.state={text:'',msg:[]}
	}
	componentDidMount() {
	 if(!this.props.chat.chatmsg.length){
	 	// 获取消息列表
			this.props.getMsgList()
		// 进行消息监听
		    this.props.resvMsg()
		}
	}
	// 路由离开就是销毁组件，估在路由离开前触发改事件
	componentWillUnmount(){
      const from = this.props.match.params.user
	  this.props.readMsg(from)
	}
	handleSubmit (){
		const from = this.props.user._id
		const to = this.props.match.params.user
		const msg = this.state.text
		const create_time = new Date().getTime()
		this.props.sendMsg({from,to,msg,create_time})
		this.setState({text:''})
	}
	render(){		
		const userid = this.props.match.params.user
		const Item = List.Item
		const users = this.props.chat.users
		// 还没获得对应的user则先不渲染
		if(!users[userid]){
			return null
		}
		const chatid = getChatId(userid,this.props.user._id)
		const chatmsgs = this.props.chat.chatmsg.filter(v=>v.chatid===chatid)
		return (
			<div id="chat-page">
			    <NavBar
			     mode="dark"
			     icon={<Icon type="left" />}
			     onLeftClick={() => {this.props.history.goBack()}}>{users[userid].name}</NavBar>
				 {chatmsgs.map(v=>{
					const avatar = v.from?require(`../images/${users[v.from].avatar}.png`):'boy'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
					return v.from===userid?(
						<List key={v._id}>
							<Item thumb={avatar}>{v.content}</Item>
						</List>
						):(
						<List key={v._id}>
							<Item
							 extra={<img src={avatar} alt=""/>}
							 className="chatme">{v.content}</Item>
						</List>
						)
				})}
				<div className="stick-footer">
					<List>
						<InputItem
						  placeholder='请输入'
						  value={this.state.text}
						  onChange={v=>{
						  	this.setState({text:v})
						  }}
						  extra={<span onClick={()=>this.handleSubmit()}>发送</span>}></InputItem>
					</List>
				</div>
			</div>
			)
	}

}

export default Chat