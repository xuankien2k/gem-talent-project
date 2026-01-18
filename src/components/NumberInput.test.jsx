import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NumberInput from './NumberInput'

describe('NumberInput Component', () => {

  describe('Unit Selection', () => {
    it('should default to % unit', () => {
      render(<NumberInput />)
      const percentButton = screen.getByText('%').closest('button')
      expect(percentButton).toHaveClass('bg-gray-700')
    })

    it('should switch to px unit when clicked', () => {
      render(<NumberInput />)
      const pxButton = screen.getByText('px').closest('button')
      fireEvent.click(pxButton)
      expect(pxButton).toHaveClass('bg-gray-700')
    })

    it('should switch from px to % and clamp value to 100 if value > 100', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const pxButton = screen.getByText('px').closest('button')
      
      // Switch to px
      fireEvent.click(pxButton)
      
      // Set value to 150
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '150' } })
      fireEvent.blur(input)
      
      // Switch back to %
      const percentButton = screen.getByText('%').closest('button')
      fireEvent.click(percentButton)
      
      expect(input.value).toBe('100')
    })
  })

  describe('Value Input and Validation', () => {
    it('should replace comma with dot', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '12,3' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('12.3')
      }, { timeout: 1000 })
    })

    it('should remove non-numeric characters on blur', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '123a' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('123')
      }, { timeout: 1000 })
    })

    it('should handle 12a3 -> 12 on blur', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '12a3' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('12')
      }, { timeout: 1000 })
    })

    it('should handle a123 -> valid value on blur', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: 'a123' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('123')
      }, { timeout: 1000 })
    })

    it('should handle 12.4.5 -> valid value on blur', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '12.4.5' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        const val = parseFloat(input.value)
        expect(val).toBeGreaterThanOrEqual(0)
        expect(val).toBeLessThanOrEqual(100)
      }, { timeout: 1000 })
    })

    it('should set value to 0 if input < 0 on blur', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '-5' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('0')
      }, { timeout: 1000 })
    })
  })

  describe('Percentage Mode Validation', () => {
    it('should revert to previous valid value if input > 100 in % mode', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      // Set initial value to 50
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '50' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('50')
      }, { timeout: 1000 })
      
      // Try to enter 150
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '150' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('50')
      }, { timeout: 1000 })
    })

    it('should disable decrement button when value is 0 in % mode', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '−')
      
      // Set value to 0
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '0' } })
      fireEvent.blur(input)
      
      expect(decrementButton).toBeDisabled()
    })

    it('should disable increment button when value is 100 in % mode', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+')
      
      // Set value to 100
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '100' } })
      fireEvent.blur(input)
      
      expect(incrementButton).toBeDisabled()
    })

    it('should show tooltip when hovering disabled decrement button', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '−')
      
      // Set value to 0
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '0' } })
      fireEvent.blur(input)
      
      fireEvent.mouseEnter(decrementButton)
      
      await waitFor(() => {
        expect(screen.getByText('Value must greater than 0')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should show tooltip when hovering disabled increment button', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+')
      
      // Set value to 100
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '100' } })
      fireEvent.blur(input)
      
      await waitFor(() => {
        expect(input.value).toBe('100')
      }, { timeout: 1000 })
      
      fireEvent.mouseEnter(incrementButton)
      
      await waitFor(() => {
        expect(screen.getByText('Value must smaller than 100')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('Increment and Decrement', () => {
    it('should increment value when + button is clicked', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+')
      
      const initialValue = parseFloat(input.value)
      fireEvent.click(incrementButton)
      
      expect(parseFloat(input.value)).toBe(initialValue + 1)
    })

    it('should decrement value when - button is clicked', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const decrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '−')
      
      const initialValue = parseFloat(input.value)
      fireEvent.click(decrementButton)
      
      expect(parseFloat(input.value)).toBe(initialValue - 1)
    })

    it('should not increment beyond 100 in % mode', async () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+')
      
      // Set value to 100
      fireEvent.focus(input)
      fireEvent.change(input, { target: { value: '100' } })
      fireEvent.blur(input)
      
      // Try to increment
      fireEvent.click(incrementButton)
      
      await waitFor(() => {
        expect(input.value).toBe('100')
        expect(screen.getByText('Value must smaller than 100')).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })

  describe('UI States', () => {
    it('should show focus border when input is focused', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      const container = input.closest('.border-2')
      
      fireEvent.focus(input)
      
      expect(container).toHaveClass('border-blue-500')
    })

    it('should show hover state on buttons', () => {
      render(<NumberInput />)
      const incrementButton = screen.getAllByRole('button').find(btn => btn.textContent === '+')
      
      fireEvent.mouseEnter(incrementButton)
      
      expect(incrementButton).toHaveClass('bg-gray-700')
    })

    it('should show hover state on input', () => {
      render(<NumberInput />)
      const input = screen.getByRole('textbox')
      
      fireEvent.mouseEnter(input)
      
      expect(input).toHaveClass('bg-gray-700')
    })
  })
})
