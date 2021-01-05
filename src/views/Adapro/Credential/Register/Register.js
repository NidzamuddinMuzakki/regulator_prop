import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import { Link } from 'react-router-dom';
import API from 'api';

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordconfirm: ""
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
    API.post("/api/credential/login/signup", {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    }).then(
        data => {
          console.log(data);
          this.props.history.replace("/login");
        }
    )
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="username" placeholder="Username" autoComplete="username" onChange={this._handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" placeholder="Email" autoComplete="email" onChange={this._handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password" placeholder="Password" autoComplete="new-password" onChange={this._handleChange} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="passwordconfirm" placeholder="Repeat password" autoComplete="new-password" onChange={this._handleChange} />
                    </InputGroup>
                    <Button color="success" onClick={this._handleFormSubmit} block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="12" className="text-center">
                      <h2><b>KOPI</b></h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="12" sm="12" className="text-center">
                      PT. Adapro Nusa Data
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
