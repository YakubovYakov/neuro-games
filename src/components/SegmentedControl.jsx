// Переключатель-«таблетка»: подпись + ряд взаимоисключающих вариантов
function SegmentedControl({ label, value, options, onChange }) {
  return (
    <div className="setting">
      <span className="setting__label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map(({ value: optVal, label: optLabel }) => (
          <button
            key={optVal}
            type="button"
            role="radio"
            aria-checked={value === optVal}
            className={
              'segment' + (value === optVal ? ' segment--active' : '')
            }
            onClick={() => onChange(optVal)}
          >
            {optLabel}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SegmentedControl
