import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in home-container">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Badge */}
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Smart Campus Maintenance & Incident Tracker
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Spot a problem on campus? <br />
          <span className="hero-gradient-text">
            Snap, Report, and Get it Fixed.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          CampusFix is the unified hub for students and faculty to report damaged infrastructure, broken equipment, safety hazards, and track real-time repairs.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-group">
          <Link to={user ? "/post" : "/login"} className="btn btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Report an Issue
          </Link>
          <Link to="/feed" className="btn btn-secondary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            View Live Feed
          </Link>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="glass-panel metrics-section">
        <div className="metrics-grid">
          <div>
            <div className="metric-number metric-emerald">24/7</div>
            <div className="metric-label">Campus Ops Response</div>
          </div>
          <div>
            <div className="metric-number metric-cyan">100%</div>
            <div className="metric-label">Transparent Feed</div>
          </div>
          <div>
            <div className="metric-number metric-purple">Instant</div>
            <div className="metric-label">Cloud ImageKit Sync</div>
          </div>
          <div>
            <div className="metric-number metric-amber">Role-Based</div>
            <div className="metric-label">Admin Management</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="workflow-section">
        <h2 className="section-title">How CampusFix Works</h2>
        <p className="section-subtitle">
          Three simple steps to make your campus safer, cleaner, and better maintained.
        </p>

        <div className="workflow-grid">
          <div className="glass-panel workflow-card">
            <div className="step-number step-emerald">
              1
            </div>
            <h3 className="workflow-card-title">Capture & Report</h3>
            <p className="workflow-card-desc">
              Take a quick photo of any broken chair, leaky pipe, flickering light, or hazardous walkway, then specify the exact building and room.
            </p>
          </div>

          <div className="glass-panel workflow-card">
            <div className="step-number step-cyan">
              2
            </div>
            <h3 className="workflow-card-title">Public Community Feed</h3>
            <p className="workflow-card-desc">
              All reports appear on the live campus feed so peers and department staff stay updated without duplicate submissions.
            </p>
          </div>

          <div className="glass-panel workflow-card">
            <div className="step-number step-purple">
              3
            </div>
            <h3 className="workflow-card-title">Campus Action & Fix</h3>
            <p className="workflow-card-desc">
              Campus administrators and repair technicians inspect the ticket, dispatch staff, and ensure your university environment remains top notch.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="glass-panel banner-section">
        <div className="banner-content">
          <div className="banner-text-col">
            <h2 className="banner-title">
              Empowering Students. Enhancing Campus Life.
            </h2>
            <p className="banner-desc">
              Whether you are in the engineering quad, library basement, or athletic facility, your voice helps keep our learning spaces pristine.
            </p>
          </div>
          <div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Join CampusFix Today →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
