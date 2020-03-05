import React, {PureComponent} from "react";
import {Button, Container, Menu, Responsive, Segment, Visibility} from "semantic-ui-react";
import {HomepageHeading} from "./HomePageHeading";
import {ButtonProps} from "semantic-ui-react/dist/commonjs/elements/Button/Button";
import {Link} from "react-router-dom";

interface DesktopContainerState {
  fixed?: boolean
  handleLogin: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {}
  handleLogout: (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {}
  isAuthenticated: boolean
}

export class DesktopContainer extends PureComponent<DesktopContainerState> {

  hideFixedMenu = () => this.setState({fixed: false})
  showFixedMenu = () => this.setState({fixed: true})

  render() {

    const {children, fixed} = this.props

    return (
      <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{minHeight: 700, padding: '1em 0em'}}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : undefined}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
              <Container>
                <Menu.Item as='a' active>
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item position='right'>
                  {logInLogOutButton(this.props)}
                </Menu.Item>
              </Container>
            </Menu>
            <HomepageHeading/>
          </Segment>
          <Segment>
            {children}
          </Segment>
        </Visibility>
      </Responsive>
    )
  }
}

const getWidth = (): number => {
  const isSSR: boolean = typeof window === 'undefined'
  return isSSR ? Responsive.onlyTablet.minWidth as number : window.innerWidth as number
}

const logInLogOutButton = (props: any): any => {
  if (props.isAuthenticated) {
    return (
      <Button name="logout" as='a' inverted={!props.fixed} onClick={props.handleLogout}>
        Log out
      </Button>
    )
  } else {
    return (
      <Button name="login" as='a' inverted={!props.fixed} onClick={props.handleLogin}>
        Log in
      </Button>
    )
  }
}
