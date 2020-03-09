import React from 'react'
import {Button, Card, Icon} from 'semantic-ui-react'
import {YoutubeVideo} from "./YoutubeVideo";
import {Movie} from "../../types/Movie";
import Auth from "../../auth/Auth";

interface YoutubeCardItemProps {
  movie: Movie
  isFluid: boolean
  auth: Auth
}

export const YoutubeCardItem = (props: YoutubeCardItemProps): any => ({
  render() {

    return (
      <Card fluid={props.isFluid}>
        <YoutubeVideo/>
        <Card.Content>
          <Card.Header>{props.movie.name}</Card.Header>
          <Card.Meta>
            <span className='sub'>{props.movie.directorName}</span>
          </Card.Meta>
          <Card.Description>
            {props.movie.summary}
          </Card.Description>
        </Card.Content>
        {props.auth.getUserId() === props.movie.userId ? getAuthenticatedContainer() : ""}
      </Card>
    )
  }
})


const getAuthenticatedContainer = () => {
  return(
    <Card.Content extra>
      <div className='ui two buttons'>
        <Button basic color='green'>
          Edit
        </Button>
        <Button basic color='red'>
          Delete
        </Button>
      </div>
    </Card.Content>
  )
}
