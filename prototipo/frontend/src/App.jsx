import { useEffect, useState } from 'react'

function App() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `/api/universities?name=${encodeURIComponent(q)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de universidades')
        }

        setItems(await response.json())
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Error al cargar los datos')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [q])

  return (
    <>
      <h1>Universidades del Perú</h1>
      <input
        type="text"
        placeholder="Buscar universidad..."
        value={q}
        onChange={(event) => setQ(event.target.value)}
      />
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <p>{items.length} resultados</p>
      <ul>
        {items.map((u) => (
          <li key={u.name}>
            {u.name}
            {u.web_pages?.[0] && (
              <>
                {' '}
                <a href={u.web_pages[0]} target="_blank" rel="noreferrer">
                  sitio web
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
      <footer>©Mejia Cruzado, Jezer Farid. U23239424</footer>
    </>
  )
}

export default App
