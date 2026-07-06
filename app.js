// State Management
let recaps = [];
let draft = {};
let currentView = 'dashboard';
let activeCategory = '';
let trendChartInstance = null;
let compareChartInstance = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Load Data from Local Storage
  const savedRecaps = localStorage.getItem('momoyo_recaps');
  if (savedRecaps) {
    try {
      recaps = JSON.parse(savedRecaps);
    } catch (e) {
      console.error("Error parsing saved recaps:", e);
      recaps = [];
    }
  } else {
    // Populate with some mock data if empty, to make the dashboard look beautiful immediately!
    populateMockData();
  }

  // Load Draft
  const savedDraft = localStorage.getItem('momoyo_recap_draft');
  if (savedDraft) {
    try {
      draft = JSON.parse(savedDraft);
    } catch (e) {
      draft = {};
    }
  }

  // Load Theme Preference
  const savedTheme = localStorage.getItem('momoyo_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Setup UI components and data bindings
  initThemeToggle();
  initNavigation();
  populateDropdowns();
  initFormInputs();
  renderDashboard();
  renderHistoryTable();
  initAnalyticsControls();
  
  // Set default date in form
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('input-tanggal').value = today;

  // Set default dates for consolidated filters
  const dateEnd = new Date();
  const dateStart = new Date();
  dateStart.setDate(dateStart.getDate() - 7); // Default to last 7 days

  const dateEndStr = dateEnd.toISOString().split('T')[0];
  const dateStartStr = dateStart.toISOString().split('T')[0];

  document.getElementById('consolidated-start-date').value = dateStartStr;
  document.getElementById('consolidated-end-date').value = dateEndStr;

  // Render initial analytics & consolidated matrix
  setTimeout(() => {
    renderAnalyticsCharts();
  }, 100);
  setTimeout(() => {
    renderConsolidatedMatrix();
  }, 150);
});

// Mock Data Builder (to wow the user with initial data)
function populateMockData() {
  const crewNames = ["Sarah", "Viky Setiawan", "Rian", "Dewi"];
  const dates = [];
  // Generate last 7 days dates
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  // Create 6 dummy recaps
  const mockRecaps = [
    {
      id: "recap-1",
      tanggal: dates[0],
      toko: STORES[0], // Sukalarang
      crew: crewNames[1],
      items: generateMockItemValues(45)
    },
    {
      id: "recap-2",
      tanggal: dates[1],
      toko: STORES[1], // Mangun jaya
      crew: crewNames[0],
      items: generateMockItemValues(35)
    },
    {
      id: "recap-3",
      tanggal: dates[2],
      toko: STORES[2], // Dukuh zamrud
      crew: crewNames[2],
      items: generateMockItemValues(55)
    },
    {
      id: "recap-4",
      tanggal: dates[3],
      toko: STORES[3], // Luwuk
      crew: crewNames[3],
      items: generateMockItemValues(60)
    },
    {
      id: "recap-5",
      tanggal: dates[4],
      toko: STORES[0], // Sukalarang
      crew: crewNames[1],
      items: generateMockItemValues(42)
    },
    {
      id: "recap-6",
      tanggal: dates[5],
      toko: STORES[2], // Dukuh Zamrud
      crew: crewNames[2],
      items: generateMockItemValues(52)
    }
  ];

  recaps = mockRecaps;
  localStorage.setItem('momoyo_recaps', JSON.stringify(recaps));
}

function generateMockItemValues(baseVal) {
  const items = {};
  ITEM_FIELDS.forEach(item => {
    // Generate random realistic stocks between 2 and 80
    const variance = Math.floor(Math.random() * 15) - 7;
    items[item.id] = Math.max(0, baseVal + variance);
  });
  return items;
}

// ==========================================
// CORE THEME SWITCHER
// ==========================================
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('momoyo_theme', newTheme);
    
    // Update chart layouts on theme change
    renderAnalyticsCharts();
  });
}

// ==========================================
// NAVIGATION HANDLERS
// ==========================================
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchView(target);
    });
  });
}

