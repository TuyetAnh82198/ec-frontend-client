import { Container } from "react-bootstrap";
import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { CartFill } from "react-bootstrap-icons";

const Products = () => {
  //state danh sách sản phẩm
  const [pds, setPds] = useState([]);
  //state hiện/ẩn pop up
  const [show, setShow] = useState(false);
  //state sản phẩm lấy thông tin để hiển thị lên pop up
  const [pd, setPd] = useState({});

  //hàm hiện/ẩn pop up
  const handleClose = () => setShow(false);
  const handleShow = (_id, name, shortDesc, img, price) => {
    setPd({ _id, name, shortDesc, img, price });
    setShow(true);
  };
  const navigate = useNavigate();

  //hàm lấy danh sách sản phẩm
  const fetchPds = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/products/get-top-8`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setPds(data.result);
          // console.log(data.result);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchPds(), [fetchPds]);

  return (
    <Container className="my-5">
      <div
        style={{
          fontWeight: "550",
          fontSize: "1.2rem",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        TOP 8 MOST POPULAR DRINKS
      </div>
      <div>
        <div
          className="d-flex justify-content-between"
          style={{ marginBottom: "2rem" }}
        >
          {pds.length === 0 && <p>Loading...</p>}
          {pds.slice(0, 4).map((pd) => (
            <div
              key={pd._id}
              onClick={() =>
                handleShow(pd._id, pd.name, pd.short_desc, pd.imgs[0], pd.price)
              }
              className="col-3"
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <img
                width="30%"
                src={`${process.env.REACT_APP_BACKEND}/${pd.imgs[0]}`}
                alt=""
              />
              <p style={{ fontWeight: "bold" }}>{pd.name}</p>
              <p style={{ margin: "-1rem 0", color: "gray" }}>${pd.price}</p>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between">
          {pds.slice(4).map((pd) => (
            <div
              key={pd._id}
              onClick={() =>
                handleShow(pd._id, pd.name, pd.short_desc, pd.imgs[0], pd.price)
              }
              className="col-3"
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <img
                width="30%"
                src={`${process.env.REACT_APP_BACKEND}/${pd.imgs[0]}`}
                alt=""
              />
              <p style={{ fontWeight: "bold" }}>{pd.name}</p>
              <p style={{ margin: "-1rem 0", color: "gray" }}>${pd.price}</p>
            </div>
          ))}
        </div>
      </div>
      {/* pop up hiển thị thông tin sản phẩm */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton border-0></Modal.Header>
        <Modal.Body className="d-flex">
          <div>
            <img
              style={{ paddingLeft: "1rem" }}
              src={`${process.env.REACT_APP_BACKEND}/${pd.img}`}
              alt=""
            />
          </div>
          <div className="mx-4 my-5">
            <p style={{ fontWeight: "bold" }}>{pd.name}</p>
            <p>${pd.price}</p>
            <p>{pd.shortDesc}</p>
            <div style={{ textAlign: "right" }}>
              <button
                className="p-2"
                style={{
                  border: "none",
                  backgroundColor: "#E61D2B",
                  color: "white",
                }}
                onClick={() => navigate(`/detail/${pd._id}`)}
              >
                <CartFill /> View Detail
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
