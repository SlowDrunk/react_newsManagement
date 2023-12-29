import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { setUserInfo } from '@/redux/reducers/UserReducer'
import generateRandomToken from '@/utils/renderToken'

export default function Login() {
    const history = useHistory()
    const dispatch = useDispatch()
    // 点击登录
    const onFinish = (value: any) => {
        axios.get(`http://localhost:3004/users?username=${value.username}&password=${value.password}&roleState=true`).then((res) => {
            if (res.data.length > 0) {
                localStorage.setItem('token', generateRandomToken(32))
                // 将用户信息存储在redux中
                dispatch(setUserInfo(res.data[0]))
                history.push('/')
            } else {
                message.error('用户名或密码不匹配')
            }
        })
    }
    return (
        <div className='flex items-center justify-center bg-[rgba(29,31,68,0.7)] w-full h-[100vh] overflow-hidden'>
            <div className='flex flex-col justify-center items-center bg-[rgba(0,0,0,0.7)] p-[20px]'>
                <div className='text-center text-[#fcfcfc] text-[24px] font-bold mb-4'>全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="w-[500px]"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>


                    <Form.Item>
                        <Button type={'default'} danger className='w-full' htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    )
}
