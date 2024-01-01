import React from 'react'
import { Layout } from 'antd'
import SideBar from './components/SideBar'
import TopHeader from './components/TopHeader'
import Home from './components/Home'
import { Switch, Route, Redirect } from 'react-router-dom'
import RightList from './components/RightList'
import RoleList from './components/RoleList'
import UserList from './components/UserList'
import NewEdit from './components/NewEdit'
import DraftList from './components/DraftList'
import NewsPriview from './components/NewsPriview'
import AuditList from './components/AuditList'
import AuditNews from './components/AuditNews'
import Unpublist from './components/publistTavle/Unpublist'
import SunsetList from './components/publistTavle/Sunset'
import publistedList from './components/publistTavle/Published'

const { Header, Content } = Layout

export default function NewSandBox() {
    return (
        <Layout className='h-[100vh]'>
            <SideBar />
            <Layout>
                <Header className='flex flex-row justify-center items-center'>
                    <TopHeader />
                </Header>
                <Content className='m-[16px] bg-[#ffffff] p-[12px] rounded-xl overflow-auto'>
                    <Switch>
                        <Route path={'/home'} component={Home}></Route>
                        <Route path={'/right-manage/right/list'} component={RightList}></Route>
                        <Route path={'/right-manage/role/list'} component={RoleList}></Route>
                        <Route path={'/user-manage/list'} component={UserList}></Route>
                        <Route path={'/news-manage/add/:id?'} component={NewEdit}></Route>
                        <Route path={'/news-manage/draft'} component={DraftList}></Route>
                        <Route path={'*/newsPrevirw/:id'} component={NewsPriview}></Route>
                        <Route path={'/audit-manage/list'} component={AuditList}></Route>
                        <Route path={'/audit-manage/audit'} component={AuditNews}></Route>
                        <Route path={'/publish-manage/unpublished'} component={Unpublist}></Route>
                        <Route path={'/publish-manage/published'} component={publistedList}></Route>
                        <Route path={'/publish-manage/sunset'} component={SunsetList}></Route>
                        <Redirect from='/' to={'/home'} exact></Redirect>
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}