function switchView(viewId) {
  currentView = viewId;
  
  // Hide all views
  document.querySelectorAll('.content-view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show target view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Update navigation items active state
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(nav => {
    if (nav.getAttribute('data-target') === viewId) {
      nav.classList.add('active');
    } else {
      nav.classList.remove('active');
    }
  });

  // Perform view specific tasks
  if (viewId === 'dashboard') {
    renderDashboard();
  } else if (viewId === 'history') {
    renderHistoryTable();
  } else if (viewId === 'analytics') {
    renderAnalyticsCharts();
  } else if (viewId === 'consolidated-recap') {
    renderConsolidatedMatrix();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// POPULATE DROPDOWNS
// ==========================================
function populateDropdowns() {
  const tokoSelect = document.getElementById('input-toko');
  const filterTokoSelect = document.getElementById('filter-store');
  const analyticsStoreSelect = document.getElementById('analytics-store-select');
  const consolidatedStoreSelect = document.getElementById('consolidated-store-select');

  // Clear existing (except defaults)
  tokoSelect.innerHTML = '<option value="" disabled selected>-- Pilih Toko --</option>';
  filterTokoSelect.innerHTML = '<option value="all">Semua Toko</option>';
  analyticsStoreSelect.innerHTML = '<option value="all">Semua Toko (Bandingan)</option>';
  if (consolidatedStoreSelect) {
    consolidatedStoreSelect.innerHTML = '<option value="all">Semua Cabang Toko</option>';
  }

  STORES.forEach((store, index) => {
    // Fill form dropdown
    const optForm = document.createElement('option');
    optForm.value = store;
    optForm.textContent = store;
    tokoSelect.appendChild(optForm);

    // Fill history filter dropdown
    const optFilter = document.createElement('option');
    optFilter.value = store;
    optFilter.textContent = store;
    filterTokoSelect.appendChild(optFilter);

    // Fill analytics dropdown
    const optAnal = document.createElement('option');
    optAnal.value = store;
    optAnal.textContent = store;
    analyticsStoreSelect.appendChild(optAnal);

    // Fill consolidated dropdown
    if (consolidatedStoreSelect) {
      const optCons = document.createElement('option');
      optCons.value = store;
      optCons.textContent = store;
      consolidatedStoreSelect.appendChild(optCons);
    }
  });
}

// ==========================================
// FORM DYNAMIC RENDER & ENGINE
// ==========================================
function initFormInputs() {
  const tabsContainer = document.getElementById('category-tabs');
  
  // Extract unique categories
  const categoriesSet = new Set();
  ITEM_FIELDS.forEach(item => categoriesSet.add(item.category));
  const categories = Array.from(categoriesSet);

  activeCategory = categories[0];

  // Render Tabs
  tabsContainer.innerHTML = '';
  categories.forEach((cat, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `tab-btn ${cat === activeCategory ? 'active' : ''}`;
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      // Set active class
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeCategory = cat;
      renderFormItems();
    });
    tabsContainer.appendChild(btn);
  });

  // Render Items Grid
  renderFormItems();

  // Setup auto-save listener on form meta fields
  document.getElementById('input-tanggal').addEventListener('change', saveDraftAuto);
  document.getElementById('input-toko').addEventListener('change', saveDraftAuto);
  document.getElementById('input-crew').addEventListener('input', saveDraftAuto);
}

function renderFormItems() {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';

  // Filter items in active category
  const filtered = ITEM_FIELDS.filter(item => item.category === activeCategory);

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'stock-input-card';
    card.id = `item-card-${item.id}`;

    // Item Info
    const info = document.createElement('div');
    info.className = 'stock-item-info';
    
    const title = document.createElement('h4');
    title.textContent = item.title;
    
    const badge = document.createElement('span');
    badge.textContent = item.category;

    info.appendChild(title);
    info.appendChild(badge);

    // Numeric controls
    const controls = document.createElement('div');
    controls.className = 'numeric-control';

    const minBtn = document.createElement('button');
    minBtn.type = 'button';
    minBtn.className = 'num-btn';
    minBtn.innerHTML = '<i data-lucide="minus"></i>';
    minBtn.addEventListener('click', () => adjustQty(item.id, -1));

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `qty-${item.id}`;
    input.min = '0';
    input.placeholder = '0';
    // Load from draft if exists
    input.value = draft[item.id] !== undefined ? draft[item.id] : '';
    input.addEventListener('input', () => {
      // Clean numeric inputs
      if (input.value < 0) input.value = 0;
      draft[item.id] = input.value === '' ? '' : parseInt(input.value);
      saveDraftAuto();
    });

    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'num-btn';
    plusBtn.innerHTML = '<i data-lucide="plus"></i>';
    plusBtn.addEventListener('click', () => adjustQty(item.id, 1));

    controls.appendChild(minBtn);
    controls.appendChild(input);
    controls.appendChild(plusBtn);

    card.appendChild(info);
    card.appendChild(controls);
    grid.appendChild(card);
  });

  // Re-init icons inside dynamic content
  lucide.createIcons();
}

function adjustQty(itemId, delta) {
  const input = document.getElementById(`qty-${itemId}`);
  if (!input) return;

  let currentVal = parseInt(input.value) || 0;
  let newVal = Math.max(0, currentVal + delta);
  input.value = newVal;

  // Trigger change event to save draft
  draft[itemId] = newVal;
  saveDraftAuto();
}

