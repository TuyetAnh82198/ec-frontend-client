import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Card, Container, Navbar } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { socket } from "../socket.js";
import ScrollToBottom from "react-scroll-to-bottom";

import {
  CartFill,
  PersonFill,
  ChatDotsFill,
  X,
  SendFill,
} from "react-bootstrap-icons";
import logo from "../imgs/logo.png";
import logo_nav from "../imgs/logo_nav.png";

import styles from "./rootLayout.module.css";

const Footer = lazy(() => import("../components/Footer.jsx"));

const RootLayout = () => {
  if (!localStorage.getItem("numberOfItems")) {
    localStorage.setItem("numberOfItems", 0);
  }
  //state trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //state số sản phẩm trong giỏ hàng
  const [numberOfItems, setNumberOfItems] = useState(
    localStorage.getItem("numberOfItems")
  );
  //state ẩn, hiện cửa sổ Chat
  const [hideChat, setHideChat] = useState(true);
  //state lịch sử chat
  const [messageList, setMessageList] = useState([]);
  //state cập nhật tin nhắn đã input
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.connect();
    localStorage.setItem(
      "roomId",
      Math.floor(Math.random() * Date.now()).toString(36)
    );
    socket.emit("createRoom", localStorage.getItem("roomId"));
    return () => {
      socket.disconnect();
    };
  }, []);
  //hàm tạo roomId nếu chưa có và thêm tin nhắn mới vào lịch sử chat;
  //hoặc kết thúc phiên chat khi khách hàng gõ /end
  const chatHandler = (e) => {
    e.preventDefault();
    if (msg.trim().length !== 0) {
      if (msg === "/end") {
        setMessageList([]);
        socket.emit("end chat", localStorage.getItem("roomId"));
        localStorage.removeItem("roomId");
        localStorage.setItem(
          "roomId",
          Math.floor(Math.random() * Date.now()).toString(36)
        );
        socket.emit("createRoom", localStorage.getItem("roomId"));
      } else {
        setMessageList((prevState) => [
          ...prevState,
          {
            sender: "client",
            dateTime: `${
              new Date().getMonth() + 1
            }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
            content: msg,
          },
        ]);

        const sendMessages = () => {
          return {
            roomId: localStorage.getItem("roomId"),
            messageList: [
              ...messageList,
              {
                sender: "client",
                dateTime: `${
                  new Date().getMonth() + 1
                }/${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
                content: msg,
              },
            ],
          };
        };
        socket.emit("frontend send messages", sendMessages());
      }

      setMsg("");
    }
  };

  useEffect(() => {
    const receiveMessages = (data) => {
      setMessageList(data.messageList);
    };
    socket.on("server send messages", receiveMessages);
    return () => {
      socket.off("server send messages", receiveMessages);
    };
  }, []);

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
            setIsLoggedIn(true);
            if (!localStorage.getItem("fullName")) {
              localStorage.setItem("fullName", data.fullName);
            }
            localStorage.setItem("numberOfItems", data.numberOfItems);
            setNumberOfItems(data.numberOfItems);
          } else if (data.msg === "Have not been logged in yet.") {
            setIsLoggedIn(false);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchLogin(), [fetchLogin]);

  useEffect(() => {
    const cartHandler = (data) => {
      if (data.action === "add") {
        setNumberOfItems(data.addResult.length);
        localStorage.setItem("numberOfItems", data.addResult.length);
      } else if (data.action === "update") {
        setNumberOfItems(data.updatedResult.length);
        localStorage.setItem("numberOfItems", data.updatedResult.length);
      } else if (data.action === "delete") {
        setNumberOfItems(data.deleteResult.length);
        localStorage.setItem("numberOfItems", data.deleteResult.length);
      } else if (data.action === "paid") {
        setNumberOfItems(data.paid);
        localStorage.setItem("numberOfItems", 0);
      }
    };
    socket.on("cart", cartHandler);

    return () => {
      socket.off("cart", cartHandler);
    };
  }, []);

  //hàm xử lý việc đăng xuất
  const logout = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/users/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "You are logged out.") {
            alert("You are logged out.");
            if (localStorage.getItem("fullName")) {
              localStorage.removeItem("fullName");
            }
            navigate("/login");
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      {!hideChat && (
        <Container className="d-flex justify-content-around">
          <Card
            className="col-8 col-md-4 rounded-3 shadow"
            style={{
              zIndex: "3",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Card.Header className="d-flex justify-content-between">
              <h5>Customer Support</h5>
              <X
                onClick={() => setHideChat(true)}
                style={{ fontSize: "2rem", cursor: "pointer" }}
              />
            </Card.Header>
            <Card.Body>
              <ScrollToBottom>
                <div style={{ height: "18rem" }}>
                  {messageList.length === 0 && (
                    <div className="d-flex">
                      <PersonFill
                        style={{
                          color: "#cf4965",
                          fontSize: "1.6rem",
                          marginRight: "0.5rem",
                          marginTop: "0.2rem",
                        }}
                      />
                      <p
                        className="p-1"
                        style={{ color: "gray", backgroundColor: "#f8f9fa" }}
                      >
                        Hello, how can I help you today?
                      </p>
                    </div>
                  )}
                  {messageList.map((msg) => (
                    <div
                      key={(Math.random() * 5).toString()}
                      style={{
                        textAlign: msg.sender === "client" ? "right" : "left",
                        color: msg.sender === "client" ? "white" : "gray",
                      }}
                    >
                      <p
                        className="d-inline-block p-2 rounded-1"
                        style={{
                          backgroundColor:
                            msg.sender === "client" ? "#49adf7" : "#f8f9fa",
                        }}
                      >
                        {msg.content}
                      </p>
                      <p style={{ color: "gray" }}>
                        <span>{msg.dateTime}</span> from {msg.sender}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollToBottom>
            </Card.Body>
            <Card.Footer className="p-2">
              <form onSubmit={chatHandler}>
                <input
                  className="col-11 p-1 border-0"
                  type="text"
                  placeholder="Type and enter. You can end the chat by typing '/end'"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <button
                  className="col-1 border-0"
                  type="submit"
                  style={{
                    fontSize: "1.2rem",
                    color: "#cf4965",
                  }}
                >
                  <SendFill />
                </button>
              </form>
            </Card.Footer>
          </Card>
        </Container>
      )}
      <Container className="d-flex">
        <div className="col-2" style={{ position: "relative" }}>
          <NavLink to="/">
            <img
              className={`shadow ${styles.logo}`}
              src={logo}
              alt="coca_logo"
            />
          </NavLink>
        </div>
        <Navbar className="p-0 col-10 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : styles.notActive
              }
            >
              Home
            </NavLink>
            <NavLink
              to="shop"
              className={({ isActive }) =>
                isActive ? styles.active : styles.notActive
              }
            >
              Shop
            </NavLink>
          </div>
          <div
            style={{ textAlign: "center" }}
            className="d-flex align-items-center"
          >
            <NavLink>
              <img
                className={styles.cocacola}
                src={logo_nav}
                alt="coca_navlogo"
              />
            </NavLink>
          </div>
          <div className="d-flex align-items-center">
            <NavLink
              to={isLoggedIn ? "cart" : "sign-up"}
              className={({ isActive }) =>
                isActive ? styles.active : styles.notActive
              }
            >
              {isLoggedIn ? (
                <div className="d-flex">
                  <div>
                    <CartFill
                      className="position-relative"
                      style={{ color: "gray", right: "0.3rem" }}
                    />
                    {numberOfItems > 0 && (
                      <span
                        className={`d-inline-block ${styles.numberOfItems}`}
                        style={{
                          color: "white",
                          backgroundColor: "#E61D2B",
                          borderRadius: "50%",
                          width: "0.9rem",
                          height: "0.9rem",
                          textAlign: "center",
                          fontSize: "0.7rem",
                        }}
                      >
                        {numberOfItems}
                      </span>
                    )}
                  </div>
                  Cart
                </div>
              ) : (
                "Sign Up"
              )}
            </NavLink>
            <NavLink
              to={isLoggedIn ? "/history" : "login"}
              className={({ isActive }) =>
                isActive ? styles.active : styles.notActive
              }
            >
              {isLoggedIn ? (
                <div>
                  <PersonFill style={{ color: "gray" }} />{" "}
                  {localStorage.getItem("fullName")}
                </div>
              ) : (
                "Login"
              )}
            </NavLink>
            {isLoggedIn && (
              <NavLink onClick={logout} className={styles.notActive}>
                (Logout)
              </NavLink>
            )}
          </div>
        </Navbar>
      </Container>
      <ChatDotsFill
        onClick={() => setHideChat(!hideChat)}
        style={{
          fontSize: "3rem",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          color: "#cf4965",
          cursor: "pointer",
        }}
      />
      <Outlet />
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default RootLayout;
