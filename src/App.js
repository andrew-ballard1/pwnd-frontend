import React, { useEffect, useState, useContext } from 'react'
import BreachContext from './BreachContext'
import { TextField, InputAdornment, ThemeProvider, CssBaseline, Grid } from '@material-ui/core'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles'
import validator from 'email-validator'
import { AccountCircle } from '@material-ui/icons'

import {red, green, grey, blue} from '@material-ui/core/colors';

const theme = createMuiTheme({
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
    }
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
  const {hasError, errorText} = error
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

const AccountSubmit = () => {
  const handleSubmit = (event) => {
    console.log(event.target.value)
    event.preventDefault()
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomTextField />
      </form>
    </>
  )
}

const App = () => {
  // I'm specifically choosing useContext over component composition because
  // composition could get gross sending data between multiple nested levels AND a few components on the same level.
  
  // At some point this could be redesigned to use either, but its an excuse for me to try useContext
  const [breachData, setBreachData] = useState([])
  const breachRef = { breachData, setBreachData }

  const classes = useStyles
  useEffect(async () => {
    console.log('trigger re-render?')
    // await setBreachData(breachRef.breachData)
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
            <AccountSubmit />
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