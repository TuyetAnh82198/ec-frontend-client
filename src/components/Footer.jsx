import { Fragment } from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <Fragment>
      <Container
        className="d-flex py-5 px-5 my-2"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="col-4 d-flex justify-content-around">
          <div>
            <h5>
              <i>FREE SHIPPING</i>
            </h5>
            <i style={{ color: "gray" }}>Free shipping nationwide</i>
          </div>
        </div>
        <div className="col-4 d-flex justify-content-around">
          <div>
            <h5>
              <i>24 X 7 SERVICE</i>
            </h5>
            <i style={{ color: "gray" }}>Free shipping nationwide</i>
          </div>
        </div>
        <div className="col-4 d-flex justify-content-around">
          <div>
            <h5>
              <i>FESTIVAL OFFER</i>
            </h5>
            <i style={{ color: "gray" }}>Free shipping nationwide</i>
          </div>
        </div>
      </Container>
      <Container className="my-5 d-flex justify-content-between">
        <div className="col-4">
          <h5>LET'S BE FRIEND!</h5>
          <p>
            <i style={{ color: "gray" }}>
              We will keep you updated with the latest offers and news.
            </i>
          </p>
        </div>
        <div className="col-8" style={{ textAlign: "right" }}>
          <input
            className="p-3"
            style={{ width: "40%" }}
            type="email"
            placeholder="Enter your email address"
          />
          <button
            className="border-0"
            style={{
              padding: "1.1rem",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Subscribe
          </button>
        </div>
      </Container>
      <div style={{ backgroundColor: "black", color: "white" }}>
        <Container className="py-5 d-flex">
          <div className="col-4">
            <h5>CUSTOMER SERVICES</h5>
            <p>{`Help & Contact Us`}</p>
            <p>{`Returns & Refunds`}</p>
            <p>Online Stores</p>
            <p>{`Terms & Conditions`}</p>
          </div>
          <div className="col-4">
            <h5>COMPANY</h5>
            <div></div>
            <p>What We do</p>
            <p>Available Services</p>
            <p>Latest Posts</p>
            <p>FAQs</p>
          </div>
          <div className="col-4">
            <h5>SOCIAL MEDIA</h5>
            <p>X</p>
            <p>Instagram</p>
            <p>Facebook</p>
            <p>Pinterest</p>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default Footer;
