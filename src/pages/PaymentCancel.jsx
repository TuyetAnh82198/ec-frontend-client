import { Container } from "react-bootstrap";
import GrayBanner from "../components/GrayBanner";

const PaymentCancel = () => {
  return (
    <Container>
      <GrayBanner title="THANK YOU" />
      <div style={{ textAlign: "center" }}>
        <h1>Oops! Your payment has been cancelled.</h1>
      </div>
    </Container>
  );
};

export default PaymentCancel;
