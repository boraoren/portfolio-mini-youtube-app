import React, {PureComponent} from 'react'
import {Card} from 'semantic-ui-react'
import {YoutubeCardItem} from "./YoutubeCardItem";
import Auth from "../../auth/Auth";
import {Movie} from "../../types/Movie";
import {EditYoutubeCardItem} from "./EditYoutubeCardItem";

interface YoutubeCardItemListProps {
    auth: Auth
    movies: Movie[]
    history: History
}

interface YoutubeCardItemListState {
    movies: Movie[]
}

export class YoutubeCardItemList extends PureComponent<YoutubeCardItemListProps, YoutubeCardItemListState> {

    state:YoutubeCardItemListState = {
        movies:this.props.movies
    }

    componentWillReceiveProps(nextProps: Readonly<YoutubeCardItemListProps>, nextContext: any): void {
        this.setState({ movies:nextProps.movies })
    }

    handleUpdateMovieList = (newMovie: Movie) => {
        this.setState({
            movies: [...this.props.movies, newMovie]
        })
        alert(`New movie ${newMovie.name} has been added.`)
    }

    render() {
        const movies: Movie[] = this.state.movies
        const {auth, history} = this.props

        return (
            <>
                {this.props.auth.isAuthenticated() ? <EditYoutubeCardItem auth={auth}
                                                                          history={history}
                                                                          handleUpdateMovieList={this.handleUpdateMovieList}/> : ""}
                <Card.Group centered>
                    {movies.map((movie: Movie) => {
                        return (
                            <YoutubeCardItem isFluid={false}
                                             movie={movie}
                                             auth={this.props.auth}/>
                        )
                    })}
                </Card.Group>
            </>
        )
    }


}
