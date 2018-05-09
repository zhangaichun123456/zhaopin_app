import React from 'react'
import axios from 'axios'
import {
	withRouter
} from 'react-router-dom'

import {
	loadData
} from '../../redux/user.redux'
import {
	connect
} from 'react-redux'


@withRouter //由于AuthRoute并不是真正的路由组件，所以没有路由相关属性，则用withRouter包裹一下就好了
@connect(null, {
	loadData
})
class AuthRoute extends React.Component {
	componentDidMount() {
		console.log('authroute')
		// 如果已经在登录页或者注册页就不用管了
		const publicList = ['/login', '/register']
		const pathname = this.props.location.pathname
		if (publicList.indexOf(pathname) > -1) {
			return null
		}
		axios.get('/user/info').then(res => {
			if (res.status === 200) {
				if (res.data.code === 0) {
					// 有登信息的
					this.props.loadData(res.data.data)
				} else {
					// 没有登录信息则调到登录页
					this.props.history.push('/login')
				}
			}
		})

	}

	render() {
		return null
	}

}

export default AuthRoute