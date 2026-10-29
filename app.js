/**
 * Smart Space Organizer - Frontend Application Logic
 * Pure Vanilla JavaScript (ES6+)
 * Fully integrated with Flask Backend & SQLite Database.
 * Exact dynamic counts directly from the backend (no hardcoded fallback counts).
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Global Application State ---
  let storedItems = [];
  let selectedLocation = '';
  let selectedSubLocation = '';
  let selectedImageFile = null;
  let uploadedImageBase64 = null;
  let selectedLocImageFile = null;
  let uploadedLocImageBase64 = null;
  let selectedSpace = 'Study Desk';
  let uploadedSpaceImageBase64 = null;
  let currentUser = null;

  // --- DOM Elements ---
  const viewLanding = document.getElementById('viewLanding');
  const viewStoreItem = document.getElementById('viewStoreItem');
  const viewSubLocation = document.getElementById('viewSubLocation');
  const viewSaveLocation = document.getElementById('viewSaveLocation');
  const viewLocationResult = document.getElementById('viewLocationResult');
  const viewSpaceUpload = document.getElementById('viewSpaceUpload');
  const viewSpaceDimensions = document.getElementById('viewSpaceDimensions');
  const viewSpaceAiPlan = document.getElementById('viewSpaceAiPlan');
  const viewFindItem = document.getElementById('viewFindItem');

  // Navigation Items
  const navHome = document.getElementById('navHome');
  const navFind = document.getElementById('navFind');
  const navSpaces = document.getElementById('navSpaces');
  const navItems = document.getElementById('navItems');
  const navOrganize = document.getElementById('navOrganize');
  const navSettings = document.getElementById('navSettings');
  const sidebarLogo = document.getElementById('sidebarLogo');
  const brandHeaderHome = document.getElementById('brandHeaderHome');
  const btnLoginHeader = document.getElementById('btnLoginHeader');
  const loginBtnLabel = document.getElementById('loginBtnLabel');
  const avatarProfileBtn = document.getElementById('avatarProfileBtn');

  // Page 1: Landing
  const btnCreateItem = document.getElementById('btnCreateItem');
  const statItemsCount = document.getElementById('statItemsCount');
  const statLocationsCount = document.getElementById('statLocationsCount');
  const statSpacesCount = document.getElementById('statSpacesCount');
  const cardItemsStored = document.getElementById('cardItemsStored');
  const cardLocationsSaved = document.getElementById('cardLocationsSaved');
  const cardSpacesOrganized = document.getElementById('cardSpacesOrganized');

  // Page 2: Store an Item
  const btnBackToHome = document.getElementById('btnBackToHome');
  const btnCancelStore = document.getElementById('btnCancelStore');
  const btnNextAction = document.getElementById('btnNextAction');
  const tabTypeItem = document.getElementById('tabTypeItem');
  const tabUploadImage = document.getElementById('tabUploadImage');
  const itemSearchInput = document.getElementById('itemSearchInput');
  const btnClearInput = document.getElementById('btnClearInput');
  const suggestionChips = document.querySelectorAll('.item-chip');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const fileInput = document.getElementById('fileInput');
  const uploadDefaultContent = document.getElementById('uploadDefaultContent');
  const uploadPreviewContainer = document.getElementById('uploadPreviewContainer');
  const previewImage = document.getElementById('previewImage');
  const previewFilename = document.getElementById('previewFilename');
  const previewAiTag = document.getElementById('previewAiTag');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const locationCards = document.querySelectorAll('.location-card');
  const customDetailRow = document.getElementById('customDetailRow');
  const customLocationInput = document.getElementById('customLocationInput');

  // Page 4: Sub-Location
  const btnBackToStore = document.getElementById('btnBackToStore');
  const subLocationTitle = document.getElementById('subLocationTitle');
  const subLocationSubtitle = document.getElementById('subLocationSubtitle');
  const subLocationOptionsList = document.getElementById('subLocationOptionsList');
  const customSubLocationInput = document.getElementById('customSubLocationInput');
  const btnNextToSaveLocation = document.getElementById('btnNextToSaveLocation');

  // Page 5: Save Location (with Image)
  const btnBackToSubLocation = document.getElementById('btnBackToSubLocation');
  const locationUploadDropzone = document.getElementById('locationUploadDropzone');
  const locationFileInput = document.getElementById('locationFileInput');
  const locUploadDefaultContent = document.getElementById('locUploadDefaultContent');
  const locUploadPreviewContainer = document.getElementById('locUploadPreviewContainer');
  const locPreviewImage = document.getElementById('locPreviewImage');
  const locPreviewFilename = document.getElementById('locPreviewFilename');
  const btnRemoveLocImage = document.getElementById('btnRemoveLocImage');
  const customNoteInput = document.getElementById('customNoteInput');
  const btnSaveFinalLocation = document.getElementById('btnSaveFinalLocation');

  // Page 6: Item Location Result
  const resultItemThumb = document.getElementById('resultItemThumb');
  const resultItemName = document.getElementById('resultItemName');
  const resultBreadcrumbs = document.getElementById('resultBreadcrumbs');
  const resultCurrentLocHierarchy = document.getElementById('resultCurrentLocHierarchy');
  const resultSavedDate = document.getElementById('resultSavedDate');
  const btnAddAnotherItem = document.getElementById('btnAddAnotherItem');
  const btnDecorateMySpace = document.getElementById('btnDecorateMySpace');
  const btnFindAnotherItem = document.getElementById('btnFindAnotherItem');

  // Page 7: Space Upload
  const btnBackToHomeFromSpace = document.getElementById('btnBackToHomeFromSpace');
  const spaceRoomDropzone = document.getElementById('spaceRoomDropzone');
  const spaceRoomFileInput = document.getElementById('spaceRoomFileInput');
  const spaceRoomDefaultContent = document.getElementById('spaceRoomDefaultContent');
  const spaceRoomPreview = document.getElementById('spaceRoomPreview');
  const spaceRoomPreviewImg = document.getElementById('spaceRoomPreviewImg');
  const spaceRoomFilename = document.getElementById('spaceRoomFilename');
  const btnRemoveSpaceRoomImage = document.getElementById('btnRemoveSpaceRoomImage');
  const chooseSpaceGrid = document.getElementById('chooseSpaceGrid');
  const btnAddCustomSpaceLink = document.getElementById('btnAddCustomSpaceLink');
  const customSpaceInputWrap = document.getElementById('customSpaceInputWrap');
  const customSpaceTextInput = document.getElementById('customSpaceTextInput');
  const btnNextToDimensions = document.getElementById('btnNextToDimensions');

  // Page 8: Space Dimensions
  const btnBackToSpaceUpload = document.getElementById('btnBackToSpaceUpload');
  const btnSkipDimensions = document.getElementById('btnSkipDimensions');
  const btnNextToAiPlan = document.getElementById('btnNextToAiPlan');

  // Page 9: AI Plan
  const btnBackToDimensions = document.getElementById('btnBackToDimensions');
  const aiPlanSpaceImg = document.getElementById('aiPlanSpaceImg');
  const aiPlanSuggestionsList = document.getElementById('aiPlanSuggestionsList');
  const btnFinishAiPlan = document.getElementById('btnFinishAiPlan');

  // Page 10: Find My Item
  const btnBackFromFind = document.getElementById('btnBackFromFind');
  const btnAddNewFromFind = document.getElementById('btnAddNewFromFind');
  const findItemInput = document.getElementById('findItemInput');
  const btnClearFindInput = document.getElementById('btnClearFindInput');
  const findChips = document.querySelectorAll('.find-chip');
  const findTopMatchWrapper = document.getElementById('findTopMatchWrapper');
  const topMatchThumb = document.getElementById('topMatchThumb');
  const topMatchName = document.getElementById('topMatchName');
  const topMatchPath = document.getElementById('topMatchPath');
  const topMatchDate = document.getElementById('topMatchDate');
  const btnTopMatchFind = document.getElementById('btnTopMatchFind');
  const btnTopMatchDelete = document.getElementById('btnTopMatchDelete');
  let topMatchCurrentItem = null;
  const findResultsHeader = document.getElementById('findResultsHeader');
  const findResultsCount = document.getElementById('findResultsCount');
  const findResultsGrid = document.getElementById('findResultsGrid');
  const findEmptyState = document.getElementById('findEmptyState');
  const btnEmptyAdd = document.getElementById('btnEmptyAdd');

  // Modals
  const storedItemsModal = document.getElementById('storedItemsModal');
  const btnCloseItemsModal = document.getElementById('btnCloseItemsModal');
  const modalFilterInput = document.getElementById('modalFilterInput');
  const storedItemsList = document.getElementById('storedItemsList');

  const loginModal = document.getElementById('loginModal');
  const btnCloseLoginModal = document.getElementById('btnCloseLoginModal');
  const btnSimulateLogin = document.getElementById('btnSimulateLogin');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');

  const toastContainer = document.getElementById('toastContainer');

  // --- Sub-location Presets ---
  const subLocationPresets = {
    'Drawer': {
      title: 'Which drawer?',
      subtitle: 'Select the specific drawer where you kept it.',
      placeholder: 'e.g. Second drawer below the mirror',
      options: [
        'Drawer under Study Desk',
        'Drawer inside Dressing Table',
        'Bedside Drawer',
        'Kitchen Drawer',
        'Wardrobe Drawer',
        'Other Drawer'
      ]
    },
    'Wardrobe': {
      title: 'Which part of the wardrobe?',
      subtitle: 'Select the specific wardrobe section where you kept it.',
      placeholder: 'e.g. Middle shelf behind winter coats',
      options: [
        'Upper Hanging Rail',
        'Top Storage Shelf',
        'Bottom Shoe Rack',
        'Drawer inside Wardrobe',
        'Coat & Jacket Section',
        'Other Wardrobe Section'
      ]
    },
    'Bedroom': {
      title: 'Which bedroom spot?',
      subtitle: 'Select the specific spot in the bedroom where you kept it.',
      placeholder: 'e.g. Behind the pillow on the right',
      options: [
        'Left Bedside Table',
        'Right Nightstand',
        'Under Bed Storage',
        'Dressing Table Top',
        'Bedroom Bookshelf',
        'Other Bedroom Spot'
      ]
    },
    'Kitchen': {
      title: 'Which kitchen spot?',
      subtitle: 'Select the specific cabinet or spot where you kept it.',
      placeholder: 'e.g. Top shelf next to the blender',
      options: [
        'Upper Spice Cabinet',
        'Pantry Main Shelf',
        'Countertop Organizer',
        'Dish Rack Area',
        'Under-Sink Cabinet',
        'Other Kitchen Spot'
      ]
    },
    'Dressing Table': {
      title: 'Which dressing table spot?',
      subtitle: 'Select the specific tray or drawer where you kept it.',
      placeholder: 'e.g. In the acrylic drawer organizer',
      options: [
        'Velvet Jewelry Tray',
        'Center Vanity Drawer',
        'Mirrored Table Surface',
        'Makeup Organizer Box',
        'Side Accessory Shelf',
        'Other Dressing Table Spot'
      ]
    },
    'Study Desk': {
      title: 'Which desk spot?',
      subtitle: 'Select the specific spot on or around your desk.',
      placeholder: 'e.g. Under the monitor on the left',
      options: [
        'Desk Surface Tray',
        'Cable Management Box',
        'Monitor Stand Shelf',
        'Desk Drawers Unit',
        'Pen & Stationery Stand',
        'Other Study Desk Spot'
      ]
    },
    'Storage Box': {
      title: 'Which storage box?',
      subtitle: 'Select the specific container or tote where you kept it.',
      placeholder: 'e.g. Blue bin on top closet shelf',
      options: [
        'Clear Plastic Bin #1',
        'Labeled Documents Box',
        'Winter Items Container',
        'Electronics Gadgets Tote',
        'Memory & Keepsake Box',
        'Other Storage Box'
      ]
    },
    'Other': {
      title: 'Which specific area?',
      subtitle: 'Select or specify the area where you kept it.',
      placeholder: 'e.g. Living room shelf beside TV',
      options: [
        'Living Room Cabinet',
        'Entryway Console Table',
        'Hallway Shoe Cabinet',
        'Balcony Utility Shelf',
        'Bathroom Medicine Cabinet',
        'Custom Dedicated Spot'
      ]
    }
  };

  const itemLocationHints = {
    'charger': 'Study Desk',
    'macbook': 'Study Desk',
    'laptop': 'Study Desk',
    'passport': 'Wardrobe',
    'clothes': 'Wardrobe',
    'coat': 'Wardrobe',
    'shirt': 'Wardrobe',
    'watch': 'Dressing Table',
    'perfume': 'Dressing Table',
    'makeup': 'Dressing Table',
    'keys': 'Drawer',
    'airpods': 'Bedroom',
    'earphones': 'Bedroom',
    'pillow': 'Bedroom',
    'coffee': 'Kitchen',
    'cup': 'Kitchen',
    'spices': 'Kitchen',
    'scissors': 'Drawer',
    'toolbox': 'Storage Box',
    'documents': 'Drawer'
  };

  const spaceAiSuggestionsPresets = {
    'Study Desk': [
      { num: '1', badge: 'badge-rose', title: 'Frequently used items', desc: "Keep these within arm's reach." },
      { num: '2', badge: 'badge-violet', title: 'Small items', desc: 'Use a small organizer box.' },
      { num: '3', badge: 'badge-blue', title: 'Documents', desc: 'Place vertically in a file holder.' },
      { num: '4', badge: 'badge-indigo', title: 'Cables', desc: 'Use cable clips and a cable box.' },
      { num: '5', badge: 'badge-pink', title: 'Rarely used items', desc: 'Move to upper storage.' }
    ],
    'Bedroom': [
      { num: '1', badge: 'badge-rose', title: 'Frequently used items', desc: 'Keep phone charger & glasses on nightstand.' },
      { num: '2', badge: 'badge-violet', title: 'Small accessories', desc: 'Store in a velvet bedside catchall tray.' },
      { num: '3', badge: 'badge-blue', title: 'Books & reading', desc: 'Stack vertically in bedside shelf.' },
      { num: '4', badge: 'badge-indigo', title: 'Bedding & blankets', desc: 'Store folded in a storage bench or basket.' },
      { num: '5', badge: 'badge-pink', title: 'Rarely used items', desc: 'Store in under-bed rolling organizer bins.' }
    ],
    'Wardrobe': [
      { num: '1', badge: 'badge-rose', title: 'Daily wear & shirts', desc: 'Hang on matching velvet hangers at eye level.' },
      { num: '2', badge: 'badge-violet', title: 'Ties & accessories', desc: 'Use hanging door hooks or slide-out ties rack.' },
      { num: '3', badge: 'badge-blue', title: 'Folded knitwear', desc: 'Stack in vertical divider compartments.' },
      { num: '4', badge: 'badge-indigo', title: 'Socks & intimates', desc: 'Separate with honeycomb drawer dividers.' },
      { num: '5', badge: 'badge-pink', title: 'Seasonal coats & bags', desc: 'Move to high top-shelf organizers.' }
    ],
    'Dressing Table': [
      { num: '1', badge: 'badge-rose', title: 'Daily skincare & scents', desc: 'Keep on rotating acrylic turntable tray.' },
      { num: '2', badge: 'badge-violet', title: 'Brushes & cosmetics', desc: 'Organize in upright cup canisters.' },
      { num: '3', badge: 'badge-blue', title: 'Jewelry & watches', desc: 'Store in velvet-lined drawer organizers.' },
      { num: '4', badge: 'badge-indigo', title: 'Hair styling appliances', desc: 'Hang on side heat-resistant holster hooks.' },
      { num: '5', badge: 'badge-pink', title: 'Backup beauty bottles', desc: 'Store inside lower cabinet vanity baskets.' }
    ],
    'Kitchen': [
      { num: '1', badge: 'badge-rose', title: 'Everyday spices & oils', desc: 'Place near stovetop on a revolving tier.' },
      { num: '2', badge: 'badge-violet', title: 'Cutlery & tools', desc: 'Organize into bamboo drawer dividers.' },
      { num: '3', badge: 'badge-blue', title: 'Plates & bowls', desc: 'Stack neatly in lower easily reached cabinets.' },
      { num: '4', badge: 'badge-indigo', title: 'Pantry dry grains', desc: 'Pour into labeled airtight glass jars.' },
      { num: '5', badge: 'badge-pink', title: 'Specialty cookware', desc: 'Store in deep bottom pull-out drawers.' }
    ],
    'Drawer': [
      { num: '1', badge: 'badge-rose', title: 'High-touch items', desc: 'Place wallet, keys & badge right in front.' },
      { num: '2', badge: 'badge-violet', title: 'Loose stationery', desc: 'Use segmented small organizer trays.' },
      { num: '3', badge: 'badge-blue', title: 'Important papers', desc: 'Keep flat inside labeled protective folders.' },
      { num: '4', badge: 'badge-indigo', title: 'Cables & adapters', desc: 'Bundle neatly with silicone cable ties.' },
      { num: '5', badge: 'badge-pink', title: 'Spare batteries & supplies', desc: 'Tuck away into back partitioned row.' }
    ],
    'Storage Area': [
      { num: '1', badge: 'badge-rose', title: 'Emergency & utility tools', desc: 'Hang on visible pegboard within quick reach.' },
      { num: '2', badge: 'badge-violet', title: 'Hardware & screws', desc: 'Organize into clear compartment bins.' },
      { num: '3', badge: 'badge-blue', title: 'Cleaning caddy', desc: 'Keep grouped together in a portable bucket.' },
      { num: '4', badge: 'badge-indigo', title: 'Holiday decor', desc: 'Pack into heavy-duty labeled totes.' },
      { num: '5', badge: 'badge-pink', title: 'Archive storage boxes', desc: 'Stack securely on reinforced lower racks.' }
    ],
    'Other': [
      { num: '1', badge: 'badge-rose', title: 'Frequently used items', desc: "Keep these within arm's reach." },
      { num: '2', badge: 'badge-violet', title: 'Small items', desc: 'Use a small organizer box.' },
      { num: '3', badge: 'badge-blue', title: 'Documents', desc: 'Place vertically in a file holder.' },
      { num: '4', badge: 'badge-indigo', title: 'Cables', desc: 'Use cable clips and a cable box.' },
      { num: '5', badge: 'badge-pink', title: 'Rarely used items', desc: 'Move to upper storage.' }
    ]
  };

  // --------------------------------------------------------------------------
  // BACKEND API INTEGRATION: EXACT REAL STATS & OBJECTS
  // --------------------------------------------------------------------------

  /**
   * Fetches the exact real metrics from the SQLite database.
   * If 1 item is saved, it renders 1. If 5 rooms are saved, it renders 5.
   */
  async function updateStats() {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        // Exact real counts from database — NO fake additions!
        if (statItemsCount) statItemsCount.textContent = data.items_stored !== undefined ? data.items_stored : 0;
        if (statLocationsCount) statLocationsCount.textContent = data.locations_saved !== undefined ? data.locations_saved : 0;
        if (statSpacesCount) statSpacesCount.textContent = data.spaces_organized !== undefined ? data.spaces_organized : 0;
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  }

  /**
   * Loads user objects from SQLite via backend API.
   */
  async function loadBackendObjects() {
    try {
      const response = await fetch('/api/objects');
      if (response.ok) {
        const objects = await response.json();
        storedItems = objects.map(obj => ({
          id: String(obj.id),
          name: obj.object_name,
          location: obj.room_name || 'General Storage',
          subLocation: obj.location_name || '',
          detail: obj.full_location_path || (obj.room_name ? `${obj.room_name} → ${obj.location_name || ''}` : ''),
          note: obj.description || '',
          image: obj.image_path || null,
          locationImage: null,
          date: obj.created_at ? formatDisplayDate(obj.created_at) : 'Saved'
        }));
        await updateStats();
        renderFindResults(storedItems);
      }
    } catch (err) {
      console.error('Error loading backend objects:', err);
    }
  }

  /**
   * Check current session on startup.
   */
  async function checkAuthSession() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          currentUser = data.user;
          if (loginBtnLabel) {
            loginBtnLabel.textContent = currentUser.username || 'Account';
          }
        }
      }
    } catch (e) {
      console.warn('Auth check skipped:', e);
    }
  }

  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'Saved';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'Saved';
      const now = new Date();
      const diffMs = now - d;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 24) return 'Today';
      if (diffHours < 48) return 'Yesterday';
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch (e) {
      return 'Saved';
    }
  }

  // --------------------------------------------------------------------------
  // VIEW NAVIGATION FLOW
  // --------------------------------------------------------------------------
  const allViews = [
    viewLanding,
    viewStoreItem,
    viewSubLocation,
    viewSaveLocation,
    viewLocationResult,
    viewSpaceUpload,
    viewSpaceDimensions,
    viewSpaceAiPlan,
    viewFindItem
  ];

  const allNavButtons = [navHome, navFind, navSpaces, navItems, navOrganize, navSettings];

  function switchView(viewName) {
    allViews.forEach(v => {
      if (v) v.classList.remove('active-view');
    });

    allNavButtons.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    if (viewName === 'store') {
      if (viewStoreItem) viewStoreItem.classList.add('active-view');
      if (navOrganize) navOrganize.classList.add('active');
      window.location.hash = '#store';
      setTimeout(() => itemSearchInput && itemSearchInput.focus(), 200);
    } else if (viewName === 'sublocation') {
      if (viewSubLocation) viewSubLocation.classList.add('active-view');
      if (navOrganize) navOrganize.classList.add('active');
      window.location.hash = '#sublocation';
    } else if (viewName === 'savelocation') {
      if (viewSaveLocation) viewSaveLocation.classList.add('active-view');
      if (navOrganize) navOrganize.classList.add('active');
      window.location.hash = '#savelocation';
    } else if (viewName === 'result') {
      if (viewLocationResult) viewLocationResult.classList.add('active-view');
      if (navOrganize) navOrganize.classList.add('active');
      window.location.hash = '#result';
    } else if (viewName === 'spaceupload') {
      if (viewSpaceUpload) viewSpaceUpload.classList.add('active-view');
      if (navSpaces) navSpaces.classList.add('active');
      window.location.hash = '#spaceupload';
    } else if (viewName === 'spacedimensions') {
      if (viewSpaceDimensions) viewSpaceDimensions.classList.add('active-view');
      if (navSpaces) navSpaces.classList.add('active');
      window.location.hash = '#spacedimensions';
    } else if (viewName === 'spaceaiplan') {
      if (viewSpaceAiPlan) viewSpaceAiPlan.classList.add('active-view');
      if (navSpaces) navSpaces.classList.add('active');
      window.location.hash = '#spaceaiplan';
      renderAiPlanSuggestions(selectedSpace);
    } else if (viewName === 'find') {
      if (viewFindItem) viewFindItem.classList.add('active-view');
      if (navFind) navFind.classList.add('active');
      window.location.hash = '#find';
      loadBackendObjects();
      setTimeout(() => findItemInput && findItemInput.focus(), 200);
    } else {
      if (viewLanding) viewLanding.classList.add('active-view');
      if (navHome) navHome.classList.add('active');
      window.location.hash = '#landing';
    }

    updateStats();
  }

  function handleUrlHash() {
    const hash = window.location.hash;
    if (hash === '#store') {
      switchView('store');
    } else if (hash === '#sublocation') {
      switchView('sublocation');
    } else if (hash === '#savelocation') {
      switchView('savelocation');
    } else if (hash === '#result') {
      switchView('result');
    } else if (hash === '#spaceupload') {
      switchView('spaceupload');
    } else if (hash === '#spacedimensions') {
      switchView('spacedimensions');
    } else if (hash === '#spaceaiplan') {
      switchView('spaceaiplan');
    } else if (hash === '#find') {
      switchView('find');
    } else {
      switchView('landing');
    }
  }

  window.addEventListener('popstate', handleUrlHash);

  // Navigation Click Handlers
  // Find My Item buttons (header + landing hero button)
  const btnHeaderFind = document.getElementById('btnHeaderFind');
  const btnLandingFindItem = document.getElementById('btnLandingFindItem');
  const btnHomeFromResult = document.getElementById('btnHomeFromResult');

  if (btnHeaderFind) btnHeaderFind.addEventListener('click', () => switchView('find'));
  if (btnLandingFindItem) btnLandingFindItem.addEventListener('click', () => switchView('find'));
  if (btnHomeFromResult) btnHomeFromResult.addEventListener('click', () => switchView('landing'));

  if (btnCreateItem) btnCreateItem.addEventListener('click', () => switchView('store'));
  if (btnBackToHome) btnBackToHome.addEventListener('click', () => switchView('landing'));
  if (btnCancelStore) btnCancelStore.addEventListener('click', () => {
    resetAllForms();
    switchView('landing');
  });
  if (brandHeaderHome) brandHeaderHome.addEventListener('click', () => switchView('landing'));
  if (sidebarLogo) sidebarLogo.addEventListener('click', () => switchView('landing'));
  if (navHome) navHome.addEventListener('click', () => switchView('landing'));
  if (navFind) navFind.addEventListener('click', () => switchView('find'));
  if (navSpaces) navSpaces.addEventListener('click', () => switchView('spaceupload'));
  if (navOrganize) navOrganize.addEventListener('click', () => switchView('store'));
  if (navItems) navItems.addEventListener('click', () => openStoredItemsModal());
  if (navSettings) navSettings.addEventListener('click', () => {
    showToast('System Active', 'Connected to Flask backend & SQLite database.');
  });

  // --------------------------------------------------------------------------
  // PAGE 2: MODE TOGGLE, SEARCH & AI RECOGNITION
  // --------------------------------------------------------------------------
  if (tabTypeItem) {
    tabTypeItem.addEventListener('click', () => {
      tabTypeItem.classList.add('active');
      if (tabUploadImage) tabUploadImage.classList.remove('active');
      if (itemSearchInput) itemSearchInput.focus();
    });
  }

  if (tabUploadImage) {
    tabUploadImage.addEventListener('click', () => {
      tabUploadImage.classList.add('active');
      if (tabTypeItem) tabTypeItem.classList.remove('active');
      if (fileInput) fileInput.click();
    });
  }

  if (itemSearchInput) {
    itemSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.trim().length > 0) {
        if (btnClearInput) btnClearInput.classList.add('visible');
        checkSmartLocationSuggestion(val);
      } else {
        if (btnClearInput) btnClearInput.classList.remove('visible');
      }
    });
  }

  if (btnClearInput) {
    btnClearInput.addEventListener('click', () => {
      itemSearchInput.value = '';
      btnClearInput.classList.remove('visible');
      itemSearchInput.focus();
    });
  }

  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.dataset.item || chip.textContent.trim();
      const cleanName = text.replace(/^[^\w\s]+/, '').trim();
      itemSearchInput.value = cleanName;
      if (btnClearInput) btnClearInput.classList.add('visible');
      checkSmartLocationSuggestion(cleanName);
      showToast('Smart Suggestion', `Suggested spot for "${cleanName}" highlighted below.`);
    });
  });

  function checkSmartLocationSuggestion(query) {
    const lower = query.toLowerCase();
    for (const [keyword, suggestedLocation] of Object.entries(itemLocationHints)) {
      if (lower.includes(keyword)) {
        selectLocationByName(suggestedLocation);
        break;
      }
    }
  }

  // Location Card Selection
  locationCards.forEach(card => {
    card.addEventListener('click', () => {
      const locName = card.dataset.location;
      selectLocationCard(card, locName);
    });
  });

  function selectLocationByName(locationName) {
    locationCards.forEach(c => {
      if (c.dataset.location === locationName) {
        selectLocationCard(c, locationName);
      }
    });
  }

  function selectLocationCard(cardElement, locName) {
    locationCards.forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');
    selectedLocation = locName;

    if (locName === 'Other') {
      if (customDetailRow) customDetailRow.classList.add('active');
      if (customLocationInput) customLocationInput.focus();
    } else {
      if (customDetailRow) customDetailRow.classList.remove('active');
    }
  }

  // Item Photo Upload & AI Backend Recognition
  if (uploadDropzone) {
    uploadDropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemoveImage')) return;
      if (fileInput) fileInput.click();
    });

    uploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadDropzone.classList.add('drag-active');
    });

    uploadDropzone.addEventListener('dragleave', () => {
      uploadDropzone.classList.remove('drag-active');
    });

    uploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadDropzone.classList.remove('drag-active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleUploadedFile(file);
      } else {
        showToast('Invalid File', 'Please upload a JPG, PNG, or WEBP image.', true);
      }
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedFile(file);
    });
  }

  async function handleUploadedFile(file) {
    selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = async (event) => {
      uploadedImageBase64 = event.target.result;
      if (previewImage) previewImage.src = uploadedImageBase64;
      if (previewFilename) previewFilename.textContent = file.name;

      if (uploadDefaultContent) uploadDefaultContent.style.display = 'none';
      if (uploadPreviewContainer) uploadPreviewContainer.classList.add('active');

      // Call Backend AI Recognition (/api/ai/recognize)
      try {
        const formData = new FormData();
        formData.append('image', file);
        const aiResponse = await fetch('/api/ai/recognize', {
          method: 'POST',
          body: formData
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (aiData && aiData.label) {
            const label = aiData.label;
            const suggested = aiData.suggested_location || 'Study Desk';
            if (previewAiTag) {
              const conf = Math.round((aiData.confidence || 0.85) * 100);
              previewAiTag.textContent = `AI: Detected "${label}" (${conf}%)`;
            }
            if (!itemSearchInput.value.trim()) {
              itemSearchInput.value = label;
              if (btnClearInput) btnClearInput.classList.add('visible');
            }
            selectLocationByName(suggested);
            showToast('AI Visual Recognition', `Identified "${label}". Suggested: ${suggested}.`);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend AI recognition fallback:', err);
      }

      // Graceful local heuristic fallback
      const simulated = simulateAiRecognition(file.name);
      if (previewAiTag) previewAiTag.textContent = `AI: Detected "${simulated.label}"`;
      if (!itemSearchInput.value.trim()) {
        itemSearchInput.value = simulated.label;
        if (btnClearInput) btnClearInput.classList.add('visible');
      }
      selectLocationByName(simulated.location);
    };
    reader.readAsDataURL(file);
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedImageFile = null;
      uploadedImageBase64 = null;
      if (fileInput) fileInput.value = '';
      if (uploadPreviewContainer) uploadPreviewContainer.classList.remove('active');
      if (uploadDefaultContent) uploadDefaultContent.style.display = 'flex';
    });
  }

  function simulateAiRecognition(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('key')) return { label: 'House Key Set', location: 'Drawer' };
    if (lower.includes('pass') || lower.includes('doc')) return { label: 'Passport & Visa', location: 'Wardrobe' };
    if (lower.includes('charger') || lower.includes('cable')) return { label: 'High-Speed USB Charger', location: 'Study Desk' };
    if (lower.includes('watch') || lower.includes('jewel')) return { label: 'Wrist Watch', location: 'Dressing Table' };
    if (lower.includes('phone') || lower.includes('airpod') || lower.includes('headphone')) return { label: 'AirPods & Case', location: 'Bedroom' };
    if (lower.includes('mug') || lower.includes('bottle') || lower.includes('tea')) return { label: 'Coffee Tumbler', location: 'Kitchen' };
    return { label: 'Personal Belonging', location: 'Study Desk' };
  }

  // --- Step 2 -> Step 4: Next Action ---
  if (btnNextAction) {
    btnNextAction.addEventListener('click', () => {
      const itemName = itemSearchInput.value.trim();

      if (!itemName && !uploadedImageBase64 && !selectedImageFile) {
        showToast('Item Name Required', 'Please enter an item name or upload a photo.', true);
        if (itemSearchInput) itemSearchInput.focus();
        return;
      }

      if (!selectedLocation) {
        showToast('Select Location', 'Please choose where you kept this item.', true);
        const grid = document.getElementById('locationCardsGrid');
        if (grid) {
          grid.style.transform = 'scale(1.02)';
          setTimeout(() => grid.style.transform = 'scale(1)', 250);
        }
        return;
      }

      renderSubLocationOptions(selectedLocation);
      switchView('sublocation');
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 4: SUB-LOCATION LOGIC
  // --------------------------------------------------------------------------
  function renderSubLocationOptions(locName) {
    const preset = subLocationPresets[locName] || subLocationPresets['Drawer'];
    if (subLocationTitle) subLocationTitle.textContent = preset.title;
    if (subLocationSubtitle) subLocationSubtitle.textContent = preset.subtitle;
    if (customSubLocationInput) customSubLocationInput.placeholder = preset.placeholder;

    if (!selectedSubLocation || !preset.options.includes(selectedSubLocation)) {
      selectedSubLocation = preset.options[0];
    }

    if (subLocationOptionsList) {
      subLocationOptionsList.innerHTML = preset.options.map(optionText => {
        const isSelected = optionText === selectedSubLocation;
        return `
          <div class="subloc-option-card ${isSelected ? 'selected' : ''}" data-subloc="${escapeHtml(optionText)}">
            <div class="subloc-option-left">
              <div class="subloc-radio-circle">
                <span class="subloc-radio-dot"></span>
              </div>
              <span class="subloc-option-text">${escapeHtml(optionText)}</span>
            </div>
            <div class="subloc-selected-badge" title="Selected">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
            </div>
          </div>
        `;
      }).join('');

      subLocationOptionsList.querySelectorAll('.subloc-option-card').forEach(card => {
        card.addEventListener('click', () => {
          subLocationOptionsList.querySelectorAll('.subloc-option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedSubLocation = card.dataset.subloc;
        });
      });
    }
  }

  if (btnBackToStore) {
    btnBackToStore.addEventListener('click', () => switchView('store'));
  }

  if (btnNextToSaveLocation) {
    btnNextToSaveLocation.addEventListener('click', () => {
      const customSub = customSubLocationInput ? customSubLocationInput.value.trim() : '';
      if (customSub) {
        selectedSubLocation = customSub;
      }

      if (!selectedSubLocation) {
        showToast('Sub-Location Required', 'Please select or enter a specific spot.', true);
        return;
      }

      // Update the "Selected Area" summary pill with the actual chosen location path
      const saveLocationSummaryPath = document.getElementById('saveLocationSummaryPath');
      if (saveLocationSummaryPath) {
        const locationLabel = selectedLocation || 'Home';
        const subLabel = selectedSubLocation || '';
        saveLocationSummaryPath.textContent = subLabel
          ? `${locationLabel} → ${subLabel}`
          : locationLabel;
      }

      switchView('savelocation');
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 5: SAVE LOCATION PHOTO & CREATE IN SQLITE
  // --------------------------------------------------------------------------
  if (btnBackToSubLocation) {
    btnBackToSubLocation.addEventListener('click', () => switchView('sublocation'));
  }

  if (locationUploadDropzone) {
    locationUploadDropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemoveLocImage')) return;
      if (locationFileInput) locationFileInput.click();
    });

    locationUploadDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      locationUploadDropzone.classList.add('drag-active');
    });

    locationUploadDropzone.addEventListener('dragleave', () => {
      locationUploadDropzone.classList.remove('drag-active');
    });

    locationUploadDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      locationUploadDropzone.classList.remove('drag-active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleUploadedLocFile(file);
      }
    });
  }

  if (locationFileInput) {
    locationFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedLocFile(file);
    });
  }

  function handleUploadedLocFile(file) {
    selectedLocImageFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedLocImageBase64 = event.target.result;
      if (locPreviewImage) locPreviewImage.src = uploadedLocImageBase64;
      if (locPreviewFilename) locPreviewFilename.textContent = file.name;
      if (locUploadDefaultContent) locUploadDefaultContent.style.display = 'none';
      if (locUploadPreviewContainer) locUploadPreviewContainer.classList.add('active');
    };
    reader.readAsDataURL(file);
  }

  if (btnRemoveLocImage) {
    btnRemoveLocImage.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedLocImageFile = null;
      uploadedLocImageBase64 = null;
      if (locationFileInput) locationFileInput.value = '';
      if (locUploadPreviewContainer) locUploadPreviewContainer.classList.remove('active');
      if (locUploadDefaultContent) locUploadDefaultContent.style.display = 'flex';
    });
  }

  /**
   * Final Action: Save Location -> Sends directly to Flask /api/objects!
   */
  if (btnSaveFinalLocation) {
    btnSaveFinalLocation.addEventListener('click', async () => {
      const itemName = (itemSearchInput.value.trim()) ||
        (previewFilename && previewFilename.textContent ? previewFilename.textContent.split('.')[0] : 'Saved Belonging');
      const customSub = customSubLocationInput ? customSubLocationInput.value.trim() : '';
      const customNote = customNoteInput ? customNoteInput.value.trim() : '';
      const finalSubLocation = customSub || selectedSubLocation || 'General Area';
      const finalDetail = customNote ? `${finalSubLocation} • ${customNote}` : finalSubLocation;

      btnSaveFinalLocation.disabled = true;
      btnSaveFinalLocation.textContent = 'Saving...';

      try {
        const formData = new FormData();
        formData.append('object_name', itemName);
        formData.append('room', selectedLocation || 'Drawer');
        formData.append('location', finalSubLocation);
        formData.append('description', customNote);

        if (selectedImageFile) {
          formData.append('image', selectedImageFile);
        } else if (selectedLocImageFile) {
          formData.append('image', selectedLocImageFile);
        } else if (uploadedImageBase64) {
          formData.append('image_path', uploadedImageBase64);
        }

        const response = await fetch('/api/objects', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          const savedObj = result.object || {};

          // Reload fresh data from backend
          await loadBackendObjects();
          await updateStats();

          // Populate Confirmation Screen
          if (resultItemName) resultItemName.textContent = savedObj.object_name || itemName;
          if (resultItemThumb) {
            resultItemThumb.src = savedObj.image_path || uploadedImageBase64 || uploadedLocImageBase64 || '/assets/wireless-earphones.jpg';
          }
          if (resultBreadcrumbs) {
            resultBreadcrumbs.innerHTML = `
              <span class="path-pill">Home</span>
              <span class="path-arrow">→</span>
              <span class="path-pill">${escapeHtml(savedObj.room_name || selectedLocation)}</span>
              <span class="path-arrow">→</span>
              <span class="path-pill">${escapeHtml(savedObj.location_name || finalSubLocation)}</span>
              ${customNote ? `
                <span class="path-arrow">→</span>
                <span class="path-pill">${escapeHtml(customNote)}</span>
              ` : ''}
              <span class="path-arrow">→</span>
            `;
          }
          if (resultCurrentLocHierarchy) {
            resultCurrentLocHierarchy.textContent = savedObj.full_location_path || `${selectedLocation} → ${finalSubLocation}${customNote ? ' → ' + customNote : ''}`;
          }
          if (resultSavedDate) {
            resultSavedDate.textContent = 'Today';
          }

          showToast('Location Saved!', `"${itemName}" was stored in ${selectedLocation} (${finalSubLocation}).`);
          switchView('result');
        } else {
          const err = await response.json();
          showToast('Save Error', err.message || 'Could not save object.', true);
        }
      } catch (err) {
        console.error('Error saving item:', err);
        showToast('Error', 'Failed to reach server.', true);
      } finally {
        btnSaveFinalLocation.disabled = false;
        btnSaveFinalLocation.textContent = 'Save Location';
      }
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 6: ITEM LOCATION RESULT ACTIONS
  // --------------------------------------------------------------------------
  if (btnAddAnotherItem) {
    btnAddAnotherItem.addEventListener('click', () => {
      resetAllForms();
      switchView('store');
    });
  }

  if (btnDecorateMySpace) {
    btnDecorateMySpace.addEventListener('click', () => switchView('spaceupload'));
  }

  if (btnFindAnotherItem) {
    btnFindAnotherItem.addEventListener('click', () => switchView('find'));
  }

  // --------------------------------------------------------------------------
  // PAGE 7: SPACE ORGANIZER
  // --------------------------------------------------------------------------
  if (btnBackToHomeFromSpace) {
    btnBackToHomeFromSpace.addEventListener('click', () => switchView('landing'));
  }

  if (chooseSpaceGrid) {
    const spaceCards = chooseSpaceGrid.querySelectorAll('.space-choice-card');
    spaceCards.forEach(card => {
      card.addEventListener('click', () => {
        spaceCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedSpace = card.dataset.space || 'Study Desk';
      });
    });
  }

  if (btnAddCustomSpaceLink) {
    btnAddCustomSpaceLink.addEventListener('click', () => {
      if (customSpaceInputWrap) {
        const isHidden = customSpaceInputWrap.style.display === 'none';
        customSpaceInputWrap.style.display = isHidden ? 'block' : 'none';
        if (isHidden && customSpaceTextInput) customSpaceTextInput.focus();
      }
    });
  }

  if (customSpaceTextInput) {
    customSpaceTextInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) selectedSpace = val;
    });
  }

  if (spaceRoomDropzone) {
    spaceRoomDropzone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemoveSpaceRoomImage')) return;
      if (spaceRoomFileInput) spaceRoomFileInput.click();
    });

    spaceRoomDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      spaceRoomDropzone.classList.add('drag-active');
    });

    spaceRoomDropzone.addEventListener('dragleave', () => {
      spaceRoomDropzone.classList.remove('drag-active');
    });

    spaceRoomDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      spaceRoomDropzone.classList.remove('drag-active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleUploadedSpaceFile(file);
      }
    });
  }

  if (spaceRoomFileInput) {
    spaceRoomFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedSpaceFile(file);
    });
  }

  function handleUploadedSpaceFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedSpaceImageBase64 = event.target.result;
      if (spaceRoomPreviewImg) spaceRoomPreviewImg.src = uploadedSpaceImageBase64;
      if (spaceRoomFilename) spaceRoomFilename.textContent = file.name;
      if (spaceRoomDefaultContent) spaceRoomDefaultContent.style.display = 'none';
      if (spaceRoomPreview) spaceRoomPreview.classList.add('active');
      if (aiPlanSpaceImg) aiPlanSpaceImg.src = uploadedSpaceImageBase64;
      showToast('Photo Uploaded', 'AI is ready to analyze your space.');
    };
    reader.readAsDataURL(file);
  }

  if (btnRemoveSpaceRoomImage) {
    btnRemoveSpaceRoomImage.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedSpaceImageBase64 = null;
      if (spaceRoomFileInput) spaceRoomFileInput.value = '';
      if (spaceRoomPreview) spaceRoomPreview.classList.remove('active');
      if (spaceRoomDefaultContent) spaceRoomDefaultContent.style.display = 'block';
      if (aiPlanSpaceImg) aiPlanSpaceImg.src = '/assets/desk-workspace.jpg';
    });
  }

  if (btnNextToDimensions) {
    btnNextToDimensions.addEventListener('click', () => {
      if (aiPlanSpaceImg) {
        aiPlanSpaceImg.src = uploadedSpaceImageBase64 || '/assets/desk-workspace.jpg';
      }
      switchView('spacedimensions');
    });
  }

  // Page 8
  if (btnBackToSpaceUpload) {
    btnBackToSpaceUpload.addEventListener('click', () => switchView('spaceupload'));
  }

  if (btnSkipDimensions) {
    btnSkipDimensions.addEventListener('click', () => switchView('spaceaiplan'));
  }

  if (btnNextToAiPlan) {
    btnNextToAiPlan.addEventListener('click', () => switchView('spaceaiplan'));
  }

  // Page 9: Apply Plan -> Creates Space in SQLite via POST /api/rooms
  if (btnBackToDimensions) {
    btnBackToDimensions.addEventListener('click', () => switchView('spacedimensions'));
  }

  function renderAiPlanSuggestions(spaceName) {
    const list = spaceAiSuggestionsPresets[spaceName] || spaceAiSuggestionsPresets['Study Desk'];
    if (aiPlanSuggestionsList) {
      aiPlanSuggestionsList.innerHTML = list.map(item => `
        <div class="suggestion-item-row">
          <div class="suggestion-badge ${item.badge}">${item.num}</div>
          <div class="suggestion-text-wrap">
            <div class="suggestion-title">${escapeHtml(item.title)}</div>
            <div class="suggestion-desc">${escapeHtml(item.desc)}</div>
          </div>
        </div>
      `).join('');
    }
  }

  if (btnFinishAiPlan) {
    btnFinishAiPlan.addEventListener('click', async () => {
      try {
        await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            room_name: selectedSpace,
            description: 'Organized with AI Smart Space recommendations'
          })
        });
      } catch (e) {
        console.warn('Room creation error:', e);
      }

      await updateStats();
      showToast('Space Plan Applied!', `Your ${selectedSpace} has a tailored smart organization strategy.`);
      setTimeout(() => switchView('landing'), 500);
    });
  }

  // --------------------------------------------------------------------------
  // PAGE 10: "FIND MY ITEM" NATURAL SEARCH
  // --------------------------------------------------------------------------
  if (btnBackFromFind) {
    btnBackFromFind.addEventListener('click', () => switchView('landing'));
  }

  if (btnAddNewFromFind) {
    btnAddNewFromFind.addEventListener('click', () => switchView('store'));
  }

  if (btnEmptyAdd) {
    btnEmptyAdd.addEventListener('click', () => switchView('store'));
  }

  if (findItemInput) {
    findItemInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (q.length > 0) {
        if (btnClearFindInput) btnClearFindInput.classList.add('visible');
        searchItems(q);
      } else {
        if (btnClearFindInput) btnClearFindInput.classList.remove('visible');
        renderFindResults(storedItems);
      }
    });
  }

  if (btnClearFindInput) {
    btnClearFindInput.addEventListener('click', () => {
      findItemInput.value = '';
      btnClearFindInput.classList.remove('visible');
      renderFindResults(storedItems);
      findItemInput.focus();
    });
  }

  findChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.search || chip.textContent.trim().replace(/^[^\w\s]+/, '').trim();
      findItemInput.value = q;
      if (btnClearFindInput) btnClearFindInput.classList.add('visible');
      searchItems(q);
    });
  });

  async function searchItems(query) {
    try {
      const res = await fetch(`/api/objects/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const matches = await res.json();
        const mapped = matches.map(obj => ({
          id: String(obj.id),
          name: obj.object_name,
          location: obj.room_name || 'General Storage',
          subLocation: obj.location_name || '',
          detail: obj.full_location_path || (obj.room_name ? `${obj.room_name} → ${obj.location_name || ''}` : ''),
          note: obj.description || '',
          image: obj.image_path || null,
          date: obj.created_at ? formatDisplayDate(obj.created_at) : 'Saved'
        }));
        renderFindResults(mapped);
      }
    } catch (e) {
      console.warn('Backend search error, falling back locally:', e);
      const q = query.toLowerCase();
      const filtered = storedItems.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.subLocation && item.subLocation.toLowerCase().includes(q))
      );
      renderFindResults(filtered);
    }
  }

  function renderFindResults(items) {
    if (!findResultsGrid) return;

    if (!items || items.length === 0) {
      findResultsGrid.style.display = 'none';
      if (findTopMatchWrapper) findTopMatchWrapper.style.display = 'none';
      if (findResultsHeader) findResultsHeader.style.display = 'none';
      if (findEmptyState) findEmptyState.style.display = 'flex';
      if (findResultsCount) findResultsCount.textContent = 'No Items Found';
      return;
    }

    if (findEmptyState) findEmptyState.style.display = 'none';
    findResultsGrid.style.display = 'grid';
    if (findResultsHeader) findResultsHeader.style.display = 'block';

    // Highlight top match if searching
    const hasSearchQuery = findItemInput && findItemInput.value.trim().length > 0;
    if (hasSearchQuery && items.length > 0) {
      const top = items[0];
      topMatchCurrentItem = top;
      if (findTopMatchWrapper) findTopMatchWrapper.style.display = 'flex';
      const topThumb = document.getElementById('topMatchThumb');
      const topIconBox = document.getElementById('topMatchIconBox');
      const topThumbBox = document.getElementById('topMatchThumbBox');
      if (top.image) {
        if (topThumbBox) topThumbBox.style.display = 'block';
        if (topThumb) { topThumb.src = top.image; topThumb.style.display = 'block'; }
        if (topIconBox) topIconBox.style.display = 'none';
      } else {
        if (topThumbBox) topThumbBox.style.display = 'none';
        if (topThumb) topThumb.style.display = 'none';
        if (topIconBox) topIconBox.style.display = 'flex';
      }
      if (topMatchName) topMatchName.textContent = top.name;
      if (topMatchPath) topMatchPath.textContent = top.detail || `${top.location} → ${top.subLocation}`;
      if (topMatchDate) topMatchDate.textContent = `Saved: ${top.date || 'Today'}`;
    } else {
      if (findTopMatchWrapper) findTopMatchWrapper.style.display = 'none';
    }

    if (findResultsCount) {
      findResultsCount.textContent = hasSearchQuery ? `Search Results (${items.length})` : `All Stored Items (${items.length})`;
    }

    findResultsGrid.innerHTML = items.map(item => `
      <div class="find-result-card" data-id="${item.id}">
        <div class="find-card-left">
          ${item.image ? `
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="find-card-thumb">
          ` : `
            <div class="find-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 8h10M7 12h10M7 16h6" />
              </svg>
            </div>
          `}
          <div>
            <h4 class="find-card-name">${escapeHtml(item.name)}</h4>
            <div class="find-card-location">
              <span class="find-card-room-badge">${escapeHtml(item.location)}</span>
              <span>${escapeHtml(item.subLocation || 'Spot')}</span>
            </div>
          </div>
        </div>
        <button type="button" class="btn-card-delete" data-delete-id="${item.id}" title="Delete item">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `).join('');

    findResultsGrid.querySelectorAll('.btn-card-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteItem(btn.dataset.deleteId);
      });
    });
  }

  if (btnTopMatchDelete) {
    btnTopMatchDelete.addEventListener('click', () => {
      if (topMatchCurrentItem) {
        deleteItem(topMatchCurrentItem.id);
      }
    });
  }

  if (btnTopMatchFind) {
    btnTopMatchFind.addEventListener('click', () => {
      if (topMatchCurrentItem) {
        showToast('Item Located', `${topMatchCurrentItem.name} is stored at: ${topMatchCurrentItem.detail || topMatchCurrentItem.location}.`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // STORED ITEMS DIRECTORY MODAL (Connected to SQLite)
  // --------------------------------------------------------------------------
  if (cardItemsStored) cardItemsStored.addEventListener('click', openStoredItemsModal);
  if (cardLocationsSaved) cardLocationsSaved.addEventListener('click', openStoredItemsModal);
  if (cardSpacesOrganized) cardSpacesOrganized.addEventListener('click', () => switchView('spaceupload'));

  function openStoredItemsModal() {
    renderStoredItemsList(storedItems);
    if (storedItemsModal) storedItemsModal.classList.add('open');
    if (modalFilterInput) {
      modalFilterInput.value = '';
      setTimeout(() => modalFilterInput.focus(), 150);
    }
  }

  if (btnCloseItemsModal) {
    btnCloseItemsModal.addEventListener('click', () => {
      storedItemsModal.classList.remove('open');
    });
  }

  if (storedItemsModal) {
    storedItemsModal.addEventListener('click', (e) => {
      if (e.target === storedItemsModal) storedItemsModal.classList.remove('open');
    });
  }

  if (modalFilterInput) {
    modalFilterInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = storedItems.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.subLocation && item.subLocation.toLowerCase().includes(q)) ||
        (item.note && item.note.toLowerCase().includes(q))
      );
      renderStoredItemsList(filtered);
    });
  }

  function renderStoredItemsList(itemsToRender) {
    if (!storedItemsList) return;

    if (!itemsToRender || itemsToRender.length === 0) {
      storedItemsList.innerHTML = `
        <div style="text-align: center; padding: 36px 12px; color: var(--text-muted);">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <div style="font-weight: 700; font-size: 16px; color: #1E1B4B;">No items found</div>
          <p style="font-size: 13px; margin-top: 4px;">Save an item to see it listed here in your database.</p>
        </div>
      `;
      return;
    }

    storedItemsList.innerHTML = itemsToRender.map(item => `
      <div class="stored-item-row" data-id="${item.id}">
        <div class="stored-item-left">
          ${item.image ? `
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="stored-item-loc-thumb" title="Item Photo">
          ` : `
            <div class="stored-item-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
              </svg>
            </div>
          `}
          <div>
            <div class="stored-item-name">${escapeHtml(item.name)}</div>
            <div class="stored-item-location">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>${escapeHtml(item.location)}</span>
              ${item.subLocation ? `<span class="stored-item-subloc-tag">📍 ${escapeHtml(item.subLocation)}</span>` : ''}
              ${item.note ? `<span style="color: var(--text-muted); font-weight: normal;">• Note: ${escapeHtml(item.note)}</span>` : ''}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="stored-item-date">${item.date || 'Saved'}</span>
          <button type="button" class="delete-item-btn" title="Delete item" data-delete-id="${item.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `).join('');

    storedItemsList.querySelectorAll('.delete-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteItem(btn.dataset.deleteId);
      });
    });
  }

  /**
   * Deletes an item from the backend SQLite database.
   * Immediately updates exact database counts!
   */
  async function deleteItem(id) {
    try {
      const response = await fetch(`/api/objects/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        showToast('Item Removed', 'The item was deleted from your database.');
        await loadBackendObjects();
        await updateStats();
        renderStoredItemsList(storedItems);
      } else {
        showToast('Delete Error', 'Could not delete item.', true);
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error', 'Failed to communicate with server.', true);
    }
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATION MODAL (Connected to Flask /api/login)
  // --------------------------------------------------------------------------
  if (btnLoginHeader) btnLoginHeader.addEventListener('click', () => loginModal.classList.add('open'));
  if (avatarProfileBtn) avatarProfileBtn.addEventListener('click', () => loginModal.classList.add('open'));
  if (btnCloseLoginModal) btnCloseLoginModal.addEventListener('click', () => loginModal.classList.remove('open'));

  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.classList.remove('open');
    });
  }

  if (btnSimulateLogin) {
    btnSimulateLogin.addEventListener('click', async () => {
      const ident = (loginEmail ? loginEmail.value.trim() : '') || 'alex';
      const pwd = (loginPassword ? loginPassword.value.trim() : '') || 'password123';

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: ident, password: pwd })
        });

        if (res.ok) {
          const data = await res.json();
          currentUser = data.user;
          if (loginModal) loginModal.classList.remove('open');
          if (loginBtnLabel) loginBtnLabel.textContent = currentUser.username;
          showToast('Signed In', `Welcome back, ${currentUser.username}! Loaded your home catalog.`);
          await loadBackendObjects();
          await updateStats();
        } else {
          showToast('Login Failed', 'Invalid username or password.', true);
        }
      } catch (e) {
        console.error('Login error:', e);
      }
    });
  }

  // --------------------------------------------------------------------------
  // HELPERS & FORM RESETS
  // --------------------------------------------------------------------------
  function resetAllForms() {
    if (itemSearchInput) itemSearchInput.value = '';
    if (btnClearInput) btnClearInput.classList.remove('visible');
    if (customLocationInput) customLocationInput.value = '';
    if (customDetailRow) customDetailRow.classList.remove('active');
    locationCards.forEach(c => c.classList.remove('selected'));
    selectedLocation = '';

    selectedImageFile = null;
    uploadedImageBase64 = null;
    if (fileInput) fileInput.value = '';
    if (uploadPreviewContainer) uploadPreviewContainer.classList.remove('active');
    if (uploadDefaultContent) uploadDefaultContent.style.display = 'flex';

    selectedSubLocation = '';
    if (customSubLocationInput) customSubLocationInput.value = '';

    selectedLocImageFile = null;
    uploadedLocImageBase64 = null;
    if (locationFileInput) locationFileInput.value = '';
    if (locUploadPreviewContainer) locUploadPreviewContainer.classList.remove('active');
    if (locUploadDefaultContent) locUploadDefaultContent.style.display = 'flex';
    if (customNoteInput) customNoteInput.value = '';
  }

  function showToast(title, description, isWarning = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon" style="${isWarning ? 'background: #FEF3C7; color: #D97706;' : ''}">
        ${isWarning ? `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        ` : `
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `}
      </div>
      <div class="toast-message">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-desc">${escapeHtml(description)}</div>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Initialize App On Startup ---
  checkAuthSession();
  loadBackendObjects();
  handleUrlHash();
});
