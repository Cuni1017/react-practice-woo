import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material/react-button";

const OrderFailedPage = () => {
  return (
    <div style={{ textAlign: "center", fontSize: "2.5rem", marginTop: "2rem" }}>
      訂單建立失敗
      <div style={{ marginTop: "3rem" }}>
        <Button outlined>
          <Link to="/">回到首頁</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderFailedPage;
