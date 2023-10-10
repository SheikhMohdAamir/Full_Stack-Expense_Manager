import Signup from "./Signup";
import Login from "./Login";
import { useState } from "react";

const LoginPage = () => {
  const [change, setChange] = useState(false);

  const changeHandler = () => {
    setChange(!change);
  };
  return (
    <div>
      {change === false && <Signup changeHandler={changeHandler} />}
      {change === true && <Login changeHandler={changeHandler} />}
    </div>
  );
};

export default LoginPage;
