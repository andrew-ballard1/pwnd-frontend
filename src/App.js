import React, { useEffect, useState, useContext } from 'react'
import {
  TextField, 
  InputAdornment, 
  ThemeProvider, 
  CssBaseline, 
  Grid, 
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'

import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import { AccountCircle, HelpOutline, CheckCircleOutline, FilterList } from '@material-ui/icons'
import { red, green, grey, blue } from '@material-ui/core/colors'

import validator from 'email-validator'
import parse from 'html-react-parser'

import BreachContext from './BreachContext'
import FilterContext from './FilterContext'

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "a": {
          color: '#bbddff',
        },
        ".cardHeader": {
          borderBottom: '1px rgba(255, 255, 255, 0.4) solid',
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent:'space-between',
          padding: '15px',
          marginLeft: '-15px',
          marginRight: '-15px',
          marginBottom: '15px'
        },
        ".breachCard": {
          paddingLeft: '15px',
          paddingRight: '15px',
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderRadius: '4px', 
          boxShadow: '0px 2px 3px 0px rgba(255,255,255,0.1)', 
          backgroundColor: '#444',
          width: '90%',
          minHeight: '300px',
          margin: '15px',
          alignSelf: 'center'
        },
        ".cardLogo":{
          width: '50px', 
          height: '50px', 
          border: '1px white solid', 
          borderRadius: '4px', 
          backgroundSize: '70%', 
          backgroundRepeat: 'no-repeat', 
          backgroundPosition: 'center'
        },
        ".cardFooter":{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'flex-end',
        }
      },
    },
  },
  palette: {
    type: "dark",
    primary: {
      main: grey[50],
    },
    secondary: {
      main: grey[500],
    },
    error: {
      main: red[500],
    },
    success: {
      main: green[500],
    },
    info: {
      main: blue[500],
    },
  },
})

const useStyles = makeStyles(theme => ({
  fullHeight: {
    height: '100vh',
  }
}));


const getBreach = async (account) => {
  console.log("getBreach()")
  const token = '12345' // if auth is to be added between front / back ends
  const options = {
    method: 'GET',
    // headers: {
    //   Authroization: `Bearer ${token}`
    // }
  }
  
  const url = `http://127.0.0.1:3030/breaches?account=${account}`
  let res = []
  await fetch(url, options).then((response) => response.json()).then((data) => {
    console.log('data:')
    console.log(data)
    res = data
  }).catch((error) => {
    console.log(error)
  })

  return res
}


const CustomTextField = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState({hasError: false, errorText: ''})
  const {hasError, errorText} = error
  
  const {setBreachData} = useContext(BreachContext)

  const handleKeyUp = async (event) => {
    if (event.key === 'Enter') {
      // validate email
      if(validator.validate(email)){
        console.log('getting breach data')
        const breachData = await getBreach(email)
        setBreachData(breachData)
      } else {
        setError({hasError: true, errorText: 'Invalid Email Address'})
      }
    } else {
      setError({hasError: false, errorText: ''})
      setEmail(event.target.value)
    }
  }

  return (
    <TextField
      error={hasError}
      label='Check an Email'
      defaultValue=''
      helperText={errorText}
      onKeyUp={handleKeyUp}
      autoComplete='off'
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AccountCircle color={hasError ? 'secondary' : 'primary'}/>
          </InputAdornment>
        ),
      }}
    />
  )
}

const BreachTable = (data = []) => {
  console.log("breachtable sees the following data")
  console.log(data)
  return (
    <div>
      {data.map((item, index) => {
        return (<div>{index}. {JSON.stringify(item)}</div>)
      })}
    </div>
  )
}

const App = () => {
  // I'm specifically choosing useContext over component composition because
  // composition could get gross sending data between multiple nested levels AND a few components on the same level.
  
  // At some point this could be redesigned to use either, but its an excuse for me to try useContext - update, I love useContext.
  // I think I hate material-ui though, at least until I don't have to hit documentation every 2 minutes

  const [breachData, setBreachData] = useState([])
  const breachRef = { breachData, setBreachData }

  const classes = useStyles
  useEffect(async () => {
    setBreachData(breachRef.breachData)
  }, [breachRef.breachData])

  console.log('app render ------------------------ start')
  console.log(breachData)
  console.log('app render ------------------------ end')

  return (
    <BreachContext.Provider value={breachRef}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{height:'100vh'}}>

          <Grid item>
            <CustomTextField />
          </Grid>
          <Grid item>
            <div>
              {breachData.length > 0 &&
                (<div>
                  <h2>
                    Breach Data
                  </h2>
                  {BreachTable(breachData)}
                </div>)
              }
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </BreachContext.Provider>
  )
}

export default App