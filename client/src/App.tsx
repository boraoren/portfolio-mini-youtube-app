import React, {PureComponent} from 'react'
import {Route, Router, Switch} from 'react-router-dom'
import {Grid, Loader, Segment} from 'semantic-ui-react'

import Auth from './auth/Auth'
import {NotFound} from './components/NotFound'
import {DesktopContainer} from "./components/other/DesktopContainer";
import {MobileContainer} from "./components/other/MobileContainer";
import {YoutubeCardItemList} from "./components/other/YoutubeCardItemList";
import {getMovies} from "./api/movies-api";
import {Movie} from "./types/Movie";
import {ButtonProps} from "semantic-ui-react/dist/commonjs/elements/Button/Button";

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  movies: Movie[]
  loadingMovies: boolean
}

export default class App extends PureComponent<AppProps, AppState> {

  state: AppState = {
    movies: [],
    loadingMovies: false
  }

  handleLogin =(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps):any=>  {
    this.props.auth.login()
  }

  handleLogout = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps):any => {
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

  async componentDidMount() {
    try {
      const movies = await getMovies(this.props.auth.getIdToken())
      this.setState({
        movies,
        loadingMovies: false
      })
    } catch (e) {
      alert(`Failed to fetch movies: ${e.message}`)
    }
  }

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
                  <Grid.Column width={16}>
                    {this.renderMovies()}
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

  renderMovies() {
    if (this.state.loadingMovies) {
      return this.renderLoading()
    }

    return this.renderMovieList()
  }

  renderMovieList() {
    return (
      <YoutubeCardItemList auth={this.props.auth}
                           movies={this.state.movies}
                           history={this.props.history}/>
    )
  }


  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Movies
        </Loader>
      </Grid.Row>
    )
  }

}
