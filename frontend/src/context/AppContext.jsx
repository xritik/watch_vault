import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { watchlistAPI, authAPI } from '../utils/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ total: 0, movies: 0, series: 0, watched: 0 })
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPwdModal, setShowPwdModal] = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [pwdAction, setPwdAction] = useState(null) // 'delete' | 'edit'

  // Toast
  const [toast, setToast] = useState({ show: false, msg: '' })
  let toastTimer = null

  const showToast = (msg) => {
    setToast({ show: true, msg })
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => setToast({ show: false, msg: '' }), 2200)
  }

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // Fetch data
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (typeFilter !== 'all') params.type = typeFilter
      if (search) params.search = search
      if (sort) params.sort = sort

      const [itemsRes, statsRes] = await Promise.all([
        watchlistAPI.getAll(params),
        watchlistAPI.getStats(),
      ])
      setItems(itemsRes.data.data)
      setStats(statsRes.data.data)
    } catch (err) {
      console.error(err)
      showToast('❌ Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, typeFilter, search, sort])

  useEffect(() => { fetchItems() }, [fetchItems])

  // CRUD
  const addItem = async (data) => {
    try {
      showToast('Saving…')
      await watchlistAPI.create(data)
      await fetchItems()
      showToast('✅ Added!')
    } catch {
      showToast('❌ Failed to add')
    }
  }

  const updateItem = async (id, data) => {
    try {
      showToast('Updating…')
      await watchlistAPI.update(id, data)
      await fetchItems()
      showToast('✅ Updated!')
    } catch {
      showToast('❌ Failed to update')
    }
  }

  const deleteItem = async (id) => {
    try {
      showToast('Deleting…')
      await watchlistAPI.delete(id)
      await fetchItems()
      showToast('🗑 Deleted')
    } catch {
      showToast('❌ Failed to delete')
    }
  }

  const verifyPassword = async (password) => {
    try {
      await authAPI.verify(password)
      return true
    } catch {
      return false
    }
  }

  return (
    <AppContext.Provider value={{
      items, stats, loading,
      theme, toggleTheme,
      statusFilter, setStatusFilter,
      typeFilter, setTypeFilter,
      search, setSearch,
      sort, setSort,
      showAddModal, setShowAddModal,
      showDetailModal, setShowDetailModal,
      showPwdModal, setShowPwdModal,
      detailItem, setDetailItem,
      editItem, setEditItem,
      pwdAction, setPwdAction,
      toast,
      showToast,
      addItem, updateItem, deleteItem, verifyPassword,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
