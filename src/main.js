import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import { sites, targets } from './data.js';

const app = document.querySelector('#app');
let map;
let markers = {};
let activeTarget = 'both';
let activeSite = sites.find(s => s.caseStudy);
let earthData = { climate: null, elevation: null };
let requestToken = 0;

const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n, digits=1) => Number.isFinite(Number(n)) ? Number(n).toFixed(digits) : '—';
const targetLabel = s => s.targets.map(t => t === 'mars' ? 'Mars' : 'Moon').join(' + ');

function render() {
  app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="#"><span class="brand-symbol">✦</span><span><b>TERRA<span>TWIN</span></b><small>PLANETARY ANALOG DISCOVERY</small></span></a>
      <nav><a href="#discover" class="active">Discover</a><a href="#case">Case study</a><a href="#method">Method</a><a href="#data">Data & sources</a></nav>
      <span class="preview"><i></i> RESEARCH PROTOTYPE</span>
    </header>
    <main>
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><i></i> EARTH → MOON / MARS</div>
          <h1>Earth is our<br><em>testing ground.</em></h1>
          <p>A transparent screening tool for exploring Earth's extreme environments as potential research analogs for future lunar and Martian missions.</p>
          <div class="hero-actions"><a class="button primary" href="#discover">Explore candidate sites <span>↗</span></a><a class="quiet-link" href="#method">See the method →</a></div>
          <div class="hero-proof"><span>OPEN DATA</span><span>TRACEABLE SOURCES</span><span>NO BLACK-BOX SCORES</span></div>
        </div>
        <div class="hero-visual">
          <div class="orbit o1"></div><div class="orbit o2"></div>
          <div class="globe earth"></div><div class="globe moon"></div><div class="globe mars"></div>
          <div class="planet-tag earth-tag">EARTH <small>ANALOG CANDIDATES</small></div>
          <div class="planet-tag moon-tag">MOON <small>LOLA TOPOGRAPHY</small></div>
          <div class="planet-tag mars-tag">MARS <small>MOLA TOPOGRAPHY</small></div>
          <div class="visual-foot">COMPARATIVE PLANETARY FIELD SCIENCE <span>01 / 02</span></div>
        </div>
      </section>

      <section class="principle-strip">
        <div><b>02</b><span>PLANETARY TARGETS</span></div><div><b>${sites.length.toString().padStart(2,'0')}</b><span>EARTH REGIONS IN SCREENING SET</span></div><div><b>02</b><span>LIVE EARTH DATA APIS</span></div>
        <p>Screening candidates is not the same as certifying a landing site.</p>
      </section>

      <section id="discover" class="section">
        <div class="section-head"><div><div class="eyebrow">01 / DISCOVERY ATLAS</div><h2>Where should we look?</h2><p>Filter by planetary target, select a region, and inspect its evidence and limitations.</p></div>
          <div class="filters"><button class="filter active" data-filter="both">Both targets</button><button class="filter" data-filter="mars">Mars</button><button class="filter" data-filter="moon">Moon</button></div>
        </div>
        <div class="atlas-grid">
          <div class="map-wrap"><div class="map-head"><div><b>EARTH ANALOG CANDIDATE MAP</b><small>SELECT A MARKER TO OPEN THE SITE RECORD</small></div><span>OPENSTREETMAP</span></div><div id="map"></div><div class="map-foot"><span><i class="dot candidate"></i> Exploratory candidate</span><span><i class="dot reference"></i> Documented analog reference</span></div></div>
          <aside class="site-detail" id="site-detail"></aside>
        </div>
      </section>

      <section id="case" class="section case-section">
        <div class="section-head"><div><div class="eyebrow">02 / DETAILED CASE STUDY</div><h2>Kīlauea: one landscape, two worlds.</h2><p>A documented basaltic-volcanic reference site for comparing selected lunar and Martian geology themes.</p></div><span class="case-label">REFERENCE CASE · HAWAIʻI</span></div>
        <div class="case-grid">
          <div class="case-image"><div class="lava-art"></div><div class="image-caption">BASALTIC LAVA LANDSCAPE <span>EARTH FIELD ANALOG</span></div></div>
          <div class="case-copy">
            <div class="eyebrow">WHY THIS CASE?</div>
            <h3>Study the process, not just the picture.</h3>
            <p>Kīlauea's basaltic lava fields provide a real field setting for examining lava-flow morphology, volcanic landforms, and geological mapping methods. NASA's Planetary Analog Explorer explicitly presents Kīlauea basalt landscapes alongside the Moon. This is a Moon-focused reference; TerraTwin does not claim NASA has validated it as a Mars analog.</p>
            <div class="case-targets"><div><b>MOON</b><p>Compare basaltic volcanic plains and lava-flow landforms. The Moon's mare basalts formed in a very different airless environment.</p></div><div><b>MARS</b><p>Not evaluated in this case study. A Mars comparison would need its own planetary target and supporting evidence.</p></div></div>
            <div class="case-warning"><b>Interpretation boundary</b><span>This is a documented analog reference, not a newly discovered site. It demonstrates how TerraTwin will evaluate candidate regions without claiming Earth and planetary conditions are identical.</span></div>
          </div>
        </div>
      </section>

      <section class="section data-section">
        <div class="section-head"><div><div class="eyebrow">03 / LIVE EARTH OBSERVATIONS</div><h2>Measure the place.</h2><p>Request Earth climate and elevation values for the selected coordinates.</p></div><span class="data-badge">LIVE API REQUESTS</span></div>
        <div class="measurement-panel">
          <div class="measurement-title"><div><b id="measurement-site">${esc(activeSite.name)}</b><small id="measurement-coords">${activeSite.lat.toFixed(3)}, ${activeSite.lon.toFixed(3)}</small></div><button id="load-data" class="button secondary">Load Earth measurements ↗</button></div>
          <div id="measurement-results" class="measurement-results">
            <div class="metric"><small>NASA POWER · AIR TEMPERATURE</small><b>— <i>°C</i></b><span>Annual mean of monthly climatology values</span></div>
            <div class="metric"><small>NASA POWER · PRECIPITATION</small><b>— <i>mm/day</i></b><span>Annual mean daily precipitation climatology</span></div>
            <div class="metric"><small>SRTM · ELEVATION</small><b>— <i>m</i></b><span>30 m class elevation dataset where covered</span></div>
          </div>
          <div class="measurement-note" id="measurement-note">No measurements requested yet. Select a site and load its data. Values will be labelled with their source and coverage limitations.</div>
        </div>
      </section>

      <section id="method" class="section method-section">
        <div class="section-head"><div><div class="eyebrow">04 / TRANSPARENT METHOD</div><h2>From a hunch to a testable candidate.</h2><p>TerraTwin separates observed data, literature context, and hypotheses.</p></div></div>
        <div class="method-cards">
          <article><span>01</span><h3>Define planetary features</h3><p>Use mission datasets to define measurable target characteristics: topography, slope, roughness, geology, temperature, and resource indicators.</p></article>
          <article><span>02</span><h3>Screen Earth regions</h3><p>Use Earth observations and published geology to shortlist places with potentially relevant features. Do not infer mineralogy from climate or elevation.</p></article>
          <article><span>03</span><h3>Compare like with like</h3><p>Match spatial scale, units, and measurement definitions. Report missing data and uncertainty rather than filling gaps with guessed values.</p></article>
          <article><span>04</span><h3>Validate in the field</h3><p>Check candidate geology, surface materials, seasonal changes, access, and safety with local experts and field measurements.</p></article>
        </div>
        <div class="integrity"><span>✦</span><div><b>No invented compatibility score</b><p>This prototype does not calculate a planetary similarity score. Candidate labels are hypotheses for follow-up investigation. A defensible score requires matched planetary and Earth raster datasets, explicit weights, spatial sampling, uncertainty analysis, and validation.</p></div></div>
      </section>

      <section id="data" class="section sources-section">
        <div class="section-head"><div><div class="eyebrow">05 / OPEN DATA & PROVENANCE</div><h2>Know where the evidence comes from.</h2><p>Earth observations are queried live; planetary mission data are linked as the reference datasets needed for the next analysis stage.</p></div></div>
        <div class="source-grid">
          <a href="https://power.larc.nasa.gov/docs/services/api/temporal/climatology/" target="_blank" rel="noreferrer"><b>NASA POWER</b><span>Earth meteorology and solar climatology. Used by the live climate query.</span><small>LIVE IN THIS PROTOTYPE ↗</small></a>
          <a href="https://data.nasa.gov/dataset/nasadem-merged-dem-global-1-arc-second-v001" target="_blank" rel="noreferrer"><b>NASADEM / SRTM</b><span>Near-global Earth elevation derived from SRTM; queried here through OpenTopoData's SRTM30m service.</span><small>LIVE ELEVATION SERVICE ↗</small></a>
          <a href="https://pgda.gsfc.nasa.gov/products/62" target="_blank" rel="noreferrer"><b>MOLA · MARS</b><span>Mars Orbiter Laser Altimeter gridded topography products for Mars surface elevation context.</span><small>PLANETARY REFERENCE DATA ↗</small></a>
          <a href="https://science.nasa.gov/mission/lro/lola/" target="_blank" rel="noreferrer"><b>LOLA · MOON</b><span>Lunar topography, slope, roughness, and surface-brightness products.</span><small>PLANETARY REFERENCE DATA ↗</small></a>
          <a href="https://science.nasa.gov/solar-system/analog-explorer/" target="_blank" rel="noreferrer"><b>NASA PLANETARY ANALOG EXPLORER</b><span>NASA's documented analog examples, including Kīlauea and the Moon.</span><small>ANALOG REFERENCE ↗</small></a>
          <a href="https://doi.org/10.1029/2026JE009817" target="_blank" rel="noreferrer"><b>MAKGADIKGADI · 2026 STUDY</b><span>Peer-reviewed GPR study of buried faults, relict fan deltas, and layered mounds in Botswana's pans as a Martian playa-lake analog.</span><small>PEER-REVIEWED RESEARCH ↗</small></a>
          <a href="https://doi.org/10.3389/fspas.2023.1108386" target="_blank" rel="noreferrer"><b>MAKGADIKGADI · 2023 STUDY</b><span>Research on groundwater circulation in the pans and implications for Martian playa processes.</span><small>PEER-REVIEWED RESEARCH ↗</small></a>
          <a href="https://pds.nasa.gov/" target="_blank" rel="noreferrer"><b>NASA PLANETARY DATA SYSTEM</b><span>Archive for planetary mission data products and documentation.</span><small>DATA ARCHIVE ↗</small></a>
        </div>
        <div class="provenance-note"><b>Data coverage note</b><p>NASA POWER climatology is a gridded Earth climate product, not a point weather-station observation. The SRTM 30 m service is not global: its coverage is approximately 60°S–60°N, so high-latitude sites may return no value. MOLA and LOLA are linked as planetary reference datasets but their rasters are not yet ingested into this browser prototype; therefore this version does not claim a quantitative Earth–Moon–Mars raster match.</p></div>
      </section>
    </main>
    <footer><a class="brand" href="#"><span class="brand-symbol">✦</span><span><b>TERRA<span>TWIN</span></b><small>SEGFAULT IN THE STARS</small></span></a><p>Discover Earth. Understand other worlds.</p><small>RESEARCH PROTOTYPE 2.0 · NOT A LANDING-SITE CERTIFICATION TOOL</small></footer>
  </div>`;
}

function filteredSites() {
  return activeTarget === 'both' ? sites : sites.filter(s => s.targets.includes(activeTarget));
}

function iconFor(site, selected) {
  const klass = site.status.includes('Documented') ? 'reference-pin' : 'candidate-pin';
  return L.divIcon({className:'pin-shell', html:`<div class="pin ${klass} ${selected?'selected':''}"><i></i></div>`, iconSize:[22,22], iconAnchor:[11,11]});
}

function initMap() {
  map = L.map('map', {scrollWheelZoom:true}).setView([12, 5], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:18
  }).addTo(map);
  refreshMarkers();
  setTimeout(()=>map.invalidateSize(), 150);
}

function refreshMarkers() {
  Object.values(markers).forEach(m=>map.removeLayer(m));
  markers = {};
  filteredSites().forEach(site=>{
    const m=L.marker([site.lat,site.lon],{icon:iconFor(site,site.id===activeSite.id)}).addTo(map);
    m.bindTooltip(site.name);
    m.on('click',()=>selectSite(site.id));
    markers[site.id]=m;
  });
}

function renderSite() {
  const s=activeSite;
  document.querySelector('#site-detail').innerHTML=`
    <div class="detail-head"><span class="eyebrow">SELECTED REGION</span><span class="status ${s.status.includes('Documented')?'documented':''}">${esc(s.status)}</span></div>
    <h3>${esc(s.name)}</h3><p class="location">${esc(s.country)} · ${esc(s.category)}</p>
    <div class="target-tags">${s.targets.map(t=>`<span>${t==='mars'?'MARS':'MOON'}</span>`).join('')}</div>
    <p class="hypothesis">${esc(s.hypothesis)}</p>
    <div class="detail-group"><b>FEATURES TO INVESTIGATE</b><ul>${s.matches.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="detail-group limitations"><b>LIMITATIONS / VALIDATION NEEDED</b><ul>${s.limits.map(v=>`<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="site-note"><b>STATUS NOTE</b><p>${esc(s.whyNew)}</p></div>
    <div class="coordinates">${s.lat.toFixed(3)}° ${s.lat<0?'S':'N'} &nbsp; / &nbsp; ${Math.abs(s.lon).toFixed(3)}° ${s.lon<0?'W':'E'}</div>`;
  document.querySelector('#measurement-site').textContent=s.name;
  document.querySelector('#measurement-coords').textContent=`${s.lat.toFixed(3)}, ${s.lon.toFixed(3)}`;
}

function selectSite(id) {
  activeSite=sites.find(s=>s.id===id);
  earthData={climate:null,elevation:null};
  renderSite();
  renderMeasurements();
  refreshMarkers();
  map.panTo([activeSite.lat,activeSite.lon],{animate:true,duration:.4});
}

function renderMeasurements() {
  const c=earthData.climate, e=earthData.elevation;
  const temp=c?.temp ?? '—', rain=c?.rain ?? '—', elev=e?.elevation ?? '—';
  document.querySelector('#measurement-results').innerHTML=`
    <div class="metric"><small>NASA POWER · AIR TEMPERATURE</small><b>${temp} <i>${c?'°C':'°C'}</i></b><span>Annual mean of monthly climatology values</span></div>
    <div class="metric"><small>NASA POWER · PRECIPITATION</small><b>${rain} <i>mm/day</i></b><span>Annual mean daily precipitation climatology</span></div>
    <div class="metric"><small>SRTM · ELEVATION</small><b>${elev} <i>m</i></b><span>${e?.dataset ? esc(e.dataset) : 'SRTM 30 m class dataset'}</span></div>`;
  const notes=[];
  if(c?.error) notes.push(`NASA POWER: ${c.error}`);
  if(e?.error) notes.push(`Elevation: ${e.error}`);
  if(!c && !e) notes.push('No measurements requested yet.');
  if(c && !c.error) notes.push('NASA POWER climatology response received. Values represent gridded climatological estimates, not a local station reading.');
  if(e && !e.error) notes.push(`Elevation returned by ${e.dataset}; a single point elevation does not describe slope or terrain roughness.`);
  document.querySelector('#measurement-note').textContent=notes.join(' ');
}

async function loadMeasurements() {
  const button=document.querySelector('#load-data');
  const site=activeSite, token=++requestToken;
  button.disabled=true; button.textContent='Requesting data…';
  document.querySelector('#measurement-note').textContent='Querying NASA POWER and the SRTM elevation service. Please wait…';
  const powerUrl=`https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,PRECTOTCORR&community=AG&longitude=${site.lon}&latitude=${site.lat}&format=JSON`;
  const elevationUrl=`https://api.opentopodata.org/v1/srtm30m?locations=${site.lat},${site.lon}`;
  const [climateResult,elevationResult]=await Promise.allSettled([
    fetch(powerUrl).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();}),
    fetch(elevationUrl).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json();})
  ]);
  if(token!==requestToken) return;
  if(climateResult.status==='fulfilled') {
    const p=climateResult.value?.properties?.parameter;
    const t=p?.T2M ? Object.values(p.T2M).map(Number).filter(Number.isFinite) : [];
    const r=p?.PRECTOTCORR ? Object.values(p.PRECTOTCORR).map(Number).filter(Number.isFinite) : [];
    earthData.climate = t.length && r.length
      ? {temp:(t.reduce((a,b)=>a+b,0)/t.length).toFixed(1),rain:(r.reduce((a,b)=>a+b,0)/r.length).toFixed(2)}
      : {error:'The response did not include both requested parameters. Check the NASA POWER parameter/community availability.'};
  } else earthData.climate={error:climateResult.reason?.message || 'Request failed.'};
  if(elevationResult.status==='fulfilled') {
    const result=elevationResult.value?.results?.[0];
    earthData.elevation = Number.isFinite(result?.elevation)
      ? {elevation:Math.round(result.elevation),dataset:result.dataset || 'SRTM30m'}
      : {error:'No SRTM elevation returned. This location may be outside SRTM 30 m coverage (approximately 60°S–60°N) or contain a no-data pixel.'};
  } else earthData.elevation={error:elevationResult.reason?.message || 'Request failed.'};
  renderMeasurements();
  button.disabled=false; button.textContent='Refresh Earth measurements ↗';
}

render();
initMap();
renderSite();
renderMeasurements();

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  activeTarget=btn.dataset.filter;
  document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===btn));
  refreshMarkers();
  const visible=filteredSites();
  if(visible.length) map.fitBounds(L.latLngBounds(visible.map(s=>[s.lat,s.lon])).pad(.22));
  if(!filteredSites().some(s=>s.id===activeSite.id)) selectSite(filteredSites()[0].id);
}));
document.querySelector('#load-data').addEventListener('click',loadMeasurements);
