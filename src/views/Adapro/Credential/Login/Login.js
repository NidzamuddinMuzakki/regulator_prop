import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import authMethod from "auth/authMethod";

class Login extends Component {
  Auth = new authMethod();

  state = {
    username: "",
    password: ""
  }
  _handleChange = (e) => {
    this.setState(
        {
            [e.target.name]: e.target.value
        }, () => { console.log(this.state); }
    )
  }
  _handleFormSubmit = (e) => {
    e.preventDefault();
    this.Auth.login(this.state.username,this.state.password).then(res => {
      if(res === false) return alert("Sorry credentials don't exists");
      this.props.history.replace("/");
    }).catch(err => {
      alert(err);
    })
  }
  componentWillMount() {
    if(this.Auth.loggedIn())
    this.props.history.replace('/');
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="username" placeholder="Username" autoComplete="username" onChange={this._handleChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" placeholder="Password" autoComplete="current-password" onChange={this._handleChange} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this._handleFormSubmit}>Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h1><b>KOPI</b></h1>
                      <p><i>Compliance and Regulatory, simplified.</i></p>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                      <p>&nbsp;</p>
                      <p><b>PT. Adapro Nusa Data</b></p>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
