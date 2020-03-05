import React, {Component, PureComponent} from "react";
import {Button, Container, Icon, Menu, Responsive, Segment, Sidebar} from "semantic-ui-react";
import {HomepageHeading} from "./HomePageHeading";

export class MobileContainer extends PureComponent {
  state = {
    sidebarOpened: false
  }

  handleSidebarHide = () => this.setState({sidebarOpened: false})

  handleToggle = () => this.setState({sidebarOpened: true})

  render() {
    const {children} = this.props
    const {sidebarOpened} = this.state

    return (
      <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item as='a' active>
            Home
          </Menu.Item>
          <Menu.Item as='a'>Work</Menu.Item>
          <Menu.Item as='a'>Log in</Menu.Item>
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            inverted
            textAlign='center'
            style={{minHeight: 350, padding: '1em 0em'}}
            vertical
          >
            <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar'/>
                </Menu.Item>
                <Menu.Item position='right'>
                  <Button as='a' inverted>
                    Log in
                  </Button>
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile/>
          </Segment>
          <Segment>
            {children}
          </Segment>
        </Sidebar.Pusher>
      </Responsive>
    )
  }
}

const getWidth = (): number => {
  const isSSR: boolean = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth as number : window.innerWidth as number
}
