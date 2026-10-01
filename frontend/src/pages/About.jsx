import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="animate-fade-in about-container">
      {/* Title */}
      <div className="about-header">
        <h1 className="about-title">About CampusFix</h1>
        <p className="about-subtitle">
          Bridging the gap between university students and campus maintenance operations for a modern, safe educational environment.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-panel about-panel">
        <h2 className="about-panel-title-primary">
          Our Mission
        </h2>
        <p className="about-text">
          Traditional university work orders often get lost in email chains or delayed paperwork. <strong>CampusFix</strong> delivers an open, real-time platform where any campus resident or visitor can flag broken infrastructure, electrical hazards, plumbing failures, and broken learning equipment directly to the facility team with visual proof.
        </p>
      </div>

      {/* Best Practices */}
      <div className="glass-panel about-panel">
        <h2 className="section-title">
          Reporting Guidelines & Best Practices
        </h2>
        
        <div className="guidelines-grid">
          <div className="guideline-card">
            <div className="guideline-title">📸 Clear Photos</div>
            <p className="guideline-desc">
              Ensure photos are well-lit and show both the damaged item and its immediate surrounding context.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-title">📍 Exact Location</div>
            <p className="guideline-desc">
              Specify the Block, Floor, and Room number or prominent landmarks to help technicians locate it swiftly.
            </p>
          </div>

          <div className="guideline-card">
            <div className="guideline-title">⚠️ Correct Urgency</div>
            <p className="guideline-desc">
              Use <em>Hazardous/Critical</em> solely for imminent safety threats (sparks, major leaks, blocked fire exits).
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="glass-panel emergency-panel">
        <h2 className="emergency-title">
          Emergency Protocol
        </h2>
        <p className="emergency-desc">
          If you encounter an active fire, medical emergency, gas leak, or security threat, please dial campus emergency services immediately rather than filing a web ticket.
        </p>

        <div className="emergency-contacts-row">
          <div className="emergency-contact-chip">
            🚨 <strong>Campus Emergency:</strong> ext. 911 / (800) 555-0199
          </div>
          <div className="emergency-contact-chip">
            ⚡ <strong>Facilities Dispatch:</strong> ext. 4357 (HELP)
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="about-bottom-cta">
        <Link to="/feed" className="btn btn-primary btn-lg">
          Browse Live Campus Feed →
        </Link>
      </div>
    </div>
  );
};

export default About;
