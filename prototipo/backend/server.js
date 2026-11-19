const express = require('express');

const app = express();
let universitiesCache;

async function getUniversities() {
  if (!universitiesCache) {
    universitiesCache = (async () => {
      const response = await fetch(
        'http://universities.hipolabs.com/search?country=Peru'
      );

      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de universidades');
      }

      return response.json();
    })();
  }

  return universitiesCache;
}

app.get('/api/universities', async (req, res) => {
  try {
    const universities = await getUniversities();
    const { name } = req.query;
    const results =
      typeof name === 'string' && name
        ? universities.filter((university) =>
            university.name.toLowerCase().includes(name.toLowerCase())
          )
        : universities;

    res.json(results);
  } catch {
    res.status(502).json({ error: 'No se pudo obtener los datos' });
  }
});

app.listen(3000, () => {
  console.log('API en puerto 3000');
});
