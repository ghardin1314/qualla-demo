import React, {useState, useEffect} from "react";
import {ethers} from "ethers";

import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import SwapVertIcon from "@material-ui/icons/SwapVert";

import {useSnackbar} from "notistack";
import {Hidden} from "@material-ui/core";

import {accountVar, providerVar, daiVar} from "../cache";
import {useQueryWithAccount} from "../hooks";
import {useReactiveVar, gql, useQuery, useMutation} from "@apollo/client";

const GET_BALACES = gql`
  query getBalances($id: ID!) {
    user(id: $id) {
      id
      username
      contract {
        id
      }
    }
  }
`;

const MINT_TOKENS = gql`
  mutation mintTokens($id: ID!) {
    mintTokens(id: $id) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    direction: "column",
    zIndex: 1,
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },

  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    spacing: theme.spacing(3),
  },

  underline: {
    textDecoration: "underline",
  },
}));

export default function Balances() {
  let dai = useReactiveVar(daiVar);
  let provider = useReactiveVar(providerVar);
  let account = useReactiveVar(accountVar);
  let {loading, data} = useQueryWithAccount(GET_BALACES);

  let [mintTokens, {error}] = useMutation(MINT_TOKENS);

  if (error) {
    console.log(error.message);
  }

  const classes = useStyles();
  const [ethbal, setEthBal] = useState(0);
  const [daibal, setDaiBal] = useState(0);
  const [contractbal, setContractbal] = useState(0);

  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    getBlances();
  }, [account]);

  useEffect(() => {
    subscribePersonalDai();
  }, [dai, account]);

  // useEffect(() => {
  //   subscribeContractDai();
  // }, [dai, creatorState.contract.address]);

  async function subscribePersonalDai() {
    if (dai && account) {
      let filterFromMe = dai.filters.Transfer(account, null);

      let filterToMe = dai.filters.Transfer(null, account);

      let handleTransfer = async function (from, to, amount) {
        dai.balanceOf(account).then((daibal) => {
          setDaiBal(ethers.utils.formatEther(daibal));

          enqueueSnackbar("Personal Balance Updated", {
            variant: "success",
            autoHideDuration: 2000,
          });
        });
      };

      dai.on(filterFromMe, handleTransfer);
      dai.on(filterToMe, handleTransfer);
    }
  }

  // async function subscribeContractDai() {
  //   if (web3State.Dai && creatorState.contract.address) {
  //     // web3State.Dai.removeAllListeners("Transfer");

  //     let filterFromMe = web3State.Dai.filters.Transfer(
  //       creatorState.contract.address,
  //       null
  //     );

  //     let filterToMe = web3State.Dai.filters.Transfer(
  //       null,
  //       creatorState.contract.address
  //     );

  //     let handleTransfer = async function (from, to, amount) {
  //       web3State.Dai.balanceOf(creatorState.contract.address).then(
  //         (contractbal) => {
  //           setContractbal(ethers.utils.formatEther(contractbal));

  //           enqueueSnackbar("Contract Balance Updated", {
  //             variant: "success",
  //             autoHideDuration: 2000,
  //           });
  //         }
  //       );
  //     };

  //     web3State.Dai.on(filterFromMe, handleTransfer);
  //     web3State.Dai.on(filterToMe, handleTransfer);
  //   }
  // }

  async function getBlances() {
    if (provider && account) {
      provider.getBalance(account).then((ethbal) => {
        setEthBal(parseFloat(ethers.utils.formatEther(ethbal)).toFixed(3));
      });

      if (dai) {
        dai.balanceOf(account).then((daibal) => {
          setDaiBal(ethers.utils.formatEther(daibal));
        });
      }
      if (data && data.contract) {
        dai.balanceOf(data.contract.id).then((contractbal) => {
          setContractbal(ethers.utils.formatEther(contractbal));
        });
      }
    }
  }

  function _mintTokens() {
    if (account) {
      enqueueSnackbar("Request Processing", {
        variant: "success",
      });

      mintTokens({variables: {id: account}}).catch((err) => {
        enqueueSnackbar(`${err.message}`, {
          variant: "warning",
        });
      });

    } else {
      enqueueSnackbar("No account", {
        variant: "error",
      });
    }

  }

  function withdrawTokens() {
    // if (contractbal === "0.0") {
    //   enqueueSnackbar("No funds to withdraw", {
    //     variant: "warning",
    //     autoHideDuration: 2000,
    //   });
    //   return;
    // }
    // enqueueSnackbar("Request Processing", {
    //   variant: "success",
    //   autoHideDuration: 2000,
    // });
    // axios
    //   .post("http://localhost:8080/withdraw", {
    //     publisher: web3State.account,
    //   })
    //   .then((res) => {})
    //   .catch((err) => {
    //     enqueueSnackbar(err.response.data.error, {
    //       variant: "error",
    //       autoHideDuration: 2000,
    //     });
    //   });
  }

  const contractComp = (
    <>
      <Grid item>
        <Typography variant="subtitle1" className={classes.underline}>
          Contract:
        </Typography>
      </Grid>
      <Grid item>
        <Typography>${contractbal} Dai</Typography>
      </Grid>
      <Grid item>
        <Button onClick={withdrawTokens} color="primary" variant="contained">
          <SwapVertIcon />
          Withdraw {"  "}
        </Button>
      </Grid>
    </>
  );

  return (
    <Hidden smDown>
      <Card className={classes.root} raised>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Balances:
          </Typography>
          <Grid container className={classes.container} spacing={1}>
            {data && data.contract ? contractComp : null}
            <Grid item>
              <Typography variant="subtitle1" className={classes.underline}>
                Personal:
              </Typography>
            </Grid>
            <Grid item>
              <Typography>{ethbal} Eth</Typography>
            </Grid>

            <Grid item>
              <Typography>${daibal} Dai</Typography>
            </Grid>
            <Grid item>
              <Button onClick={_mintTokens} color="primary" variant="contained">
                <AttachMoneyIcon />
                Get Dai {"  "}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Hidden>
  );
}
