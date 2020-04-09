import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import axios from "axios";

import "antd-mobile/dist/antd-mobile.css";

import Login from "./Container/Login";
import Main from "./Container";
import Spinner from "./Components/Spin";

import { Drawer, NavBar, Icon, Button } from "antd-mobile";

class App extends Component {
  state = {
    auth: {
      token: "",
      user: "",
      loginFail: ""
    },
    open: false,
    loading: false,
    errors: {
      data: [],
      loading: false,
      error: null
    }
  };

  componentDidMount() {
    if (localStorage.getItem("token")) {
      const auth = {
        user: localStorage.getItem("user"),
        token: localStorage.getItem("token")
      };
      this.setState({ auth });
    }
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  };

  logout = () => {
    const auth = {
      user: "",
      token: ""
    };
    localStorage.clear();
    this.setState({ auth, open: false });
  };

  login = values => {
    const authData = {
      ...values,
      returnSecureToken: true
    };
    this.setState({ loading: true });

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDYxf2HeZ3LF-5_tn7igDpGJJirXhZWF44",
        authData
      )
      .then(res => {
        console.log(res);
        const auth = {
          user: res.data.displayName,
          token: res.data.idToken
        };
        localStorage.setItem("token", res.data.idToken);
        localStorage.setItem("user", res.data.displayName);

        this.setState({ auth });
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
        const tmp = {
          loginFail: "Ne postoji korisnik!"
        };
        this.setState({ auth: tmp });

        console.log(error);
      });
  };

  getErrors = () => {
    this.setState({ errors: { data: {}, error: null, loading: true } });
    axios
      .get(`https://neuros-error.firebaseio.com/data.json/?done=1`, {
        headers: {
          Authorization: `key=AAAAQ0C8sp0:APA91bGwVoEgyreYtRnxybrLrtzI-ZGCkCAHK9xmzzOjYYdP1BscUi3YY5H61s28AYxgxBmUMQiPixaIUv5pcQ1Ns_nR6Y2rIYz4nWDLC2MnzdghhmvJ_gu8eFw8FN_w_CBQHIEXBW5S`
        }
      })
      .then(res => {
        const data = [];
        for (let key in res.data) {
          data.push({
            ...res.data[key],
            id: key
          });
        }
        this.setState({
          errors: { data, error: null, loading: false },
        });
      })
      .catch(error => {
        let errors = {
          data: [],
          error,
          loading: false
        };
        this.setState({ errors });
      });
  };

  errorDone = (data, id) => {
    this.setState({ errors: { data: {}, error: null, loading: true } });
    axios
      .put(`https://neuros-error.firebaseio.com/data${id}.json/`, JSON.stringify(data))
      .then(res => {
        this.getErrors();
      })
      .catch(error => {
        let errors = {
          data: [],
          error,
          loading: false
        };
        this.setState({ errors });
      });
  }

  render() {
    if (this.state.loading) {
      return <Spinner />;
    }

    const sidebar = (
      <div
        style={{
          minHeight: document.documentElement.clientHeight,
          background: "white",
          width: "280px"
        }}
      >
        <Button
          onClick={this.logout}
          style={{ position: "fixed", bottom: "30px", left: "30%" }}
          inline
          type="ghost"
        >
          LOGUT
        </Button>
      </div>
    );

    return this.state.auth.token ? (
      <div style={{ maxWidth: "640px", maxHeight: "100vh", margin: "0 auto", overflow: "auto" }}>
         <Drawer
          className="my-drawer"
          style={{
            minHeight: document.documentElement.clientHeight,
          }}
          contentStyle={{
            color: "#A6A6A6",
            textAlign: "center",
            paddingTop: 42
          }}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        />
        <Main errorDone={this.errorDone} getErrors={this.getErrors} errors={this.state.errors} />
       

        <div
          onClick={this.onOpenChange}
          style={{
            cursor: "pointer",
            fontSize: "1em",
            borderRadius: "50%",
            width: "3.5em",
            height: "3.5em",
            border: "none",
            left: "15px",
            bottom: "15px",
            zIndex: 2,
            position: "fixed",
            background: "rgba(253, 226, 67, 0.37)"
          }}
        >
        </div>
      </div>
    ) : (
      <Login auth={this.state.auth} handleLogin={this.login} />
    );
  }
}

export default App;