// Filter Form Items via Search Bar
function filterItems() {
  const query = document.getElementById('item-search').value.toLowerCase().trim();
  const grid = document.getElementById('items-grid');
  const emptyState = document.getElementById('no-search-results');

  if (query === '') {
    // Restore default view (by active category tab)
    renderFormItems();
    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');
    return;
  }

  // Search across ALL categories
  const matched = ITEM_FIELDS.filter(item => item.title.toLowerCase().includes(query));

  grid.innerHTML = '';
  if (matched.length === 0) {
    emptyState.classList.remove('hidden');
    grid.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');

    matched.forEach(item => {
      const card = document.createElement('div');
      card.className = 'stock-input-card';
      
      const info = document.createElement('div');
      info.className = 'stock-item-info';
      
      const title = document.createElement('h4');
      title.textContent = item.title;
      
      const badge = document.createElement('span');
      badge.textContent = item.category;

      info.appendChild(title);
      info.appendChild(badge);

      const controls = document.createElement('div');
      controls.className = 'numeric-control';

      const minBtn = document.createElement('button');
      minBtn.type = 'button';
      minBtn.className = 'num-btn';
      minBtn.innerHTML = '<i data-lucide="minus"></i>';
      minBtn.addEventListener('click', () => adjustQty(item.id, -1));

      const input = document.createElement('input');
      input.type = 'number';
      input.id = `qty-${item.id}`;
      input.min = '0';
      input.placeholder = '0';
      input.value = draft[item.id] !== undefined ? draft[item.id] : '';
      input.addEventListener('input', () => {
        if (input.value < 0) input.value = 0;
        draft[item.id] = input.value === '' ? '' : parseInt(input.value);
        saveDraftAuto();
      });

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'num-btn';
      plusBtn.innerHTML = '<i data-lucide="plus"></i>';
      plusBtn.addEventListener('click', () => adjustQty(item.id, 1));

      controls.appendChild(minBtn);
      controls.appendChild(input);
      controls.appendChild(plusBtn);

      card.appendChild(info);
      card.appendChild(controls);
      grid.appendChild(card);
    });
    lucide.createIcons();
  }
}

// ==========================================
// DRAFT SYSTEM
// ==========================================
function saveDraftAuto() {
  const statusMsg = document.getElementById('draft-status-msg');
  statusMsg.className = 'draft-indicator saving';
  statusMsg.innerHTML = '<i data-lucide="loader"></i> Menyimpan draft...';
  lucide.createIcons();

  // Save metadata
  draft.tanggal = document.getElementById('input-tanggal').value;
  draft.toko = document.getElementById('input-toko').value;
  draft.crew = document.getElementById('input-crew').value;

  localStorage.setItem('momoyo_recap_draft', JSON.stringify(draft));

  setTimeout(() => {
    statusMsg.className = 'draft-indicator success';
    statusMsg.innerHTML = '<i data-lucide="check-circle-2"></i> Draft tersimpan otomatis';
    lucide.createIcons();
  }, 400);
}

function saveDraftManual() {
  saveDraftAuto();
  alert("Draft rekap stok berhasil disimpan secara lokal!");
}

function loadDraft() {
  const savedDraft = localStorage.getItem('momoyo_recap_draft');
  if (!savedDraft) {
    alert("Tidak ada draft tersimpan.");
    return;
  }

  draft = JSON.parse(savedDraft);
  
  if (draft.tanggal) document.getElementById('input-tanggal').value = draft.tanggal;
  if (draft.toko) document.getElementById('input-toko').value = draft.toko;
  if (draft.crew) document.getElementById('input-crew').value = draft.crew;

  // Re-render items
  renderFormItems();
  alert("Draft berhasil dimuat!");
}

function clearForm() {
  if (confirm("Apakah Anda yakin ingin mengosongkan seluruh form? Draft yang tersimpan akan dihapus.")) {
    draft = {};
    localStorage.removeItem('momoyo_recap_draft');
    
    // Clear inputs
    document.getElementById('rekap-stok-form').reset();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('input-tanggal').value = today;

    // Reset grid
    renderFormItems();
    
    const statusMsg = document.getElementById('draft-status-msg');
    statusMsg.className = 'draft-indicator';
    statusMsg.innerHTML = '<i data-lucide="info"></i> Form dibersihkan';
    lucide.createIcons();
  }
}

// ==========================================
// FORM SUBMISSION & GOOGLE FORM LINKING
// ==========================================
function handleFormSubmit(event) {
  event.preventDefault();

  const tanggal = document.getElementById('input-tanggal').value;
  const toko = document.getElementById('input-toko').value;
  const crew = document.getElementById('input-crew').value;

  if (!tanggal || !toko || !crew) {
    alert("Mohon lengkapi Tanggal, Toko, dan Nama Crew!");
    return;
  }

  // Gather values for all 73 items
  const itemValues = {};
  ITEM_FIELDS.forEach(item => {
    const inputVal = draft[item.id];
    itemValues[item.id] = (inputVal !== undefined && inputVal !== '') ? parseInt(inputVal) : 0;
  });

  // Create new recap object
  const newRecap = {
    id: 'recap-' + Date.now(),
    tanggal,
    toko,
    crew,
    items: itemValues
  };

  // Add to recaps state
  recaps.unshift(newRecap); // Add to beginning of array
  localStorage.setItem('momoyo_recaps', JSON.stringify(recaps));

  // Clear draft
  draft = {};
  localStorage.removeItem('momoyo_recap_draft');
  document.getElementById('rekap-stok-form').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('input-tanggal').value = today;
  renderFormItems();

  // Generate pre-filled Google Form URL
  const prefilledUrl = generatePrefilledFormUrl(newRecap);

  // Setup success popup modal links
  const gLink = document.getElementById('success-google-link');
  gLink.href = prefilledUrl;
  
  // Open Success Modal
  document.getElementById('success-modal').classList.add('active');
}

