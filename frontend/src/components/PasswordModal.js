import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

const ACTION_MAP = {
  delete:   { icon: '🗑️', title: 'CONFIRM DELETE',      sub: 'Enter your secret password to delete this title.',       confirm: 'Delete ♡'       },
  edit:     { icon: '✏️', title: 'VERIFY TO EDIT',       sub: 'Enter your secret password to edit this title.',         confirm: 'Unlock Edit ♡'  },
  favorite: { icon: '❤️', title: 'VERIFY TO FAVORITE',   sub: 'Enter your secret password to toggle favorite.',         confirm: 'Confirm ♡'      },
  lock:     { icon: '🔒', title: 'VERIFY TO LOCK',        sub: 'Enter your secret password to lock / unlock this card.', confirm: 'Confirm ♡'      },
};

export default function PasswordModal() {
  const { showPwdModal, setShowPwdModal, pwdAction, verifyPassword, executePendingAction } = useApp();

  const [pwd,     setPwd]     = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error,   setError]   = useState('');
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showPwdModal) {
      setPwd('');
      setError('');
      setShaking(false);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 350);
    }
  }, [showPwdModal]);

  const close = () => setShowPwdModal(false);

  const wrongPassword = () => {
    const msgs = [
      'Wrong password! Access denied. 🚫',
      "Nope! That's not it. Try again.",
      'Incorrect! This vault is protected. 🔒',
      'Wrong! Only Ritik knows this. 👀',
    ];
    setError(msgs[Math.floor(Math.random() * msgs.length)]);
    setShaking(true);
    setPwd('');
    setTimeout(() => setShaking(false), 500);
  };

  const confirm = async () => {
    const ok = await verifyPassword(pwd);
    if (!ok) { wrongPassword(); return; }
    setShowPwdModal(false);
    await executePendingAction();
  };

  const meta = ACTION_MAP[pwdAction] || ACTION_MAP.edit;

  if (!showPwdModal) return null;

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="pwd-modal">
        <span className="pwd-icon">{meta.icon}</span>
        <div className="pwd-title">{meta.title}</div>
        <p className="pwd-sub">{meta.sub}</p>

        <div className="pwd-dots">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`pwd-dot${i < pwd.length ? ' filled' : ''}${error && i < pwd.length ? ' wrong' : ''}`}
            />
          ))}
        </div>

        <div className="pwd-input-wrap">
          <input
            ref={inputRef}
            type={showPwd ? 'text' : 'password'}
            maxLength={7}
            placeholder="●●●●●●●"
            value={pwd}
            className={shaking ? 'shake' : ''}
            onChange={e => { setPwd(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            autoComplete="off"
          />
          <button className="pwd-eye" tabIndex={-1} onClick={() => setShowPwd(v => !v)}>
            {showPwd ? '🙈' : '👁️'}
          </button>
        </div>

        {error && (
          <div className="pwd-error show">
            <span className="pwd-error-icon">✕</span>
            <span>{error}</span>
          </div>
        )}

        <div className="pwd-footer">
          <button className="btn btn-cancel" onClick={close}>Cancel</button>
          <button className="btn btn-save"   onClick={confirm}>{meta.confirm}</button>
        </div>
      </div>
    </div>
  );
}
