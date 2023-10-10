import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRef } from "react";
import axios from 'axios'

const Login = (props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const loginHandler = async (event) => {
    event.preventDefault();
    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try{
        const req=await axios.post('http://localhost:9000/user/login',formData)
        console.log(req.data)
    }
    catch(err){
      alert(err.message)
      console.log(err.response)
    }
  };
  return (
    <div>
      <div>
        <Card bg="success" className="text-center" style={{ color: "white" }}>
          <Card.Title>Day-To-Day Expenses</Card.Title>
          <hr />
          <Card.Header>Login</Card.Header>
        </Card>
      </div>
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <Form onSubmit={loginHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email..."
              ref={emailRef}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              ref={passwordRef}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Login
          </Button>
          <br />
          <br />
          <Button
            variant="success"
            type="button"
            onClick={() => {
              props.changeHandler();
            }}
          >
            Don't Have An Account! Sign Up.
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
