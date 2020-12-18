import React from "react";

import { Button, GridListTile, Typography } from "@material-ui/core";
import GridList from "@material-ui/core/GridList";
import { makeStyles } from "@material-ui/core/styles";

import { useReactiveVar } from "@apollo/client";
import { GET_USER_BASETOKENS } from "../queries";
import { accountVar } from "../../../cache";
import { useQueryWithAccount } from "../../../hooks";
import BaseTokenCard from "../components/BaseTokenCard";
import BlankBaseTokenCard from "../components/BlankBaseTokenCard";
import CustomGridlist from "../../../containers/CustomGridlist";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
  },
  cardsDiv: {
    marginTop: theme.spacing(2),
    marginRight: -140,
    marginLeft: -140,
    justifyContent: "space-around",
    // overflow: "hidden",
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(4),
  },
  blankCard: {
    paddingLeft: 140,
  },
  btn: {
    width: 175,
    marginTop: theme.spacing(2),
    borderRadius: 10,
  },
}));

export default function SubTokens() {
  const classes = useStyles();
  let account = useReactiveVar(accountVar);
  const { error, loading, data } = useQueryWithAccount(GET_USER_BASETOKENS);

  return (
    <div className={classes.root}>
      <Typography variant="h4">
        <b>Subscription Tokens:</b>
      </Typography>
      <div className={classes.cardsDiv}>
        {data?.user?.baseTokens?.length > 0 ? (
          <CustomGridlist name="SubTokens">
            {data?.user?.baseTokens.map((token, i) => (
              <GridListTile key={i} className={classes.cardTile}>
                <BaseTokenCard token={token} className={classes.card} />
              </GridListTile>
            ))}
          </CustomGridlist>
        ) : (
          <div className={classes.blankCard}>
            <BlankBaseTokenCard />
          </div>
        )}
      </div>
      <Button
        component={Link}
        to="/mint"
        variant="contained"
        color="secondary"
        className={classes.btn}
      >
        Manage Tokens
      </Button>
    </div>
  );
}
