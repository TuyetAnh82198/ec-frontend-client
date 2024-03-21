import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import GrayBanner from "../components/GrayBanner";
import { Container, Table } from "react-bootstrap";
import {
  ArrowLeft,
  ArrowRight,
  CaretLeftFill,
  CaretRightFill,
  CartDashFill,
  GiftFill,
  Trash,
} from "react-bootstrap-icons";
import { socket } from "../socket.js";

const Cart = () => {
  //state danh sách sản phẩm trong giỏ hàng
  const [pds, setPds] = useState([]);

  const navigate = useNavigate();
  //hàm lấy danh sách sản phẩm trong giỏ hàng
  const fetchPds = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/cart/get`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (data.msg === "have not been logged in yet") {
            navigate("/login");
          } else {
            setPds(data.result);
            // console.log(data.result);
          }
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    fetchPds();
  }, [fetchPds]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  });
  useEffect(() => {
    const cartHandler = (data) => {
      if (data.action === "update") {
        setPds(data.updatedResult);
        localStorage.setItem("numberOfItems", data.updatedResult.length);
      } else if (data.action) {
        setPds(data.deleteResult);
        localStorage.setItem("numberOfItems", data.deleteResult.length);
      }
    };
    socket.on("cart", cartHandler);
    return () => {
      socket.off("cart", cartHandler);
    };
  });

  //hàm cập nhật lại số lượng của sản phẩm trong giỏ hàng
  const updateQuan = (action, id, quan, pdId) => {
    if (action === "desc" && quan > 1) {
      fetch(`${process.env.REACT_APP_BACKEND}/cart/update-quan`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action,
          id,
          quan,
          pdId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    } else if (action === "inc") {
      fetch(`${process.env.REACT_APP_BACKEND}/cart/update-quan`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          action,
          id,
          quan,
          pdId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
            if (data.message === "The quantity not available!") {
              alert("The quantity not available!");
            }
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  //hàm xóa sản phẩm ra khỏi giỏ hàng
  const deleteProduct = (id) => {
    const isDeleted = window.confirm("Are you sure?");
    if (isDeleted) {
      fetch(`${process.env.REACT_APP_BACKEND}/cart/delete-item/${id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.err) {
          } else {
            navigate("/server-error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container>
      <GrayBanner title="CART" />
      <div className="my-5">
        <h5 className="my-4">SHOPPING CART</h5>
        <div className="d-flex justify-content-between">
          <div className="col-7">
            {pds.length === 0 && (
              <div style={{ textAlign: "center", paddingBottom: "1rem" }}>
                <CartDashFill /> Cart is empty
              </div>
            )}
            {pds.length > 0 && (
              <Table responsive>
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th
                      className="col-2"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      IMAGE
                    </th>
                    <th style={{ backgroundColor: "#f8f9fa" }}>PRODUCT</th>
                    <th style={{ backgroundColor: "#f8f9fa" }}>PRICE</th>
                    <th style={{ backgroundColor: "#f8f9fa" }}>QUANTITY</th>
                    <th style={{ backgroundColor: "#f8f9fa" }}>TOTAL</th>
                    <th style={{ backgroundColor: "#f8f9fa" }}>REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {pds.map((pd) => (
                    <tr
                      key={pd._id}
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      <td>
                        <img
                          width="30%"
                          src={`${process.env.REACT_APP_BACKEND}/${pd.productId.imgs[0]}`}
                          alt=""
                        />
                      </td>
                      <td>
                        <h6>{pd.productId.name}</h6>
                      </td>
                      <td style={{ color: "gray" }}>${pd.productId.price}</td>
                      <td>
                        <button
                          onClick={() =>
                            updateQuan(
                              "desc",
                              pd._id,
                              pd.quan,
                              pd.productId._id
                            )
                          }
                          className="border-0"
                          style={{ backgroundColor: "white" }}
                        >
                          <CaretLeftFill />
                        </button>{" "}
                        {pd.quan}{" "}
                        <button
                          onClick={() =>
                            updateQuan("inc", pd._id, pd.quan, pd.productId._id)
                          }
                          className="border-0"
                          style={{ backgroundColor: "white" }}
                        >
                          <CaretRightFill />
                        </button>
                      </td>
                      <td style={{ color: "gray" }}>
                        ${(pd.productId.price * pd.quan).toFixed(2)}
                      </td>
                      <td>
                        <Trash
                          onClick={() => deleteProduct(pd._id)}
                          style={{ color: "gray", cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <div
              className="p-3 d-flex justify-content-between"
              style={{ backgroundColor: "#f8f9fa", fontWeight: "300" }}
            >
              <button
                className="border-0"
                onClick={() => navigate("/shop")}
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <ArrowLeft style={{ color: "black" }} /> Continue shopping
              </button>
              <button
                className="px-2 py-1"
                disabled={pds.length > 0 ? false : true}
                onClick={() => navigate("/checkout")}
                style={{ backgroundColor: "#f8f9fa" }}
              >
                Proceed to checkout <ArrowRight />
              </button>
            </div>
          </div>
          <div className="col-4 p-5" style={{ backgroundColor: "#f8f9fa" }}>
            <h5>CART TOTAL</h5>
            <div className="my-3 d-flex justify-content-between border-bottom ">
              <p>SUBTOTAL</p>
              <p style={{ color: "gray" }}>
                $
                {pds
                  .map((pd) => pd.productId.price * pd.quan)
                  .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                  .toFixed(2)}
              </p>
            </div>
            {pds
              .map((pd) => pd.productId.price * pd.quan)
              .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
              .toFixed(2) < 75 &&
              Number(
                pds
                  .map((pd) => pd.productId.price * pd.quan)
                  .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                  .toFixed(2)
              ) !== 0 && (
                <div className="d-flex justify-content-between">
                  <p>Ship</p>
                  <p>7.95</p>
                </div>
              )}
            <div className="my-3 d-flex justify-content-between">
              <p>TOTAL</p>
              <p>
                $
                {pds
                  .map((pd) => pd.productId.price * pd.quan)
                  .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                  .toFixed(2) > 75
                  ? pds
                      .map((pd) => pd.productId.price * pd.quan)
                      .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                      .toFixed(2)
                  : pds
                      .map((pd) => pd.productId.price * pd.quan)
                      .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                      .toFixed(2) == 0
                  ? 0
                  : (
                      Number(
                        pds
                          .map((pd) => pd.productId.price * pd.quan)
                          .reduce((acc, eachPdTotal) => acc + eachPdTotal, 0)
                          .toFixed(2)
                      ) + 7.95
                    ).toFixed(2)}
              </p>
            </div>
            <div className="d-flex flex-column">
              <input
                className="p-2"
                type="text"
                placeholder="Enter your coupon"
              />
              <button
                className="p-2 border-0"
                style={{ backgroundColor: "black", color: "white" }}
              >
                <GiftFill /> Apply coupon
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
