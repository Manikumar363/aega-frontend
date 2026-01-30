"use client";

import React from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const TrainingFilter = () => {
  return (
    <section className="bg-zinc-900 py-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-white text-xl font-bold mb-6">Find Training Programmes</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Dropdowns */}
          {[
            "Training Category", 
            "Participation Type", 
            "Training Format", 
            "Training Duration"
          ].map((placeholder, idx) => (
            <div key={idx} className="lg:col-span-2 relative">
              <select className="w-full bg-zinc-800 text-gray-300 border border-zinc-700 px-4 py-3 rounded appearance-none focus:outline-none focus:border-orange-500 cursor-pointer text-sm">
                <option>{placeholder}</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          ))}

          {/* Search Button (Dark) */}
          <div className="lg:col-span-2">
            <button className="w-full bg-zinc-800 border border-zinc-700 text-orange-500 font-bold py-3 rounded hover:bg-zinc-700 transition-colors text-sm">
              Search
            </button>
          </div>

          {/* Browse All Button (Orange) */}
          <div className="lg:col-span-2">
            <button className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition-colors text-sm">
              Browse all Events
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};