export const sites = [
  {
    id: "makgadikgadi", name: "Makgadikgadi Pans", country: "Botswana",
    lat: -20.6, lon: 25.6, targets: ["mars"],
    category: "Evaporite / seasonal playa lake",
    status: "Documented Mars analog reference",
    hypothesis: "Published research treats Makgadikgadi as a Martian playa-lake analog. A 2026 Journal of Geophysical Research: Planets study used ground-penetrating radar to image buried faults, relict fan deltas, and layered mounds, supporting comparisons of subsurface structures and hydrological processes.",
    matches: ["Seasonally inundated playa-lake setting", "Evaporite and clay-forming processes", "Published GPR observations of buried structures"],
    limits: ["Seasonal surface water and shallow brines differ from present-day Mars", "Earth gravity and atmosphere are not reproduced", "This is an established research analog, not a TerraTwin discovery", "The prototype does not ingest the study's GPR/ERT data or compare Mars radargrams quantitatively"],
    whyNew: "Reclassified from exploratory to a literature-supported Mars analog reference after checking peer-reviewed 2023 and 2026 studies. TerraTwin does not claim to have discovered the site.",
    caseStudy: false
  },
  {
    id: "danakil", name: "Danakil Depression", country: "Ethiopia",
    lat: 14.2, lon: 40.3, targets: ["mars"],
    category: "Hyper-arid volcanic / evaporite terrain",
    status: "Exploratory candidate",
    hypothesis: "A combination of aridity, volcanic geology, and salt-rich hydrothermal settings makes this region a useful candidate for studying mineral precipitation and extreme-environment field methods.",
    matches: ["Arid environment", "Volcanic and hydrothermal processes", "Salt and mineral deposits"],
    limits: ["Some areas are hazardous and require specialist field planning", "Hydrothermal chemistry is not a direct Mars surface analogue", "Local conditions vary sharply over short distances"],
    whyNew: "A multi-feature candidate to compare against Mars mineral and terrain datasets; no equivalence is asserted.",
    caseStudy: false
  },
  {
    id: "arizaro", name: "Salar de Arizaro", country: "Argentina",
    lat: -25.1, lon: -67.7, targets: ["mars"],
    category: "High-altitude salt flat",
    status: "Exploratory candidate",
    hypothesis: "A high-elevation salt-flat environment offers a candidate setting for studying evaporite deposits, exposed sediment, and environmental extremes.",
    matches: ["Salt-flat geomorphology", "High-altitude aridity", "Exposed sedimentary surfaces"],
    limits: ["Salt composition and mineral phases need field or remote-sensing confirmation", "High-altitude Earth atmosphere differs from Mars", "Not a landing-site safety assessment"],
    whyNew: "Included as a candidate for data-led screening; TerraTwin has not validated it as a new analog.",
    caseStudy: false
  },
  {
    id: "kilauea", name: "Kīlauea Volcanic Fields", country: "Hawaiʻi, USA",
    lat: 19.42, lon: -155.29, targets: ["moon"],
    category: "Basaltic volcanic terrain",
    status: "Documented analog reference",
    hypothesis: "Basaltic lava fields provide a useful field setting for studying lunar volcanic landforms and field geology methods. NASA documents Kīlauea in its basalt-landscape comparison with the Moon; a Mars comparison would need separate evidence.",
    matches: ["Basaltic volcanic landforms", "Lava-flow morphology", "Field geology and rover-method testing"],
    limits: ["Earth has active weather, atmosphere, hydrology, and biology", "Lunar vacuum and reduced gravity are not reproduced", "Mars has a different atmosphere, gravity, and surface alteration history"],
    whyNew: "Reference site used to benchmark the method, not presented as a new discovery.",
    caseStudy: true
  },
  {
    id: "askja", name: "Askja Volcanic Region", country: "Iceland",
    lat: 65.03, lon: -16.75, targets: ["moon", "mars"],
    category: "Basaltic volcanic highland",
    status: "Exploratory candidate",
    hypothesis: "Volcanic landforms and basaltic materials may support comparative studies of planetary volcanism and field operations in rugged terrain.",
    matches: ["Volcanic landforms", "Basaltic geology hypothesis", "Rugged field terrain"],
    limits: ["SRTM 30 m public API coverage does not extend to this latitude", "Geologic mapping is needed at the chosen field scale", "Earth climate and atmosphere differ from both targets"],
    whyNew: "A candidate region for further geologic screening, not a confirmed new analog.",
    caseStudy: false
  },
  {
    id: "mcmurdo", name: "McMurdo Dry Valleys", country: "Antarctica",
    lat: -77.5, lon: 162.0, targets: ["mars"],
    category: "Cold polar desert",
    status: "Documented analog reference",
    hypothesis: "A cold, extremely dry polar-desert environment is useful for studying cold-desert processes, permafrost, and field methods relevant to Mars research.",
    matches: ["Cold-desert setting", "Permafrost and ice-related processes", "Sparse surface water"],
    limits: ["Earth atmosphere and gravity differ from Mars", "Local ecosystems and water cycles are not Martian", "Outside SRTM 30 m coverage"],
    whyNew: "Established analog reference used for comparison; not counted as a new candidate.",
    caseStudy: false
  },
  {
    id: "atacama", name: "Atacama Desert", country: "Chile",
    lat: -24.5, lon: -69.25, targets: ["mars"],
    category: "Hyper-arid desert",
    status: "Documented analog reference",
    hypothesis: "The Atacama is a well-known Mars analog research environment because of extreme aridity and its value for astrobiology and instrument testing.",
    matches: ["Extreme aridity", "Salt and mineral deposits", "Astrobiology field methods"],
    limits: ["Earth atmosphere, gravity, radiation, and water cycles differ", "Conditions vary across the desert"],
    whyNew: "Reference site only. TerraTwin explicitly avoids claiming this famous analog as a new discovery.",
    caseStudy: false
  }
];

export const targets = {
  mars: {
    label: "Mars",
    subtitle: "Cold, dusty world with a thin CO₂-rich atmosphere",
    features: [
      ["Topography", "Cratered terrain, volcanic provinces, channels, plains and steep local slopes"],
      ["Geology", "Basaltic rocks, dust, impact materials, sulfates and other alteration minerals"],
      ["Environment", "Low pressure, cold conditions, dust activity and strong radiation exposure"],
      ["Resources", "Water ice in selected settings; resource potential is highly location-dependent"]
    ],
    instrument: "MOLA (Mars Orbiter Laser Altimeter) provides global topography; other orbital instruments provide imagery and mineralogical context.",
    caveat: "Earth field sites can reproduce selected geological or environmental processes, but not Martian gravity, atmospheric pressure, radiation, or full surface chemistry."
  },
  moon: {
    label: "Moon",
    subtitle: "Airless, cratered surface with volcanic plains and regolith",
    features: [
      ["Topography", "Impact craters, mountains, rilles, polar illumination and permanently shadowed regions"],
      ["Geology", "Anorthositic highlands, basaltic maria, impact breccias and regolith"],
      ["Environment", "Near-vacuum, extreme thermal cycles, radiation and micrometeorite exposure"],
      ["Resources", "Potential polar water ice and oxygen-bearing minerals; location-specific evidence is essential"]
    ],
    instrument: "LOLA (Lunar Orbiter Laser Altimeter) provides global and regional topography, slopes, roughness and surface-brightness products.",
    caveat: "Earth analogs support geology and equipment testing, but cannot reproduce lunar vacuum, reduced gravity, radiation, or the full thermal environment."
  }
};
