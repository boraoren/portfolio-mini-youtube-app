import React, {PureComponent} from 'react'
import {Button, Card, Form, Input, Modal, Select, TextArea} from 'semantic-ui-react'
import {YoutubeVideo} from "./YoutubeVideo";
import {Movie} from "../../types/Movie";
import Auth from "../../auth/Auth";
import {updateMovie} from "../../api/movies-api";

interface YoutubeCardItemState {
  open: boolean
  name: string
  directorName: string
  type: string
  summary: string

}


interface YoutubeCardItemProps {
  movie: Movie
  isFluid: boolean
  auth: Auth
}


const options = [
  {key: 'a', text: 'action', value: 'action'},
  {key: 'co', text: 'comedy', value: 'comedy'},
  {key: 'f', text: 'fantasy', value: 'fantasy'},
  {key: 'h', text: 'horror', value: 'horror'},
  {key: 'r', text: 'romance', value: 'romance'},
  {key: 't', text: 'thriller', value: 'thriller'},
  {key: 's', text: 'sci-fi', value: 'sci-fi'}
]

export class YoutubeCardItem extends PureComponent<YoutubeCardItemProps, YoutubeCardItemState> {

  state = {
    open: false,
    name: this.props.movie.name,
    directorName: this.props.movie.directorName,
    type: this.props.movie.type,
    summary: this.props.movie.summary,
  }

  updateState = <T extends string>(key: keyof YoutubeCardItemState, value: T) => (
    prevState: YoutubeCardItemState
  ): YoutubeCardItemState => ({
    ...prevState,
    [key]: value
  })


  handleChange = (e: any, {name, value}: { name: any, value: any }) => this.setState(this.updateState(name, value))

  handleSubmit = async () => {

    try {
      const updatedMovie = await updateMovie(this.props.auth.getIdToken(), this.props.movie.id, {
        name: this.state.name,
        directorName: this.state.directorName,
        summary: this.state.summary,
        type: this.state.type,
      })

      this.props.movie.name = this.state.name
      this.props.movie.directorName = this.state.directorName
      this.props.movie.summary = this.state.summary
      this.props.movie.type = this.state.type

      alert(`Movie ${this.state.name} updated`)
      this.setState({open: false})
    } catch {
      alert('Movie update failed')
    }

  }


  render() {
    const {isFluid, movie, auth} = this.props
    const {open} = this.state
    const show = () => () => this.setState({
      open: true,
    })
    const close = () => this.setState({open: false})

    return (
      <Card fluid={isFluid}>
        <YoutubeVideo/>
        <Card.Content>
          <Card.Header>{this.state.name}</Card.Header>
          <Card.Meta>
            <span className='sub'>{this.state.directorName}</span>
          </Card.Meta>
          <Card.Description>
            {this.state.summary}
          </Card.Description>
        </Card.Content>
        <Card.Content>
          {this.state.type}
        </Card.Content>
        {auth.getUserId() === movie.userId ? getAuthenticatedContainer(open, close, show, movie, this.handleChange, this.handleSubmit) : ""}
      </Card>
    )
  }
}


const getAuthenticatedContainer = (open: any,
                                   close: any,
                                   show: any,
                                   movie: Movie,
                                   handleChange: any,
                                   handleSubmit: any) => {
  return (
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button basic color='green' onClick={show()}>
          Edit
        </Button>
        <Button basic color='red'>
          Delete
        </Button>
      </div>
      <Modal dimmer={true} open={open} onClose={close}>
        <Modal.Header>Update Movie Item</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Group widths='equal'>
              <Form.Field
                name={'name'}
                control={Input}
                label='Movie Name'
                placeholder='Movie Name'
                onChange={handleChange}
                defaultValue={movie.name}
              />
              <Form.Field
                name={'directorName'}
                control={Input}
                label='Director Name'
                placeholder='Director Name'
                onChange={handleChange}
                defaultValue={movie.directorName}
              />
              <Form.Field
                name={'type'}
                control={Select}
                label='Movie Type'
                options={options}
                placeholder='Movie Type'
                onChange={handleChange}
                defaultValue={movie.type.toLowerCase()}
              />
            </Form.Group>
            <Form.Field
              name={'summary'}
              control={TextArea}
              label='Summary'
              placeholder='Tell us more about movie'
              onChange={handleChange}
              defaultValue={movie.summary}
            />
            <Form.Field control={Button}
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Yep, that's me">Submit</Form.Field>
            <Button color='black' onClick={close}>
              Cancel
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </Card.Content>
  )
}
