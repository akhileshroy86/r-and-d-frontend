'use client';

interface FeaturesSectionProps {
  onOpenLoginModal: (userType: 'patient' | 'doctor' | 'staff' | 'admin') => void;
}

export default function FeaturesSection({ onOpenLoginModal }: FeaturesSectionProps) {
  return (
    <>
      {/* Feature Cards Section */}
      <div style={{
        padding: '80px 0 40px 0',
        backgroundColor: 'white',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Section Header */}
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
              Key Features
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#1f2937',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Comprehensive healthcare management platform designed for modern hospitals and clinics
            </p>
          </div>
          
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {/* Multi-Language Support Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#e0e7ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#4f46e5' }}>🌐</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Multi-Language Support
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Telugu, Hindi, English support with more languages coming soon. Breaking language barriers in healthcare.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>Telugu</span>
              <span style={{
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>Hindi</span>
              <span style={{
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500'
              }}>English</span>
            </div>
          </div>

          {/* AI Voice Booking Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#16a34a' }}>🎤</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              AI Voice Booking
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Speak your symptoms and let AI suggest the right department and doctor. No more confusion or wrong appointments.
            </p>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              borderLeft: '4px solid #10b981'
            }}>
              <p style={{ fontStyle: 'italic', color: '#4b5563', fontSize: '14px', marginBottom: '8px' }}>
                "I have chest pain and breathing issues"
              </p>
              <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>
                → Suggests: Cardiology Dept.
              </p>
            </div>
          </div>

          {/* Smart Queue Engine Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#2563eb' }}>⏰</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Smart Queue Engine
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Book time ranges instead of fixed slots. Get live ETA updates and track your position in real-time.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>Your Position:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb' }}>3rd in queue</p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>ETA:</p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a' }}>~15 mins</p>
              </div>
            </div>
          </div>

          {/* Seamless Payments Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#f3e8ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#9333ea' }}>💳</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Seamless Payments
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Integrated Razorpay and UPI payments with automatic booking ID mapping and receipt generation.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                backgroundColor: '#ff6b35',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                💳 Cards
              </div>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📱 UPI
              </div>
            </div>
          </div>

          {/* Operational Dashboards Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#d97706' }}>📊</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Operational Dashboards
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Comprehensive dashboards for doctors, staff, and admins with real-time insights and day-to-day management tools.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => onOpenLoginModal('doctor')}
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                👨⚕️ Doctor
              </button>
              <button 
                onClick={() => onOpenLoginModal('staff')}
                style={{
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                👥 Staff
              </button>
              <button 
                onClick={() => onOpenLoginModal('admin')}
                style={{
                  backgroundColor: '#f3e8ff',
                  color: '#9333ea',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {/* Reviews & Analytics Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#fecaca',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <span style={{ fontSize: '24px', color: '#dc2626' }}>⭐</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#111827' }}>
              Reviews & Analytics
            </h3>
            <p style={{ color: '#1f2937', lineHeight: '1.6', marginBottom: '20px' }}>
              Patient rating system for trust building and comprehensive revenue/operational analytics for administrators.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(star => (
                  <span key={star} style={{ color: '#fbbf24', fontSize: '16px' }}>⭐</span>
                ))}
              </div>
              <span style={{ fontWeight: 'bold', color: '#111827' }}>4.8/5</span>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>(2,847 reviews)</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      {/* How It Works Section */}
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
          {/* Section Header */}
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
              How It Works
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#1f2937',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Simple 5-step process that transforms the patient experience
            </p>
          </div>
          
          {/* Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            alignItems: 'start'
          }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#6366f1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: 'white' }}>🎤</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px'
              }}>
                1. Speak/Type Symptoms
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                Describe your health concerns in your preferred language using voice or text input.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: 'white' }}>🧠</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px'
              }}>
                2. AI Suggests Department
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                Our AI analyzes symptoms and recommends the most suitable department and available doctors.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: 'white' }}>📅</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px'
              }}>
                3. Pick Time Range
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                Select a flexible time range that works for you instead of rigid appointment slots.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#8b5cf6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: 'white' }}>💳</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px'
              }}>
                4. Pay & Join Queue
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                Secure online payment via Razorpay/UPI and automatic entry into the smart queue system.
              </p>
            </div>

            {/* Step 5 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#dc2626',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
              }}>
                <span style={{ fontSize: '32px', color: 'white' }}>👁️</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '12px'
              }}>
                5. Track Real-Time ETA
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#1f2937',
                lineHeight: '1.5'
              }}>
                Monitor your queue position and estimated arrival time until it's your turn to see the doctor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}