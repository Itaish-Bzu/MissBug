const { useState, useEffect } = React

export function LabelSelector({ onLabelChange }) {
  const [selectedLabels, setSelectedLabels] = useState([])
  const labels=["critical","need-CR","dev-branch","bug","save-failure","UI-issue","backend-error","car-module","regression","urgent"]

  useEffect(() => {
    onLabelChange(selectedLabels)
  }, [selectedLabels])

  function handleLabelChange(event) {
    const label = event.target.value
    if (event.target.checked) {
      setSelectedLabels(prevLabels => [...prevLabels, label])
    } else {
      setSelectedLabels(prevLabels => prevLabels.filter(l => l !== label))
    }
  }

  return (
    <div className="label-selector">
      <h4>labels</h4>
      {labels.map(label => (
        <span key={label}>
          <input
            type="checkbox"
            value={label}
            checked={selectedLabels.includes(label)}
            onChange={handleLabelChange}
            id={`checkbox-${label}`}
          />
          <label htmlFor={`checkbox-${label}`}>{label}</label>
        </span>
      ))}
    </div>
  )
}
