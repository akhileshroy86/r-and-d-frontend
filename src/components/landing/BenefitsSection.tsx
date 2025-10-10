'use client';

export default function BenefitsSection() {
  const patientBenefits = [
    {
      icon: '🕐',
      iconColor: '#10b981',
      title: 'Minimal Waiting Time',
      description: 'Book time ranges instead of fixed slots and get real-time ETA updates.'
    },
    {
      icon: '👀',
      iconColor: '#10b981',
      title: 'Clear ETA Visibility',
      description: 'Always know where you stand in the queue and when your turn is coming.'
    },
    {
      icon: '🔒',
      iconColor: '#10b981',
      title: 'Secure Payments',
      description: 'Safe and convenient online payments with instant digital receipts.'
    },
    {
      icon: '⭐',
      iconColor: '#10b981',
      title: 'Verified Reviews',
      description: 'Read authentic patient reviews and make informed decisions about your healthcare.'
    },
    {
      icon: '🌐',
      iconColor: '#10b981',
      title: 'Multi-Language Support',
      description: 'Use the platform in your preferred language for better understanding.'
    }
  ];

  const hospitalBenefits = [
    {
      icon: '🏥',
      iconColor: '#8b5cf6',
      title: 'Unified System',
      description: 'Single platform for managing queues, payments, and operations efficiently.'
    },
    {
      icon: '📊',
      iconColor: '#8b5cf6',
      title: 'Advanced Analytics',
      description: 'Comprehensive insights into revenue, patient flow, and operational performance.'
    },
    {
      icon: '👥',
      iconColor: '#8b5cf6',
      title: 'Simple Staff Tools',
      description: 'Easy-to-use interfaces that require minimal training for staff adoption.'
    },
    {
      icon: '🤖',
      iconColor: '#8b5cf6',
      title: 'AI-Powered Efficiency',
      description: 'Automated patient routing and smart scheduling reduce manual work.'
    },
    {
      icon: '💰',
      iconColor: '#8b5cf6',
      title: 'Revenue Optimization',
      description: 'Maximize revenue with better patient flow and reduced no-shows.'
    }
  ];

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
            color: '#111827',
            marginBottom: '16px'
          }}>
            Benefits for Everyone
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#1f2937',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            HealthcareMS delivers value to patients, doctors, and hospital administrators
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px'
        }}>
          {/* For Patients */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>👤</span>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                For Patients
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {patientBenefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '20px' }}>{benefit.icon}</span>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {benefit.title}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#1f2937',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Hospitals */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f3e8ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>🏥</span>
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                For Hospitals
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {hospitalBenefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '20px' }}>{benefit.icon}</span>
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {benefit.title}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#1f2937',
                      lineHeight: '1.5',
                      margin: 0
                    }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}