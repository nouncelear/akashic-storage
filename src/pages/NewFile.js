import React from 'react'
import { Dialog, DialogContent, Grid, Typography, Fab, Button, InputBase } from "@material-ui/core"
import { AccountBalanceWallet, Check, Clear, NavigateNext, HomeWork } from "@material-ui/icons"
import { withStyles } from '@material-ui/core/styles'
import readFile from '../tools/readFile';
import { generateNewFileArweaveTx, arweaveInstance } from '../tools/arweaveTools'
import { encode , decode } from 'base64-arraybuffer'
import LoadingModal from '../components/LoadingModal';

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

class NewFile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            rawFile: null,
            nameFile: null,
            fileDescription: 'File description',
            //Tx
            transactionNewFile: null,
            winstonNewFileFee: null,
            arNewFileFee: null,
            confirmNewFile: null,
            txIdNewFile: null
        }
    }



    loadFile = async(event) => {
        try{
            const { file, name } = await readFile(event.target.files[0])
            const rawFile = await encode(file)
            this.setState({ rawFile, nameFile: name })            
        }catch(error){
            console.log(error)
        }
    }

    setNewFile = async() => {
        const { rawFile, nameFile, fileDescription } = this.state
        const { folderId, folderName } = this.props
        const { userArweaveWallet } = this.props.data

        if(!rawFile || !nameFile || !fileDescription){
            alert('Upload a file and put a description')
            return
        }
        try{
            const { transaction, fee } = await generateNewFileArweaveTx(rawFile, nameFile, fileDescription,folderId,userArweaveWallet )
            this.setState({ transactionNewFile: transaction, winstonNewFileFee: transaction.reward, arNewFileFee: fee })
        }catch(error){
            console.log(error)
        }
    }

    confirmNewFile = async () => {
        const { userArweaveWallet } = this.props.data
        const { transactionNewFile } = this.state
        try{
            this.setState({ loadingTxModal: true })
            var transaction = transactionNewFile
            await arweaveInstance.transactions.sign(transaction, userArweaveWallet)
            const response = await arweaveInstance.transactions.post(transaction)
            this.setState({ confirmNewFile: true, txIdNewFile: transaction.id, loadingTxModal: false })
        }catch(error){
            console.log(error)
            this.setState({ loadingTxModal: false})
            alert('Error')
        }
    }

    clearNewFile = () => {
        this.props.closeModal()
        this.setState({
            rawFile: null,
            nameFile: null,
            fileDescription: null,
            transactionNewFile: null,
            winstonNewFileFee: null,
            arNewFileFee: null,
            confirmNewFile: null,
            txIdNewFile: null
         })
    }

    render(){
        const { open, folderId, folderName, classes, closeModal } = this.props
        const { userArweaveWinston } = this.props.data
        const { nameFile, loadingTxModal, transactionNewFile, arNewFileFee, winstonNewFileFee, fileDescription, confirmNewFile, txIdNewFile } = this.state
        if(confirmNewFile){
            return(
                <Dialog open={open}>
                <DialogContent style={{ backgroundColor: '#2d3436', color:'white' }}>
                <Grid container className={classes.main} justify="center" direction="column" alignContent="center" alingItems="center"> 
                    <Typography align="center">Transaction Deploy !</Typography>
                    <Typography align="center">{txIdNewFile}</Typography>
                    <Typography align="center">Wait mining to view the file in the the dApp</Typography>
                    <Button style={{ margin: 10 }} onClick={this.clearNewFile} variant="contained" color="primary">Home Page <HomeWork/></Button>
                </Grid>
                </DialogContent>
                </Dialog>
            )
        }
        return(
            <Dialog open={open}>
                <DialogContent style={{ backgroundColor: '#2d3436', color:'white' }}>
                    <Grid container direction="column">                    
                        <Typography align="center">Upload New File</Typography>
                        <Typography variant="overline" className={classes.smallText}>Folder Name: </Typography>
                        <Typography className={classes.smallText}>{folderName}</Typography>
                        <Typography variant="overline" className={classes.smallText}>Folder Id: </Typography>
                        <Typography className={classes.smallText} >{folderId}</Typography>
                    </Grid>
                    {(!transactionNewFile) ? (                    
                        <Grid container direction="column"  alignContent="center" alignItems="center">
                        <Typography variant="overline" className={classes.textTitle}>File Upload</Typography>
                        {nameFile ? 
                        <React.Fragment>
                            <Typography className={classes.nameFile}>{nameFile}</Typography>
                            <Fab onClick={() => this.setState({rawFile: null, nameFile: null})} color="secondary" size="small" variant="outlined"><Clear/></Fab>
                        </React.Fragment>
                        :
                        <Fab className={classes.buttonLoad} onClick={() => this.refs.fileUploader.click()} variant="outlined">
                            Load File
                            <AccountBalanceWallet style={{ marginLeft: 3 }} />
                        </Fab>
                        }
                        <Typography variant="overline" className={classes.textTitle}>File Description: </Typography>
                        <InputBase multiline rows="4"  className={classes.input} onChange={(e) => this.setState({ fileDescription: e.target.value })}/>
                        
                        <input  ref="fileUploader" type="file" onChange={ e => this.loadFile(e)} className={classes.hidden} />
                        <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                        <Button className={classes.buttonAdvance} color="secondary" variant="contained" onClick={this.clearNewFile}>Cancel<Clear/></Button>
                        <Button className={classes.buttonAdvance} color="primary" variant="contained" onClick={this.setNewFile}>Advance<NavigateNext/></Button>
                        </Grid>
                        </Grid>
                    )
                    :
                    <Grid container alignContent="center" alignItems="center" direction="column">  
                        <Typography variant="overline" className={classes.textTitle}>File Name: </Typography>       
                        <Typography>{nameFile}</Typography>
                        <Typography variant="overline" className={classes.textTitle}>File Description:</Typography>
                        <Typography>{fileDescription}</Typography>     
                        <Typography variant="overline" className={classes.textTitle}>Transaction Cost:</Typography>  
                        <Typography>{arNewFileFee} AR</Typography>    
                        {(parseInt(winstonNewFileFee) < parseInt(userArweaveWinston)) ? 
                            <Grid container direction="row" justify="center" alignContent="center" alignItems="center">
                                <Fab onClick={this.confirmNewFile} color="primary" style={{ margin: 10 }}  variant="outlined"><Check/></Fab>
                                <Fab onClick={this.clearNewFile} color="secondary" style={{ margin: 10 }} variant="outlined"><Clear/></Fab>
                            </Grid>
                        :
                            <Typography style={{ color: 'red' }}>Insuficient funds</Typography>
                        }
                    </Grid>
                    }
                    <LoadingModal open={loadingTxModal} />
                </DialogContent>
            </Dialog>
        )
    }
}

export default withStyles(styles)(NewFile)
