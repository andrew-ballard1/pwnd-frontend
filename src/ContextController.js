import React from 'react'

const BreachContext = React.createContext({
    breachData: [],
    setBreachData: () => {}
})

const FilterContext = React.createContext({
    filter: {searchBy: '', severity: 0, sortBy: 'name_asc'},
    setFilter: () => {}
})

export default {BreachContext, FilterContext}