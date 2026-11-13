# TerraTwin — Planetary Analog Discovery (Research Prototype)

**Team:** Segfault in the Stars  
**Challenge:** Identify and characterize terrestrial analog environments for future lunar and Martian bases / landing-site research.  
**Version:** 2.0 research prototype

## What this prototype does

- Interactive Earth map with candidate regions and documented analog reference sites.
- Separate Mars, Moon, and combined filters.
- Transparent site records: hypotheses, potentially relevant features, limitations, and validation needs.
- Detailed Kīlauea case study: a documented basaltic-volcanic analog reference used to explain comparison boundaries for both Moon and Mars.
- Live NASA POWER point-climatology request for Earth air temperature and precipitation.
- Live SRTM 30 m class elevation query through OpenTopoData.
- Links to MOLA (Mars), LOLA (Moon), NASA PDS, NASA Planetary Analog Explorer, and NASADEM/SRTM provenance.
- No invented similarity scores.

## Run on Windows

Install Node.js 18+ first. Then open this folder in VS Code and choose Terminal → New Terminal.

```powershell
npm install
npm run dev
```

Open the localhost URL printed by Vite.

Production build:

```powershell
npm run build
npm run preview
```

## Live data used

### NASA POWER climatology

The app requests `T2M` and `PRECTOTCORR` from the NASA POWER temporal climatology point API. It averages the returned monthly climatology values and labels precipitation as mm/day (annual mean daily climatology). This is a gridded climatology estimate, not a station measurement.

API docs: https://power.larc.nasa.gov/docs/services/api/temporal/climatology/

### SRTM elevation

The app requests a single point elevation from OpenTopoData's `srtm30m` endpoint. SRTM is a NASA/NGA Shuttle Radar Topography Mission elevation dataset; OpenTopoData is a third-party API wrapper. Its SRTM coverage is approximately 60°S to 60°N, so polar and high-latitude sites may return no data.

API docs: https://www.opentopodata.org/api/  
SRTM dataset notes: https://www.opentopodata.org/datasets/srtm/  
NASADEM source record: https://data.nasa.gov/dataset/nasadem-merged-dem-global-1-arc-second-v001

## Additional peer-reviewed context

- Makgadikgadi groundwater and Martian playa processes (2023): https://doi.org/10.3389/fspas.2023.1108386
- Makgadikgadi GPR subsurface structures and Martian playa lakes (2026): https://doi.org/10.1029/2026JE009817

## Planetary reference datasets

- MOLA / Mars topography: https://pgda.gsfc.nasa.gov/products/62
- LOLA / lunar topography, slope, roughness and brightness: https://science.nasa.gov/mission/lro/lola/
- NASA Planetary Data System: https://pds.nasa.gov/
- NASA Planetary Analog Explorer: https://science.nasa.gov/solar-system/analog-explorer/

**Important:** MOLA and LOLA are linked as planetary reference datasets but their gridded rasters are not ingested into this browser prototype. This version therefore does not calculate quantitative Earth–Mars or Earth–Moon raster similarity.

## Scientific integrity and limitations

- Candidate locations are exploratory hypotheses, not newly validated analog discoveries.
- Kīlauea is a NASA-documented Moon analog reference.
- Makgadikgadi is now classified as a literature-supported Mars playa-lake analog reference: published 2023 research discusses its relevance to Martian playa processes, and a 2026 Journal of Geophysical Research: Planets paper reports GPR observations of buried structures. TerraTwin did not discover this site and does not ingest those GPR/ERT data.
- No compatibility or safety score is calculated.
- Climate and elevation are only two Earth-side indicators. They do not establish geology, mineralogy, slope, roughness, resource availability, radiation, or landing safety.
- A scientifically defensible similarity analysis requires aligned raster datasets, matched units and spatial scales, explicit feature weights, uncertainty reporting, and validation.

## Map attribution

Map tiles © OpenStreetMap contributors: https://www.openstreetmap.org/copyright

## Team

Segfault in the Stars — solo prototype build.
