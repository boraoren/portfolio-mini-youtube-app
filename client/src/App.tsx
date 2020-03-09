import React, {Component} from 'react'
import {Route, Router, Switch} from 'react-router-dom'
import {Grid, Segment} from 'semantic-ui-react'

import Auth from './auth/Auth'
import {NotFound} from './components/NotFound'
import {DesktopContainer} from "./components/other/DesktopContainer";
import {MobileContainer} from "./components/other/MobileContainer";
import {YoutubeCardItemList} from "./components/other/YoutubeCardItemList";
import {EditYoutubeCardItem} from "./components/other/EditYoutubeCardItem";

export interface AppProps {
}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin(): any {
    this.props.auth.login()
  }

  handleLogout(): any {
    this.props.auth.logout()
  }

  ResponsiveContainer = (props: any): any => (
    <>
      <DesktopContainer fixed={true}
                        handleLogin={this.handleLogin}
                        handleLogout={this.handleLogout}
                        isAuthenticated={this.props.auth.isAuthenticated()}>{props.children}</DesktopContainer>
      <MobileContainer>{props.children}</MobileContainer>
    </>
  )


  render() {
    return (
      <Segment vertical>
        <Router history={this.props.history}>
          {this.generateCurrentPage()}
        </Router>
      </Segment>
    )
  }


  generateCurrentPage() {
    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props: any) => {
            return <this.ResponsiveContainer>
              <Grid centered={true}>
                <Grid.Row>
                  <Grid.Column width={14}>
                    {this.props.auth.isAuthenticated() ? <EditYoutubeCardItem auth={this.props.auth} history={this.props.history}/> : ""}
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <YoutubeCardItemList auth={this.props.auth}/>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </this.ResponsiveContainer>
          }}
        />

        <Route component={NotFound}/>
      </Switch>
    )
  }
}
