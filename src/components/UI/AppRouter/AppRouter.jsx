import React, {useContext} from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { AuthContext } from '../../../context'
import { privateRoutes, publicRoutes } from '../../../router'
import Loader from '../Loader/Loader'

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext)

    if (isLoading) {
        return <Loader />
    }

    return (
        isAuth
            ? <Switch>
                {
                    privateRoutes.map(route =>
                        <Route
                            path={route.path}
                            component={route.component}
                            exact={route.exact}
                            key={route.path}
                        />
                    )
                }
                < Redirect to="/posts" />
            </Switch >
            : <Switch>
                {publicRoutes.map(route =>
                    <Route
                        path={route.path}
                        component={route.component}
                        exact={route.exact}
                        key={route.path}
                    />
                )}
                <Redirect to="/login" />
            </Switch>
    )
}

export default AppRouter
