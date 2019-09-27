import React from 'react';
import {
  Grid,
  Table,
  TableBody,
  TablePagination,
  TableRow,
  Paper,
  Typography,
  CircularProgress
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
//import HeadTableSector from './HeadTableSector';

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getSorting(order, orderBy) {
  return order === 'desc'
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const styles = theme => ({
  root: {
    margin:15,
    width: '90%'
  },
  actions: { margin: 0 },

  tableBodyRow: {
    // Small Screen
    display: 'table-row',
    height: 'auto',
    marginTop: 5,
    border: 0,

    [theme.breakpoints.up('sm')]: {
      height: 48,
      display: 'table-row',
      border: 0,
      backgroundColor: 'transparent'
    }
  }
});

class MainTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'desc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =      order === 'desc'
        ? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  // isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data } = this.props
    const {
    order, orderBy, rowsPerPage, page 
    } = this.state
    const CellsComponent = this.props.cells

    if(data === 1){
      return(
        <Grid container justify="center" alignContent="center" alignItems="center">
          <CircularProgress style={{ margin: 15}} />
        </Grid>
      )
    }

    if(data === 2 || !data) {
      return(
        <Grid container justify="center" alignContent="center" alignItems="center">
          <Typography align="center" style={{ margin: 10 }}>Error Loading Data, Try Again</Typography>
        </Grid>
      )
    }

    if(data.length === 0){
      return(
        <Grid container justify="center" alignContent="center"  alignItems="center">
          <Typography align="center" style={{ margin: 10 }}>Nothing Found</Typography>
        </Grid>
      )
    }

    return (
      <Paper className={classes.root}>
        <div>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <TableBody>
              {stableSort(this.props.data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      key={n.contractID}
                      tabIndex={-1}
                      classes={{
                        root: classes.tableBodyRow
                      }}
                    >
                      <CellsComponent data={n} />
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <TablePagination
          className={classes.actions}
          component="div"
          count={this.props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          rowsPerPageOptions={[]}
          labelRowsPerPage=""
          backIconButtonProps={{}}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(MainTable);
