import { useRef, useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import backgroundImg from "../imgs/background.jpg";

const Login = () => {
  const navigate = useNavigate();
  //hàm kiểm tra người dùng đã đăng nhập chưa
  const fetchLogin = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/check-login`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "You are logged in.") {
            navigate("/");
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchLogin(), [fetchLogin]);

  const emailInput = useRef();
  const passInput = useRef();

  //hàm submit form
  const submitForm = (e) => {
    e.preventDefault();
    const inputObj = {
      email: emailInput.current.value,
      pass: passInput.current.value,
    };
    fetch(`${process.env.REACT_APP_BACKEND}/users/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputObj),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.errs) {
            alert(data.errs);
          } else if (data.msg === "Wrong email or password!") {
            alert("Wrong email or password!");
          } else if (data.msg === "You are logged in!") {
            alert("You are logged in!");
            navigate("/");
          }
        } else {
          //   navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className="d-flex justify-content-around align-items-center"
      style={{
        textAlign: "center",
        width: "100%",
        minHeight: "100vh",
        zIndex: "-2",
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImg})`,
      }}
    >
      <Container
        className="col-9 col-md-6 col-xxl-4 px-5 my-3 rounded-2 shadow"
        style={{
          backgroundColor: "white",
          zIndex: "5",
          height: "80vh",
        }}
      >
        <p className="my-5" style={{ fontSize: "1.4rem" }}>
          Login
        </p>
        <form onSubmit={submitForm} className="d-flex flex-column">
          <input
            className="p-3 border border-secondary border-bottom-0"
            type="email"
            placeholder="Email"
            required
            ref={emailInput}
          />
          <input
            className="p-3 border border-secondary"
            type="password"
            placeholder="Password"
            required
            ref={passInput}
          />

          <button
            type="submit"
            className="border-0 py-2 my-3"
            style={{ backgroundColor: "black", color: "white" }}
          >
            LOGIN
          </button>
        </form>
        <div className="py-3" style={{ color: "gray" }}>
          <span>Create an account?</span>{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/sign-up")}
          >
            Click
          </span>
          . Or go to
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            {" "}
            HomePage
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Login;
