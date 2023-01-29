import React, { useRef } from "react";
// import TaiwanPostalCode from "./TaiwanPostalCode.json"; //改在父層引入在傳進來當props

// console.log(TaiwanPostalCode);

import { Headline6 } from "@material/react-typography";
import Card, { CardPrimaryContent } from "@material/react-card";
import TextField, { HelperText, Input } from "@material/react-text-field";
import MaterialIcon from "@material/react-material-icon";
import Select, { Option } from "@material/react-select";

const getCityOptions = (cities) => {
  return cities.map((city) => {
    return (
      <Option key={city} value={city}>
        {city}
      </Option>
    );
  });
};

const getDistrictOptions = (districts) => {
  return districts.map((district) => {
    return (
      <Option key={district} value={district}>
        {district}
      </Option>
    );
  });
};

const AddressPicker = ({ fullAddress, handler, TaiwanPostalCodes }) => {
  // console.log(fullAddress);
  // console.log(handler);
  // console.log(TaiwanPostalCodes);

  const prostalCode = TaiwanPostalCodes;
  const cities = Object.keys(prostalCode);
  const cityOptions = getCityOptions(cities);
  const cityData = prostalCode[fullAddress.city]; // XX市底下的Object{}
  const districts = Object.keys(cityData); // XX市底下的Object[XX市] => 值:{XX區,XX區,...}
  const districtsOptions = getDistrictOptions(districts);
  const div = useRef(null);

  const handlerRelated = (name, value) => {
    let mergeObject = {};

    if (name == "city" && fullAddress.city != value) {
      //當更換city時，district和postalCode全部清空
      mergeObject["district"] = "";
      mergeObject["postalCode"] = "";
      //   console.log(mergeObject);
    } else if (name == "district" && fullAddress.district != value) {
      const cityData = prostalCode[fullAddress.city]; // XX市底下的Object{}
      const postalCode = cityData[value];
      mergeObject["postalCode"] = postalCode;
    }
    return mergeObject;
  };

  const inputHandler = (e) => {
    const { name, value } = e.target; // 抓觸發的name跟value
    const mergeObject = handlerRelated(name, value);
    // console.log(fullAddress);
    // console.log(mergeObject);
    handler("fullAddress", { ...fullAddress, ...mergeObject, [name]: value });
  };

  // https://github.com/material-components/material-components-web-react/tree/master/packages/select
  // 使用enhanced的select必須用這個
  const onEnhancedChange = (name, index, item) => {
    // console.log(name);
    // console.log(index);
    // console.log(item);
    let value = item.getAttribute("data-value");
    const mergeObject = handlerRelated(name, value);
    handler("fullAddress", { ...fullAddress, ...mergeObject, [name]: value });
  };

  const clearAddress = (e) => {
    const name = "address";
    const value = "";
    const mergeObject = handlerRelated(name, value);
    handler("fullAddress", { ...fullAddress, ...mergeObject, [name]: value });
  };

  return (
    <div ref={div}>
      <Card>
        <CardPrimaryContent>
          <div style={{ padding: "1rem" }}>
            <Headline6 tag="p">寄送地址</Headline6>
            <Select
              label="城市"
              name="city"
              value={fullAddress.city}
              onEnhancedChange={onEnhancedChange.bind(this, "city")} //如果使用enhanced就要用這個，因為結構會改變
              // onChange={this.inputHandler} //不能用這個
              enhanced //如果原本沒有值，label(城市)會跟值(台北市)重疊，市/區同理
              outlined
            >
              {cityOptions}
            </Select>
            <input type="hidden" name="city" value={fullAddress.city} />
            <br />
            <br />
            <Select
              label="市/區"
              name="district"
              value={fullAddress.district}
              //因為傳回的東西找不到name，所以用bind(this, city)多傳一個name回去
              onEnhancedChange={onEnhancedChange.bind(this, "district")}
              // onChange={this.inputHandler}
              enhanced
              outlined
            >
              {districtsOptions}
            </Select>
            <input type="hidden" name="district" value={fullAddress.district} />
            <br />
            <br />
            <TextField outlined label="郵遞區號">
              <Input
                name="postalCode"
                value={fullAddress.postalCode}
                disabled
              />
            </TextField>
            {/* 因為使用Material會改變我們的結構，送出去的值的key會跟原本寫的不一樣
                  解決方案為，給一個input:hidden name和value都和所需的值一樣就可以 */}
            <input
              type="hidden"
              name="postalCode"
              value={fullAddress.postalCode}
            />
            <br />
            <TextField
              outlined
              label="地址"
              helperText={<HelperText>請輸入正確地址用以寄送商品</HelperText>}
              // leadingIcon={<MaterialIcon role="button" icon="home" />}
              onTrailingIconSelect={clearAddress}
              trailingIcon={
                <MaterialIcon
                  role="button"
                  icon="delete"
                  style={{
                    position: "absolute",
                    right: "10px",
                  }}
                />
              }
              style={{
                marginTop: "1rem",
                padding: "0 1rem",
              }}
            >
              <Input
                type="text"
                name="address"
                onChange={inputHandler}
                value={fullAddress.address}
              />
            </TextField>
          </div>
        </CardPrimaryContent>
      </Card>
    </div>
  );
};

// class AddressPicker extends React.Component {
//   constructor(props) {
//     super(props); //將state寫在父層，才不用一直重新render
//     this.prostalCode = this.props.TaiwanPostalCodes;
//     this.cities = Object.keys(this.prostalCode);

//     // this.div = createRef(); //此為解決送出去的select的name會變成enhanced的解決方案二
//   }

//   //  此為解決送出去的select的name會變成enhanced的解決方案二
//   //   componentDidMount = () => {
//   //     let enhanced_selects = this.div.current.querySelectorAll(
//   //       "input[name='enhanced-select']"
//   //     );
//   //     // enhanced_selects.forEach((select) => {
//   //     //   console.log(select.getAttribute("name"));
//   //     // });
//   //     enhanced_selects[0].name = "city";
//   //     enhanced_selects[1].name = "district";
//   //     // console.log(enhanced_selects);
//   //   };

export default AddressPicker;
