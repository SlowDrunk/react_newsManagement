import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Space, Dropdown } from 'antd';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        首页
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
]

export default function TopHeader() {
  return (
    <div className='w-full flex flex-row justify-end items-center'>
      {/* 提示语 */}
      <span className='text-[#fcfcfc] mr-3'>欢迎XXX回来</span>
      {/* 头像 */}

      {/* @ts-ignore */}
      <Space>
        <Dropdown menu={{ items }}>
          <Space>
            <Avatar className='bg-[#ccc]' size={48} shape='circle' icon={<UserOutlined />} ></Avatar>
          </Space>
        </Dropdown>
      </Space>
    </div>
  )
}
