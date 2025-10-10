'use client';

export default function FooterSection() {
  const footerLinks = {
    company: [
      'About Us',
      'Careers',
      'Press',
      'Contact',
      'Partners'
    ],
    resources: [
      'Help Center',
      'API Documentation',
      'Blog',
      'Case Studies',
      'Webinars'
    ],
    legal: [
      'Privacy Policy',
      'Terms of Service',
      'HIPAA Compliance',
      'Security',
      'Cookies'
    ]
  };

  const socialIcons = [
    { icon: '📘', name: 'Facebook' },
    { icon: '🐦', name: 'Twitter' },
    { icon: '💼', name: 'LinkedIn' },
    { icon: '📷', name: 'Instagram' }
  ];

  return (
    <footer style={{
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      padding: '60px 0 30px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '60px',
          marginBottom: '50px'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>🏥</span>
              </div>
              <span style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                HealthcareMS
              </span>
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '30px',
              maxWidth: '300px'
            }}>
              Revolutionizing healthcare appointments with AI-powered booking, real-time queue management, and seamless payment integration.
            </p>
            <div style={{
              display: 'flex',
              gap: '16px'
            }}>
              {socialIcons.map((social, index) => (
                <div key={index} style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#334155',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}>
                  <span style={{ fontSize: '18px' }}>{social.icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }}>
              Company
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {footerLinks.company.map((link, index) => (
                <a key={index} href="#" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }}>
              Resources
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {footerLinks.resources.map((link, index) => (
                <a key={index} href="#" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px'
            }}>
              Legal
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {footerLinks.legal.map((link, index) => (
                <a key={index} href="#" style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid #334155',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            © 2024 HealthcareMS. All rights reserved. Made with <span style={{ color: '#ef4444' }}>❤️</span> for better healthcare.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#10b981'
            }}>
              <span>🛡️</span>
              HIPAA Compliant
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#3b82f6'
            }}>
              <span>🔒</span>
              SSL Secured
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}