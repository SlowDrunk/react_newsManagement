import React, { useState, useEffect, useMemo } from 'react'
import { Layout, Menu } from 'antd'
import { useHistory } from 'react-router-dom'
import { HomeOutlined, UserOutlined, PicRightOutlined, AlignCenterOutlined, ExclamationCircleOutlined, SketchOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd';
import axios from 'axios';
import { rightsApi, rolesApi } from '@/utils/supabaseServer'
import { useSelector } from 'react-redux'
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
  const userStore = useSelector((state: any) => state.user)
  const { roleid } = userStore
  console.log(userStore)

  const [routerMenu, setRouterMenu] = useState<any[]>()
  // 根据当前登录的用户角色渲染菜单
  const [currentRole, setcurrentRole] = useState<string[]>()
  useEffect(() => {
    rolesApi.getCurrentRole(roleid).then(res => {
      if (res?.length) {
        setcurrentRole(res[0].rights.checked)
      }
    })
  }, [])
  // 组件挂载完成取数据
  useMemo(() => {
    rightsApi.queryRightsWithChildren().then((res) => {
      if (res) {
        setRouterMenu(res.map((item: any) => {
          if (item.pagepermisson === 1 && currentRole?.includes(item.key)) {
            const childrenArr: any = item.children?.length > 0 ? item.children.map((ele: any) => {
              if (ele.pagepermisson === 1) {
                return getItem(ele.title, ele.key, iconMap[ele.key])
              }
            }) : null
            return getItem(item.title, item.key, iconMap[item.key], childrenArr)
          }
        }))
      }
    })
  }, [currentRole])

  const history = useHistory()
  // 当前选择的菜单项
  const [currentMenuItem, setCurrentMenuItem] = useState<string>(history.location.pathname)
  const openKey = `/${history.location.pathname.split('/')[1]}`
  useEffect(() => {
    setCurrentMenuItem(history.location.pathname)
  }, [history.location.pathname])
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
