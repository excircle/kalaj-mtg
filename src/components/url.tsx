import { useState, FormEvent } from 'react'

interface UrlProps {
  /** Called with the URL string when the form is submitted */
  onUrlSubmit: (url: string) => void
}

export default function Url({ onUrlSubmit }: UrlProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    onUrlSubmit(inputValue.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <label htmlFor="card-url" className="sr-only">
        Card JSON URL
      </label>
      <div className="relative">
        <input
          id="card-url"
          type="url"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Card please...."
          required
          className="block w-full pl-10 pr-24 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 
                     focus:ring-blue-500 focus:border-blue-500"
          aria-label="Card JSON URL"
        />
        <button
          type="submit"
          className="absolute right-2 bottom-1/2 transform translate-y-1/2 px-4 py-2 text-sm font-medium 
                     text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Fetch
        </button>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      </div>
    </form>
  )
}
