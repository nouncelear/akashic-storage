import React from 'react'
import { CircularProgress, Grid, Typography, Button } from '@material-ui/core'
import { Folder, Attachment } from '@material-ui/icons'
import { Redirect } from 'react-router-dom'
import { getFilesFolder } from '../tools/arweaveTools'
import NewFile from './NewFile'
import MainTable from '../components/MainTable'
import CellFileList from '../components/CellFileList'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
    buttonLoad:{
        textTransform: 'none',
        margin: 10
    },
    nameFile:{
        fontSize: 18
    },
    descriptionFile:{
        fontSize:15,
        fontStyle: 'italic' 
    }
})

class ViewFolder extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            uploadFileModal: false,
            listFiles: []
        }
    }

    componentDidMount = async () => {
        try{
            this.getFiles()
        }catch(error){
            console.log(error)
        }
    }

    getFiles = async () => {
        try{
            this.setState({ listFiles: 1 })
            const id = this.props.match.params.id
            const listFiles = await getFilesFolder(id)
            this.setState({ listFiles })
        }catch(error){
            this.setState({ listFiles: 2 })
        }
    }

    closeNewFileModal = () => this.setState({ uploadFileModal: false })

    render(){
        const { classes } = this.props
        if(!this.props.location.state){
            return <Redirect to="/home" />
        }
        const { loadingFolder, uploadFileModal, listFiles } = this.state
        const { folderName, id, folderDescription } = this.props.location.state.data
        if(loadingFolder){
            return (
                <Grid container justify="center" alignContent="center" alignItems="center">
                    <CircularProgress />
                </Grid>
            )
        }

        return(
            <Grid container justify="center" alignContent="center" alignItems="center" direction="column">
            <Typography className={classes.nameFile} variant="h6"><Folder/>{folderName}</Typography>
            <Typography style={{ fontSize: 8 }} variant="caption">{id}</Typography>
            <Typography className={classes.descriptionFile}>{folderDescription}</Typography>
            <Button className={classes.buttonLoad} onClick={() => this.setState({ uploadFileModal: true })} variant="contained">
                Upload File <Attachment/>
            </Button>
            <MainTable
                data={listFiles}
                cells={CellFileList}
            />
            <NewFile data={this.props.data} closeModal={this.closeNewFileModal} open={uploadFileModal} folderId={id} folderName={folderName} />
            </Grid>
        )
    }
}

export default withStyles(styles)(ViewFolder)
