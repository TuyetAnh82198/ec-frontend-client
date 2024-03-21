import { Container } from "react-bootstrap";

const RelatedProducts = (props) => {
  return (
    <Container>
      <h5>RELATED DRINKS</h5>
      <div className="d-flex">
        {props.pds.map((pd) => (
          <div
            key={pd._id}
            className="col-3"
            style={{ textAlign: "center", cursor: "pointer" }}
          >
            <a
              href={`http://localhost:3000/detail/${pd._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <img
                width="25%"
                src={`${process.env.REACT_APP_BACKEND}/${pd.imgs[0]}`}
                alt=""
              />
              <h6>{pd.name}</h6>
              <p style={{ color: "gray" }}>${pd.price}</p>
            </a>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default RelatedProducts;
