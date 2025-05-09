import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ShowDetail.css';

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Fetch show data from JSON file
    fetch('/movies.json')
      .then(response => response.json())
      .then(data => {
        const foundShow = data.shows.find(s => s.id === parseInt(id, 10));
        setShow(foundShow);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading show details:', error);
        setLoading(false);
      });

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const getTrailerEmbedUrl = (url) => {
    if (!url) return '';
    // Convert YouTube URL to embed URL
    const videoId = url.split('v=')[1]?.split('&')[0];
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0`;
  };

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="not-found">
        <h2>Show not found</h2>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="show-detail-container">
      {showTrailer && (
        <div className="trailer-overlay" onClick={closeTrailer}>
          <div className="trailer-container" onClick={e => e.stopPropagation()}>
            <button className="close-trailer" onClick={closeTrailer}>×</button>
            <iframe 
              title={`${show.title} Trailer`}
              width="100%" 
              height="100%" 
              src={getTrailerEmbedUrl(show.trailerUrl)}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="show-backdrop" style={{ backgroundImage: `url(${show.imageUrl})` }}>
        <div className="overlay"></div>
        <Link to="/" className="back-link">
          <span>←</span> Back to Browse
        </Link>
      </div>

      <div className="show-content">
        <div className="show-header">
          <h1>{show.title}</h1>
          <div className="show-meta">
            <span className="show-rating">{show.rating}</span>
            <span className="show-year">{show.releaseYear}</span>
            <span className="show-seasons">{show.seasons} {show.seasons === 1 ? 'Season' : 'Seasons'}</span>
            {show.imdbRating && (
              <span className="imdb-rating">
                {/* IMDb logo hidden via CSS but keeping text for accessibility */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="imdb-logo" />
                IMDb: {show.imdbRating}
              </span>
            )}
          </div>
        </div>

        <div className="show-details-container">
          <div className="show-poster">
            <img src={show.imageUrl} alt={show.title} />
            <div className="quality-badge">HD</div>
          </div>
          
          <div className="show-info-container">
            <div className="show-description">
              <p>{show.description}</p>
            </div>
            
            <div className="show-creator">
              <span className="detail-label">Creator:</span> {show.creator}
            </div>
            
            <div className="show-cast">
              <span className="detail-label">Starring:</span> {show.starring.join(', ')}
            </div>
            
            <div className="show-genres">
              <span className="detail-label">Genres:</span> {show.genre.join(', ')}
            </div>
            
            <div className="action-buttons">
              <button className="play-button">▶ Play</button>
              <button className="trailer-button" onClick={handlePlayTrailer}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="trailer-icon">
                  <path d="M22 8.5V15.5C22 17.97 19.97 20 17.5 20H6.5C4.03 20 2 17.97 2 15.5V8.5C2 6.03 4.03 4 6.5 4H17.5C19.97 4 22 6.03 22 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.75 12V10.8L10.75 11.4L11.75 12L10.75 12.6L9.75 13.2V12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.25 8.5V15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Trailer
              </button>
              <button className="add-list-button">+ My List</button>
            </div>
          </div>
        </div>

        <div className="show-additional-info">
          <div className="info-section">
            <h3>About {show.title}</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Release Year</span>
                <span className="info-value">{show.releaseYear}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rating</span>
                <span className="info-value">{show.rating}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Seasons</span>
                <span className="info-value">{show.seasons}</span>
              </div>
              {show.imdbRating && (
                <div className="info-item">
                  <span className="info-label">IMDb Rating</span>
                  <span className="info-value">{show.imdbRating}/10</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="similar-shows">
          <h2>Similar Shows</h2>
          <div className="similar-shows-message">
            <p>Recommendations based on your watch history are coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail; 