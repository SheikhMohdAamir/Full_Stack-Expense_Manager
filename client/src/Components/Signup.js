import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRef } from "react";
import axios from 'axios'

const Signup = () => {
    const emailRef=useRef('')
    const nameRef=useRef('')
    const passwordRef=useRef('')

    const signupHandler=async(event)=>{
        event.preventDefault()
        const formData={
            email:emailRef.current.value,
            name:nameRef.current.value,
            password:passwordRef.current.value
        }
        try{
            const req=await axios.post('http://localhost:9000/user/signup',formData)
            console.log(req.data)
        }
        catch(err){
            console.log(err)
        }
    }

  return (
    <div>
      <div>
        <Card bg="success" className="text-center" style={{ color: "white" }}>
          <Card.Title>Day-To-Day Expenses</Card.Title>
            <hr />
          <Card.Header>SignUp</Card.Header>
        </Card>
      </div>
      <div className="container min-vh-100 d-flex justify-content-center align-items-center">
        <Form onSubmit={signupHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email..." ref={emailRef} />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="name" placeholder="Enter name..." ref={nameRef} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" ref={passwordRef} />
                </Form.Group>
                <Button variant="success" type="submit">
                  Submit
                </Button>
              </Form>
      </div>
    </div>
  );
};

export default Signup