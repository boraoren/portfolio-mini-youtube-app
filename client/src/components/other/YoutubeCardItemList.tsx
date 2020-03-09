import React, {PureComponent} from 'react'
import {Card, Grid, Loader} from 'semantic-ui-react'
import {YoutubeCardItem} from "./YoutubeCardItem";
import {getMovies} from "../../api/movies-api";
import Auth from "../../auth/Auth";
import {Movie} from "../../types/Movie";

interface YoutubeCardItemListProps {
    auth: Auth
}

interface YoutubeCardItemListState {
    movies: Movie[]
    loadingMovies: boolean
}

export class YoutubeCardItemList extends PureComponent<YoutubeCardItemListProps, YoutubeCardItemListState> {

    state: YoutubeCardItemListState = {
        movies: [],
        loadingMovies: true
    }

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


    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline="centered">
                    Loading Movies
                </Loader>
            </Grid.Row>
        )
    }


    renderMovieList() {

        const movies: Movie[] = this.state.movies

        return (
            <Card.Group centered>
                {movies.map((movie: Movie) => {
                    return (
                        <YoutubeCardItem isFluid={false}
                                         movie={movie}
                                         auth={this.props.auth}/>
                    )
                })}
            </Card.Group>)
    }

    renderMovies() {
        if (this.state.loadingMovies) {
            return this.renderLoading()
        }

        return this.renderMovieList()
    }

    render() {
        return (
            <>
                {this.renderMovies()}
            </>
        )
    }


}
