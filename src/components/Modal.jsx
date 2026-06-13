// Затемнённая подложка + центрированное диалоговое окно
function Modal({ label, className = '', children }) {
  return (
    <div className="modal-backdrop">
      <div
        className={['modal', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
