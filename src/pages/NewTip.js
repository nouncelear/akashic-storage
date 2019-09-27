import React from 'react'
import { Dialog, DialogContent, Grid, Typography, Fab, Button, InputBase } from "@material-ui/core"
import { AccountBalanceWallet, Check, Clear, NavigateNext, HomeWork } from "@material-ui/icons"
import { withStyles } from '@material-ui/core/styles'
import { arweaveInstance, generateTipArweaveTx, getTransactionOwner } from '../tools/arweaveTools'

const styles = () => ({
    buttonLoad:{
        textTransform:'none',
        margin: 5,
        maxWidth: 250
    },
    buttonAdvance:{
        margin: 5,
    },
    hidden:{
        display:'none'
    },
    input:{
        borderRadius: 8,
        backgroundColor: '#b2bec3',
        border: '1px solid #dfe6e9',
        fontSize: 12,
        width: '250px',
        padding: '5px 6px',
        marginBottom:15
    },
    folderId:{
        fontSize: 10, wordWrap: 'anywhere'
    },
    textTitle:{
        fontSize: 10,
    },
    nameFile:{
        padding: 10, wordWrap: 'anywhere'
    },
    smallText:{
        fontSize: 10, wordWrap: 'anywhere'
    }
})

class NewTip extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            valueTip: 0,
            //Tx
            transactionNewTip: null,
            winstonNewTipFee: null,
            arNewTipFee: null,
            confirmNewTip: null,
            txIdNewTip: null
        }
    }

    setNewTip = async() => {
        const { valueTip } = this.state
        const { fileId, fileOwner } = this.props
        const { userArweaveWallet } = this.props.data

        if(!valueTip){
            alert('Put a valid value to the tip')
            return
        }
        try{
            const { transaction, fee } = await generateTipArweaveTx(fileId, fileOwner, valueTip, userArweaveWallet )
            this.setState({ transactionNewTip: transaction, winstonNewTipFee: transaction.reward, arNewTipFee: fee })
        }catch(error){
            console.log(error)
        }
    }

    confirmNewTip = async () => {
        const { userArweaveWallet } = this.props.data
        const { transactionNewTip } = this.state
        try{
            this.setState({ loadingTxModal: true })
            var transaction = transactionNewTip
            await arweaveInstance.transactions.sign(transaction, userArweaveWallet)
            const response = await arweaveInstance.transactions.post(transaction)
            this.setState({ confirmNewTip: true, txIdNewTip: transaction.id, loadingTxModal: false })
        }catch(error){
            console.log(error)
        }
    }

    clearNewTip = () => {
        this.props.closeModal()
        this.setState({
            rawFile: null,
            nameFile: null,
            transactionNewTip: null,
            winstonNewTipFee: null,
            arNewTipFee: null,
            confirmNewTip: null,
            txIdNewTip: null
         })
    }

    render(){
        const { open, fileId, fileOwner, fileName , classes, closeModal } = this.props
        const { userArweaveWinston } = this.props.data
        const { transactionNewTip, arNewTipFee, winstonNewTipFee, valueTip, confirmNewTip, txIdNewTip } = this.state
        if(confirmNewTip){
            return(
                <Dialog open={open}>
                <DialogContent style={{ backgroundColor: '#2d3436', color:'white' }}>
                <Grid container className={classes.main} justify="center" direction="column" alignContent="center" alingItems="center"> 
                    <Typography align="center">Transaction Deploy !</Typography>
                    <Typography align="center">{txIdNewTip}</Typography>
                    <Typography align="center">Wait mining to view the confirmation on the dApp</Typography>
                    <Button style={{ margin: 10 }} onClick={this.clearNewTip} variant="contained" color="primary">Home Page <HomeWork/></Button>
                </Grid>
                </DialogContent>
                </Dialog>
            )
        }
        return(
            <Dialog open={open}>
                <DialogContent style={{ backgroundColor: '#2d3436', color:'white' }}>
                    <Grid container direction="column">                    
                        <Typography align="center">New Tip</Typography>
                        <Typography variant="overline" className={classes.smallText}>File Name: </Typography>
                        <Typography className={classes.smallText}>{fileName}</Typography>
                        <Typography variant="overline" className={classes.smallText}>Uploader: </Typography>
                        <Typography className={classes.smallText} >{fileOwner}</Typography>
                    </Grid>
                    {(!transactionNewTip) ? (                    
                        <Grid container direction="column"  alignContent="center" alignItems="center">
                        <Typography variant="overline" className={classes.textTitle}>Tip Value(AR)</Typography>
                        <InputBase
                            type="number"
                            onChange={(e) => this.setState({ valueTip: e.target.value})}
                        />
                        <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                        <Button className={classes.buttonAdvance} color="secondary" variant="contained" onClick={this.clearNewTip}>Cancel<Clear/></Button>
                        <Button className={classes.buttonAdvance} color="primary" variant="contained" onClick={this.setNewTip}>Advance<NavigateNext/></Button>
                        </Grid>
                        </Grid>
                    )
                    :
                    <Grid container alignContent="center" alignItems="center" direction="column">  
                        <Typography variant="overline" className={classes.textTitle}>Value Tip: </Typography>       
                        <Typography>{valueTip} AR</Typography>  
                        <Typography variant="overline" className={classes.textTitle}>Transaction Fee:</Typography>  
                        <Typography>{arNewTipFee} AR</Typography>    
                        {(parseInt(winstonNewTipFee) < parseInt(userArweaveWinston)) ? 
                            <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                                <Fab onClick={this.confirmNewTip} color="primary" style={{ margin: 10 }}  variant="outlined"><Check/></Fab>
                                <Fab onClick={this.clearNewTip} color="secondary" style={{ margin: 10 }} variant="outlined"><Clear/></Fab>
                            </Grid>
                        :
                            <Typography style={{ color: 'red' }}>Insuficient funds</Typography>
                        }
                    </Grid>
                    }
                </DialogContent>
            </Dialog>
        )
    }
}

export default withStyles(styles)(NewTip)
