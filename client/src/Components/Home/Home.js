import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRef, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../btn.css";


const Home = () => {
  const [expenses, setExpenses] = useState(null);
  const [post, setPost] = useState(null);
  const [del, setDel] = useState(null);
  const [premiumbtn, setpremiumbtn] = useState(false);
  const navigate= useNavigate()
  useEffect(() => {
    return async () => {
      try {
        const req = await axios.get("http://localhost:9000/checkifpremium", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        if(req.data.message==='NOT A PREMIUM MEMBER'){
          setpremiumbtn(true)
        }
       
      } catch (err) {
        console.log(err);
      }
    };
  }, []);
  useEffect(() => {
    return async () => {
      try {
        const req = await axios.get("http://localhost:9000/home/get", {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setExpenses(req.data.expenses);
      } catch (err) {
        console.log(err);
      }
    };
  }, [post, del]);
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
      const req = await axios.post(
        "http://localhost:9000/home/post",
        formData,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(req);
      setPost(req.data);
    } catch (err) {
      console.log(err);
    }
  };
  const deletHandler = async (id) => {
    try {
      const req = await axios.post(
        "http://localhost:9000/home/delete",
        { id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(req);
      setTimeout(() => setDel(req.data), 500);
    } catch (err) {
      console.log(err);
    }
  };

  const premiumHandler = async () => {
    console.log("CLICKED");
    try {
      const req = await axios.get("http://localhost:9000/purchasepremium", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      console.log("PREMIUM Handler REQUEST", req.data);
      const options = {
        key: req.data.key_id,
        order_id: req.data.order.id,
        handler: async function (req) {
          await axios.post(
            "http://localhost:9000/updatetransactionstatus",
            {
              "order_id": options.order_id,
              "payment_id": req.razorpay_payment_id,
            },
            { "headers": { Authorization: localStorage.getItem("token") } }
          )

          alert('Congratulations, You Are A Premium User Now')
          setpremiumbtn(false)
          console.log(req)
        },
      };
      const rzp=new window.Razorpay(options)
      rzp.open()
      rzp.on('payment.failed',function(res){
        try{
          const req=axios.get('http://localhost:9000/transactionfailed',{headers: { Authorization: localStorage.getItem("token") }})
          console.log(req)
        }
        catch(err){
          console.log(err)
        }
        alert('Something Went Wrong')
      })
    } catch (err) {
      console.log(err);
    }
  };
  const logoutHandler=()=>{
    localStorage.clear('token')
    navigate('/')
  }

  return (
    <div>
      <Navbar bg="success" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>&#9738; Welcome To Your Expense Manager</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {premiumbtn && <button
                className="button"
                variant="info"
                size="sm"
                onClick={premiumHandler}
                
              >
                Switch To Premium&#9813;
              </button>}
             {!premiumbtn  && <button
                className="button"
                variant="info"
                size="sm"
                disabled
              >
                Premium Member&#9813;
              </button>}
            </Navbar.Text>
            <Navbar.Text>
            <Button variant="success" type="button" onClick={logoutHandler}>
            Logout
          </Button>
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
        <b style={{ fontSize: "30px", color: "#3A833A" }}>
          &#9783; List Of Expenses &#10225;
        </b>
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
                  <Button
                    variant="danger"
                    type="button"
                    size="sm"
                    onClick={() => deletHandler(i.id)}
                  >
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