function closeSuccessModal() {
  document.getElementById('success-modal').classList.remove('active');
  switchView('history');
}

// Prefill Google Form Generator Engine
function generatePrefilledFormUrl(recap) {
  let url = `${GOOGLE_FORM_BASE_URL}?`;
  
  // Format Date for Google Forms query param (YYYY-MM-DD)
  url += `entry.1701275633=${encodeURIComponent(recap.tanggal)}`;
  // Store Name
  url += `&entry.468249070=${encodeURIComponent(recap.toko)}`;
  // Crew Name
  url += `&entry.440897246=${encodeURIComponent(recap.crew)}`;

  // Prefill stock items
  ITEM_FIELDS.forEach(item => {
    const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
    // We only attach to URL if user has entered a value. Let's prefill all to be explicit.
    url += `&entry.${item.id}=${encodeURIComponent(qty)}`;
  });

  return url;
}

// ==========================================
// DASHBOARD VIEW RENDERING
// ==========================================
function renderDashboard() {
  // Stat: Total
  document.getElementById('stat-total-recaps').textContent = recaps.length;

  // Stats: Store Recaps Count & Find active store
  const storeCounts = {};
  STORES.forEach(s => storeCounts[s] = 0);

  recaps.forEach(recap => {
    if (storeCounts[recap.toko] !== undefined) {
      storeCounts[recap.toko]++;
    }
  });

  // Render individual store badges in UI
  STORES.forEach((store, index) => {
    document.getElementById(`badge-store-${index}`).textContent = `${storeCounts[store]} Rekap`;
  });

  // Active Store Calculation
  let activeStore = '-';
  let maxCount = 0;
  for (const store in storeCounts) {
    if (storeCounts[store] > maxCount) {
      maxCount = storeCounts[store];
      activeStore = store.replace("Momoyo ", ""); // shorten name
    }
  }
  document.getElementById('stat-active-store').textContent = maxCount > 0 ? activeStore : '-';

  // Last Recap Info
  const lastRecapDateEl = document.getElementById('stat-last-recap-date');
  const lastRecapStoreEl = document.getElementById('stat-last-recap-store');

  if (recaps.length > 0) {
    // Since recaps are sorted in descending order or sorted by date, let's find the latest recap by date
    const sortedByDate = [...recaps].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    const latest = sortedByDate[0];
    lastRecapDateEl.textContent = formatDateString(latest.tanggal);
    lastRecapStoreEl.textContent = `di ${latest.toko.split(' (')[0]}`;
  } else {
    lastRecapDateEl.textContent = '-';
    lastRecapStoreEl.textContent = 'Belum ada data masuk';
  }

  // Render Recent Activity List (max 5 items)
  const activityList = document.getElementById('recent-activity-list');
  activityList.innerHTML = '';

  if (recaps.length === 0) {
    activityList.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox"></i>
        <p>Belum ada data rekap stok yang dimasukkan.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  const latestActivities = recaps.slice(0, 5);
  latestActivities.forEach(recap => {
    // Count filled items (qty > 0)
    let filledCount = 0;
    Object.values(recap.items).forEach(val => {
      if (val > 0) filledCount++;
    });

    const item = document.createElement('div');
    item.className = 'activity-item';

    item.innerHTML = `
      <div class="activity-meta">
        <div class="activity-badge">
          <i data-lucide="clipboard-check"></i>
        </div>
        <div class="activity-details">
          <h4>${recap.toko.split(' (')[0]}</h4>
          <p>${formatDateString(recap.tanggal)} &bull; Oleh Crew: <strong>${recap.crew}</strong></p>
        </div>
      </div>
      <div class="activity-actions">
        <span class="badge" style="background-color: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary); margin-right: 8px;">
          ${filledCount} Item
        </span>
        <button class="btn btn-outline btn-icon" onclick="openDetailsModal('${recap.id}')" title="Lihat Rincian">
          <i data-lucide="eye" style="width:14px; height:14px;"></i>
        </button>
        <a href="${generatePrefilledFormUrl(recap)}" target="_blank" class="btn btn-primary btn-icon" title="Kirim ke Google Form">
          <i data-lucide="external-link" style="width:14px; height:14px;"></i>
        </a>
      </div>
    `;
    activityList.appendChild(item);
  });

  lucide.createIcons();
}

// ==========================================
// HISTORY TABLE VIEW RENDERING
// ==========================================
function renderHistoryTable() {
  const storeFilter = document.getElementById('filter-store').value;
  const crewSearch = document.getElementById('history-search').value.toLowerCase().trim();
  const tableBody = document.getElementById('history-table-body');
  const emptyState = document.getElementById('history-empty-state');
  const table = document.getElementById('history-table');

  // Filter recaps list
  let filtered = recaps;
  if (storeFilter !== 'all') {
    filtered = filtered.filter(r => r.toko === storeFilter);
  }
  if (crewSearch !== '') {
    filtered = filtered.filter(r => r.crew.toLowerCase().includes(crewSearch));
  }

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    table.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  table.classList.remove('hidden');

  filtered.forEach(recap => {
    let filledCount = 0;
    Object.values(recap.items).forEach(val => {
      if (val > 0) filledCount++;
    });

    const tr = document.createElement('tr');
    tr.id = `row-${recap.id}`;

    tr.innerHTML = `
      <td><strong>${formatDateString(recap.tanggal)}</strong></td>
      <td>${recap.toko}</td>
      <td>${recap.crew}</td>
      <td><span class="badge">${filledCount} / 73 Item</span></td>
      <td class="text-right">
        <div class="table-actions">
          <button class="btn btn-outline" onclick="openDetailsModal('${recap.id}')">
            <i data-lucide="eye"></i> Rincian
          </button>
          <a href="${generatePrefilledFormUrl(recap)}" target="_blank" class="btn btn-primary">
            <i data-lucide="external-link"></i> Kirim Form
          </a>
          <button class="btn btn-outline-danger btn-icon" onclick="deleteRecap('${recap.id}')" title="Hapus">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  lucide.createIcons();
}

function deleteRecap(id) {
  if (confirm("Apakah Anda yakin ingin menghapus data rekap ini dari riwayat lokal?")) {
    recaps = recaps.filter(r => r.id !== id);
    localStorage.setItem('momoyo_recaps', JSON.stringify(recaps));
    renderHistoryTable();
  }
}

// ==========================================
// DETAILS MODAL VIEW HANDLERS
// ==========================================
let activeModalRecap = null;

function openDetailsModal(recapId) {
  const recap = recaps.find(r => r.id === recapId);
  if (!recap) return;

  activeModalRecap = recap;

  // Set Modal Headings
  document.getElementById('modal-title').textContent = recap.toko.split(' (')[0];
  document.getElementById('modal-subtitle').textContent = `Tanggal: ${formatDateString(recap.tanggal)} | Direkap oleh: ${recap.crew}`;

  // Configure Modal Actions
  const gfBtn = document.getElementById('modal-btn-google-form');
  gfBtn.onclick = () => {
    window.open(generatePrefilledFormUrl(recap), '_blank');
  };

  const csvBtn = document.getElementById('modal-btn-export-csv');
  csvBtn.onclick = () => {
    exportSingleToCSV(recap);
  };

  // Render items details list
  renderModalItemsList();

  // Open Modal Overlay
  document.getElementById('details-modal').classList.add('active');
  document.getElementById('modal-item-search').value = '';
  document.getElementById('modal-filter-filled').checked = false;
}

function closeModal() {
  document.getElementById('details-modal').classList.remove('active');
  activeModalRecap = null;
}

function renderModalItemsList() {
  const body = document.getElementById('modal-details-body');
  body.innerHTML = '';

  const searchQuery = document.getElementById('modal-item-search').value.toLowerCase().trim();
  const filterFilledOnly = document.getElementById('modal-filter-filled').checked;

  let count = 0;
  ITEM_FIELDS.forEach((item, index) => {
    const qty = activeModalRecap.items[item.id] !== undefined ? activeModalRecap.items[item.id] : 0;
    
    // Check search match
    if (searchQuery !== '' && !item.title.toLowerCase().includes(searchQuery)) {
      return;
    }

    // Check quantity filter
    if (filterFilledOnly && qty === 0) {
      return;
    }

    count++;
    const tr = document.createElement('tr');
    tr.className = qty > 0 ? 'highlight-qty' : 'inactive';

    tr.innerHTML = `
      <td>${item.num}</td>
      <td><strong>${item.title}</strong></td>
      <td><span class="badge badge-store" style="font-size: 0.7rem; font-weight: normal;">${item.category}</span></td>
      <td class="text-center"><strong>${qty}</strong></td>
    `;
    body.appendChild(tr);
  });
}

function filterModalDetails() {
  if (activeModalRecap) {
    renderModalItemsList();
  }
}

// ==========================================
// ANALYTICS & CHARTS SYSTEM (CHART.JS)
// ==========================================
function initAnalyticsControls() {
  const itemSelect = document.getElementById('analytics-item-select');
  
  // Clear select
  itemSelect.innerHTML = '';
  
  // Populate items
  ITEM_FIELDS.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.title;
    itemSelect.appendChild(opt);
  });
}

function getChartColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: isDark ? '#9ca3af' : '#4b5563',
    grid: isDark ? '#2b2e3a' : '#e5e7eb',
    accent: '#e11d48',
    secondary: '#f59e0b',
    stores: ['#e11d48', '#f59e0b', '#3b82f6', '#10b981'],
    storesFill: [
      'rgba(225, 29, 72, 0.1)',
      'rgba(245, 158, 11, 0.1)',
      'rgba(59, 130, 246, 0.1)',
      'rgba(16, 185, 129, 0.1)'
    ]
  };
}

function renderAnalyticsCharts() {
  const itemId = document.getElementById('analytics-item-select').value;
  const storeFilter = document.getElementById('analytics-store-select').value;
  const minThreshold = parseInt(document.getElementById('analytics-min-threshold').value) || 0;

  if (!itemId) return;

  const itemDetails = ITEM_FIELDS.find(i => i.id == itemId);
  document.getElementById('chart-item-badge').textContent = itemDetails ? itemDetails.category : '-';

  // Get configuration colors
  const colors = getChartColors();

  // Create Trend Chart Data
  // Sort recaps chronological by date (ascending)
  const sortedChronological = [...recaps].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
  
  const dates = Array.from(new Set(sortedChronological.map(r => r.tanggal)));
  
  let datasets = [];

  if (storeFilter === 'all') {
    // Create dataset for each store
    STORES.forEach((store, sIdx) => {
      const dataPoints = [];
      dates.forEach(d => {
        // Find recap on this date for this store
        const found = sortedChronological.find(r => r.tanggal === d && r.toko === store);
        dataPoints.push(found ? (found.items[itemId] || 0) : null); // null allows gaps in chart
      });

      datasets.push({
        label: store.split(' (')[0],
        data: dataPoints,
        borderColor: colors.stores[sIdx],
        backgroundColor: colors.stores[sIdx],
        borderWidth: 2,
        tension: 0.1,
        spanGaps: true,
        pointRadius: 4,
        pointHoverRadius: 6
      });
    });
  } else {
    // Dataset for single store
    const dataPoints = [];
    dates.forEach(d => {
      const found = sortedChronological.find(r => r.tanggal === d && r.toko === storeFilter);
      dataPoints.push(found ? (found.items[itemId] || 0) : 0);
    });

    datasets.push({
      label: storeFilter.split(' (')[0],
      data: dataPoints,
      borderColor: colors.accent,
      backgroundColor: 'rgba(225, 29, 72, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.15,
      pointRadius: 5,
      pointHoverRadius: 7
    });

    // Add min threshold line dataset
    if (minThreshold > 0) {
      datasets.push({
        label: 'Batas Minimum',
        data: Array(dates.length).fill(minThreshold),
        borderColor: colors.secondary,
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false
      });
    }
  }

  // Render Trend Chart
  const trendCtx = document.getElementById('trendChart').getContext('2d');
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  trendChartInstance = new Chart(trendCtx, {
    type: 'line',
    data: {
      labels: dates.map(d => formatDateString(d)),
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: colors.text, font: { family: 'Plus Jakarta Sans', weight: '600' } }
        },
        tooltip: {
          bodyFont: { family: 'Plus Jakarta Sans' },
          titleFont: { family: 'Plus Jakarta Sans', weight: '700' }
        }
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans' } }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans' } },
          min: 0
        }
      }
    }
  });

  // Create Bar Comparison Chart Data
  // For the selected item, find the LATEST stock level recorded for EACH store
  const comparisonData = STORES.map(store => {
    // Find latest recap for this store
    const storeRecaps = [...recaps].filter(r => r.toko === store)
      .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    
    if (storeRecaps.length > 0) {
      return {
        store: store.split(' (')[0],
        qty: storeRecaps[0].items[itemId] !== undefined ? storeRecaps[0].items[itemId] : 0,
        date: storeRecaps[0].tanggal
      };
    }
    return { store: store.split(' (')[0], qty: 0, date: null };
  });

  // Render Bar Comparison Chart
  const compareCtx = document.getElementById('compareChart').getContext('2d');
  if (compareChartInstance) {
    compareChartInstance.destroy();
  }

  compareChartInstance = new Chart(compareCtx, {
    type: 'bar',
    data: {
      labels: comparisonData.map(item => item.store),
      datasets: [{
        label: 'Stok Terakhir',
        data: comparisonData.map(item => item.qty),
        backgroundColor: colors.stores,
        borderRadius: 8,
        barThickness: 32
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          bodyFont: { family: 'Plus Jakarta Sans' },
          titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
          callbacks: {
            label: function(context) {
              const info = comparisonData[context.dataIndex];
              const dateStr = info.date ? ` (rekap: ${formatDateString(info.date)})` : ' (no data)';
              return `Stok: ${context.raw} unit${dateStr}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', weight: '600' } }
        },
        y: {
          grid: { color: colors.grid },
          ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans' } },
          min: 0
        }
      }
    }
  });
}

