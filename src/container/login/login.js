import React from 'react'
import Logo from '../../component/logo/logo'
import {List,InputItem,WingBlank,Button,WhiteSpace} from 'antd-mobile';

import {login} from '../../redux/user.redux'
import hocForm from '../../component/hoc-form/hoc-form'

import {connect} from 'react-redux'

import {
	Redirect
} from 'react-router-dom'

@connect(
	state => state.user, {
		login
	})
@hocForm
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this)
		this.handleLogin = this.handleLogin.bind(this)
	}
	handleLogin() {
		this.props.login(this.props.state)
	}
	register() {
		this.props.history.push('/register')
	}
	render() {
		console.log(this.props)
		return (
			<div> 
			    {(this.props.redirectTo&&this.props.redirectTo!=='/login')?<Redirect to={this.props.redirectTo}></Redirect> : null}
				<Logo></Logo>
				<h2>登录页面</h2>
				<WingBlank>
					<List>
					    {this.props.msg?<p className='error-msg'>{this.props.msg}</p>:null}
						<InputItem onChange={v=>this.props.handleChange('user',v)}>用户</InputItem>
						<WhiteSpace />
						<InputItem type='password' onChange={v=>this.props.handleChange('pwd',v)}>密码</InputItem>
					</List>
					<Button onClick={this.handleLogin} type="primary">登录</Button>
					<WhiteSpace />
					<Button onClick={this.register} type="primary">注册</Button>
				</WingBlank>
			</div>
		)
	}
}

export default Login