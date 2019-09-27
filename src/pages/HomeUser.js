import React from 'react'
import { Grid,  Tabs, Tab, Fab } from '@material-ui/core'
import { CreateNewFolderOutlined } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import MainTable from '../components/MainTable'
import { Redirect } from 'react-router-dom'
import CellHomeList from '../components/CellHomeList'


class HomeUser extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tabStatus: 0,
            returnHome: false,
            notRegistered: false,
            myFolders: [],
            sharedFolders: []
        }
    }

    componentDidMount = async () => {
        const { userArweaveAddress, userArweaveBalance } = this.props.data
        if(!userArweaveAddress || !userArweaveBalance){
            this.setState({ returnHome: true })
            return
        }
    }

    handleChangeTabs = (event, value) => this.setState({ tabStatus: value })

  
  

    render(){
        const { tabStatus, returnHome } = this.state
        const { userFolders, listFolders  } = this.props.data
        if(returnHome){
            return <Redirect to="/" />
        }

        return(
                    <Grid container style={{ backgroundColor: '#2d3436', color:'#b2bec3', padding: 5, borderRadus: 20 }} direction="column" alignContent="center" justify="center" alignItems="center">
                    <Link to={"/home/folder/new"}>
                    <Fab style={{ textTransform: 'none', margin: 5}} variant="outlined">
                        New Folder 
                        <CreateNewFolderOutlined style={{marginLeft: 3}}/>
                    </Fab>
                    </Link>
                    <Tabs
                        value={tabStatus}
                        onChange={this.handleChangeTabs}
                        scrollButtons="auto"
                        variant="scrollable"
                        indicatorColor="primary"
                    >
                    <Tab label="My Folders" />
                    <Tab label="Community Folders" />
                    </Tabs>
                    {tabStatus === 0 && (
                        <MainTable
                        data={userFolders}
                        cells={CellHomeList}
                        />
                    )}
                    {tabStatus === 1 && (
                        <MainTable
                        data={listFolders}
                        cells={CellHomeList}
                        />
                    )}
                </Grid>
        )
    }
}

export default HomeUser