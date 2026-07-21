"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Super Operations', path: '/dashboard/admin/super' },
    { name: 'Admissions CRM', path: '/dashboard/admin/admissions' },
    { name: 'Finance Engine', path: '/dashboard/admin/finance' },
    { name: 'HR & Assets', path: '/dashboard/admin/hr' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar Navigation */}
      <div className="glass-panel" style={{ width: '250px', padding: '20px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 5px 0', color: 'var(--primary-color, #10b981)' }}>ClgERP</h2>
          <p style={{ margin: '0', fontSize: '0.8rem', color: '#94a3b8' }}>Admin/Faculty Portal</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#cbd5e1',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <Link href="/login" style={{ color: '#ef4444', textDecoration: 'none', fontSize: '0.9rem' }}>Logout</Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
