'use client';

export default function PlatformScreensSection() {
  const dashboards = [
    {
      title: 'Patient Dashboard',
      description: 'Comprehensive patient portal with appointment booking, queue tracking, payment history, and doctor reviews all in one place.',
      color: '#6366f1',
      features: [
        'Voice-enabled symptom input',
        'Real-time queue position tracking', 
        'Digital receipts and payment history',
        'Doctor ratings and reviews'
      ]
    },
    {
      title: 'Doctor Dashboard',
      description: 'Streamlined doctor interface for managing daily appointments, patient queue, and consultation notes with efficiency.',
      color: '#059669',
      features: [
        'Daily appointment queue management',
        'Patient history and consultation notes',
        'Mark consultations complete',
        'Schedule follow-up appointments'
      ]
    },
    {
      title: 'Staff Reception Dashboard',
      description: 'Complete reception management system for handling appointments, walk-ins, queue coordination, and daily operations.',
      color: '#dc2626',
      features: [
        'Appointment and walk-in management',
        'Real-time queue coordination',
        'Shift opening and closing',
        'Daily reports and PDF generation'
      ]
    },
    {
      title: 'Admin Analytics Dashboard',
      description: 'Comprehensive analytics and reporting dashboard for hospital administrators with revenue insights and operational metrics.',
      color: '#7c3aed',
      features: [
        'Revenue analytics by doctor/department',
        'Patient flow and trend analysis',
        'Export reports (PDF/Excel/CSV)',
        'Performance metrics dashboard'
      ]
    }
  ];

  const getPreview = (index: number, color: string) => {
    const previews = [
      // Patient Dashboard Preview
      <div key="patient" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        height: '350px',
        border: '1px solid #374151'
      }}>
        <div style={{
          background: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          height: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #374151' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#6366f1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>👤</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Patient Dashboard</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', border: '1px solid #4b5563' }}>
                <div style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '4px' }}>Next Appointment</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Dr. Smith - 2:30 PM</div>
              </div>
              <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', border: '1px solid #4b5563' }}>
                <div style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '4px' }}>Queue Position</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>3rd in line</div>
              </div>
            </div>
            <div style={{ background: '#6366f1', borderRadius: '8px', padding: '16px', color: 'white' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>Health Score</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>92%</div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                <div style={{ width: '92%', height: '100%', background: 'white', borderRadius: '2px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Doctor Dashboard Preview
      <div key="doctor" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        height: '350px',
        border: '1px solid #374151'
      }}>
        <div style={{
          background: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          height: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #374151' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>👨⚕️</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Doctor Dashboard</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', flex: 1 }}>
            <div>
              <div style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '12px', fontWeight: '500' }}>Today's Appointments</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['John Doe - 9:00 AM', 'Jane Smith - 10:30 AM', 'Mike Johnson - 2:00 PM'].map((appointment, i) => (
                  <div key={i} style={{ background: '#374151', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', color: '#ffffff', border: '1px solid #4b5563' }}>
                    {appointment}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#059669', borderRadius: '8px', padding: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>12</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>Patients Today</div>
              </div>
              <div style={{ background: '#374151', borderRadius: '8px', padding: '12px', textAlign: 'center', border: '1px solid #4b5563' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>4</div>
                <div style={{ fontSize: '10px', color: '#d1d5db' }}>Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Staff Reception Dashboard Preview
      <div key="staff" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        height: '350px',
        border: '1px solid #374151'
      }}>
        <div style={{
          background: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          height: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #374151' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>👩💼</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Reception Dashboard</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>24</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Check-ins</div>
            </div>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>8</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Waiting</div>
            </div>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>16</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Completed</div>
            </div>
          </div>
          <div style={{ background: '#dc2626', borderRadius: '8px', padding: '16px', color: 'white', flex: 1 }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '8px' }}>Queue Status</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Now Serving</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Token #A-15</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>Next: A-16</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Est. 5 min</div>
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Admin Analytics Dashboard Preview
      <div key="admin" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        height: '350px',
        border: '1px solid #374151'
      }}>
        <div style={{
          background: '#1f2937',
          borderRadius: '12px',
          padding: '20px',
          height: '100%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #374151' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#7c3aed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>📊</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>Analytics Dashboard</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>$45.2K</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Revenue</div>
            </div>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>1,247</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Patients</div>
            </div>
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #4b5563' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>94.5%</div>
              <div style={{ fontSize: '10px', color: '#d1d5db' }}>Satisfaction</div>
            </div>
          </div>
          <div style={{ background: '#7c3aed', borderRadius: '8px', padding: '16px', color: 'white', flex: 1 }}>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px' }}>Monthly Performance</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '60px' }}>
              {[40, 65, 45, 80, 60, 90, 75, 85].map((height, i) => (
                <div key={i} style={{ width: '12px', height: `${height}%`, background: 'rgba(255,255,255,0.8)', borderRadius: '2px' }}></div>
              ))}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px', textAlign: 'center' }}>Revenue trend showing 15% growth</div>
          </div>
        </div>
      </div>
    ];

    return previews[index];
  };

  return (
    <div style={{
      padding: '80px 0',
      backgroundColor: '#f8fafc',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '16px'
          }}>
            Platform Screens
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore our intuitive interfaces designed for every user type
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {dashboards.map((dashboard, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: index % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
              gap: '60px',
              alignItems: 'center'
            }}>
              {index % 2 === 0 ? (
                <>
                  <div>
                    <h3 style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: dashboard.color,
                      marginBottom: '20px'
                    }}>
                      {dashboard.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '16px',
                      color: '#1f2937',
                      lineHeight: '1.6',
                      marginBottom: '30px'
                    }}>
                      {dashboard.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dashboard.features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                          <span style={{ color: '#1f2937', fontSize: '14px' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {getPreview(index, dashboard.color)}
                </>
              ) : (
                <>
                  {getPreview(index, dashboard.color)}
                  <div>
                    <h3 style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: dashboard.color,
                      marginBottom: '20px'
                    }}>
                      {dashboard.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '16px',
                      color: '#1f2937',
                      lineHeight: '1.6',
                      marginBottom: '30px'
                    }}>
                      {dashboard.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {dashboard.features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                          <span style={{ color: '#1f2937', fontSize: '14px' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}