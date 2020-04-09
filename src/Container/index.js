import React, { Component } from "react";

import { List, Button, TextareaItem } from "antd-mobile";

import Spinner from "./../Components/Spin";

class Main extends Component {
  state = {
    open: "",
    allOpen: false
  };

  componentDidMount() {
    this.props.getErrors();
  }

  toggleAllErrors = () => {
    this.setState({ allOpen: !this.state.allOpen });
  };

  showError = id => {
    if (id === this.state.open) {
      this.setState({ open: "" });
      return;
    }
    this.setState({ open: id });
  };

  testClass = id => {
    if (this.state.allOpen || id === this.state.open) {
      return "active";
    }
    return "";
  };

  errorDone = item => {
    const tmp = { ...item };
    tmp.done = 1;
    const id = tmp.id;
    delete tmp.id;
    this.props.errorDone(tmp, id);
  };
 

  render() {
    const { data } = this.props.errors;

    if (this.props.errors.error) {
      return (
        <div
          style={{
            marginTop: "100px",
            textAlign: "center",
            color: "rgb(206, 17, 38)"
          }}
        >
          Dogodio se error kod dohvata errora :/
        </div>
      );
    }

    return this.props.errors.loading ? (
      <Spinner />
    ) : (
      <>
        <List
          style={{ marginBottom: "80px" }}
          renderHeader={() => <h2>Lista Errora</h2>}
        >
          {data.map(item => (
            <>
              <List.Item
                key={item.id}
                extra={
                  <div
                    style={{
                      backgroundColor: item.done === 0 ? "#b7eb8f" : "#ffccc7",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "inline-block"
                    }}
                  ></div>
                }
                arrow={
                  item.id === this.state.open || this.state.allOpen
                    ? "up"
                    : "down"
                }
                onClick={() => this.showError(item.id)}
              >
                <div>
                  {" "}
                  <span>{item.app_name}</span>
                </div>
              </List.Item>
              <List.Item
                key={item.id + "content"}
                className={"errorContent " + this.testClass(item.id)}
              >
                <div>
                  <ul style={{ padding: "0" }}>
                    {" "}
                    <li>{item.created_at}</li>
                    <li>
                      <p>{item.error}</p>
                    </li>
                    <li>{item.method}</li>
                    <li>{item.endpoint.path_info}</li>
                    <li>{item.endpoint.remote_address}</li>
                    <li>{item.endpoint.remote_host}</li>
                    <li>{item.endpoint.server_name}</li>
                    <li>{item.user.name}</li>
                    <li
                      style={{
                        padding: "1px",
                        border: "1px solid rgba(0,0,0, 0.2)"
                      }}
                    >
                      <label>DATA</label>
                      {/* {console.log(JSON.parse(item.values.data))} */}
                      {/* <TextareaItem value={JSON.parse(item.values.data)} rows={5} /> */}
                    </li>
                    {item.values.binary ? (
                      <li
                        style={{
                          padding: "1px",
                          border: "1px solid rgba(0,0,0, 0.2)"
                        }}
                      >
                        <label>BINARY</label>
                        {item.values.binary.map(file => (
                          <div>
                            <div style={{ paddingLeft: "4px" }}>
                              {file.name}
                            </div>
                            <div style={{ paddingLeft: "4px" }}>
                              {file.size}
                            </div>
                            <div
                              style={{
                                height: "1px",
                                padding: "0 4px",
                                backgroundColor: "rgba(0,0,0, 0.2)"
                              }}
                            ></div>
                          </div>
                        ))}
                      </li>
                    ) : null}
                  </ul>
                  <div>
                    <Button
                      style={{ margin: "10px 0", background: "#b7eb8f" }}
                      type="primary"
                      onClick={() => this.errorDone(item)}
                    >
                      Završi
                    </Button>
                  </div>
                </div>
              </List.Item>
            </>
          ))}
        </List>
        <div
          onClick={this.toggleAllErrors}
          style={{
            cursor: "pointer",
            fontSize: "1em",
            borderRadius: "50%",
            width: "3.5em",
            height: "3.5em",
            border: "none",
            right: "15px",
            bottom: "15px",
            zIndex: 2,
            position: "fixed",
            background: "#43d2fd5e"
          }}
        ></div>
      </>
    );
  }
}

export default Main;
