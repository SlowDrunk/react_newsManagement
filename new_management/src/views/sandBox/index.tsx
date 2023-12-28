import React from 'react'
import { Layout } from 'antd'
import SideBar from './components/SideBar'
import TopHeader from './components/TopHeader'
import Home from './components/Home'
import { Switch, Route, Redirect } from 'react-router-dom'
import RightList from './components/RightList'
import RoleList from './components/RoleList'

const { Header, Content } = Layout

export default function NewSandBox() {
    return (
        <Layout className='h-[100vh]'>
            <SideBar />
            <Layout>
                <Header>
                    <TopHeader />
                </Header>
                <Content className='m-[16px] bg-[#ffffff] p-[12px] rounded-xl overflow-auto'>
                    <Switch>
                        <Route path={'/home'} component={Home}></Route>
                        <Route path={'/right-manage/right/list'} component={RightList}></Route>
                        <Route path={'/right-manage/role/list'} component={RoleList}></Route>
                        <Redirect from='/' to={'/home'} exact></Redirect>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
