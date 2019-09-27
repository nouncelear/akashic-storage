import React from 'react'
import { Grid, Typography, Button } from '@material-ui/core'
import { CloudDownload, AttachMoney, ZoomIn } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { decode } from 'base64-arraybuffer'
import fileDownload from 'js-file-download'
import { Redirect } from 'react-router-dom'
import { getTransactionOwner, getFileTips } from '../tools/arweaveTools'
import NewTip from './NewTip';

const styles = () => ({
    nameFile:{
        fontSize: 18,
        marginBottom: 3
    },
    descriptionFile:{
        fontSize:15,
        fontStyle: 'italic' 
    },
    fileId:{
        fontSize:9
    },
    downloadButton:{
        textTransform:'none',
        margin: 10,
        width: 175
    }
})

class ViewFile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            ownerFile: null,
            newTipModal: false,
            listTips: false
        }
    }

    componentDidMount = async () => {
        if(!this.props.location.state.data) return
        const { fileId, txId } = this.props.location.state.data
        const ownerFile = await getTransactionOwner(txId)
        const listTips = await getFileTips(fileId)
        this.setState({ ownerFile, listTips })
    }

    downloadFile = async () => {
        try{
            const {
                fileData,
                fileName
            } = this.props.location.state.data
            const arrayBuffer = await decode(fileData)
            fileDownload(arrayBuffer, fileName)
        }catch(error){
            console.log(error)
        }
    }

    closeTipModal = () => this.setState({ newTipModal: false })

    openTip = () => {
        const { ownerFile } = this.state
        const { userArweaveAddress } = this.props.data
        if(!ownerFile){
            alert('fetching uploader... wait a moment')
            return
        }
        if(userArweaveAddress === ownerFile){
            alert('Can`t tip yourself')
            return
        }
        this.setState({ newTipModal: true })
    }


    render(){
        if(!this.props.location.state){
            return <Redirect to="/home" />
        }

        const { fileName, fileId, fileDescription, txId } = this.props.location.state.data
        const { classes } = this.props
        const { ownerFile, newTipModal, listTips } = this.state
        return(
            <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
                <Typography className={classes.nameFile} align="center">{fileName}</Typography>
                <Typography className={classes.fileId} align="center">{fileId}</Typography>
                <Typography className={classes.descriptionFile} align="center">{fileDescription}</Typography>

                <Typography>Uploader:</Typography>
                <Typography>{ownerFile}</Typography>
                {listTips &&
                <React.Fragment>
                <Typography>Tips:</Typography>
                <Typography>{listTips.length}</Typography>
                </React.Fragment>
                }
                <Button className={classes.downloadButton} onClick={this.downloadFile} variant="contained" color="primary">
                    Download File <CloudDownload style={{ marginLeft: 5 }}/>
                </Button>

                <Button className={classes.downloadButton} onClick={this.openTip} variant="contained" color="primary">
                    Tip Uploader <AttachMoney style={{ marginLeft: 5 }}/>
                </Button>

                <a href={`https://viewblock.io/arweave/tx/${txId}`} target="_blank" rel="noopener noreferrer">
                    <Button className={classes.downloadButton} variant="contained" color="primary">
                        View on Explorer <ZoomIn style={{ marginLeft: 5 }}/>
                    </Button>
                </a>
                {listTips &&
                <Typography align="center">Tips List</Typography>}
                {listTips &&
                    listTips.map((tip) => (
                        <Grid container style={{ margin: 10 }} direction="column">
                        <a href={`https://viewblock.io/arweave/tx/${tip.txId}`} target="_blank" rel="noopener noreferrer" >
                        <Typography align="center" style={{fontSize: 12, color: 'black'}}>{tip.txId}</Typography>
                        </a>
                        <Typography align="center">{tip.valueTip} AR</Typography>
                        </Grid>
                    ))
                }
                <NewTip 
                    data={this.props.data}
                    fileId={fileId}
                    fileOwner={ownerFile}
                    fileName={fileName}
                    open={newTipModal}
                    closeModal={this.closeTipModal}
                />
            </Grid>
        )
    }
}


export default withStyles(styles)(ViewFile)
