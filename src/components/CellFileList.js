import React, { Fragment } from 'react'
import { TableCell, Typography, IconButton } from '@material-ui/core'
import { CloudDownload, ZoomIn } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { decode } from 'base64-arraybuffer'
import fileDownload from 'js-file-download'
import { Link } from 'react-router-dom'

const styles = () => ({
  tableId: {
    display: 'table-cell',
    padding: '10px 5px',
    fontSize: 12,
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
  },
})


class CellFileList extends React.Component {

    downloadFile = async () => {
        try{
            const {
                fileData,
                fileName
            } = this.props.data
            const arrayBuffer = await decode(fileData)
            fileDownload(arrayBuffer, fileName)
        }catch(error){
            console.log(error)
        }
    }
    render(){
        const {
            fileData,
            fileName,
            fileId
        } = this.props.data
        const { classes } = this.props
        const data = this.props.data
        
        return (
            <Fragment>
            <TableCell classes={{ root: classes.tableId }}>
                    <Typography style={{ color: 'grey' }}>{fileName}</Typography>
            </TableCell>
            <TableCell  classes={{ root: classes.tableId }}>
            <IconButton onClick={this.downloadFile}>
            <CloudDownload/>
            </IconButton>
            </TableCell>
            <TableCell  classes={{ root: classes.tableId }}>
                <Link to={{pathname:`/home/file/view/${fileId}`, state : {data} }}>
                    <IconButton>
                        <ZoomIn/>
                    </IconButton>
                </Link>
            </TableCell>
            </Fragment>
        )
    }
}

export default withStyles(styles)(CellFileList)
