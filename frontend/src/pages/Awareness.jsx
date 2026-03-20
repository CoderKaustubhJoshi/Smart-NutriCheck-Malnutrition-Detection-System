import { motion } from 'framer-motion'

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }

const globalStats = [
    { icon: '👶', num: '149M', label: 'children stunted globally', color: '#00c3e3', src: 'WHO 2023' },
    { icon: '⚡', num: '45M', label: 'children wasted (acute)', color: '#f97316', src: 'UNICEF 2023' },
    { icon: '💀', num: '3.1M', label: 'child deaths linked to malnutrition/yr', color: '#ef4444', src: 'WHO' },
    { icon: '🌍', num: '1 in 3', label: 'children malnourished worldwide', color: '#fbbf24', src: 'UNICEF' },
]

const types = [
    {
        icon: '📉',
        title: 'Stunting',
        desc: 'Low height-for-age due to chronic malnutrition. Affects long-term cognitive development and future earning potential.',
        tag: 'Chronic',
        color: '#00c3e3',
    },
    {
        icon: '🪶',
        title: 'Wasting',
        desc: 'Low weight-for-height. A sign of acute malnutrition — children can deteriorate rapidly and face a higher risk of death.',
        tag: 'Acute',
        color: '#f97316',
    },
    {
        icon: '⚖️',
        title: 'Underweight',
        desc: 'Low weight-for-age. Can reflect both stunting and wasting — often used as a composite indicator.',
        tag: 'Composite',
        color: '#fbbf24',
    },
    {
        icon: '💊',
        title: 'Micronutrient Deficiency',
        desc: 'Lack of essential vitamins & minerals (iron, vitamin A, iodine). Called "hidden hunger" — often no visible symptoms.',
        tag: 'Hidden',
        color: '#7c3aed',
    },
]

const warningSigns = [
    '🔴 Visible weight loss or swollen limbs/abdomen',
    '🔴 Growth that is noticeably below average',
    '🔴 Persistent fatigue, apathy, or irritability',
    '🔴 Pale or dry skin, brittle hair and nails',
    '🔴 Slow healing of wounds and frequent illness',
    '🔴 Delayed development of motor/cognitive skills',
]

const prevention = [
    { icon: '🤱', title: 'Exclusive Breastfeeding', desc: 'For the first 6 months — provides all essential nutrients.' },
    { icon: '🥦', title: 'Diverse, Nutritious Diet', desc: 'Include proteins, vegetables, fruits, and fortified foods.' },
    { icon: '🏥', title: 'Regular Health Check-ups', desc: 'Growth monitoring and early detection saves lives.' },
    { icon: '💧', title: 'Clean Water & Sanitation', desc: 'Prevents diarrheal diseases that worsen malnutrition.' },
    { icon: '💉', title: 'Immunization', desc: 'Reduces infection burden that depletes nutritional stores.' },
    { icon: '📚', title: 'Parental Education', desc: 'Awareness about feeding practices is critical for prevention.' },
]

