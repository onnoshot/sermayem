"use client"
import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  transactionModalOpen: boolean
  editingTransactionId: string | null
  prefillDate: string | null
  sourceModalOpen: boolean
  editingSourceId: string | null
  proModalOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  openAddTransaction: () => void
  openAddTransactionWithDate: (date: string) => void
  openEditTransaction: (id: string) => void
  closeTransactionModal: () => void
  openAddSource: () => void
  openEditSource: (id: string) => void
  closeSourceModal: () => void
  openProModal: () => void
  closeProModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  transactionModalOpen: false,
  editingTransactionId: null,
  prefillDate: null,
  sourceModalOpen: false,
  editingSourceId: null,
  proModalOpen: false,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openAddTransaction: () => set({ transactionModalOpen: true, editingTransactionId: null, prefillDate: null }),
  openAddTransactionWithDate: (date) => set({ transactionModalOpen: true, editingTransactionId: null, prefillDate: date }),
  openEditTransaction: (id) => set({ transactionModalOpen: true, editingTransactionId: id, prefillDate: null }),
  closeTransactionModal: () => set({ transactionModalOpen: false, editingTransactionId: null, prefillDate: null }),
  openAddSource: () => set({ sourceModalOpen: true, editingSourceId: null }),
  openEditSource: (id) => set({ sourceModalOpen: true, editingSourceId: id }),
  closeSourceModal: () => set({ sourceModalOpen: false, editingSourceId: null }),
  openProModal: () => set({ proModalOpen: true }),
  closeProModal: () => set({ proModalOpen: false }),
}))
