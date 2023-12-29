import { BrowserRouter as HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from '@/views/login'
import NewSandBox from '@/views/sandBox'

export default function MyRouter() {
    return (
        <div>
            <HashRouter>
                <Switch>
                    <Route path={'/login'} component={Login}></Route>
                    <Route path={'/'} render={() => {
                        return localStorage.getItem('token') ?
                            <NewSandBox></NewSandBox> :
                            <Redirect to={'/login'}></Redirect>
                    }}></Route>
                </Switch>
            </HashRouter>
        </div>
    )
}
