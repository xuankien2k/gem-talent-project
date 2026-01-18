import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

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
  const tooltipTimeoutRef = useRef(null)

  // Clean and normalize input string
  const cleanValue = useCallback((str) => {
    if (!str?.trim()) return ''
    
    let cleaned = str
      .replace(/,/g, '.') // Replace comma with dot
      .replace(/[^0-9.]/g, '') // Remove non-numeric except dot
    
    // Handle multiple dots - keep only the first one
    const parts = cleaned.split('.')
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('')
    }
    
    return cleaned
  }, [])

  // Parse string to number
  const parseValue = useCallback((str) => {
    const cleaned = cleanValue(str)
    if (!cleaned || cleaned === '.') return null
    const num = parseFloat(cleaned)
    return isNaN(num) ? null : num
  }, [cleanValue])

  // Validate and clamp value based on unit
  const validateValue = useCallback((val, currentUnit = unit) => {
    if (val == null || isNaN(val)) return 0
    if (val < 0) return 0
    if (currentUnit === '%' && val > 100) return 100
    return val
  }, [unit])

  // Update value and input synchronously
  const updateValue = useCallback((newValue) => {
    setValue(newValue)
    setInputValue(newValue.toString())
    setPreviousValidValue(newValue)
  }, [])

  // Show tooltip with auto-hide
  const showTooltip = useCallback((message) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current)
    }
    setTooltip(message)
    tooltipTimeoutRef.current = setTimeout(() => setTooltip(null), 2000)
  }, [])

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value)
  }, [])

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    const parsed = parseValue(inputValue)
    
    // Revert if exceeds limit in % mode, otherwise validate
    if (unit === '%' && parsed !== null && parsed > 100) {
      updateValue(previousValidValue)
    } else {
      const validated = validateValue(parsed ?? value, unit)
      updateValue(validated)
    }
    setTooltip(null)
  }, [inputValue, unit, value, previousValidValue, parseValue, validateValue, updateValue])

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
    setPreviousValidValue(value)
    setTooltip(null)
  }, [value])

  // Handle increment
  const handleIncrement = useCallback(() => {
    const newValue = value + 1
    if (unit === '%' && newValue > 100) {
      showTooltip('Value must smaller than 100')
      return
    }
    updateValue(newValue)
  }, [value, unit, updateValue, showTooltip])

  // Handle decrement
  const handleDecrement = useCallback(() => {
    const newValue = value - 1
    if (newValue < 0) {
      showTooltip('Value must greater than 0')
      return
    }
    updateValue(newValue)
  }, [value, updateValue, showTooltip])

  // Handle unit change
  const handleUnitChange = useCallback((newUnit) => {
    if (newUnit === unit) return
    
    setUnit(newUnit)
    
    // Clamp value when switching to % mode
    if (newUnit === '%' && value > 100) {
      updateValue(100)
    }
  }, [unit, value, updateValue])

  // Computed disabled states
  const isDecrementDisabled = useMemo(() => unit === '%' && value === 0, [unit, value])
  const isIncrementDisabled = useMemo(() => unit === '%' && value === 100, [unit, value])

  // Handle button hover for tooltip
  const handleButtonHover = useCallback((buttonType) => {
    setHoveredButton(buttonType)
    
    const tooltips = {
      decrement: isDecrementDisabled ? 'Value must greater than 0' : null,
      increment: isIncrementDisabled ? 'Value must smaller than 100' : null,
    }
    
    const message = tooltips[buttonType]
    if (message) {
      setTooltip(message)
    } else if (!isFocused) {
      setTooltip(null)
    }
  }, [isDecrementDisabled, isIncrementDisabled, isFocused])

  const handleButtonLeave = useCallback(() => {
    setHoveredButton(null)
    if (!isFocused && !hoveredInput) {
      setTooltip(null)
    }
  }, [isFocused, hoveredInput])

  // Update input value when value changes externally
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString())
    }
  }, [value, isFocused])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="gem-p-8 gem-bg-[#303030] gem-min-h-screen">
      <div className="gem-max-w-md gem-mx-auto gem-space-y-6">
        {/* Unit Selector */}
        <div className="gem-flex gem-items-center gem-gap-4">
          <label className="gem-text-gray-300 gem-text-sm gem-font-medium gem-w-16">Unit</label>
          <div className="gem-flex gem-w-[140px] gem-h-[36px] gem-gap-[2px] gem-rounded-[6px] gem-bg-[#212121] gem-p-[2px]">
            <button
              onClick={() => handleUnitChange('%')}
              className={`gem-w-[67px] gem-h-[32px] gem-rounded-[6px] gem-text-sm gem-font-medium gem-transition-colors ${
                unit === '%'
                  ? 'gem-bg-[#424242] gem-text-[#F9F9F9]'
                  : 'gem-bg-[#212121] gem-text-[#AAAAAA]'
              }`}
            >
              %
            </button>
            <button
              onClick={() => handleUnitChange('px')}
              className={`gem-w-[67px] gem-h-[32px] gem-rounded-[6px] gem-text-sm gem-font-medium gem-transition-colors ${
                unit === 'px'
                  ? 'gem-bg-[#424242] gem-text-[#F9F9F9]'
                  : 'gem-bg-[#212121] gem-text-[#AAAAAA]'
              }`}
            >
              px
            </button>
          </div>
        </div>

        {/* Value Stepper */}
        <div className="gem-flex gem-items-center gem-gap-4">
          <label className="gem-text-gray-300 gem-text-sm gem-font-medium gem-w-16">Value</label>
          <div className="gem-relative">
            <div className="gem-flex gem-items-center gem-w-[140px] gem-h-[36px] gem-rounded-[6px] gem-bg-[#212121]">
              {/* Decrement Button */}
              <div className="gem-relative">
                <button
                  onClick={handleDecrement}
                  onMouseEnter={() => handleButtonHover('decrement')}
                  onMouseLeave={handleButtonLeave}
                  // disabled={isDecrementDisabled}
                  className={`gem-h-[36px] gem-w-[36px] gem-rounded-l-[6px] gem-border-r-0 gem-text-lg gem-font-normal gem-transition-all ${
                    isFocused
                      ? 'gem-border gem-border-[#3C67FF] gem-border-r-0 gem-text-[#F9F9F9]'
                      : 'gem-border gem-border-transparent gem-border-r-0'
                  } ${
                    isDecrementDisabled
                      ? 'gem-cursor-default gem-bg-[#212121] gem-text-[#AAAAAA]'
                      : hoveredButton === 'decrement' || (hoveredInput && !isFocused)
                      ? 'gem-bg-[#424242] gem-text-[#F9F9F9]'
                      : 'gem-bg-[#212121] gem-hover:bg-[#424242] gem-text-[#F9F9F9]'
                  }`}
                >
                  −
                </button>
                {/* Tooltip for Decrement Button */}
                {tooltip && hoveredButton === 'decrement' && isDecrementDisabled && (
                  <div className="gem-absolute gem-bottom-full gem-left-1/2 gem--translate-x-1/2 gem-mb-2 gem-px-3 gem-py-2 gem-bg-[#212121] gem-rounded-lg gem-text-[#F9F9F9] gem-text-xs gem-whitespace-nowrap gem-shadow-lg gem-z-50">
                    {tooltip}
                    <div className="gem-absolute gem-top-full gem-left-1/2 gem--translate-x-1/2 gem-w-0 gem-h-0 gem-border-l-4 gem-border-r-4 gem-border-t-4 gem-border-transparent gem-border-t-[#212121]"></div>
                  </div>
                )}
              </div>

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
                className={`gem-flex-1 gem-w-[68px] gem-h-[36px] gem-text-center gem-border-x-0 gem-outline-none gem-text-sm gem-font-normal gem-transition-all gem-text-[#F9F9F9] ${
                  isFocused
                    ? 'gem-border-y gem-border-[#3C67FF] gem-border-x-0 gem-bg-[#212121]'
                    : 'gem-border gem-border-x-0 gem-border-transparent'
                } ${
                  !isFocused && hoveredInput
                    ? 'gem-bg-[#424242]'
                    : !isFocused
                    ? 'gem-bg-[#212121]'
                    : ''
                }`}
              />

              {/* Increment Button */}
              <div className="gem-relative">
                <button
                  onClick={handleIncrement}
                  onMouseEnter={() => handleButtonHover('increment')}
                  onMouseLeave={handleButtonLeave}
                  // disabled={isIncrementDisabled}
                  className={`gem-h-[36px] gem-w-[36px] gem-rounded-r-[6px] gem-text-lg gem-font-normal gem-border-l-0 gem-transition-all ${
                    isFocused
                      ? 'gem-border gem-border-[#3C67FF] gem-border-l-0 gem-text-[#F9F9F9]'
                      : 'gem-border gem-border-transparent gem-border-l-0'
                  } ${
                    isIncrementDisabled
                      ? 'gem-cursor-default gem-bg-[#212121] gem-text-[#AAAAAA]'
                      : hoveredButton === 'increment' || (hoveredInput && !isFocused)
                      ? 'gem-bg-[#424242] gem-text-[#F9F9F9]'
                      : 'gem-bg-[#212121] gem-hover:bg-[#424242] gem-text-[#F9F9F9]'
                  }`}
                >
                  +
                </button>
                {/* Tooltip for Increment Button */}
                {tooltip && hoveredButton === 'increment' && isIncrementDisabled && (
                  <div className="gem-absolute gem-bottom-full gem-left-1/2 gem--translate-x-1/2 gem-mb-2 gem-px-3 gem-py-2 gem-bg-[#212121] gem-rounded-lg gem-text-[#F9F9F9] gem-text-xs gem-whitespace-nowrap gem-shadow-lg gem-z-50">
                    {tooltip}
                    <div className="gem-absolute gem-top-full gem-left-1/2 gem--translate-x-1/2 gem-w-0 gem-h-0 gem-border-l-4 gem-border-r-4 gem-border-t-4 gem-border-transparent gem-border-t-[#212121]"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NumberInput
