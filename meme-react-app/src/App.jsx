import { useEffect, useRef, useState } from 'react'
import './App.css'

const PAGE_SIZE = 20
const SHIMMER_DELAY_MS = 3000
const MEME_API_URL = `https://meme-api.com/gimme/${PAGE_SIZE}`

const waitForShimmer = () =>
  new Promise((resolve) => {
    setTimeout(resolve, SHIMMER_DELAY_MS)
  })

function App() {
  const [memes, setMemes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState('')
  const loadMoreRef = useRef(null)

  const fetchMemes = async (append = false) => {
    if (append) {
      setIsFetchingMore(true)
    } else {
      setIsLoading(true)
    }

    setError('')

    try {
      await waitForShimmer()

      const response = await fetch(MEME_API_URL)

      if (!response.ok) {
        throw new Error(`Failed to load memes (${response.status})`)
      }

      const data = await response.json()
      const items = Array.isArray(data.memes) ? data.memes.slice(0, PAGE_SIZE) : []

      if (append) {
        setMemes((previousMemes) => [...previousMemes, ...items])
      } else {
        setMemes(items)
      }
    } catch (loadError) {
      setError(loadError.message || 'Something went wrong while loading memes.')

      if (!append) {
        setMemes([])
      }
    } finally {
      setIsLoading(false)
      setIsFetchingMore(false)
    }
  }

  useEffect(() => {
    fetchMemes()
  }, [])

  useEffect(() => {
    const node = loadMoreRef.current

    if (!node || isLoading) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry.isIntersecting && !isFetchingMore) {
          fetchMemes(true)
        }
      },
      {
        rootMargin: '200px',
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isLoading, isFetchingMore])

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Trending now</p>
          <h1>Meme Gallery</h1>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={() => fetchMemes(false)}
          disabled={isLoading || isFetchingMore}
        >
          {isLoading ? 'Loading...' : 'Refresh memes'}
        </button>
      </header>

      {error && (
        <div className="error-banner" role="alert">
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={() => fetchMemes(false)}>
            Try again
          </button>
        </div>
      )}

      {isLoading ? (
        <section className="meme-grid" aria-label="Loading memes">
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <article
              key={`skeleton-${index}`}
              className="meme-card shimmer-card"
              aria-hidden="true"
            >
              <div className="image-shimmer" />
              <div className="text-block">
                <div className="line line-lg shimmer-line" />
                <div className="line line-md shimmer-line" />
                <div className="line line-sm shimmer-line" />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <section className="meme-grid" aria-live="polite">
            {memes.map((meme) => (
              <article key={meme.url || meme.id} className="meme-card">
                <img
                  src={meme.url}
                  alt={meme.title || 'Meme'}
                  loading="lazy"
                  className="meme-image"
                />

                <div className="meme-content">
                  <div className="meme-title-row">
                    <h2>{meme.title}</h2>
                    <span className="meme-score">{meme.score}</span>
                  </div>

                  <p className="meta">
                    by {meme.author || 'Unknown'} • r/{meme.subreddit || 'memes'}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <div className="load-more-trigger" ref={loadMoreRef} aria-hidden="true" />

          {isFetchingMore && (
            <section className="meme-grid loading-more-grid" aria-live="polite">
              {Array.from({ length: PAGE_SIZE }, (_, index) => (
                <article
                  key={`loading-more-${index}`}
                  className="meme-card shimmer-card"
                  aria-hidden="true"
                >
                  <div className="image-shimmer" />
                  <div className="text-block">
                    <div className="line line-lg shimmer-line" />
                    <div className="line line-md shimmer-line" />
                    <div className="line line-sm shimmer-line" />
                  </div>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  )
}

export default App
