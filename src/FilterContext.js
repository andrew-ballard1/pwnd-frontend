import React from 'react'

const FilterContext = React.createContext({
    filter: {searchBy: '', severity: 0, sortBy: 'name_asc'},
    setFilter: () => {}
})

export default FilterContext