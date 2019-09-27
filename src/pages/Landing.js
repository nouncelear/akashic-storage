import React from 'react'
import { Grid, Typography,CircularProgress, Fab, Dialog, DialogContent } from '@material-ui/core'
import { AccountBalanceWallet } from '@material-ui/icons'
import { arweaveInstance, readArweaveWallet } from '../tools/arweaveTools'
import { Redirect } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
    main:{
        backgroundColor: 'transparent', borderRadius: 20, padding: 10 
    },
    title:{
        fontSize: 26, fontStyle: 'italic' 
    },
    secondaryText:{
        fontWeight: 400
    },
    buttonLoad:{
        textTransform:'none',
        margin: 5
    },
    hidden:{
        display:'none'
    }

})

class Landing extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            redirectHome: false,
            loadModal: false

        }
    }

    loadInitialData = async (e) => {
        try{
            this.setState({ loadModal: true })
            const walletString = await readArweaveWallet(e.target.files[0])
            const walletObject = await JSON.parse(walletString)
            const Address = await arweaveInstance.wallets.jwkToAddress(walletObject)
            const Winston =  await arweaveInstance.wallets.getBalance(Address)
            const Balance = await arweaveInstance.ar.winstonToAr(Winston)
            this.props.setUserArweaveInfo(walletObject, Address, Balance, Winston)
            this.setState({ redirectHome: true })
        }catch(error){
            console.log(error)
            this.setState({ loadModal: false })
            alert('Invalid Wallet File')            
        }
    }


    render(){
        const { classes } = this.props
        const { redirectHome, loadModal } = this.state
        if(redirectHome){
            return(
                <Redirect to={"/home"} />
            )
        }
        return(
            <Grid container className={classes.main} justify="center" alignItems="center" direction="column">
            <Typography className={classes.title} align="center">Akashic Storage</Typography>
            <Typography className={classes.secondaryText}>Colab and Share data via Arweave Network</Typography>
                <Fab className={classes.buttonLoad} onClick={() => this.refs.walletUploader.click()} variant="outlined">
                    Load Arweave Wallet
                    <AccountBalanceWallet style={{ marginLeft: 3 }} />
                </Fab>
                <input  ref="walletUploader" type="file" onChange={ e => this.loadInitialData(e)} className={classes.hidden} />
                <Dialog open={loadModal}>
                    <DialogContent>
                        <CircularProgress style={{ color: 'green' }} />
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}

export default withStyles(styles)(Landing)
