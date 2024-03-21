import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";

import GrayBanner from "../components/GrayBanner";
import { Container } from "react-bootstrap";

const Checkout = () => {
  //state danh sách sản phẩm trong giỏ hàng
  const [pds, setPds] = useState([]);
  //state phương thức thanh toán được chọn
  const [paymentMethod, setPaymentMethod] = useState("Payment Method");

  const fullNameInput = useRef();
  const emailInput = useRef();
  const phoneInput = useRef();
  const addressInput = useRef();

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

  //hàm submit form chốt đơn và cập nhật thông tin khách hàng
  const submitForm = async (e) => {
    e.preventDefault();
    if (paymentMethod !== "Credit Card") {
      if (paymentMethod === "Payment Method") {
        alert("Please select payment method!");
      } else {
        fetch(`${process.env.REACT_APP_BACKEND}/cart/update-payment-status`, {
          method: "GET",
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.err) {
              if (data.msg === "have not been logged in yet") {
                navigate("/login");
              } else if (data.msg === "Ordered!") {
                alert("Ordered!");
                navigate("/history");
                localStorage.setItem("numberOfItems", 0);
              }
            } else {
              navigate("/server-error");
            }
          })
          .catch((err) => console.log(err));
      }
    } else if (paymentMethod === "Credit Card") {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND}/cart/checkout`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phoneInput.current.value,
            address: addressInput.current.value,
          }),
        }
      );
      const data = await response.json();
      const result = stripe.redirectToCheckout({
        sessionId: data.id,
      });
      if (result.error) {
        console.log(result.error);
      }
    }
  };

  return (
    <Container>
      <GrayBanner title="CHECKOUT" />
      <div className="py-5">
        <h5>BILLING DETAILS</h5>
        <div className="d-flex justify-content-between">
          <div className="col-6 col-xxl-7">
            <form onSubmit={submitForm} className="d-flex flex-column">
              <label
                style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                htmlFor="fullname"
              >
                FULL NAME:
              </label>
              <input
                className="p-2"
                defaultValue={localStorage.getItem("fullName")}
                id="fullname"
                type="text"
                placeholder="Enter Your Full Name Here"
                required
                ref={fullNameInput}
              />
              <label
                style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                htmlFor="email"
              >
                EMAIL:
              </label>
              <input
                className="p-2"
                id="email"
                type="email"
                placeholder="Enter Your Email Here"
                required
                ref={emailInput}
              />
              <label
                style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                htmlFor="phone"
              >
                PHONE NUMBER:
              </label>
              <input
                className="p-2"
                id="phone"
                type="tel"
                placeholder="Enter Your Phone Number Here"
                required
                ref={phoneInput}
              />
              <label
                style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                htmlFor="address"
              >
                ADDRESS:
              </label>
              <input
                className="p-2"
                id="address"
                type="text"
                placeholder="Enter Your Address Here"
                required
                ref={addressInput}
              />
              <select
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                }}
                className="my-4 p-2"
              >
                <option value="Payment Method">Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
              </select>
              <button
                type="submit"
                className="col-3 py-1 border-0"
                style={{ backgroundColor: "black", color: "white" }}
              >
                Place order
              </button>
            </form>
          </div>
          <div
            className="col-5 col-xxl-4 p-4"
            style={{ backgroundColor: "#f8f9fa", height: "50%" }}
          >
            <h5>YOUR ORDER</h5>
            <div className="border-bottom" style={{ marginTop: "1.2rem" }}>
              {pds.map((pd) => (
                <div key={pd._id} className="d-flex justify-content-between">
                  <p style={{ fontWeight: "550" }}>{pd.productId.name}</p>

                  <p style={{ fontSize: "0.9rem", color: "gray" }}>
                    ${pd.productId.price}
                    <span style={{ fontSize: "0.9rem", color: "gray" }}>
                      {" "}
                      x {pd.quan}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <div>
              <div className="d-flex justify-content-between">
                <p>Ship</p>
                <p>7.95</p>
              </div>
              <div className="d-flex justify-content-between">
                <p style={{ fontWeight: "550" }}>TOTAL</p>
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
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;
