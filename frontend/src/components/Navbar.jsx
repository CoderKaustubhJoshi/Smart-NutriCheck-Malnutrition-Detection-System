import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/screening', icon: '🔬', label: 'Screening' },
    { path: '/awareness', icon: '💡', label: 'Awareness' },
]

export default function Navbar() {
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()

    return (
        <>
            {/* Mobile overlay */}
            <motion.nav
                className="sidebar"
                animate={{ width: collapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {/* Logo */}
                <div className="sidebar-logo">
                    <motion.div className="logo-icon" animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <circle cx="16" cy="16" r="14" stroke="url(#g1)" strokeWidth="2" />
                            <circle cx="16" cy="12" r="5" fill="url(#g1)" opacity="0.9" />
                            <path d="M8 26c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="g1" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#00f5a0" />
                                    <stop offset="1" stopColor="#00c3e3" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="logo-text"
                            >
                                <span className="gradient-text" style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem' }}>
                                    Smart Nutricheck
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                                    Malnutrition Care Initiative
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button className="collapse-btn" onClick={() => setCollapsed(c => !c)}>
                        {collapsed ? '›' : '‹'}
                    </button>
                </div>

                {/* Nav Items */}
                <ul className="nav-list">
                    {navItems.map((item, i) => (
                        <motion.li
                            key={item.path}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                        >
                            <NavLink to={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon">{item.icon}</span>
                                <AnimatePresence>
                                    {!collapsed && (
                                        <motion.span
                                            className="nav-label"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {location.pathname === item.path && (
                                    <motion.div className="nav-active-bar" layoutId="activeBar" />
                                )}
                            </NavLink>
                        </motion.li>
                    ))}
                </ul>

                {/* Bottom badge */}
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            className="sidebar-footer"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        >
                            <div className="ai-badge">
                                <span>⚡</span>
                                <span>AI Powered</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <style>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          background: linear-gradient(180deg, #060e20 0%, #0a1628 100%);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 100;
          overflow: hidden;
          padding: 0;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 16px 20px;
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        .logo-icon { flex-shrink: 0; }
        .logo-text { flex: 1; min-width: 0; }
        .collapse-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          width: 24px; height: 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .collapse-btn:hover { color: var(--accent-cyan); border-color: var(--accent-cyan); }
        .nav-list {
          list-style: none;
          padding: 16px 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          position: relative;
        }
        .nav-item:hover {
          background: rgba(0, 195, 227, 0.08);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: rgba(0, 245, 160, 0.1);
          color: var(--accent-green);
          font-weight: 600;
        }
        .nav-icon { font-size: 1.2rem; flex-shrink: 0; }
        .nav-active-bar {
          position: absolute;
          right: 0; top: 6px; bottom: 6px;
          width: 3px;
          background: linear-gradient(var(--accent-green), var(--accent-cyan));
          border-radius: 4px;
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border);
        }
        .ai-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.8rem;
          color: #a78bfa;
          font-weight: 600;
        }
      `}</style>
        </>
    )
}
