import React from 'react'
import { Redirect } from 'react-router-dom'
import { Grid, Typography, InputBase, Button, Fab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { NavigateNext, Clear, Check, HomeWork } from '@material-ui/icons'
import { generateNewFolderArweaveTx, arweaveInstance } from '../tools/arweaveTools';
import LoadingModal from '../components/LoadingModal';

const styles = () => ({
    input:{
        borderRadius: 8,
        backgroundColor: '#b2bec3',
        border: '1px solid #dfe6e9',
        fontSize: 12,
        width: '250px',
        padding: '5px 6px'
    },
    main:{
        backgroundColor: '#2d3436', color:'white', padding: 5, borderRadus: 20
    }

})

class NewFolder extends React.Component{
    constructor(props){
       super(props)
       this.state = {
        folderName: null,
        folderDescription: null,
        returnHome: false,
        returnLanding: false,
        // New Folder Transaction
        transactionNewUser: null,
        winstonNewUserFee: null,
        arNewUserFee: null
       } 
    }

    componentDidMount = () => {
        const { userArweaveAddress, userArweaveBalance } = this.props.data
        if(!userArweaveAddress || !userArweaveBalance){
            this.setState({ returnLanding: true })
            return
        }
        try{

        }catch(error){
            console.log(error)
        }
    }

    setNewFolder = async () => {
        const { userArweaveWallet, userArweaveAddress } = this.props.data
        const { folderName, folderDescription } = this.state
        try{
            const { transaction, fee } = await generateNewFolderArweaveTx(folderName, folderDescription, userArweaveWallet, userArweaveAddress)
            this.setState({ transactionNewUser: transaction, winstonNewUserFee: transaction.reward, arNewUserFee: fee })

        }catch(error){
            console.log(error)
        }
    }

    confirmNewFolder = async () => {
        const { userArweaveWallet } = this.props.data
        const { transactionNewUser } = this.state
        try{    
            this.setState({ loadingTxModal: true })
            var transaction = transactionNewUser
            await arweaveInstance.transactions.sign(transaction, userArweaveWallet)
            const response = await arweaveInstance.transactions.post(transaction)
            this.setState({ confirmNewFolder: true, txIdNewFolder: transaction.id, loadingTxModal: false})

        }catch(error){
            console.log(error)
            alert('Error')
            this.clearNewFolder()
        }
    }

    clearNewFolder = async () => {
        this.setState({ returnHome: true })
    }

    render(){
        const { transactionNewUser, winstonNewUserFee, arNewUserFee, txIdNewFolder,loadingTxModal, folderName,confirmNewFolder, folderDescription, returnHome, returnLanding } = this.state
        const { userArweaveAddress, userArweaveBalance, userArweaveWinston } = this.props.data
        const { classes } = this.props
        if(returnLanding){
            return <Redirect to="/" />
        }
        if(returnHome){
            return <Redirect to="/home" />
        }
        if(confirmNewFolder){
            return(
                <Grid container className={classes.main} justify="center" direction="column" alignContent="center" alingItems="center"> 
                    <Typography align="center">Transaction Deploy !</Typography>
                    <Typography align="center">{txIdNewFolder}</Typography>
                    <Typography align="center">Wait mining to view the folder in the the dApp</Typography>
                    <Button style={{ margin: 10 }} onClick={this.clearNewFolder} variant="contained" color="primary">Home Page <HomeWork/></Button>
                </Grid>
            )
        }
        if((transactionNewUser && winstonNewUserFee && arNewUserFee)){
            return(
            <Grid container className={classes.main} direction="column" alignContent="center" alignItems="center">
                <Typography variant="overline">Folder Name</Typography>
                <Typography>{folderName}</Typography>
                <Typography variant="overline">Folder Description</Typography>
                <Typography align="center">{folderDescription}</Typography>
                <Typography variant="overline">AR Fee: </Typography>
                <Typography>{arNewUserFee}</Typography>
                {(parseInt(winstonNewUserFee) < parseInt(userArweaveWinston)) ? 
                    <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                        <Fab color="primary" style={{ margin: 10 }} onClick={this.confirmNewFolder} variant="outlined"><Check/></Fab>
                        <Fab color="secondary" style={{ margin: 10 }} onClick={this.clearNewFolder} variant="outlined"><Clear/></Fab>
                    </Grid>
                    :
                    <Typography style={{ color: 'red' }}>Insuficient funds</Typography>
                }
                <LoadingModal open={loadingTxModal} />
            </Grid>
            )
        }
        return(
            <Grid container className={classes.main} direction="column" alignContent="center" alignItems="center">
                <Typography variant="overline">Folder Name</Typography>
                <InputBase className={classes.input} onChange={(e) => this.setState({ folderName: e.target.value })} />
                <Typography variant="overline" style={{ marginTop: 15 }}>Folder Description</Typography>
                <InputBase multiline rows="4" className={classes.input} onChange={(e) => this.setState({ folderDescription: e.target.value })} />
                <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                    <Button color="secondary"  onClick={this.clearNewFolder} variant="contained" style={{ margin: 10 }}>
                        Cancel <Clear/>
                    </Button>
                    <Button color="primary"  onClick={this.setNewFolder} variant="contained" style={{ margin: 10 }}>
                        Advance <NavigateNext/>
                    </Button>
                </Grid>

            </Grid>
        )
    }
}

export default withStyles(styles)(NewFolder)
