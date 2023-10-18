import "../btn.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";

const LearderBoard = () => {
  const [leaderboardData,setLeaderboardData] = useState(null)
  useEffect(() => {
    return async () => {
      try {
        const req = await axios.get("http://localhost:9000/premiummember", {
          headers: { Authorization: localStorage.getItem("token") },
        })
        setLeaderboardData(req.data.LeaderboardData)
        console.log(req)
      } catch (err) {
        console.log(err);
      }
    };
  }, []);
  return (
    <div>
      <hr />
      <div className="container" style={{ width: "60%" }}>
        <b style={{ fontSize: "30px", color: "#3A833A" }}>
          &#9783; Leaderboard &#10225;
        </b>
        <hr />
        <ListGroup as="ol" numbered>
          {leaderboardData === null ? (
            <p>Loading...</p>
          ) : (
            leaderboardData.map((i) => {
              return (
                <ListGroup.Item
                  action
                  variant="info"
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  key={i.id}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{i.name}</div>
                    {i.totalexpense}
                  </div>
                </ListGroup.Item>
              );
            })
          )}
        </ListGroup>
      </div>
      
    </div>
  );
};

export default LearderBoard;
