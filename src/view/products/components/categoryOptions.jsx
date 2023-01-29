import React from "react";
import Select, { Option } from "@material/react-select";

const CategoryOptions = ({ value, categories, onChange }) => {
  return (
    <Select outlined label="" value={value} onChange={onChange}>
      <Option value={-1}> 未選擇 </Option>
      {categories.map((category) => {
        return (
          <Option key={category.id} value={category.id}>
            {category.name}
          </Option>
        );
      })}
    </Select>
  );
};

export default CategoryOptions;
