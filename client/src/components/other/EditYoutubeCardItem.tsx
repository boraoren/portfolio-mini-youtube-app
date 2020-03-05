import React, {PureComponent} from 'react'
import {Button, Card, Form, Input, Select, TextArea,} from 'semantic-ui-react'

const options = [
  {key: 'm', text: 'Male', value: 'male'},
  {key: 'f', text: 'Female', value: 'female'},
  {key: 'o', text: 'Other', value: 'other'},
]

interface EditYoutubeCardItemProps {
  value: string
}

export class EditYoutubeCardItem extends PureComponent<EditYoutubeCardItemProps> {

  state = {
    value: ""
  }

  handleChange = (e: any, value: any) => this.setState({value})

  render() {
    const {value} = this.state
    return (
      <Card fluid={true}>
        <Card.Content header='Insert new movie'/>
        <Card.Content>
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                control={Input}
                label='Movie Name'
                placeholder='Movie Name'
              />
              <Form.Field
                control={Input}
                label='Director Name'
                placeholder='Director Name'
              />
              <Form.Field
                control={Select}
                label='Movie Type'
                options={options}
                placeholder='Movie Type'
              />
            </Form.Group>
            <Form.Field
              control={TextArea}
              label='Summary'
              placeholder='Tell us more about movie'
            />
            <Form.Field control={Button}>Submit</Form.Field>
          </Form>
        </Card.Content>
      </Card>
    )
  }
}
