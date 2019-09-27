import React, { Fragment } from 'react'
import { TableCell, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  tableId: {
    display: 'table-cell',
    padding: '10px 5px',
    fontSize: 12,
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
  },
})

const CellHomeList = ({ classes, data }) => {
  const {
    id,
    folderName
  } = data
  
  return (
    <Fragment>
      <TableCell datatitle="Folder Name" classes={{ root: classes.tableId }}>
        <Link to={{pathname:`/home/folder/view/${id}`, state : {data} }}>
            <Typography style={{ color: 'grey' }}>{folderName}</Typography>
        </Link>
      </TableCell>
    </Fragment>
  )
}

export default withStyles(styles)(CellHomeList)
