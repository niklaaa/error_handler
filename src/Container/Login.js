import React, { Component } from "react";

import { List, InputItem, Button } from "antd-mobile";
import { createForm } from "rc-form";

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends Component {
  state = {};
  componentDidMount() {
    // this.autoFocusInst.focus();
  }
  handleClick = () => {
    this.props.form.validateFields((error, values) => {
      console.log(error, values);
      if (!error) {
        this.props.handleLogin(values);
      }
    });
  };
  render() {

    const emailDecorator = this.props.form.getFieldDecorator("email", {
      rules: [{ required: true }]
    });
    const passwordDecorator = this.props.form.getFieldDecorator("password", {
      rules: [{ required: true }]
    });
    const { getFieldProps, getFieldsError } = this.props.form;
    return (
      <div style={{ marginTop: "30vh" }}>
        <h2 style={{ textAlign: "center" }}>Stanje...?</h2>
        <List>
          {emailDecorator(
            <InputItem
              clear
              placeholder="Email"
              required={true}
              type="email"
              // ref={el => (this.autoFocusInst = el)}
            />
          )}

          {passwordDecorator(
            <InputItem
              clear
              type="password"
              placeholder="Password"
              required={true}
              // ref={el => (this.autoFocusInst = el)}
            />
          )}
          <List.Item>
            <Button
              disabled={hasErrors(getFieldsError())}
              onClick={this.handleClick}
            >
              Login
            </Button>
            <div
              style={{
                textAlign: "center",
                padding: "15px 6px",
                color: "#7b7a1d"
              }}
            >
              {this.props.auth.loginFail}
            </div>
          </List.Item>
        </List>
      </div>
    );
  }
}

export default createForm()(Login);
