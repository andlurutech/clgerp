"use client";

export default function DashboardHome() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner & Stats */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 2,
          minWidth: '300px',
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          borderRadius: '24px',
          padding: '32px',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.4)'
        }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Welcome back, Punith! 👋</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', lineHeight: '1.5' }}>
            You have 2 classes today and 1 assignment pending.
          </p>
        </div>

        <div style={{
          flex: 1,
          minWidth: '200px',
          background: 'rgba(35, 35, 66, 0.7)',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            border: '4px solid #10b981', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            85%
          </div>
          <div style={{ fontWeight: '600' }}>Attendance</div>
          <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>Overall</div>
        </div>

        <div style={{
          flex: 1,
          minWidth: '200px',
          background: 'rgba(35, 35, 66, 0.7)',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold',
            marginBottom: '12px', color: '#a5b4fc'
          }}>
            8.5
          </div>
          <div style={{ fontWeight: '600' }}>CGPA</div>
          <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>Current</div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        
        {/* Left Column */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '400px' }}>
          
          {/* Today's Schedule */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#a5b4fc' }}>🕒</span> Today's Schedule
              </h2>
              <a href="#" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>View Full</a>
            </div>
            <div style={{
              background: 'rgba(35, 35, 66, 0.7)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(124,58,237,0.2)', padding: '8px 16px', borderRadius: '20px', color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600 }}>
                  09:00 AM
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Data Structures</div>
                  <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>Block C - 201</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>Lecture</div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(124,58,237,0.2)', padding: '8px 16px', borderRadius: '20px', color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600 }}>
                  11:00 AM
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Web Technologies</div>
                  <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>Lab 4</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>Practical</div>
              </div>
            </div>
          </div>

          {/* Pending Assignments */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#ec4899' }}>📖</span> Pending Assignments
              </h2>
            </div>
            <div style={{
              background: 'rgba(35, 35, 66, 0.7)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column', gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Linear Regression Code</div>
                  <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>Machine Learning</div>
                </div>
                <div style={{ color: '#ec4899', fontSize: '0.85rem', background: 'rgba(236,72,153,0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                  Tomorrow, 11:59 PM
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '300px' }}>
          
          {/* Happenings */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f43f5e' }}>ℹ️</span> Happenings
              </h2>
            </div>
            <div style={{
              background: 'rgba(35, 35, 66, 0.7)',
              borderRadius: '24px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600 }}>Mid-Term Examinations</div>
                  <div style={{ background: '#be185d', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>NEW</div>
                </div>
                <div style={{ color: '#a7a7cc', fontSize: '0.9rem', margin: '4px 0' }}>Schedule Released</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Oct 15</div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
              <div>
                <div style={{ fontWeight: 600 }}>TechFest 2026 Registrations</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>Oct 12</div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <a href="#" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.9rem' }}>View All Announcements</a>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