// ==========================================
// REPORT EXPORTS (CSV)
// ==========================================

// Helper: Download text file
function downloadFile(filename, content, contentType) {
  const blob = new Blob([content], { type: contentType });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Export a single recap record as CSV
function exportSingleToCSV(recap) {
  let csv = 'No,Nama Barang,Kategori,Jumlah Stok Fisik\n';
  
  ITEM_FIELDS.forEach(item => {
    const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
    csv += `"${item.num}","${item.title.replace(/"/g, '""')}","${item.category}","${qty}"\n`;
  });

  const filename = `Momoyo_Rekap_Stok_${recap.toko.replace(/[^a-zA-Z0-9]/g, '_')}_${recap.tanggal}.csv`;
  downloadFile(filename, csv, 'text/csv;charset=utf-8;');
}

// Export all history data consolidated as CSV
function exportAllToCSV() {
  if (recaps.length === 0) {
    alert("Tidak ada data riwayat rekap stok untuk diekspor!");
    return;
  }

  // Row header
  let csv = 'ID Laporan,Tanggal Rekap,Cabang Toko,Nama Crew';
  // Attach all item titles as column headers
  ITEM_FIELDS.forEach(item => {
    csv += `, "${item.title.replace(/"/g, '""')} (${item.category})"`;
  });
  csv += '\n';

  // Rows data
  recaps.forEach(recap => {
    csv += `"${recap.id}","${recap.tanggal}","${recap.toko.replace(/"/g, '""')}","${recap.crew.replace(/"/g, '""')}"`;
    ITEM_FIELDS.forEach(item => {
      const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
      csv += `,${qty}`;
    });
    csv += '\n';
  });

  downloadFile('Momoyo_Semua_Laporan_Rekap_Stok.csv', csv, 'text/csv;charset=utf-8;');
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function formatDateString(dateString) {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const d = new Date(dateString);
  // Indonesian format
  return d.toLocaleDateString('id-ID', options);
}

// ==========================================
// CONSOLIDATED RECAP MATRIX SYSTEM
// ==========================================

// Render the consolidated matrix table based on selected filters
function renderConsolidatedMatrix() {
  const startDateVal = document.getElementById('consolidated-start-date').value;
  const endDateVal = document.getElementById('consolidated-end-date').value;
  const storeFilter = document.getElementById('consolidated-store-select').value;
  const searchQuery = document.getElementById('consolidated-item-search').value.toLowerCase().trim();
  const displayMode = document.getElementById('consolidated-display-mode').value;

  const tableHead = document.getElementById('consolidated-table-head');
  const tableBody = document.getElementById('consolidated-table-body');
  const emptyState = document.getElementById('consolidated-empty-state');
  const table = document.getElementById('consolidated-table');
  const badgeCount = document.getElementById('consolidated-badge-count');

  if (!startDateVal || !endDateVal) return;

  const start = new Date(startDateVal);
  const end = new Date(endDateVal);

  // Filter recaps by date range and store
  let filtered = recaps.filter(recap => {
    const recapDate = new Date(recap.tanggal);
    // Date range check (inclusive)
    const matchesDate = recapDate >= start && recapDate <= end;
    // Store check
    const matchesStore = storeFilter === 'all' || recap.toko === storeFilter;
    return matchesDate && matchesStore;
  });

  // Sort chronologically: older first (left to right)
  filtered.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  badgeCount.textContent = `${filtered.length} Laporan Tergabung`;

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    table.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  table.classList.remove('hidden');

  // Build Headers
  tableHead.innerHTML = '';
  const trHead = document.createElement('tr');
  
  // Standard columns
  trHead.innerHTML = `
    <th>No</th>
    <th>Nama Barang</th>
    <th>Kategori</th>
  `;

  if (displayMode === 'matrix') {
    // Each recap gets a column
    filtered.forEach(recap => {
      const th = document.createElement('th');
      th.className = 'text-center th-recap-col';
      const storeShort = recap.toko.split(' (')[0].replace("Momoyo ", "");
      th.innerHTML = `
        <div style="font-size: 0.82rem; font-weight: 800;">${formatDateString(recap.tanggal)}</div>
        <div style="font-size: 0.7rem; color: var(--text-secondary); font-weight: normal; margin-top: 2px;">${storeShort}</div>
      `;
      trHead.appendChild(th);
    });
  } else {
    // Summary columns
    trHead.innerHTML += `
      <th class="text-center">Total Akumulasi</th>
      <th class="text-center">Rata-rata Stok</th>
      <th class="text-center">Stok Terendah</th>
      <th class="text-center">Stok Tertinggi</th>
    `;
  }
  tableHead.appendChild(trHead);

  // Build Body Rows for the 73 items
  tableBody.innerHTML = '';

  ITEM_FIELDS.forEach(item => {
    // Search query filter
    if (searchQuery !== '' && !item.title.toLowerCase().includes(searchQuery)) {
      return;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.num}</td>
      <td><strong>${item.title}</strong></td>
      <td><span class="badge badge-store" style="font-size: 0.7rem; font-weight: normal;">${item.category}</span></td>
    `;

    if (displayMode === 'matrix') {
      let hasPositive = false;
      
      // Get stock level for each recap
      filtered.forEach(recap => {
        const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
        const td = document.createElement('td');
        td.className = 'text-center';
        
        if (qty > 0) {
          td.innerHTML = `<strong>${qty}</strong>`;
          td.style.backgroundColor = 'rgba(16, 185, 129, 0.04)';
          td.style.color = 'var(--success-color)';
          hasPositive = true;
        } else {
          td.innerHTML = `<span style="color: var(--text-secondary); opacity: 0.4;">0</span>`;
        }
        tr.appendChild(td);
      });

      if (!hasPositive) {
        tr.style.opacity = '0.55'; // Fade out items with zero stock across all filtered dates
      }
    } else {
      // Summary calculations
      let total = 0;
      let minVal = Infinity;
      let maxVal = -Infinity;
      let count = 0;

      filtered.forEach(recap => {
        const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
        total += qty;
        if (qty < minVal) minVal = qty;
        if (qty > maxVal) maxVal = qty;
        count++;
      });

      const avg = count > 0 ? (total / count).toFixed(1) : 0;
      const minStock = minVal === Infinity ? 0 : minVal;
      const maxStock = maxVal === -Infinity ? 0 : maxVal;

      tr.innerHTML += `
        <td class="text-center"><strong>${total}</strong></td>
        <td class="text-center" style="color: var(--info-color);"><strong>${avg}</strong></td>
        <td class="text-center" style="color: var(--danger-color);">${minStock}</td>
        <td class="text-center" style="color: var(--success-color);">${maxStock}</td>
      `;

      if (total === 0) {
        tr.style.opacity = '0.55';
      }
    }

    tableBody.appendChild(tr);
  });
}

// Export the filtered matrix directly to CSV
function exportConsolidatedMatrixToCSV() {
  const startDateVal = document.getElementById('consolidated-start-date').value;
  const endDateVal = document.getElementById('consolidated-end-date').value;
  const storeFilter = document.getElementById('consolidated-store-select').value;
  const displayMode = document.getElementById('consolidated-display-mode').value;

  if (!startDateVal || !endDateVal) {
    alert("Mohon tentukan tanggal mulai dan tanggal selesai!");
    return;
  }

  const start = new Date(startDateVal);
  const end = new Date(endDateVal);

  let filtered = recaps.filter(recap => {
    const recapDate = new Date(recap.tanggal);
    const matchesDate = recapDate >= start && recapDate <= end;
    const matchesStore = storeFilter === 'all' || recap.toko === storeFilter;
    return matchesDate && matchesStore;
  });

  filtered.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  if (filtered.length === 0) {
    alert("Tidak ada data rekap stok untuk diekspor dalam periode ini!");
    return;
  }

  let csv = 'No,Nama Barang,Kategori';

  if (displayMode === 'matrix') {
    // Add columns for each recap date + store
    filtered.forEach(recap => {
      const storeShort = recap.toko.split(' (')[0].replace("Momoyo ", "");
      csv += `, "${recap.tanggal} (${storeShort})"`;
    });
    csv += '\n';

    // Add rows
    ITEM_FIELDS.forEach(item => {
      csv += `"${item.num}","${item.title.replace(/"/g, '""')}","${item.category}"`;
      filtered.forEach(recap => {
        const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
        csv += `,${qty}`;
      });
      csv += '\n';
    });
  } else {
    // Summary Headers
    csv += ',Total Akumulasi,Rata-rata,Minimum,Maximum\n';

    // Add rows
    ITEM_FIELDS.forEach(item => {
      let total = 0;
      let minVal = Infinity;
      let maxVal = -Infinity;
      let count = 0;

      filtered.forEach(recap => {
        const qty = recap.items[item.id] !== undefined ? recap.items[item.id] : 0;
        total += qty;
        if (qty < minVal) minVal = qty;
        if (qty > maxVal) maxVal = qty;
        count++;
      });

      const avg = count > 0 ? (total / count).toFixed(2) : 0;
      const minStock = minVal === Infinity ? 0 : minVal;
      const maxStock = maxVal === -Infinity ? 0 : maxVal;

      csv += `"${item.num}","${item.title.replace(/"/g, '""')}","${item.category}",${total},${avg},${minStock},${maxStock}\n`;
    });
  }

  const filename = `Momoyo_Konsolidasi_Stok_${startDateVal}_sd_${endDateVal}.csv`;
  downloadFile(filename, csv, 'text/csv;charset=utf-8;');
}
