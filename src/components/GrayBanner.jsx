import { Container } from "react-bootstrap";

const GrayBanner = (props) => {
  return (
    <Container
      className="d-flex justify-content-between"
      style={{ padding: "5rem", backgroundColor: "#f8f9fa" }}
    >
      <h4>
        <i>{props.title}</i>
      </h4>
      <p>
        <i>{props.title}</i>
      </p>
    </Container>
  );
};

export default GrayBanner;
