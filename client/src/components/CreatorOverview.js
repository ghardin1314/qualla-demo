import React from "react";
import {useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";


export default function CreatorOverview() {
  const creatorState = useSelector((state) => state.CreatorReducer);


  return (
    <Grid container alignItems="stretch">
      <Grid item component={Card} xs={6}>
        <Grid
          container
          component={CardContent}
          spacing={5}
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h6">
              {" "}
              {creatorState.contract.address
                ? creatorState.contract.subscriberCount
                : 0}
            </Typography>
            <Typography variant="subtitle1">Subscribers</Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs>
            <Typography variant="h6">
              {creatorState.contract.address
                ? creatorState.contract.tiers.length
                : 0}
            </Typography>
            <Typography variant="subtitle1">Active Teirs</Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs>
            <Typography variant="h6">
              $
              {creatorState.contract.address
                ? creatorState.contract.subscriberValue
                : 0}
            </Typography>
            <Typography variant="subtitle1">Dai/month (projected)</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
