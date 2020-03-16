import React from 'react'

export const YoutubeVideo = (props:any) => (
  <video controls={true}>
    <source src={props.url} type="video/mp4"/>
  </video>
)
