import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Table } from "react-bootstrap";
import GrayBanner from "../components/GrayBanner";
import { ArrowRight, FilePostFill } from "react-bootstrap-icons";

const History = () => {
  //state lịch sử đơn hàng
  const [cart, setCart] = useState([]);
  //state thông tin người dùng
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  //hàm lấy lịch sử đơn hàng
  const fetchCart = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/cart/history`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "have not been logged in yet") {
            navigate("/login");
          } else {
            setCart(data.cart);
            setUser(data.user);
            // console.log(data);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchCart(), []);
  return (
    <Container>
      <GrayBanner title="HISTORY" />
      {cart.length === 0 && (
        <div className="my-2" style={{ textAlign: "center" }}>
          <FilePostFill style={{ color: "gray" }} /> History is empty
        </div>
      )}
      {cart.length > 0 && user && (
        <Table className="my-5" responsive>
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th style={{ backgroundColor: "#f8f9fa" }}>ID ORDER</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>EMAIL</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>NAME</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>PHONE</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>ADDRESS</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>TOTAL</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>DELIVERY</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>STATUS</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>PAID ON</th>
              <th style={{ backgroundColor: "#f8f9fa" }}>DETAIL</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id} style={{ textAlign: "center" }}>
                <td>{item._id}</td>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>
                  $
                  {Number(
                    item.products
                      .map((pd) => pd.productId.price * pd.quan)
                      .reduce((acc, price) => acc + price, 0)
                      .toFixed(2)
                  ) >= 75
                    ? Number(
                        item.products
                          .map((pd) => pd.productId.price * pd.quan)
                          .reduce((acc, price) => acc + price, 0)
                          .toFixed(2)
                      )
                    : Number(
                        item.products
                          .map((pd) => pd.productId.price * pd.quan)
                          .reduce((acc, price) => acc + price, 0)
                          .toFixed(2)
                      ) + 7.95}
                </td>
                <td>Waiting for progressing</td>
                <td>{item.status}</td>
                <td>{item.date}</td>
                <td>
                  <button
                    onClick={() => navigate(`/history-detail/${item._id}`)}
                    className="px-2"
                    style={{ backgroundColor: "white" }}
                  >
                    View <ArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default History;
