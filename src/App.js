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

const SearchTextField = () => {
  const [search, setSearch] = useState('')
  
  const {filter, setFilter} = useContext(FilterContext)
  const handleKeyUp = async (event) => {
    setFilter({...filter, searchBy: event.target.value})
  }

  return (
    <TextField
      label='Quick Search'
      defaultValue=''
      onKeyUp={handleKeyUp}
      autoComplete='off'
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FilterList color={'primary'}/>
          </InputAdornment>
        ),
      }}
    />
  )
}

const SeverityFilter = () => {
  const [value, setValue] = React.useState(0)
  const {filter, setFilter} = useContext(FilterContext)
  
  const handleChange = async (event) => {
    setFilter({...filter, severity: Number(event.target.value)})
    setValue(Number(event.target.value))
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Severity</FormLabel>
      <RadioGroup aria-label="severity" name="severity1" value={value} onChange={handleChange}>
        <FormControlLabel value={1} control={<Radio />} label="Low" />
        <FormControlLabel value={2} control={<Radio />} label="Medium" />
        <FormControlLabel value={3} control={<Radio />} label="High" />
        <FormControlLabel value={4} control={<Radio />} label="Critical" />
        <FormControlLabel value={0} control={<Radio />} label="Show All" />
      </RadioGroup>
    </FormControl>
  )
}

const SortBy = () => {
  const [value, setValue] = React.useState('name_asc')
  const {filter, setFilter} = useContext(FilterContext)
  
  const handleChange = async (event) => {
    setFilter({...filter, severity: Number(event.target.value)})
    setValue(Number(event.target.value))
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Severity</FormLabel>
      <RadioGroup aria-label="severity" name="severity1" value={value} onChange={handleChange}>
        <FormControlLabel value='name_asc' control={<Radio />} label="Name (asc)" />
        <FormControlLabel value='name_desc' control={<Radio />} label="Name (desc)" />
        <FormControlLabel value='severity_asc' control={<Radio />} label="Severity (asc)" />
        <FormControlLabel value='severity_desc' control={<Radio />} label="Severity (desc)" />
        <FormControlLabel value='impact_asc' control={<Radio />} label="Impact (asc)" />
        <FormControlLabel value='impact_desc' control={<Radio />} label="Impact (desc)" />
      </RadioGroup>
    </FormControl>
  )
}

const BreachTable = (data) => {
  const severity = ['...', 'Low', 'Medium', 'High', 'Very High']

  let table = data.map((item, index) => {
    return (
      <div key={`card_${index}`} className={'breachCard'}>
        <div className={'cardHeader'}>
          <div style={{backgroundImage: `url(${item.LogoPath})`}} className={'cardLogo'}></div>
          <h3>{item.Name}</h3>
          <Tooltip title={item.IsVerified ? 'Verified' : 'Unverified'} arrow left>
            {item.IsVerified ? (<CheckCircleOutline />) : (<HelpOutline />)}
          </Tooltip>
        </div>
        <div>
          <div>{item.Title}</div>
          <div>{parse(item.Description)}</div>
        </div>
        <div className={'cardFooter'}>
          <div>Severity: {item.DataClasses.length < 5 ? severity[item.DataClasses.length] : 'Critical'}</div>
        </div>
      </div>
    )
  })
  return table
}

const App = () => {
  console.log('app render ------------------------ start')
  // I'm specifically choosing useContext over component composition because
  // composition could get gross sending data between multiple nested levels AND a few components on the same level.
  
  // At some point this could be redesigned to use either, but its an excuse for me to try useContext - update, I love useContext.
  // I think I hate material-ui though, at least until I don't have to hit documentation every 2 minutes
  const [breachData, setBreachData] = useState([])
  const [filter, setFilter] = useState({
    searchBy: '',
    severity: 0,
    sortBy: 'name_asc'
  })

  const data = breachData.filter((item) => {
    // handle checkbox, text search here
    console.log(filter)
    let returnVal = true
    if(filter.searchBy !== ""){
      returnVal = false
      if(item.Name.toLowerCase().indexOf(filter.searchBy.toLowerCase().trim()) !== -1){
        returnVal = true
      }
    } else {
      returnVal = true
    }

    // how many types of data were breached
    if(returnVal){
      returnVal = item.DataClasses.length >= filter.severity
    }

    return returnVal
  })
  
  const breachRef = { breachData, setBreachData }
  const filterRef = { filter, setFilter }

  useEffect(async () => {
    console.log('changing data')
    setBreachData(breachRef.breachData)
  }, [breachRef.breachData, filter])

  console.log(data)
  console.log('app render ------------------------ end')

  return (
    <BreachContext.Provider value={breachRef}>
      <FilterContext.Provider value={filterRef}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Grid
            container
            direction="column"
            justify="center"
            wrap="nowrap"
            alignItems="center"
            style={{minHeight:'100vh', paddingTop: '45vh'}}>

            <Grid 
              item
              direction="row">
              <CustomTextField />
              <SearchTextField />
              <SeverityFilter />
            </Grid>
            <Grid item>
              <div>
                {data.length > 0 &&
                  (<div style={{display: 'flex', flexDirection: 'column', flexWrap: 'no-wrap'}}>
                    <h2>
                      Breach Data
                    </h2>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100vw', flexWrap: 'no-wrap'}}>
                      {BreachTable(data)}
                    </div>
                  </div>)
                }
              </div>
            </Grid>
          </Grid>
        </ThemeProvider>
      </FilterContext.Provider>
    </BreachContext.Provider>
  )
}

export default App