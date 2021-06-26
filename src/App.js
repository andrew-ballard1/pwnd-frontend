import React, {useEffect, useState, useContext} from 'react'
import BreachContext from './BreachContext'

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


const Input = () => {
  const [value, setValue] = useState('')
  const {setBreachData} = useContext(BreachContext)

  const handleKeyUp = async (event) => {
    if (event.key === 'Enter') {
      console.log('getting breach data')
      const breachData = await getBreach(value)
      setBreachData(breachData)
    } else {
      setValue(event.target.value)
    }
  }

  return <input type="text" onKeyUp={handleKeyUp} />
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
        <label>
          Enter an email
        </label>
        <Input />
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
      <AccountSubmit />
      <div>
        {breachData.length > 0 &&
          (<div>
            Breach Data
            {BreachTable(breachData)}
          </div>)
        }
      </div>
    </BreachContext.Provider>
  )
}

export default App