import React from 'react'
import { Card } from 'semantic-ui-react'
import {YoutubeCardItem} from "./YoutubeCardItem";

export const YoutubeCardItemList = () => (
  <Card.Group centered>
    <YoutubeCardItem isFluid={false}/>
    <YoutubeCardItem isFluid={false}/>
    <YoutubeCardItem isFluid={false}/>
    <YoutubeCardItem isFluid={false}/>
  </Card.Group>
)
