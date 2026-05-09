import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getBosses, saveBattleResult } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function BattleArena() {
  const { user, updateUser } = useAuth();
  const [bosses, setBosses] = useState([]);
  const [currentBoss, setCurrentBoss] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [bossHP, setBossHP] = useState(0);
  const [log, setLog] = useState([]);
  const [phase, setPhase] = useState('select'); // select | fight | victory | defeat
  const [defending, setDefending] = useState(false);
  const [btnsDisabled, setBtnsDisabled] = useState(false);
  const [turns, setTurns] = useState(0);
  const logRef = useRef(null);

  useEffect(() => { fetchBosses(); }, []);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const fetchBosses = async () => {
    try {
      const { data } = await getBosses();
      setBosses(data.bosses);
    } catch { toast.error('Could not load bosses'); }
  };

  const addLog = (msg, type) => setLog((prev) => [...prev, { msg, type, id: Date.now() + Math.random() }]);

  const startBattle = (boss) => {
    setCurrentBoss(boss);
    setPlayerHP(100);
    setBossHP(boss.maxHp);
    setLog([{ msg: `⚔️ ${boss.name} appears! The battle begins!`, type: 'system', id: 1 }]);
    setPhase('fight');
    setTurns(0);
    setDefending(false);
    setBtnsDisabled(false);
  };

  const battleAction = async (action) => {
    if (!currentBoss || btnsDisabled) return;
    setBtnsDisabled(true);
    setDefending(false);

    let playerDmg = 0;
    let isDefend = false;
    let newTurns = turns + 1;
    setTurns(newTurns);

    let newBossHP = bossHP;
    let newPlayerHP = playerHP;

    if (action === 'attack') {
      playerDmg = Math.floor(Math.random() * 20) + 15;
      addLog(`⚔️ You strike for ${playerDmg} damage!`, 'player');
    } else if (action === 'skill') {
      playerDmg = Math.floor(Math.random() * 35) + 30;
      addLog(`✨ SKILL SHOT! Critical hit for ${playerDmg} damage!`, 'player');
    } else if (action === 'defend') {
      isDefend = true;
      setDefending(true);
      addLog('🛡️ You take a defensive stance! Damage reduced!', 'player');
    } else if (action === 'item') {
      const heal = Math.floor(Math.random() * 20) + 20;
      newPlayerHP = Math.min(100, newPlayerHP + heal);
      setPlayerHP(newPlayerHP);
      addLog(`🧪 Used Health Potion! Restored ${heal} HP!`, 'player');
    }

    newBossHP = Math.max(0, newBossHP - playerDmg);
    setBossHP(newBossHP);

    if (newBossHP <= 0) {
      addLog(`💥 ${currentBoss.name} is DEFEATED!`, 'system');
      setTimeout(async () => {
        setPhase('victory');
        try {
          const { data } = await saveBattleResult({ bossId: currentBoss._id, result: 'victory', turnsPlayed: newTurns, playerHpRemaining: newPlayerHP });
          updateUser(data.user);
          toast.success(`🏆 Victory! +${data.rewards.xp} XP +${data.rewards.gold}🪙`);
        } catch { toast.error('Could not save battle result'); }
      }, 600);
      return;
    }

    setTimeout(() => {
      let bossDmg = Math.floor(Math.random() * currentBoss.attack) + 5;
      if (isDefend) bossDmg = Math.floor(bossDmg * 0.25);
      newPlayerHP = Math.max(0, newPlayerHP - bossDmg);
      setPlayerHP(newPlayerHP);
      addLog(`👿 ${currentBoss.name} attacks for ${bossDmg} damage!`, 'boss');

      const taunts = ['Your code has memory leaks!', 'Your Big O is terrible!', 'SEGFAULT! CORE DUMPED!', 'Your merge conflicts are showing!'];
      if (Math.random() < 0.3) addLog(`💬 "${taunts[Math.floor(Math.random() * taunts.length)]}"`, 'boss');

      if (newPlayerHP <= 0) {
        addLog('💀 You have been defeated!', 'system');
        setTimeout(async () => {
          setPhase('defeat');
          try { await saveBattleResult({ bossId: currentBoss._id, result: 'defeat', turnsPlayed: newTurns, playerHpRemaining: 0 }); } catch {}
        }, 600);
        return;
      }
      setBtnsDisabled(false);
    }, 700);
  };

  const exitBattle = () => { setPhase('select'); setCurrentBoss(null); fetchBosses(); };

  const playerPct = Math.max(0, playerHP);
  const bossPct = currentBoss ? Math.max(0, Math.round((bossHP / currentBoss.maxHp) * 100)) : 100;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="page-title">⚔️ Battle Arena</div>
        <div className="page-sub">Face the bosses that stand between you and your dream job.</div>
      </div>

      {/* BOSS SELECT */}
      {phase === 'select' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {bosses.map((boss) => {
            const hpPct = Math.round((boss.maxHp / boss.maxHp) * 100);
            return (
              <motion.div key={boss._id} whileHover={{ y: -4 }} onClick={() => startBattle(boss)}
                style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: 16, padding: '1.5rem', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--blue)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border2)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem', display: 'block', animation: 'none' }}>{boss.emoji}</div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{boss.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1rem' }}>{boss.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 3, fontFamily: "'Share Tech Mono', monospace" }}>
                  <span>HP</span><span>{boss.maxHp}/{boss.maxHp}</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--red), #ff6b6b)', borderRadius: 4 }} />
                </div>
                <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--gold)', fontFamily: "'Share Tech Mono', monospace" }}>
                  ⚔️ Required: {boss.requiredSkill}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--blue2)', fontFamily: "'Share Tech Mono', monospace", marginTop: 4 }}>
                  Victory: +{boss.xpReward} XP + {boss.goldReward}🪙
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* FIGHT */}
      {phase === 'fight' && currentBoss && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            {/* HP Bars */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>{user?.avatar || '🧙'}</div>
                <div style={{ fontWeight: 700 }}>{user?.username}</div>
                <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', margin: '6px 0' }}>
                  <div style={{ width: playerPct + '%', height: '100%', background: 'linear-gradient(90deg, var(--green), #6ee7b7)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: "'Share Tech Mono', monospace" }}>HP: {Math.max(0, playerHP)}/100</div>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '2rem', fontWeight: 900, color: 'var(--red)', padding: '0 1.5rem' }}>VS</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>{currentBoss.emoji}</div>
                <div style={{ fontWeight: 700 }}>{currentBoss.name}</div>
                <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', margin: '6px 0' }}>
                  <div style={{ width: bossPct + '%', height: '100%', background: 'linear-gradient(90deg, var(--red), #ff6b6b)', borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text3)', fontFamily: "'Share Tech Mono', monospace" }}>HP: {Math.max(0, bossHP)}/{currentBoss.maxHp}</div>
              </div>
            </div>

            {/* Battle Log */}
            <div ref={logRef} style={{ background: 'var(--bg3)', borderRadius: 10, padding: '1rem', height: 150, overflowY: 'auto', marginBottom: '1rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem' }}>
              {log.map((entry) => (
                <div key={entry.id} style={{ marginBottom: 4, color: entry.type === 'player' ? 'var(--blue2)' : entry.type === 'boss' ? 'var(--red)' : 'var(--gold)' }}>
                  {entry.msg}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {[
                { action: 'attack', label: '⚔️ ATTACK', color: 'var(--red)' },
                { action: 'skill', label: '✨ SKILL', color: 'var(--blue)' },
                { action: 'defend', label: '🛡️ DEFEND', color: 'var(--green)' },
                { action: 'item', label: '🧪 POTION', color: 'var(--gold)' },
              ].map((btn) => (
                <button key={btn.action} disabled={btnsDisabled} onClick={() => battleAction(btn.action)}
                  style={{
                    padding: '10px 4px', borderRadius: 8, border: `1px solid ${btn.color}`,
                    background: 'none', color: btn.color, cursor: btnsDisabled ? 'not-allowed' : 'pointer',
                    fontFamily: "'Rajdhani', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: 1,
                    transition: 'all 0.2s', opacity: btnsDisabled ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => { if (!btnsDisabled) e.currentTarget.style.background = btn.color + '22'; }}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn-danger" onClick={exitBattle}>← EXIT BATTLE</button>
        </motion.div>
      )}

      {/* VICTORY / DEFEAT */}
      {(phase === 'victory' || phase === 'defeat') && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'var(--surface)', border: `1px solid ${phase === 'victory' ? 'var(--gold)' : 'var(--red)'}`, borderRadius: 16, padding: '3rem', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{phase === 'victory' ? '🏆' : '💀'}</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '2rem', fontWeight: 700, color: phase === 'victory' ? 'var(--gold)' : 'var(--red)', marginBottom: '1rem' }}>
            {phase === 'victory' ? 'VICTORY!' : 'DEFEATED!'}
          </div>
          <p style={{ color: 'var(--text3)', marginBottom: '2rem' }}>
            {phase === 'victory' ? `You defeated ${currentBoss?.name}! Rewards collected!` : 'The boss was too powerful. Train more and return!'}
          </p>
          <button className="btn-primary" onClick={exitBattle}>Continue →</button>
        </motion.div>
      )}
    </div>
  );
}