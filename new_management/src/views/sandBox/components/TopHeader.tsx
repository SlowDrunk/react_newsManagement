import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Space, Dropdown } from 'antd';
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearUserInfo } from '@/redux/reducers/UserReducer'
// @ts-ignore
import defaultAvatar from '@/assets/images/defaultAvatar.jpg'

export default function TopHeader() {
  const history = useHistory()
  const userStore = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: userStore?.role ? userStore.role.roleName : '超级管理员',
    },
    {
      key: '2',
      danger: true,
      label: (
        <a href="/login" onClick={() => {
          localStorage.removeItem('token')
          dispatch(clearUserInfo())
          history.replace('/login')
        }}>退出</a>
      ),
    },
  ]
  return (
    <div className='w-full flex flex-row justify-end items-center'>
      {/* 提示语 */}
      <span className='text-[#fcfcfc] mr-3'>欢迎
        <span className='text-[#1e80ff] underline mx-2'>{userStore?.username}</span>
        回来</span>
      {/* 头像 */}

      {/* @ts-ignore */}
      <Space>
        <Dropdown menu={{ items }}>
          <Space>
            <Avatar className='bg-[#ccc]' size={48} shape='circle' src={<img src={userStore?.avatar ? userStore.avatar : defaultAvatar} alt="avatar" />} icon={<UserOutlined />} ></Avatar>
          </Space>
        </Dropdown>
      </Space>
    </div>
  )
}
