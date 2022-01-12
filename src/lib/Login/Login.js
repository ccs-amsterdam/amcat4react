import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Form, Button, Segment, Message } from "semantic-ui-react";
import { useCookies } from "react-cookie";
import Amcat, { getToken } from "../apis/Amcat";

/**
 * An AmCAT login form.
 * @param {*} onLogin Returns an Amcat class instance on login, or null on logout
 * @returns
 */
export default function Login({ onLogin }) {
  const [cookies, setCookies] = useCookies(["amcat"]);
  const loggedIn = useRef(false);
  const [pending, setPending] = useState(true);

  const amcat = useMemo(
    () =>
      cookies.amcat || {
        host: "http://127.0.0.1:5000",
        email: "admin",
        token: null,
      },
    [cookies.amcat]
  );

  const setLogin = useCallback(
    (d) => {
      loggedIn.current = true;
      setCookies("amcat", JSON.stringify(d), { path: "/" });
      if (onLogin) onLogin(new Amcat(d.host, d.email, d.token));
      setPending(false);
    },
    [onLogin, setCookies]
  );

  const setLogout = useCallback(() => {
    loggedIn.current = false;
    setCookies("amcat", JSON.stringify({ ...amcat, token: null }), { path: "/" });
    if (onLogin) onLogin(null);
    setPending(false);
  }, [amcat, onLogin, setCookies]);

  useEffect(() => {
    if (!loggedIn.current && amcat.host && amcat.email && amcat.token) {
      const conn = new Amcat(amcat.host, amcat.email, amcat.token);
      conn
        .getToken()
        .then((res) => {
          setLogin({ ...amcat, token: res.data.token });
        })
        .catch((e) => {
          setLogout();
        });
      return null;
    }
    setPending(false);
  }, [amcat, setLogin, setLogout]);

  // if logged in, show log out
  if (pending) return null;
  if (loggedIn.current) return <SignOut amcat={amcat} setLogout={setLogout} />;
  return <SignIn amcat={amcat} setLogin={setLogin} />;
}

const SignOut = ({ amcat, setLogout }) => {
  return (
    <Button fluid secondary onClick={setLogout}>
      Sign out from <span style={{ color: "lightblue" }}>{amcat.email}</span>
    </Button>
  );
};

const SignIn = ({ amcat, setLogin }) => {
  const [host, setHost] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("admin");
  const [invalidPassword, setInvalidPassword] = useState(false);

  const tryPasswordLogin = async () => {
    setPassword("");
    try {
      const token = await getToken(host, email, password);
      setLogin({ host, email, token });
    } catch (e) {
      setInvalidPassword(true);
      console.log(e);
    }
  };

  let emailError = !email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (email === "admin") emailError = false;

  useEffect(() => {
    if (amcat?.email) setEmail(amcat.email);
    if (amcat?.host) setHost(amcat.host);
  }, [amcat]);

  return (
    <Form size="large">
      <Segment stacked>
        <Form.Input
          fluid
          placeholder="Host"
          name="host"
          label="Host"
          value={host}
          onChange={(e, d) => {
            if (d.value.length < 100) setHost(d.value);
          }}
          icon="home"
          iconPosition="left"
          autoFocus
        />

        <Form.Input
          fluid
          placeholder="email adress"
          error={emailError ? "Please enter a valid email adress" : false}
          name="email"
          label="Email"
          icon="mail"
          iconPosition="left"
          value={email}
          onChange={(e, d) => {
            if (d.value.length < 100) setEmail(d.value);
          }}
        />

        <Form.Input
          fluid
          placeholder="password"
          name="password"
          error={invalidPassword ? "Invalid password for this host & email" : false}
          label="Password"
          type="password"
          icon="lock"
          iconPosition="left"
          value={password}
          onChange={(e, d) => {
            setInvalidPassword(false);
            setPassword(d.value);
          }}
        />

        <Button
          disabled={password.length === 0}
          primary
          onClick={tryPasswordLogin}
          fluid
          size="large"
        >
          Sign in
        </Button>
      </Segment>
      <Message>Don't have an account? pweh!</Message>
    </Form>
  );
};