import React, {PureComponent} from 'react'
import {Button, Card, Form, Input, Select, TextArea,} from 'semantic-ui-react'
import {createMovie} from "../../api/movies-api";
import Auth from "../../auth/Auth";
import {Movie} from "../../types/Movie";

const options = [
  {key: 'a', text: 'Action', value: 'action'},
  {key: 'co', text: 'Comedy', value: 'comedy'},
  {key: 'f', text: 'Fantasy', value: 'fantasy'},
  {key: 'h', text: 'Horror', value: 'horror'},
  {key: 'r', text: 'Romance', value: 'romance'},
  {key: 't', text: 'Thriller', value: 'thriller'},
]

interface EditYoutubeCardItemProps {
  auth: Auth
  history: History
}

interface EditYoutubeCardItemState {
  movies: Movie[]
  name: string,
  directorName: string,
  type: string,
  summary: string,
  loadingMovies: boolean
}


export class EditYoutubeCardItem extends PureComponent<EditYoutubeCardItemProps, EditYoutubeCardItemState> {

  state: EditYoutubeCardItemState = {
    name: '',
    directorName: '',
    type: '',
    summary: '',
    movies: [],
    loadingMovies: false
  }

  updateState = <T extends string>(key: keyof EditYoutubeCardItemState, value: T) => (
    prevState: EditYoutubeCardItemState
  ): EditYoutubeCardItemState => ({
    ...prevState,
    [key]: value
  })

  handleChange = (e: any, {name, value}: { name: any, value: any }) => this.setState(this.updateState(name, value))

  handleSubmit = async () => {

      try {
        const newMovie = await createMovie(this.props.auth.getIdToken(), {
          name: this.state.name,
          directorName: this.state.directorName,
          summary: this.state.summary,
          type: this.state.type,
        })
        this.setState({
          movies: [...this.state.movies, newMovie],
          name: '',
          directorName: '',
          summary:'',
          type:'',
          loadingMovies: false
        })
      } catch {
        alert('Movie creation failed')
      }

  }

  render() {
    const {name, directorName, type, summary} = this.state

    return (
      <Card fluid={true}>
        <Card.Content header='Insert new movie'/>
        <Card.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths='equal'>
              <Form.Field
                name={'name'}
                control={Input}
                label='Movie Name'
                placeholder='Movie Name'
                onChange={this.handleChange}
              />
              <Form.Field
                name={'directorName'}
                control={Input}
                label='Director Name'
                placeholder='Director Name'
                onChange={this.handleChange}
              />
              <Form.Field
                name={'type'}
                control={Select}
                label='Movie Type'
                options={options}
                placeholder='Movie Type'
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Field
              name={'summary'}
              control={TextArea}
              label='Summary'
              placeholder='Tell us more about movie'
              onChange={this.handleChange}
            />
            <Form.Field control={Button}>Submit</Form.Field>
          </Form>
        </Card.Content>
        <Card.Content>
          {JSON.stringify({name, directorName, type, summary})}
        </Card.Content>
      </Card>
    )
  }

  onMovieCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newMovie = await createMovie(this.props.auth.getIdToken(), {
        name: this.state.name,
        type: this.state.type,
        directorName: this.state.directorName,
        summary: this.state.summary
      })
      this.setState({
        movies: [...this.state.movies, newMovie],
      })
    } catch {
      alert('Todo creation failed')
    }
  }

}


