import { Container } from "react-bootstrap";
import GrayBanner from "../components/GrayBanner";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  //hàm kiểm tra trạng thái thanh toán và cập nhật lại dữ liệu đơn hàng
  const fetchPaymentStatus = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/cart/payment-status`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.msg);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => fetchPaymentStatus(), []);

  return (
    <Container>
      <GrayBanner title="THANK YOU" />
      <div style={{ textAlign: "center" }}>
        <h1>Payment Successful</h1>
        <p>Thank you for your order!</p>
      </div>
    </Container>
  );
};

export default PaymentSuccess;
