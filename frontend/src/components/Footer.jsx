import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <div className="nav-logo-icon footer-logo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="footer-logo-text">Campus<span className="logo-accent">Fix</span></span>
            </div>
            <p className="footer-desc">
              Empowering students, faculty, and maintenance teams to collaborate and resolve campus infrastructure issues in real-time.
            </p>
          </div>

          <div className="footer-links-grid">
            <div>
              <h4 className="footer-heading">Platform</h4>
              <div className="footer-col-links">
                <Link to="/feed" className="footer-link">Campus Feed</Link>
                <Link to="/post" className="footer-link">Report Issue</Link>
                <Link to="/about" className="footer-link">Guidelines</Link>
              </div>
            </div>

            <div>
              <h4 className="footer-heading">Campus Ops</h4>
              <div className="footer-col-links">
                <span>Emergency: +1 (800) FIX-CAMPUS</span>
                <span>Security Desk: Block B-101</span>
                <span>Hours: 24/7 Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} CampusFix Network. All campus rights reserved.</span>
          <div className="footer-status">
            <span className="footer-status-dot"></span>
            <span>Campus Incident System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
