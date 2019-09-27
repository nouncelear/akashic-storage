import React from 'react'
import { Dialog, DialogContent, CircularProgress, Grid } from "@material-ui/core";

const LoadingModal = props => (
    <Dialog open={props.open}>
    <DialogContent>
        <Grid container alignItems="center">
            <CircularProgress/>
        </Grid>
    </DialogContent>
    </Dialog>
)

export default LoadingModal