import React, { useState } from "react";
import { quotes } from '../../assets/quotes';
import './Searchbar.css';

const Searchbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuotes, setDisplayedQuotes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllQuotes = () => {
    return Object.values(quotes).flat();
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;

    setIsSearchLoading(true);
    setError(null);
    try {
      const searchPool = selectedCategory === 'all' ? 
        getAllQuotes() : 
        quotes[selectedCategory] || [];

      const filtered = searchPool.filter((quote) =>
        quote.text.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        setError('No quotes found matching your search');
        setDisplayedQuotes([]);
      } else {
        
        const randomIndex = Math.floor(Math.random() * filtered.length);
        const randomQuote = filtered[randomIndex];
        setDisplayedQuotes([randomQuote]); 
      }
    } catch (error) {
      setError('Error searching quotes');
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleRandomQuote = () => {
    setIsRandomLoading(true);
    setError(null);
    try {
      const searchPool = selectedCategory === 'all' ? 
        getAllQuotes() : 
        quotes[selectedCategory] || [];
      
      const randomQuote = searchPool[Math.floor(Math.random() * searchPool.length)];
      setDisplayedQuotes([randomQuote]);
    } catch (error) {
      setError('Error generating random quote');
    } finally {
      setIsRandomLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="searchbar">
      <h2 className="search-heading">Search Your Favorite Quote</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search your quote"
          className="search-input"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button 
          className="search-bar-button" 
          onClick={handleSearchClick}
          disabled={!searchQuery.trim()}
        >
          {isSearchLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <button className="generate-button" onClick={handleRandomQuote}>
        {isRandomLoading ? 'Generating...' : 'Generate Random Quote'}
      </button>

      <div className="quotes-container">
        {error && <p className="error-message">{error}</p>}
        {(isSearchLoading || isRandomLoading) && <p className="loading">Loading...</p>}

        {!isSearchLoading && !isRandomLoading && displayedQuotes.length === 0 && searchQuery && (
          <p className="no-results">No quotes found for "{searchQuery}"</p>
        )}

        {displayedQuotes.map((quote, index) => (
          <div key={index} className="quote-card">
            <p className="quote-text">"{quote.text}"</p>
            <p className="quote-author">- {quote.author || 'Unknown'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Searchbar;
