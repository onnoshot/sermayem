"use client"
import { create } from "zustand"

interface UIState {
  sidebarOpen: boolean
  transactionModalOpen: boolean
  editingTransactionId: string | null
  sourceModalOpen: boolean
  editingSourceId: string | null
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
  openAddTransaction: () => void
  openEditTransaction: (id: string) => void
  closeTransactionModal: () => void
  openAddSource: () => void
  openEditSource: (id: string) => void
  closeSourceModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  transactionModalOpen: false,
  editingTransactionId: null,
  sourceModalOpen: false,
  editingSourceId: null,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openAddTransaction: () => set({ transactionModalOpen: true, editingTransactionId: null }),
  openEditTransaction: (id) => set({ transactionModalOpen: true, editingTransactionId: id }),
  closeTransactionModal: () => set({ transactionModalOpen: false, editingTransactionId: null }),
  openAddSource: () => set({ sourceModalOpen: true, editingSourceId: null }),
  openEditSource: (id) => set({ sourceModalOpen: true, editingSourceId: id }),
  closeSourceModal: () => set({ sourceModalOpen: false, editingSourceId: null }),
}))
