"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/context/UIContext";

const STORES = [
  { name: "Fanta Flagship Store",  address: "123 Market St, São Paulo", km: "0.8 km", open: true  },
  { name: "QuickMart Express",     address: "45 Av. Paulista, São Paulo", km: "1.4 km", open: true  },
  { name: "FreshStop Supermarket", address: "78 Rua Augusta, São Paulo",  km: "2.1 km", open: false },
  { name: "CoolDrinks Outlet",     address: "200 Av. Brasil, São Paulo",  km: "3.3 km", open: true  },
];

export default function StoreModal() {
  const { isStoreOpen, closeStore } = useUI();

  return (
    <AnimatePresence>
      {isStoreOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStore}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[100] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl"
          >
            {/* map placeholder */}
            <div className="relative h-40 w-full overflow-hidden bg-[#0a2012]">
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "linear-gradient(rgba(183,225,29,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(183,225,29,0.3) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#B7E11D] shadow-[0_0_24px_rgba(183,225,29,0.6)]">
                <span className="text-[#004D2A] text-lg">📍</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
            </div>

            {/* content */}
            <div className="px-6 pb-6 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl text-white">Find a Store</h2>
                <button onClick={closeStore} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white transition-colors text-sm">✕</button>
              </div>

              {/* search bar */}
              <div className="mb-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
                <span className="text-white/30 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Enter your city or zip code..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
                  defaultValue="São Paulo, Brazil"
                />
              </div>

              {/* store list */}
              <div className="flex flex-col gap-2">
                {STORES.map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-white">{s.name}</span>
                      <span className="text-xs text-white/35">{s.address}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-white/40">{s.km}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${s.open ? "bg-[#B7E11D]/15 text-[#B7E11D]" : "bg-red-500/15 text-red-400"}`}>
                        {s.open ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
