import React, {useState} from 'react';
import '../styles/SearchBar.scss';

const SearchBar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        //Search logic
        console.log('Searching for:', searchQuery);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input type="text" placeholder="Search..." value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}/>
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
};

export default SearchBar;