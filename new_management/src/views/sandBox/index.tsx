import React from 'react'
import { Layout } from 'antd'
import SideBar from './components/SideBar'
import TopHeader from './components/TopHeader'
import Home from './components/Home'
import { Switch, Route, Redirect } from 'react-router-dom'

const { Header, Content } = Layout

export default function NewSandBox() {
    return (
        <Layout>
            <SideBar />
            <Layout>
                <Header>
                    <TopHeader />
                </Header>
                <Content className='m-[16px] bg-[#ffffff] rounded-xl'>
                    <Switch>
                        <Route path={'/home'} component={Home}></Route>
                        <Redirect from='/' to={'/home'} exact></Redirect>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
