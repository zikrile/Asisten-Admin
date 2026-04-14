/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Building2, School, Package, Calculator, Save, FolderOpen, X, Edit2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CetakDokumen from './components/CetakDokumen';

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

interface SavedItem {
  id: string;
  name: string;
  unit: string;
  price: number;
}

interface PartyInfo {
  name: string;
  address: string;
  contact: string;
  representative: string;
  position: string;
  phone?: string;
  npwp?: string;
  nip?: string;
  email?: string;
}

interface SavedParty extends PartyInfo {
  id: string;
  treasurer?: {
    name: string;
    position: string;
    nip: string;
    address?: string;
  };
}

export default function App() {
  // State for Saved Data (Database)
  const [savedVendors, setSavedVendors] = useState<SavedParty[]>([]);
  const [savedSchools, setSavedSchools] = useState<SavedParty[]>([]);
  const [savedItemsDB, setSavedItemsDB] = useState<SavedItem[]>([]);
  const [showManager, setShowManager] = useState<'vendor' | 'school' | 'item' | null>(null);

  // State for Current Form
  const [vendor, setVendor] = useState<PartyInfo>({
    name: '', address: '', contact: '', representative: '', position: 'Pemilik Toko', phone: '', npwp: ''
  });
  const [school, setSchool] = useState<PartyInfo>({
    name: '', address: '', contact: '', representative: '', position: 'Kepala Sekolah', nip: '', email: ''
  });
  const [treasurer, setTreasurer] = useState({
    name: '', position: 'Bendahara Sekolah', nip: '', address: ''
  });
  const [pelaksana, setPelaksana] = useState({ name: '', nip: '' });
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [perencanaanDate, setPerencanaanDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderNumber, setOrderNumber] = useState('001/SPB/2024');
  const [bastNumber, setBastNumber] = useState('001/BAST/2024');
  const [itemCategory, setItemCategory] = useState('Pembelian ATK');
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, unit: 'Pcs', price: 0 });

  // Load ALL saved data on mount
  useEffect(() => {
    const vendors = localStorage.getItem('docugen_vendors');
    const schools = localStorage.getItem('docugen_schools');
    const itemsDB = localStorage.getItem('docugen_items_db');
    const currentForm = localStorage.getItem('docugen_current_form');

    if (vendors) setSavedVendors(JSON.parse(vendors));
    if (schools) setSavedSchools(JSON.parse(schools));
    if (itemsDB) setSavedItemsDB(JSON.parse(itemsDB));
    
    if (currentForm) {
      const parsed = JSON.parse(currentForm);
      if (parsed.vendor) setVendor(parsed.vendor);
      if (parsed.school) setSchool(parsed.school);
      if (parsed.treasurer) setTreasurer(parsed.treasurer);
      if (parsed.pelaksana) setPelaksana(parsed.pelaksana);
      if (parsed.documentDate) setDocumentDate(parsed.documentDate);
      if (parsed.perencanaanDate) setPerencanaanDate(parsed.perencanaanDate);
      if (parsed.orderNumber) setOrderNumber(parsed.orderNumber);
      if (parsed.bastNumber) setBastNumber(parsed.bastNumber);
      if (parsed.itemCategory) setItemCategory(parsed.itemCategory);
      if (parsed.items) setItems(parsed.items);
    }
  }, []);

  // Save Databases to localStorage when changed
  useEffect(() => { localStorage.setItem('docugen_vendors', JSON.stringify(savedVendors)); }, [savedVendors]);
  useEffect(() => { localStorage.setItem('docugen_schools', JSON.stringify(savedSchools)); }, [savedSchools]);
  useEffect(() => { localStorage.setItem('docugen_items_db', JSON.stringify(savedItemsDB)); }, [savedItemsDB]);

  // Save Current Form to localStorage when changed (so it doesn't disappear on refresh)
  useEffect(() => {
    const currentForm = { vendor, school, treasurer, pelaksana, documentDate, perencanaanDate, orderNumber, bastNumber, itemCategory, items };
    localStorage.setItem('docugen_current_form', JSON.stringify(currentForm));
  }, [vendor, school, treasurer, pelaksana, documentDate, perencanaanDate, orderNumber, bastNumber, itemCategory, items]);

  // CRUD Functions
  const saveCurrentVendor = () => {
    if (!vendor.name) return;
    const newSaved: SavedParty = { ...vendor, id: Math.random().toString(36).substr(2, 9) };
    setSavedVendors([...savedVendors, newSaved]);
    alert('Data Vendor berhasil disimpan ke database!');
  };

  const saveCurrentSchool = () => {
    if (!school.name) return;
    const newSaved: SavedParty = { ...school, id: Math.random().toString(36).substr(2, 9), treasurer: { ...treasurer } };
    setSavedSchools([...savedSchools, newSaved]);
    alert('Data Sekolah berhasil disimpan ke database!');
  };

  const saveItemToDB = () => {
    if (!newItem.name) return;
    const newSaved: SavedItem = { id: Math.random().toString(36).substr(2, 9), name: newItem.name, unit: newItem.unit, price: newItem.price };
    setSavedItemsDB([...savedItemsDB, newSaved]);
    alert('Barang berhasil disimpan ke database!');
  };

  const deleteSavedVendor = (id: string) => setSavedVendors(savedVendors.filter(v => v.id !== id));
  const deleteSavedSchool = (id: string) => setSavedSchools(savedSchools.filter(s => s.id !== id));
  const deleteSavedItemDB = (id: string) => setSavedItemsDB(savedItemsDB.filter(i => i.id !== id));

  const loadVendor = (v: SavedParty) => {
    const { id, treasurer: t, ...rest } = v;
    setVendor(rest);
    setShowManager(null);
  };

  const loadSchool = (s: SavedParty) => {
    const { id, treasurer: t, ...rest } = s;
    setSchool(rest);
    if (t) setTreasurer(t);
    setShowManager(null);
  };

  const loadItemFromDB = (i: SavedItem) => {
    setNewItem({ ...newItem, name: i.name, unit: i.unit, price: i.price });
    setShowManager(null);
  };

  // Calculations
  const totalAmount = useMemo(() => items.reduce((sum, item) => sum + (item.quantity * item.price), 0), [items]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const addItem = () => {
    if (!newItem.name || newItem.quantity <= 0) return;
    const item: Item = { id: Math.random().toString(36).substr(2, 9), ...newItem };
    setItems([...items, item]);
    setNewItem({ name: '', quantity: 1, unit: 'Pcs', price: 0 });
  };

  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Modal Manager */}
        <AnimatePresence>
          {showManager && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowManager(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {showManager === 'vendor' && <Building2 size={24} />}
                    {showManager === 'school' && <School size={24} />}
                    {showManager === 'item' && <Database size={24} />}
                    Daftar {showManager === 'vendor' ? 'Vendor' : showManager === 'school' ? 'Sekolah' : 'Barang'} Tersimpan
                  </h2>
                  <button onClick={() => setShowManager(null)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
                  {showManager === 'vendor' && savedVendors.length === 0 && <div className="text-center py-12 text-neutral-400 italic">Belum ada data yang disimpan.</div>}
                  {showManager === 'school' && savedSchools.length === 0 && <div className="text-center py-12 text-neutral-400 italic">Belum ada data yang disimpan.</div>}
                  {showManager === 'item' && savedItemsDB.length === 0 && <div className="text-center py-12 text-neutral-400 italic">Belum ada data yang disimpan.</div>}
                  
                  {showManager === 'vendor' && savedVendors.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-900 transition-all bg-white shadow-sm">
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{item.name}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-1">{item.address}</p>
                        <p className="text-[10px] text-neutral-400 mt-1">{item.representative} • {item.phone || item.nip}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => loadVendor(item)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-800"><FolderOpen size={14} /> Pilih</button>
                        <button onClick={() => deleteSavedVendor(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {showManager === 'school' && savedSchools.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-900 transition-all bg-white shadow-sm">
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{item.name}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-1">{item.address}</p>
                        <p className="text-[10px] text-neutral-400 mt-1">{item.representative} • {item.phone || item.nip}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => loadSchool(item)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-800"><FolderOpen size={14} /> Pilih</button>
                        <button onClick={() => deleteSavedSchool(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}

                  {showManager === 'item' && savedItemsDB.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-neutral-900 transition-all bg-white shadow-sm">
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900">{item.name}</h4>
                        <p className="text-xs text-neutral-500 mt-1">{formatCurrency(item.price)} / {item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => loadItemFromDB(item)} className="flex items-center gap-1 bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-neutral-800"><FolderOpen size={14} /> Pilih</button>
                        <button onClick={() => deleteSavedItemDB(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-neutral-50 border-t border-neutral-100 text-right">
                  <button onClick={() => setShowManager(null)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">Tutup</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">DocuGen</h1>
            <p className="text-neutral-500">Kelola Surat Pesanan & BAST dengan mudah</p>
          </div>
          <CetakDokumen 
            dataBarang={items}
            dataPihak={{ vendor, school, treasurer, pelaksana, documentDate, perencanaanDate, orderNumber, bastNumber, itemCategory }}
          />
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Parties Info */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
                <Building2 size={20} className="text-neutral-400" />
                <h2 className="text-lg font-semibold">Informasi Pihak</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vendor Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Pihak Pertama (Vendor)</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setShowManager('vendor')} className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all" title="Buka Data Tersimpan"><FolderOpen size={16} /></button>
                      <button onClick={saveCurrentVendor} className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Simpan ke Database"><Save size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Nama Perusahaan" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={vendor.name} onChange={e => setVendor({...vendor, name: e.target.value})} />
                    <textarea placeholder="Alamat Lengkap" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm min-h-[80px]" value={vendor.address} onChange={e => setVendor({...vendor, address: e.target.value})} />
                    <input type="text" placeholder="Nama Perwakilan" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={vendor.representative} onChange={e => setVendor({...vendor, representative: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Telepon" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={vendor.phone} onChange={e => setVendor({...vendor, phone: e.target.value})} />
                      <input type="text" placeholder="NPWP" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={vendor.npwp} onChange={e => setVendor({...vendor, npwp: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* School Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Pihak Kedua (Sekolah)</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setShowManager('school')} className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all" title="Buka Data Tersimpan"><FolderOpen size={16} /></button>
                      <button onClick={saveCurrentSchool} className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Simpan ke Database"><Save size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Nama Sekolah" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={school.name} onChange={e => setSchool({...school, name: e.target.value})} />
                    <textarea placeholder="Alamat Sekolah" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm min-h-[80px]" value={school.address} onChange={e => setSchool({...school, address: e.target.value})} />
                    <input type="text" placeholder="Nama Kepala Sekolah" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={school.representative} onChange={e => setSchool({...school, representative: e.target.value})} />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="NIP Kepala Sekolah" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={school.nip} onChange={e => setSchool({...school, nip: e.target.value})} />
                      <input type="email" placeholder="Email Sekolah" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={school.email} onChange={e => setSchool({...school, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Nama Bendahara" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={treasurer.name} onChange={e => setTreasurer({...treasurer, name: e.target.value})} />
                      <input type="text" placeholder="NIP Bendahara" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm" value={treasurer.nip} onChange={e => setTreasurer({...treasurer, nip: e.target.value})} />
                    </div>
                    <textarea placeholder="Alamat Pribadi Bendahara" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm min-h-[60px]" value={treasurer.address} onChange={e => setTreasurer({...treasurer, address: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Tanggal Dokumen (SP & BAST)</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={documentDate} onChange={e => setDocumentDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">No. Surat Pesanan</label>
                  <input type="text" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">No. BAST</label>
                  <input type="text" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={bastNumber} onChange={e => setBastNumber(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Tanggal Perencanaan</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={perencanaanDate} onChange={e => setPerencanaanDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Kategori Barang/Jasa</label>
                  <input type="text" placeholder="Contoh: Pembelian ATK" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={itemCategory} onChange={e => setItemCategory(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Nama Pelaksana</label>
                  <input type="text" placeholder="Nama Pelaksana" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={pelaksana.name} onChange={e => setPelaksana({...pelaksana, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500">NIP Pelaksana</label>
                  <input type="text" placeholder="NIP Pelaksana" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={pelaksana.nip} onChange={e => setPelaksana({...pelaksana, nip: e.target.value})} />
                </div>
              </div>
            </section>

            {/* Items Input */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-neutral-400" />
                  <h2 className="text-lg font-semibold">Daftar Barang</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowManager('item')} className="flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all" title="Buka Database Barang">
                    <Database size={16} /> Database Barang
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Nama Barang</label>
                  <div className="flex gap-1">
                    <input type="text" placeholder="Contoh: Laptop Core i5" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                    <button onClick={saveItemToDB} className="p-2 text-emerald-600 hover:bg-emerald-50 border border-emerald-100 rounded-lg transition-colors" title="Simpan ke Database Barang"><Save size={18} /></button>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Jumlah</label>
                  <input type="number" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})} />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Satuan</label>
                  <input type="text" placeholder="Pcs/Unit" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-medium text-neutral-500">Harga Satuan</label>
                  <input type="number" className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-neutral-900 outline-none text-sm" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value) || 0})} />
                </div>
                <div className="md:col-span-1">
                  <button onClick={addItem} className="w-full bg-neutral-900 text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors flex justify-center" title="Tambahkan ke Daftar">
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Items Table Preview */}
              <div className="overflow-x-auto border border-neutral-100 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-100">
                    <tr>
                      <th className="px-4 py-3">Nama Barang</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3">Satuan</th>
                      <th className="px-4 py-3 text-right">Harga Satuan</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.tr key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3">{item.unit}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.quantity * item.price)}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors p-1"><Trash2 size={16} /></button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-neutral-400 italic">Belum ada barang yang ditambahkan</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200 sticky top-8">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-4 mb-6">
                <Calculator size={20} className="text-neutral-400" />
                <h2 className="text-lg font-semibold">Ringkasan Biaya</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-neutral-500 text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 text-sm">
                  <span>Pajak (0%)</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                  <span className="font-bold">Total Akhir</span>
                  <span className="text-xl font-bold text-neutral-900">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-xs text-neutral-400 text-center">
                  Pastikan semua data sudah benar sebelum mencetak dokumen.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
