"use client";

import React from "react";
import { Battery, Signal, Wifi, ChevronLeft, Menu, Bell, User, MoreHorizontal, Home, Heart, Search, Settings } from "lucide-react";

export default function PreviewPane() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col font-sans">
      {/* ---------------- STATUS BAR ---------------- */}
      <div className="bg-white px-4 py-2 flex items-center justify-between text-[10px] font-semibold text-gray-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-3 h-3" />
        </div>
      </div>

      {/* ---------------- APP HEADER ---------------- */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-gray-50 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-700" /></button>
          <span className="text-sm font-bold text-gray-900">Discover</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-50 rounded-full relative">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white shadow-sm">K</div>
        </div>
      </div>

      {/* ---------------- SCROLLABLE CONTENT ---------------- */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">

        {/* Hero Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
            <div className="flex items-start justify-between mb-8">
              <div>
                <span className="text-xs font-medium opacity-80 uppercase tracking-widest">Premium</span>
                <h2 className="text-xl font-bold mt-1">AvatarFlow Pro</h2>
              </div>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 bg-white text-indigo-600 text-xs font-bold py-2.5 rounded-lg shadow-sm hover:bg-indigo-50 transition">Get Started</button>
              <button className="p-2.5 bg-white/20 rounded-lg hover:bg-white/30 transition text-white"><MoreHorizontal className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="px-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800">Components</h3>
            <span className="text-xs text-indigo-600 font-medium cursor-pointer">View All</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {['Forms', 'Text', 'Buttons', 'Lists', 'Code'].map((cat, i) => (
              <div key={i} className="flex-shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm whitespace-nowrap">
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Feed Items */}
        <div className="px-4 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 py-1">
                <div className="w-3/4 h-3 bg-gray-100 rounded mb-2"></div>
                <div className="w-1/2 h-2.5 bg-gray-50 rounded"></div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-12 h-4 bg-indigo-50 rounded text-[10px] text-indigo-500 flex items-center justify-center font-medium">Action</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ---------------- BOTTOM NAV ---------------- */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between absolute bottom-0 w-full">
        <div className="flex flex-col items-center gap-1 text-indigo-600">
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-medium">Explore</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
          <Heart className="w-5 h-5" />
          <span className="text-[9px] font-medium">Saved</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
          <Settings className="w-5 h-5" />
          <span className="text-[9px] font-medium">Settings</span>
        </div>
      </div>
    </div>
  );
}
