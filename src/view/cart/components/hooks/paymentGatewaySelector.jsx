import React from "react";
import Select, { Option } from "@material/react-select";

export default function paymentGateway({ value, paymentGateways, onChange }) {
  // 因為要等上面的orderService拿到paymentGateways所以要判斷一下，否則value會是空的
  const currentValue = paymentGateways.length > 0 ? value : "";

  return (
    <div style={{ padding: "1rem" }}>
      <Select
        style={{ margin: "1rem" }}
        label="付費方式"
        value={currentValue}
        outlined
        enhanced
        onEnhancedChange={(index, item) => {
          // console.log(paymentGateways[index]);
          onChange(paymentGateways[index]);
        }}
      >
        {paymentGateways.map((paymentGateway) => {
          // console.log(paymentGateway);
          return (
            <Option key={paymentGateway.id} value={paymentGateway.id}>
              {paymentGateway.title}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}
