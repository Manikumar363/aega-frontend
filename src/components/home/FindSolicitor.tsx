import React from 'react';

export const FindSolicitor = () => {
  return (
    <section className="bg-zinc-900 py-8 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-white text-xl font-bold mb-4">Find a Solicitor</h3>
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <input 
              type="text" 
              placeholder="Postcode" 
              className="w-full bg-zinc-800 text-white border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-yellow-500 placeholder-gray-500" 
            />
          </div>
          <div className="md:col-span-6">
            <select className="w-full bg-zinc-800 text-gray-400 border border-zinc-700 px-4 py-3 rounded focus:outline-none focus:border-yellow-500 appearance-none">
              <option>Choose an area of law...</option>
              <option>Immigration</option>
              <option>Education</option>
              <option>Compliance</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button className="w-full bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};