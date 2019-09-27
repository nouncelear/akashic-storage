import React from 'react';
import { HashRouter, Route } from 'react-router-dom'
import { Grid, IconButton, Typography } from '@material-ui/core'
import { HomeWorkOutlined } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import styles from './styles'
import Landing from './pages/Landing'
import HomeUser from './pages/HomeUser'
import NewFolder from './pages/NewFolder'
import { getUserFolders, getFolders } from './tools/arweaveTools'
import Blockies from 'react-blockies'
import ViewFolder from './pages/ViewFolder'
import ViewFile from './pages/ViewFile'

// Descentralized and Colab Folders

class ArPermaDapp extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userArweaveWallet: null,
            userArweaveBalance: null,
            userArweaveWinston: null,
            userArweaveAddress: null,
            userFolders:1,
            listFolders: 1
        }
    }

    setUserArweaveInfo = async  (wallet, address, balance, winston) => {
        try{
            this.setState({ 
                userArweaveWallet: wallet, 
                userArweaveAddress: address,
                userArweaveBalance: balance, 
                userArweaveWinston: winston
            })
            this.getUserFolders(address)
            this.getAllFolders()
        }catch(error){
            alert('Error Loading Arweave Account Data')
        }
    }

    getUserFolders = async (address) => {
        try{
            this.setState({ userFolders: 1})
            const userFolders = await getUserFolders(address)
            this.setState({ userFolders })
        }catch(error){
            console.log(error)
            this.setState({ userFolders: 2})
        }
    }

    getAllFolders = async () => {
        try{
            this.setState({ listFolders: 1})
            const listFolders = await getFolders()
            this.setState({ listFolders })
        }catch(error){
            console.log(error)
            this.setState({ listFolders: 2})
        }
    }

    render(){
        const { classes } = this.props
        const { userArweaveAddress, userArweaveBalance } = this.state
        return(
            <Grid container className={classes.mainDiv}>
            <HashRouter basename="/">
            <Grid
              container
              className={classes.box}
              justify="center"
              alignContent="center"
              direction="column"
            >
                {(userArweaveAddress && userArweaveBalance) && (
                    <Grid container style={{ backgroundColor: 'black', color:'#b2bec3', padding: 10}} direction="column" alignContent="center" justify="center" alignItems="center">
                    <Typography style={{ fontSize: 18 }} align="center">Akashic Storage</Typography>
                    <Link to={'/home'}>
                       <IconButton> <HomeWorkOutlined style={{color:'white'}}/></IconButton> 
                    </Link>                 
                    <Blockies seed={userArweaveAddress} size={10} />
                    <Typography align="center">{userArweaveAddress}</Typography>
                    <Typography align="center">AR: {userArweaveBalance}</Typography>
                    </Grid>
                )}
               <Grid container style={{ backgroundColor: '#2d3436', color:'#b2bec3'}} direction="column" alignContent="center" justify="center" alignItems="center">
                    <Route exact path="/" render={() => <Landing {...this.props} setUserArweaveInfo={this.setUserArweaveInfo} />}/>
                    <Route exact path="/home" render={() => <HomeUser {...this.props} data={this.state} />}/>
                    <Route exact path="/home/folder/new" render={() => <NewFolder {...this.props} data={this.state} />}/>
                    <Route exact path="/home/folder/view/:id" render={(props) => <ViewFolder {...props} data={this.state} />}/>
                    <Route exact path="/home/file/view/:id" render={(props) => <ViewFile {...props} data={this.state} />}/>
            </Grid>
            </Grid>
            </HashRouter>
            </Grid>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ArPermaDapp)
