import React, {PureComponent} from 'react'
import {Button, Card, Form, Input, Select, TextArea,} from 'semantic-ui-react'
import {createMovie} from "../../api/movies-api";
import Auth from "../../auth/Auth";

const options = [
  {key: 'a', text: 'action', value: 'action'},
  {key: 'co', text: 'comedy', value: 'comedy'},
  {key: 'f', text: 'fantasy', value: 'fantasy'},
  {key: 'h', text: 'horror', value: 'horror'},
  {key: 'r', text: 'romance', value: 'romance'},
  {key: 't', text: 'thriller', value: 'thriller'},
  {key: 's', text: 'sci-fi', value: 'sci-fi'}
]


interface EditYoutubeCardItemProps {
  auth: Auth
  history: History
  handleUpdateMovieList: Function
}

interface EditYoutubeCardItemState {
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
          name: '',
          directorName: '',
          summary:'',
          type:'',
          loadingMovies: false
        })

        this.props.handleUpdateMovieList(newMovie)

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
      </Card>
    )
  }

}


