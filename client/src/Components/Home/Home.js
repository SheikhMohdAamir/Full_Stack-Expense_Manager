import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";

const Home = () => {
  const [expenses, setExpenses] = useState(null);
  const [post, setPost] = useState(null);
  const [del, setDel] = useState(null);
  useEffect(() => {
    return async () => {
      try {
        const req = await axios.get("http://localhost:9000/home/get",{headers:{'Authorization':localStorage.getItem('token')}});
        setExpenses(req.data.expenses);
      } catch (err) {
        console.log(err);
      }
    }
  }, [post,del]);
  const refAmount = useRef("");
  const refDescription = useRef("");
  const refCategory = useRef("");
  const expenseHandler = async (event) => {
    event.preventDefault();
    const formData = {
      amount: refAmount.current.value,
      description: refDescription.current.value,
      category: refCategory.current.value,
    };
    try {
      const req = await axios.post("http://localhost:9000/home/post", formData, {headers:{'Authorization':localStorage.getItem('token')}});
      console.log(req);
      setPost(req.data)
    } catch (err) {
      console.log(err);
    }
  };
  const deletHandler=async(id)=>{
    try{
        const req=await axios.post('http://localhost:9000/home/delete',{id}, {headers:{'Authorization':localStorage.getItem('token')}})
        console.log(req)
        setTimeout(()=>setDel(req.data),500)
    }
    catch(err){
        console.log(err)
    }
  }
  return (
    <div>
      <Navbar bg="success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>&#9738; Welcome To Your Expense Manager</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <u>Day To Day Expenses</u>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <div className="container" style={{ width: "60%" }}>
        <Form onSubmit={expenseHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter amount..."
              ref={refAmount}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter description..."
              ref={refDescription}
            />
          </Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Select aria-label="Default select example" ref={refCategory}>
            <option value="food">Food</option>
            <option value="bills">Bills</option>
            <option value="travel">Travel</option>
          </Form.Select>
          <br />
          <Button variant="success" type="submit">
            Add+
          </Button>
        </Form>
      </div>
      <hr />
      <div className="container" style={{ width: "60%" }}>
        <b style={{fontSize:'30px',color:'#3A833A'}}>&#9783; List Of Expenses &#10225;</b>
        <ListGroup as="ol" numbered>
          {expenses === null ? (
            <p>Loading...</p>
          ) : (
            expenses.map((i) => {
              return (
                <ListGroup.Item
                  action
                  variant="success"
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  key={i.id}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{i.description}</div>
                    {i.amount}
                  </div>
                  <Button variant="danger" type="button" size="sm" onClick={()=>deletHandler(i.id)}>
                    Delete
                  </Button>
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
      </div>
    </div>
  );
};

export default Home;
