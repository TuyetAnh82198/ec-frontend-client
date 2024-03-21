import { Container, Button } from "react-bootstrap";
import { Fragment, useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import banner from "../imgs/otherPagesBanner.jpg";

import styles from "./shop.module.css";

const Shop = () => {
  //state danh sách sản phẩm
  const [pds, setPds] = useState([]);
  //state số trang tối đa có thể trả về
  const [totalPages, setTotalPages] = useState(0);
  //state trang hiện tại
  const [page, setPage] = useState(1);
  //state từ khóa tìm kiếm
  const [keyword, setKeyword] = useState("");
  //state sắp xếp sản phẩm
  const [sort, setSort] = useState("");
  //state danh mục đang xem
  const [selectedBrand, setSelectedBrand] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state;
  //hàm lấy toàn bộ sản phẩm hoặc các sản phẩm của cùng một danh mục
  const fetchAllPds = useCallback((type) => {
    fetch(
      type
        ? `${process.env.REACT_APP_BACKEND}/products/get/type/${type}/${page}`
        : `${process.env.REACT_APP_BACKEND}/products/get/type/all/${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setPds(data.result);
          setTotalPages(data.totalPages);
          //   console.log(data);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => fetchAllPds(type), []);

  //hàm lấy danh sách sản phẩm theo loại đồ uống
  const fetchPdsByType = (type) => {
    fetch(`${process.env.REACT_APP_BACKEND}/products/get/type/${type}/${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          setPds(data.result);
          setTotalPages(data.totalPages);
          // console.log(data.result);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  //hàm lấy danh sách sản phẩm theo danh mục
  const fetchPdsByBrand = (brand) => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/products/get/brand/${brand}/${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.err) {
          if (sort === "Starting from the lowest price") {
            setPds(data.result.sort((a, b) => a.price - b.price));
          } else if (sort === "Starting from the highest price") {
            setPds(data.result.sort((a, b) => b.price - a.price));
          } else {
            setPds(data.result);
          }
          setTotalPages(data.totalPages);
        } else {
          navigate("/server-error");
        }
      })
      .catch((err) => console.log(err));
  };
  let search;
  //hàm tìm kiếm theo từ khóa
  const searchHandler = (keyword) => {
    clearTimeout(search);
    search = setTimeout(() => {
      fetchPdsByBrand(keyword);
    }, 500);
    // console.log(keyword);
  };
  //hàm chọn danh mục đang xem để đổi tên danh mục đó
  const selectBrand = (brand) => {
    setSelectedBrand(brand);
  };
  return (
    <Fragment>
      <img width="100%" src={banner} alt="" />
      <Container className="my-4 d-flex">
        <div className={`col-2 ${styles.brands}`}>
          <h4 style={{ backgroundColor: "#E61D2B", color: "white" }}>BRANDS</h4>
          <h5
            onClick={() => {
              selectBrand("all");
              fetchAllPds();
            }}
            style={{ color: selectedBrand === "all" ? "#E61D2B" : "gray" }}
          >
            All
          </h5>
          <h5
            onClick={() => fetchPdsByType("soft-drinks")}
            style={{ color: "black", backgroundColor: "#f8f9fa" }}
          >
            SOFT DRINKS
          </h5>
          <h5
            onClick={() => {
              selectBrand("coca");
              fetchPdsByBrand("coca");
            }}
            style={{ color: selectedBrand === "coca" ? "#E61D2B" : "gray" }}
          >
            Coca cola
          </h5>
          <h5
            onClick={() => {
              selectBrand("sprite");
              fetchPdsByBrand("sprite");
            }}
            style={{ color: selectedBrand === "sprite" ? "#E61D2B" : "gray" }}
          >
            Sprite
          </h5>
          <h5
            onClick={() => {
              selectBrand("schweppes");
              fetchPdsByBrand("schweppes");
            }}
            style={{
              color: selectedBrand === "schweppes" ? "#E61D2B" : "gray",
            }}
          >
            Schweppes
          </h5>
          <h5
            onClick={() => fetchPdsByType("juices")}
            style={{ color: "black", backgroundColor: "#f8f9fa" }}
          >
            JUICES
          </h5>
          <h5
            onClick={() => {
              selectBrand("minute");
              fetchPdsByBrand("minute");
            }}
            style={{ color: selectedBrand === "minute" ? "#E61D2B" : "gray" }}
          >
            Minute Maid
          </h5>
          <h5
            onClick={() => fetchPdsByType("teas")}
            style={{ color: "black", backgroundColor: "#f8f9fa" }}
          >
            TEAS
          </h5>
          <h5
            onClick={() => {
              selectBrand("frestea");
              fetchPdsByBrand("frestea");
            }}
            style={{ color: selectedBrand === "frestea" ? "#E61D2B" : "gray" }}
          >
            FresTea
          </h5>
          <h5
            onClick={() => fetchPdsByType("dairy-drinks")}
            style={{ color: "black", backgroundColor: "#f8f9fa" }}
          >
            DAIRY DRINKS
          </h5>
          <h5
            onClick={() => {
              selectBrand("nutriboost");
              fetchPdsByBrand("nutriboost");
            }}
            style={{
              color: selectedBrand === "nutriboost" ? "#E61D2B" : "gray",
            }}
          >
            Nutriboost
          </h5>
        </div>
        <div className="col-10 px-5 px-sm-4">
          <div className="d-flex justify-content-between">
            <input
              onChange={(e) => {
                setKeyword(e.target.value);
                searchHandler(keyword);
              }}
              type="text"
              placeholder="Enter Search Here!"
            />
            <select
              onChange={(e) => {
                setSort(e.target.value);
                if (e.target.value === "Starting from the lowest price") {
                  const newArr = pds.sort((a, b) => a.price - b.price);
                  setPds(newArr);
                } else if (
                  e.target.value === "Starting from the highest price"
                ) {
                  const newArr = pds.sort((a, b) => b.price - a.price);
                  setPds(newArr);
                }
              }}
            >
              <option value="">Default sorting</option>
              <option value="Starting from the lowest price">
                Starting from the lowest price
              </option>
              <option value="Starting from the highest price">
                Starting from the highest price
              </option>
            </select>
          </div>
          <div className="my-5 row row-cols-3">
            {pds.length > 0 ? (
              pds.map((pd) => (
                <div
                  onClick={() => navigate(`/detail/${pd._id}`)}
                  key={pd._id}
                  className={`col ${styles.pd}`}
                  style={{ textAlign: "center" }}
                >
                  <img
                    width="30%"
                    src={`${process.env.REACT_APP_BACKEND}/${pd.imgs[0]}`}
                    alt=""
                  />
                  <h6>{pd.name}</h6>
                  <p style={{ color: "gray" }}>${pd.price}</p>
                </div>
              ))
            ) : (
              <div>Found no products.</div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                if (page > 1) {
                  setPage((prevState) => prevState - 1);
                }
              }}
              className="rounded-0"
              style={{
                backgroundColor: "white",
                color: "black",
                border: "black 0.05rem solid",
              }}
            >{`<<`}</Button>
            <Button
              className="rounded-0"
              style={{
                backgroundColor: "black",
                color: "white",
                border: "black 0.05rem solid",
              }}
            >
              {page}
            </Button>
            <Button
              onClick={() => {
                if (page < totalPages) {
                  setPage((prevState) => prevState + 1);
                }
              }}
              className="rounded-0"
              style={{
                backgroundColor: "white",
                color: "black",
                border: "black 0.05rem solid",
              }}
            >{`>>`}</Button>
            <p>Showing 1-9 of {totalPages} results</p>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Shop;
