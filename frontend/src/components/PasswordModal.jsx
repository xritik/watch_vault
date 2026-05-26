import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'

export default function PasswordModal() {
  const {
    showPwdModal, setShowPwdModal,
    pwdAction, setPwdAction,
    detailItem, setDetailItem,
    setShowDetailModal,
    setEditItem, setShowAddModal,
    verifyPassword, deleteItem,
  } = useApp()

  const [pwd, setPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (showPwdModal) {
      setPwd('')
      setError('')
      setShaking(false)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [showPwdModal])

  const close = () => {
    setShowPwdModal(false)
    setPwdAction(null)
    // Re-open detail modal if there's still a detailItem
    if (detailItem) {
      setTimeout(() => setShowDetailModal(true), 250)
    }
  }

  const wrongPassword = () => {
    const msgs = [
      'Wrong password! Access denied. 🚫',
      "Nope! That's not it. Try again.",
      'Incorrect! This vault is protected. 🔒',
      'Wrong! Only Ritik knows this. 👀',
    ]
    setError(msgs[~~(Math.random() * msgs.length)])
    setShaking(true)
    setPwd('')
    setTimeout(() => setShaking(false), 500)
  }

  const confirm = async () => {
    const ok = await verifyPassword(pwd)
    if (!ok) { wrongPassword(); return }

    setShowPwdModal(false)

    if (pwdAction === 'delete') {
      if (detailItem) {
        await deleteItem(detailItem._id)
        setDetailItem(null)
      }
    } else if (pwdAction === 'edit') {
      if (detailItem) {
        setEditItem(detailItem)
        setDetailItem(null)
        setTimeout(() => setShowAddModal(true), 200)
      }
    }
    setPwdAction(null)
  }

  const icon  = pwdAction === 'delete' ? '🗑️' : '✏️'
  const title = pwdAction === 'delete' ? 'CONFIRM DELETE' : 'VERIFY TO EDIT'
  const sub   = pwdAction === 'delete'
    ? 'Enter your secret password to delete this title.'
    : 'Enter your secret password to edit this title.'
  const confirmLabel = pwdAction === 'delete' ? 'Delete ♡' : 'Unlock Edit ♡'

  if (!showPwdModal) return null

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && close()}>
      <div className="pwd-modal">
        <span className="pwd-icon">{icon}</span>
        <div className="pwd-title">{title}</div>
        <p className="pwd-sub">{sub}</p>

        <div className="pwd-dots">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`pwd-dot ${i < pwd.length ? 'filled' : ''} ${error && i < pwd.length ? 'wrong' : ''}`}
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
            onChange={e => { setPwd(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            autoComplete="off"
          />
          <button
            className="pwd-eye"
            tabIndex={-1}
            onClick={() => setShowPwd(v => !v)}
          >
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
          <button className="btn btn-save" onClick={confirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