export default function Awareness() {
    return (
        <motion.div
            key="awareness"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            style={{ padding: '48px 40px 80px', minHeight: '100vh' }}
        >
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="section-tag">💡 Education & Awareness</span>
                <h1 style={{ fontFamily: 'Outfit', fontSize: '2.2rem', fontWeight: 800, margin: '12px 0 8px' }}>
                    Understanding <span className="gradient-text">Malnutrition</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: 48, maxWidth: 600 }}>
                    Knowledge is the first step to action. Learn the facts, signs, and solutions to child malnutrition.
                </p>
            </motion.div>

            {/* ═══ Global Stats ═══════════════════════════════════════ */}
            <section style={{ marginBottom: 60 }}>
                <motion.h2
                    className="section-heading"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                >🌍 Global Impact</motion.h2>
                <motion.div
                    className="aw-stats-grid"
                    variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                >
                    {globalStats.map((s, i) => (
                        <motion.div key={i} variants={fadeUp} className="glass-card aw-stat-card" whileHover={{ y: -5, borderColor: s.color }}>
                            <div className="aw-stat-icon" style={{ background: `${s.color}18` }}>{s.icon}</div>
                            <div className="aw-stat-num" style={{ color: s.color }}>{s.num}</div>
                            <div className="aw-stat-label">{s.label}</div>
                            <div className="aw-stat-src">Source: {s.src}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══ Types of Malnutrition ══════════════════════════════ */}
            <section style={{ marginBottom: 60 }}>
                <motion.h2 className="section-heading" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    📂 Types of Malnutrition
                </motion.h2>
                <motion.div
                    className="types-grid"
                    variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                >
                    {types.map((t, i) => (
                        <motion.div key={i} variants={fadeUp} className="glass-card type-card" whileHover={{ y: -5 }}
                            style={{ borderTop: `3px solid ${t.color}` }}>
                            <div className="type-icon">{t.icon}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.title}</h3>
                                <span className="type-tag" style={{ background: `${t.color}22`, color: t.color }}>{t.tag}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{t.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══ Warning Signs + Prevention ════════════════════════ */}
            <div className="warn-prev-grid">
                {/* Warning signs */}
                <motion.div
                    className="glass-card warn-card"
                    initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, color: '#ef4444' }}>
                        🚨 Warning Signs
                    </h2>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {warningSigns.map((s, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                            >
                                {s}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Prevention */}
                <motion.div
                    className="glass-card"
                    initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    style={{ padding: 32 }}
                >
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, color: 'var(--accent-green)' }}>
                        ✅ Prevention & Treatment
                    </h2>
                    <div className="prev-grid">
                        {prevention.map((p, i) => (
                            <motion.div
                                key={i}
                                className="prev-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ background: 'rgba(0, 245, 160, 0.06)' }}
                            >
                                <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{p.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{p.desc}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ═══ CTA ═══════════════════════════════════════════════ */}
            <motion.div
                className="glass-card cta-block"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                style={{ marginTop: 48 }}
            >
                <div className="cta-glow" />
                <span style={{ fontSize: '3rem' }}>💬</span>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 700, margin: '16px 0 10px' }}>
                    Have Questions? Ask Our AI Medical Expert
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 500, textAlign: 'center', lineHeight: 1.7 }}>
                    Use the chat button in the bottom-right corner to ask our AI medical expert anything about malnutrition, nutrition, or child health.
                </p>
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="pulse-dot-green" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>AI Expert Online</span>
                </div>
            </motion.div>

            <style>{`
        .section-heading {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
          font-family: 'Outfit', sans-serif;
        }
        .aw-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .aw-stat-card {
          padding: 28px 20px;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s;
          cursor: default;
        }
        .aw-stat-icon {
          width: 52px; height: 52px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem;
          margin: 0 auto 14px;
        }
        .aw-stat-num { font-size: 2rem; font-weight: 800; font-family: 'Outfit', sans-serif; margin-bottom: 6px; }
        .aw-stat-label { font-size: 0.83rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4; }
        .aw-stat-src { font-size: 0.7rem; color: var(--text-muted); }
        .types-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .type-card { padding: 28px 22px; }
        .type-icon { font-size: 2rem; margin-bottom: 14px; }
        .type-tag {
          font-size: 0.68rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.5px;
        }
        .warn-prev-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .warn-card { padding: 32px; }
        .prev-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .prev-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 12px;
          border-radius: var(--radius-sm);
          transition: background 0.2s;
          cursor: default;
        }
        .cta-block {
          padding: 48px 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, rgba(0, 245, 160, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .pulse-dot-green {
          width: 10px; height: 10px;
          background: var(--accent-green);
          border-radius: 50%;
          animation: pulse-glow 1.5s infinite;
        }
        @media (max-width: 1100px) {
          .aw-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .types-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .warn-prev-grid { grid-template-columns: 1fr; }
          .prev-grid { grid-template-columns: 1fr; }
          .aw-stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
        </motion.div>
    )
}
