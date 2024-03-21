import { lazy, Suspense } from "react";

import styles from "./home.module.css";

import Categories from "../components/Categories";
const Products = lazy(() => import("../components/Products"));

const Home = () => {
  return (
    <div>
      <div
        className="d-flex justify-content-between"
        style={{
          backgroundColor: "#D50021",
          height: "20rem",
        }}
      >
        <div
          className={`w-100 d-flex justify-content-around align-items-center m-3 ${styles.bannerContent}`}
        >
          <div
            className={styles.mobileBannerContent}
            style={{ color: "white" }}
          >
            <h2
              className={styles.mobileBannerTopContent}
              style={{
                borderBottom: "2px white solid",
                paddingBottom: "0.5rem",
              }}
            >
              Share a <span className={styles.coke}>Coke</span> with...
            </h2>
            <h4
              className={styles.mobileBannerBotContent}
              style={{ fontWeight: "400" }}
            >
              Say 'Alexa, let's share a Coke' to get a free personalised bottle.
            </h4>
          </div>
        </div>
        <div className="col-3 py-2">
          <iframe
            className={styles.iframe}
            src="https://giphy.com/embed/l3xt2qEof1olEZeDGO"
            frameBorder="0"
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </div>
      <Categories />
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </div>
  );
};

export default Home;
