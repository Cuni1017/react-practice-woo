import React from "react";
import Select, { Option } from "@material/react-select";

const ShippingZoneMethodSelector = ({
  value,
  shippingZoneMethods,
  onChange,
}) => {
  const currentValue =
    shippingZoneMethods.length > 0 && value.length > 0
      ? value[0].method_id
      : "";

  return (
    <div style={{ padding: "1rem" }}>
      <Select
        label="運送方式"
        value={currentValue}
        outlined
        enhanced
        onEnhancedChange={(index, item) => {
          // console.log(paymentGateways[index]);
          onChange(shippingZoneMethods[index]);
        }}
      >
        {shippingZoneMethods.map((shippingZoneMethod) => {
          return (
            <Option
              key={shippingZoneMethod.methodId}
              value={shippingZoneMethod.methodId}
            >
              {`${shippingZoneMethod.title} ${shippingZoneMethod.costValue}`}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default ShippingZoneMethodSelector;
