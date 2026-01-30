import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#03091F] text-white pt-20 pb-8 px-6 md:px-16 overflow-hidden">
      
      {/* Top CTA Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 border-b border-white/10 pb-12">
        <div className="max-w-3xl">
          <p className="text-white/60 text-[10px] tracking-[0.3em] mb-4 uppercase font-medium">
            READY TO UNLOCK YOUR INVESTMENT POTENTIAL?
          </p>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
            LET'S GET STARTED
          </h2>
        </div>
        
        <button className="mt-8 lg:mt-0 bg-[#F58A07] hover:bg-[#e07b06] text-white px-8 py-4 flex items-center gap-2 text-sm font-bold tracking-wide transition-all">
          REGISTER NOW
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Links & Newsletter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Links Columns */}
        <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-white mb-2">Company</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#F58A07] transition-colors">About Us</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Our Mission</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">News</a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-white mb-2">Events</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#F58A07] transition-colors">Investment Trends</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Risk Management</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Investing Forum</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-sm text-white mb-2">Social</h4>
            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#F58A07] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-[#F58A07] transition-colors">Reddit</a>
            </div>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-5 lg:col-start-8">
          <h4 className="font-medium text-sm text-white mb-4">
            Subscribe to be in touch with news.
          </h4>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Email Address*" 
              className="w-full bg-[#050B26] border border-white/20 p-4 pr-12 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#F58A07] transition-colors"
            />
            <ArrowUpRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs pt-8 border-t border-white/5">
        <p>©Achievy. All Rights Reserved</p>
        <p>Designed by Fourtwelve</p>
      </div>
    </footer>
  );
}
