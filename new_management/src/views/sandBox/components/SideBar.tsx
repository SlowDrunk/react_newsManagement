import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { useHistory } from 'react-router-dom'
import { HomeOutlined, UserOutlined, PicRightOutlined, AlignCenterOutlined, ExclamationCircleOutlined, SketchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd';
import axios from 'axios';
const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const iconMap: any = {
  '/home': <HomeOutlined></HomeOutlined>,
  '/user-manage': <UserOutlined></UserOutlined>,
  '/right-manage': <PicRightOutlined></PicRightOutlined>,
  '/news-manage': <AlignCenterOutlined />,
  '/audit-manage': <ExclamationCircleOutlined />,
  '/publish-manage': <SketchOutlined />,
}

export default function SideBar() {
  const [routerMenu, setRouterMenu] = useState<MenuItem[]>()
  // 组件挂载完成取数据
  useEffect(() => {
    axios.get('http://localhost:3004/rights?_embed=children').then((res: any) => {
      if (res.data.length > 0) {
        setRouterMenu(res.data.map((item: any) => {
          // pagepermisson用于确定菜单是否显示
          if (item.pagepermisson === 1) {
            const childrenArr = item.children?.length > 0 ? item.children.map((item: any) => {
              if (item.pagepermisson === 1) {
                return getItem(item.title, item.key, iconMap[item.key])
              }
            })
              : null
            return getItem(item.title, item.key, iconMap[item.key], childrenArr)
          }
        }))
      }
    }).catch((e) => {
      console.error(e)
    })
  }, [])

  const history = useHistory()
  // 当前选择的菜单项
  const [currentMenuItem, setCurrentMenuItem] = useState<string>(history.location.pathname)
  const openKey = `/${history.location.pathname.split('/')[1]}`
  // 选择菜单
  const changeMuneItem = (e: any) => {
    setCurrentMenuItem(e.key)
    // 使用路由来跳转
    history.push(e.key)
  }
  return (
    <Sider trigger={null} collapsible className='h-[100vh] w-[260px] p-[12px] overflow-auto'>
      <div className='h-[40px] w-full text-[24px] text-[#fcfcfc] font-semibold rounded-xl flex items-center justify-center mb-4'>全球新闻管理系统</div>
      <Menu theme='dark' mode="inline" selectedKeys={[currentMenuItem]} defaultOpenKeys={[openKey]} items={routerMenu} onClick={(e) => changeMuneItem(e)}></Menu>
    </Sider>
  )
}
