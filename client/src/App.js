import React, { useEffect } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import { SnackbarProvider } from "notistack";

import "./App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from "./containers/Layout";

const font = "'Rubik', sans-serif";

const theme = createMuiTheme({
  typography: {
    fontFamily: font,
    button: {
      // textTransform: "none",
    },
  },
});


export default function App() {
  // useEffect(async () => {
  //   if (account && signer) {
  //     if (account !== (await signer.getAddress())) {
  //       window.location.reload();
  //     }
  //   }
  // }, [account, signer]);

  // TODO: redo monotoring
  // async function moniterWeb3() {
  //   const _web3State = store.getState().Web3Reducer;
  //   if (_web3State.provider !== null) {
  //     const _signer = _web3State.provider.getSigner();
  //     const _account = await _signer.getAddress();

  //     if (_account !== _web3State.account) {
  //       window.location.reload();
  //     }
  //     setTimeout(moniterWeb3, 500);
  //   }
  // }
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3} autoHideDuration={4000}>
            <CssBaseline />
            <Layout>
              <BaseRouter />
            </Layout>
          </SnackbarProvider>
        </ThemeProvider>
      </Router>
    </div>
  );
}
