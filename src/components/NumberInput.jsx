import { useState, useEffect, useRef } from 'react'

const NumberInput = () => {
  const [unit, setUnit] = useState('%')
  const [value, setValue] = useState(1.0)
  const [inputValue, setInputValue] = useState('1.0')
  const [isFocused, setIsFocused] = useState(false)
  const [hoveredButton, setHoveredButton] = useState(null)
  const [hoveredInput, setHoveredInput] = useState(false)
  const [tooltip, setTooltip] = useState(null)
  const [previousValidValue, setPreviousValidValue] = useState(1.0)
  const inputRef = useRef(null)

  // Validate and clean input value
  const cleanValue = (str) => {
    if (!str || str === '') return ''
    
    // Replace comma with dot
    let cleaned = str.replace(/,/g, '.')
    
    // Remove all non-numeric characters except dot
    cleaned = cleaned.replace(/[^0-9.]/g, '')
    
    // Handle multiple dots - keep only the first one and combine the rest
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      // Take first part, then combine all decimal parts
      cleaned = parts[0] + '.' + parts.slice(1).join('')
    }
    
    return cleaned
  }

  // Parse value from string
  const parseValue = (str) => {
    const cleaned = cleanValue(str)
    if (cleaned === '' || cleaned === '.') return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : num
  }

  // Validate value based on unit
  const validateValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 0
    
    // Value must be >= 0
    if (val < 0) return 0
    
    // If unit is %, value must be <= 100
    if (unit === '%' && val > 100) {
      return 100
    }
    
    return val
  }

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  // Handle input blur
  const handleInputBlur = () => {
    setIsFocused(false)
    const parsed = parseValue(inputValue)
    
    // If unit is % and parsed value > 100, revert to previous valid value
    if (unit === '%' && parsed !== null && parsed > 100) {
      setInputValue(previousValidValue.toString())
      setValue(previousValidValue)
    } else {
      const validated = validateValue(parsed !== null ? parsed : value)
      setValue(validated)
      setInputValue(validated.toString())
      setPreviousValidValue(validated)
    }
    setTooltip(null)
  }

  // Handle input focus
  const handleInputFocus = () => {
    setIsFocused(true)
    setPreviousValidValue(value) // Store the current valid value before editing
    setTooltip(null)
  }

  // Handle increment
  const handleIncrement = () => {
    const newValue = value + 1
    if (unit === '%' && newValue > 100) {
      setTooltip('Value must smaller than 100')
      setTimeout(() => setTooltip(null), 2000)
      return
    }
    setValue(newValue)
    setInputValue(newValue.toString())
    setPreviousValidValue(newValue)
  }

  // Handle decrement
  const handleDecrement = () => {
    const newValue = value - 1
    if (newValue < 0) {
      setTooltip('Value must greater than 0')
      setTimeout(() => setTooltip(null), 2000)
      return
    }
    setValue(newValue)
    setInputValue(newValue.toString())
    setPreviousValidValue(newValue)
  }

  // Handle unit change
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return
    
    setUnit(newUnit)
    
    // If switching from px to % and value > 100, set to 100
    if (newUnit === '%' && value > 100) {
      setValue(100)
      setInputValue('100')
      setPreviousValidValue(100)
    }
  }

  // Check if buttons should be disabled
  const isDecrementDisabled = unit === '%' && value === 0
  const isIncrementDisabled = unit === '%' && value === 100

  // Handle button hover for tooltip
  const handleButtonHover = (buttonType) => {
    setHoveredButton(buttonType)
    if (buttonType === 'decrement' && isDecrementDisabled) {
      setTooltip('Value must greater than 0')
    } else if (buttonType === 'increment' && isIncrementDisabled) {
      setTooltip('Value must smaller than 100')
    }
  }

  const handleButtonLeave = () => {
    setHoveredButton(null)
    if (!isFocused) {
      setTooltip(null)
    }
  }

  // Update input value when value changes externally
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  return (
    <div className="p-8 bg-[#1a1a1a] min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        {/* Unit Selector */}
        <div className="flex items-center gap-4">
          <label className="text-gray-300 text-sm font-medium w-16">Unit</label>
          <div className="flex rounded-lg overflow-hidden bg-gray-800">
            <button
              onClick={() => handleUnitChange('%')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                unit === '%'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              %
            </button>
            <button
              onClick={() => handleUnitChange('px')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                unit === 'px'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              px
            </button>
          </div>
        </div>

        {/* Value Stepper */}
        <div className="flex items-center gap-4">
          <label className="text-gray-300 text-sm font-medium w-16">Value</label>
          <div className="relative">
            <div
              className={`flex items-center rounded-lg bg-gray-800 border-2 transition-all ${
                isFocused
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
            >
              {/* Decrement Button */}
              <button
                onClick={handleDecrement}
                onMouseEnter={() => handleButtonHover('decrement')}
                onMouseLeave={handleButtonLeave}
                disabled={isDecrementDisabled}
                className={`px-3 py-2 text-white transition-colors rounded-l-lg ${
                  isDecrementDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : hoveredButton === 'decrement'
                    ? 'bg-gray-700'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                −
              </button>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onMouseEnter={() => setHoveredInput(true)}
                onMouseLeave={() => setHoveredInput(false)}
                className={`w-20 px-3 py-2 text-white text-center bg-gray-800 border-0 outline-none ${
                  hoveredInput && !isFocused ? 'bg-gray-700' : ''
                }`}
              />

              {/* Increment Button */}
              <button
                onClick={handleIncrement}
                onMouseEnter={() => handleButtonHover('increment')}
                onMouseLeave={handleButtonLeave}
                disabled={isIncrementDisabled}
                className={`px-3 py-2 text-white transition-colors rounded-r-lg ${
                  isIncrementDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : hoveredButton === 'increment'
                    ? 'bg-gray-700'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                +
              </button>
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 rounded-lg text-white text-xs whitespace-nowrap shadow-lg">
                {tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberInput
