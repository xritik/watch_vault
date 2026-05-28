import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { watchlistAPI, authAPI } from '../utils/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [items, setItems]   = useState([]);
  const [stats, setStats]   = useState({ total: 0, movies: 0, series: 0, anime: 0, docs: 0, watched: 0 });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme]   = useState('dark');

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter,   setTypeFilter]   = useState('all');
  const [search,       setSearch]       = useState('');
  const [sort,         setSort]         = useState('newest');

  const [showAddModal,    setShowAddModal]    = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPwdModal,    setShowPwdModal]    = useState(false);
  const [detailItem,      setDetailItem]      = useState(null);
  const [editItem,        setEditItem]        = useState(null);
  const [pwdAction,       setPwdAction]       = useState(null);

  const pendingItemRef = useRef(null);

  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: '' }), 2200);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter   !== 'all') params.type   = typeFilter;
      if (search) params.search = search;
      if (sort)   params.sort   = sort;

      const [itemsRes, statsRes] = await Promise.all([
        watchlistAPI.getAll(params),
        watchlistAPI.getStats(),
      ]);
      setItems(itemsRes.data.data);
      setStats(statsRes.data.data);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search, sort, showToast]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (data) => {
    try {
      showToast('Saving…');
      await watchlistAPI.create(data);
      await fetchItems();
      showToast('✅ Added!');
    } catch {
      showToast('❌ Failed to add');
    }
  };

  const updateItem = async (id, data) => {
    try {
      await watchlistAPI.update(id, data);
      await fetchItems();
    } catch {
      showToast('❌ Failed to update');
    }
  };

  const deleteItem = async (id) => {
    try {
      showToast('Deleting…');
      await watchlistAPI.delete(id);
      await fetchItems();
      showToast('🗑 Deleted');
    } catch {
      showToast('❌ Failed to delete');
    }
  };

  const verifyPassword = async (password) => {
    try {
      await authAPI.verify(password);
      return true;
    } catch {
      return false;
    }
  };

  // Generic action requester — works for delete, edit, favorite, lock
  const requestAction = (action, item) => {
    pendingItemRef.current = item;
    setPwdAction(action);
    setShowDetailModal(false);
    setDetailItem(null);
    setTimeout(() => setShowPwdModal(true), 180);
  };

  // Same but doesn't close detail modal (for card toggle buttons)
  const requestCardAction = (action, item) => {
    pendingItemRef.current = item;
    setPwdAction(action);
    setShowPwdModal(true);
  };

  const executePendingAction = async () => {
    const item = pendingItemRef.current;
    if (!item) return;

    if (pwdAction === 'delete') {
      await deleteItem(item._id);
    } else if (pwdAction === 'edit') {
      setEditItem(item);
      setTimeout(() => setShowAddModal(true), 200);
    } else if (pwdAction === 'favorite') {
      await updateItem(item._id, { favorite: !item.favorite });
      showToast(item.favorite ? '💔 Removed from favorites' : '❤️ Added to favorites!');
    } else if (pwdAction === 'lock') {
      await updateItem(item._id, { locked: !item.locked });
      showToast(item.locked ? '🔓 Card unlocked' : '🔒 Card locked!');
    }

    pendingItemRef.current = null;
    setPwdAction(null);
  };

  return (
    <AppContext.Provider value={{
      items, stats, loading,
      theme, toggleTheme,
      statusFilter, setStatusFilter,
      typeFilter,   setTypeFilter,
      search,       setSearch,
      sort,         setSort,
      showAddModal,    setShowAddModal,
      showDetailModal, setShowDetailModal,
      showPwdModal,    setShowPwdModal,
      detailItem,   setDetailItem,
      editItem,     setEditItem,
      pwdAction,    setPwdAction,
      toast,        showToast,
      addItem, updateItem, deleteItem, verifyPassword,
      requestAction,
      requestCardAction,
      executePendingAction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
