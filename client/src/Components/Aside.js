import React from 'react';
import SearchForm from './SearchForm';
import SongContainer from './Songs/SongContainer';

const Aside = ( {search,setSearch, searchResults, chooseTrack} ) => {
    return(
        <aside>
        
        <SearchForm search= {search} setSearch={setSearch} />

        <SongContainer searchResults={searchResults} chooseTrack={chooseTrack} />
    
        
    </aside>
    )
}

export default Aside;