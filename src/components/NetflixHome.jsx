import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NetflixHome.css';

const NetflixHome = () => {
  const [shows, setShows] = useState([]);
  const [featuredShow, setFeaturedShow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load shows data from JSON file
    fetch('/movies.json')
      .then(response => response.json())
      .then(data => {
        setShows(data.shows);
        
        // Extract unique categories
        const allGenres = data.shows.flatMap(show => show.genre);
        const uniqueGenres = [...new Set(allGenres)];
        setCategories(uniqueGenres);
        
        // Set a random featured show
        const randomIndex = Math.floor(Math.random() * data.shows.length);
        setFeaturedShow(data.shows[randomIndex]);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading shows:', error);
        setLoading(false);
      });
  }, []);

  // Group shows by genre
  const showsByGenre = {};
  shows.forEach(show => {
    show.genre.forEach(genre => {
      if (!showsByGenre[genre]) {
        showsByGenre[genre] = [];
      }
      if (!showsByGenre[genre].find(s => s.id === show.id)) {
        showsByGenre[genre].push(show);
      }
    });
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="netflix-container">
      <header className="netflix-header">
        <div className="netflix-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo" />
        </div>
        <nav className="netflix-nav">
          <ul>
            <li><a href="#home" className="active">Home</a></li>
            <li><a href="#tvshows">TV Shows</a></li>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#new">New & Popular</a></li>
            <li><a href="#mylist">My List</a></li>
          </ul>
        </nav>
        <div className="netflix-search">
          <input type="search" placeholder="Search" />
        </div>
      </header>

      {featuredShow && (
        <div className="featured-show" style={{ backgroundImage: `url(${featuredShow.imageUrl})` }}>
          <div className="featured-content">
            <h1>{featuredShow.title}</h1>
            <p className="featured-description">{featuredShow.description}</p>
            <div className="featured-details">
              <span className="rating">{featuredShow.rating}</span>
              <span>{featuredShow.releaseYear}</span>
              <span>{featuredShow.seasons} {featuredShow.seasons === 1 ? 'Season' : 'Seasons'}</span>
              {featuredShow.imdbRating && (
                <span className="imdb-feature-rating">
                  {/* IMDb logo hidden via CSS but keeping text for accessibility */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="imdb-logo-sm" />
                  IMDb: {featuredShow.imdbRating}
                </span>
              )}
            </div>
            <div className="featured-buttons">
              <Link to={`/show/${featuredShow.id}`} className="play-button">▶ Play</Link>
              <Link to={`/show/${featuredShow.id}`} className="more-info-button">ⓘ More Info</Link>
            </div>
          </div>
        </div>
      )}

      <div className="shows-container">
        {categories.map((genre) => {
          const genreShows = showsByGenre[genre];
          if (!genreShows || genreShows.length === 0) return null;
          
          return (
            <div className="category" key={genre} id={genre.toLowerCase().replace(/\s+/g, '-')}>
              <h2>{genre}</h2>
              <div className="show-row">
                {genreShows.map(show => (
                  <Link to={`/show/${show.id}`} key={`${genre}-${show.id}`} className="show-card">
                    {show.imdbRating && (
                      <div className="show-rating-badge">
                        {/* IMDb logo hidden via CSS */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="imdb-logo-xs" />
                        {show.imdbRating}
                      </div>
                    )}
                    <div className="quality-badge-sm">HD</div>
                    <div className="seasons-badge">{show.seasons} {show.seasons === 1 ? 'Season' : 'Seasons'}</div>
                    <img src={show.imageUrl} alt={show.title} />
                    <div className="show-info">
                      <h3>{show.title}</h3>
                      <div className="show-details">
                        <span>{show.rating}</span>
                        <span>{show.releaseYear}</span>
                      </div>
                      <p className="show-preview-description">{show.description.substring(0, 100)}...</p>
                      <div className="show-genres">
                        {show.genre.slice(0, 3).map((g, i) => (
                          <span key={i} className="genre-pill">{g}</span>
                        ))}
                      </div>
                    </div>
                    <div className="play-overlay">
                      <div className="play-icon">▶</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="netflix-footer">
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#help">Help Center</a>
          <a href="#terms">Terms of Use</a>
          <a href="#privacy">Privacy</a>
        </div>
        <p>© 2024 Netflix Demo</p>
      </footer>
    </div>
  );
};

export default NetflixHome; 