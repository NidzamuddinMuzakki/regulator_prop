import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import authMethod from "auth/authMethod";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { motion, useCycle } from "framer-motion";

const ballStyle = {
  display: "block",
  width: "1rem",
  height: "1rem",
  marginLeft:'20px',
  backgroundColor: "grey",
  borderRadius: "0.5rem",
  
};

const bounceTransition = {
  y: {
    duration: 0.3,
    yoyo: Infinity,
    ease: "easeOut",
    
  },
  backgroundColor: {
    duration: 0.6,
    yoyo: Infinity,
    ease: "easeOut",
    repeatDelay: 0.8,
    
  },
  
};
const bounceTransition1 = {
  y: {
    duration: 0.4,
    yoyo: Infinity,
    ease: "easeOut",
    
  },
  backgroundColor: {
    duration: 0.6,
    yoyo: Infinity,
    ease: "easeOut",
    repeatDelay: 0.8,
    
  },
  
};
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const variants = {
  closed: {duration: 0.6, opacity:0,right:0 ,width:"50%",height:"100%" ,position:"absolute", zIndex:"10", background:"#20a8d8" },
  closed1: { opacity:0,right:0 ,width:"0%", height:"100%",position:"absolute", zIndex:"10", background:"#20a8d8" },
  open: { duration: 0.6,opacity:1,width:"100%",right:0,height:"100%", position:"absolute", zIndex:"10", background:"#20a8d8" },
}
const variants1 = {
  closed: { opacity: 0, },
  open: { opacity: 1 },
}
class Login extends Component {
  Auth = new authMethod();

  state = {
    username: "",
    password: "",
    open:false,
    error:"",
    isOpen:false,
    size:[window.innerWidth, window.innerHeight]
  }
  _handleClose = (event, reason)=>{
    if(reason === "clickaway"){
      return;
    }
    this.setState({
      open:false,
      error:""
    });
  }
  _handleChange = (e) => {
    this.setState(
        {
            [e.target.name]: e.target.value
        },
        //  () => { console.log(this.state); }
    )
  }
  _handleFormSubmit = (e) => {
    e.preventDefault();
    this.setState({
      isOpen:true,
    })
    console.log(this.state.size[0])
    this.Auth.login(this.state.username,this.state.password).then(res => {
      if(res === false) return 
      // alert("Sorry credentials don't exists");
      else{
        
        if(res.data=="username wrong" || res.data=="password wrong"){
          this.setState({
            open:true,
            isOpen:false,
            error:res.data.toString(),
          })
        }else{
          this.props.history.replace("/");
        }
       
      }
      
      
     
    }).catch(err => {
      console.log(this.state.isOpen)
      this.setState({
        open:true,
        error: err,
        isOpen:false,
      })
      // alert(this.state.error)
    
    })
   
  }
  componentWillMount() {
   
    window.addEventListener('resize',  (()=>{
      this.setState({
        size:[window.innerWidth, window.innerHeight]
      })
    }));
   
    if(this.Auth.loggedIn())
    this.props.history.replace('/');
    
  }
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          
          <Row className="justify-content-center">
            
            <Col md="8">
            <motion.div className="text-white bg-primary"  style={{ display:"flex",justifyContent:"center",alignItems:"center",opacity:this.state.size[0]<1000?0:1,width:this.state.size[0]<1000?"0%":"50%",right:0 ,height:this.state.size[0]<1000?'0%':'100%', position:"absolute", zIndex:"10", background:"#20a8d8"}}  
            animate={this.state.isOpen ? "open" : "closed"}
      variants={variants} >

<Card className="text-white bg-primary" style={{opacity:this.state.size[0]<1000?0:1,width: '100%', height:'100%', margin:0 }}>
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
                <motion.div variants={variants1} animate={this.state.isOpen ? "open" : "closed"} style={{opacity:this.state.size[0]<1000?0:1,position:"absolute",zIndex:"15", display:"flex"}}>

<motion.span
        style={ballStyle}
        transition={bounceTransition}
        animate={{
          y: ["100%", "-100%"],
          backgroundColor: ["#005073", "#005073"]
        }} />
        <motion.span
        style={ballStyle}
        transition={bounceTransition1}
        animate={{
          y: ["100%", "-100%"],
          backgroundColor: ["#005073", "#005073"]
        }} />
        <motion.span
        style={ballStyle}
        transition={bounceTransition}
        animate={{
          y: ["100%", "-100%"],
          backgroundColor: ["#005073", "#005073"]
        }} />
        </motion.div>
      </motion.div>
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
                          <Button onClick={this._handleFormSubmit} color="primary" className="px-4">Login</Button>
                         
                         
                         
                        </Col>
                        <Col xs="6" className="text-right">
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%'}}>
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
          <Snackbar open={this.state.open} 
          autoHideDuration={2000} 
        
          onClose={this._handleClose}>
        <Alert onClose={this._handleClose} severity={this.state.error.toString!=""?"error":"info"}>
          {this.state.error.toString()}
        </Alert>
      </Snackbar>
      {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
        </Container>

      </div>
    );
  }
}

export default Login;
