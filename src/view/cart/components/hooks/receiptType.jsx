import React, { useEffect } from "react";
import Card, { CardPrimaryContent } from "@material/react-card";

import { Body2, Headline6 } from "@material/react-typography";

import Radio, { NativeRadioControl } from "@material/react-radio";
import Checkbox from "@material/react-checkbox";
import TextField, { Input } from "@material/react-text-field";

const removeValueFromArray = (array, value) => {
  // Array.prototype.filter() 方法會建立一個經指定之函式運算後，由原陣列中通過該函式檢驗之元素所構成的新陣列。
  return array.filter((element) => {
    return element !== value;
  });
};

const ReceiptType = ({ receipt, handler }) => {
  const { receiptType, taxId, receiptOptions } = receipt;

  useEffect(() => {
    document.getElementById("byMail").value = "byMail";
    document.getElementById("promptRegistered").value = "promptRegistered";
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target; // 抓觸發的name跟value
    handler("receipt", { ...receipt, [name]: value });
  };

  const checkBoxHandler = (e) => {
    const checkBoxParent = e.target.closest(".mdc-checkbox");
    const newValue = e.target.value;
    // Element.getAttribute() 函式會回傳該網頁元素的屬性。 如果該屬性不存在，其回傳值會是null或 "" (空字串)
    const name = checkBoxParent.getAttribute("attributeName"); //receiptOptions
    let values = receipt[name];

    if (values.includes(newValue)) {
      values = removeValueFromArray(values, newValue);
    } else {
      values.push(newValue);
    }
    // 如果實體寄送沒被checked，限時掛號也不能被checked
    if (name === "receiptOptions" && !values.includes("byMail")) {
      values = [];
    }
    handler("receipt", { ...receipt, [name]: values });
  };

  return (
    <div>
      <Card>
        <CardPrimaryContent>
          <div style={{ padding: "1rem" }}>
            <Headline6 tag="p">發票類型</Headline6>
            <Body2 tag="div">
              <Radio label="個人" key="personal">
                <NativeRadioControl
                  type="radio"
                  name="receiptType"
                  value="2"
                  id="personal"
                  checked={receiptType === "2"}
                  onChange={inputHandler}
                />
              </Radio>
              <br />
              <Radio label="公司" key="company">
                <NativeRadioControl
                  type="radio"
                  name="receiptType"
                  value="3"
                  id="company"
                  checked={receiptType === "3"}
                  onChange={inputHandler}
                />
              </Radio>
              <TextField
                outlined
                label="統一編號"
                style={{ marginLeft: "1rem" }}
              >
                <Input
                  type="text"
                  name="taxId"
                  value={taxId}
                  onChange={inputHandler}
                />
              </TextField>
              <br />
              <Headline6 tag="p">郵寄選項</Headline6>
              <React.Fragment>
                <Checkbox
                  name="receiptOptions[]"
                  attributeName="receiptOptions" //自己設的
                  nativeControlId="byMail"
                  // value="byMail" //因為套用MDC，用componentDidMount的方式去賦予value就好，否則有勾選的話，送出去的值會是on
                  checked={receiptOptions.includes("byMail")}
                  // Array.prototype.includes() 方法會判斷陣列是否包含特定的元素，並以此來回傳 true 或 false。
                  onChange={checkBoxHandler}
                />
                <label htmlFor="byMail">實體寄送(+ $30)</label>
              </React.Fragment>
              <br />
              <React.Fragment>
                <Checkbox
                  name="receiptOptions[]"
                  attributeName="receiptOptions"
                  nativeControlId="promptRegistered"
                  // value="promptRegistered" //同byMail
                  checked={receiptOptions.includes("promptRegistered")}
                  onChange={checkBoxHandler}
                  disabled={!receiptOptions.includes("byMail")}
                />
                <label htmlFor="promptRegistered">
                  限時掛號(再 + $30 = $60)
                </label>
              </React.Fragment>
            </Body2>
          </div>
        </CardPrimaryContent>
      </Card>
    </div>
  );
};

export default ReceiptType;
