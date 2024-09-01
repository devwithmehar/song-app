import React , {useState} from 'react';

const SearchForm = ({search,setSearch} ) => {

    

    return(
        <form id="searchForm">
            <input
             id="search"
            name="search"
            type="text" 
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}  // update the search state on change
            placeholder="what you want to listen" />
            <label htmlFor='search' >
                <span className="material-symbols-outlined">
                    search
                </span>
            </label>
        </form>
    )
}

export default SearchForm;