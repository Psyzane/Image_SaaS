import { Images, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Images className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ImageFlow</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Features
            </a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Contact
            </a>
            <a href="#privacy" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              Privacy
            </a>
            <a href="https://github.com/psyzane" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900 transition-colors font-medium flex items-center space-x-1">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </nav>
          <button className="md:hidden p-2">
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="block w-5 h-0.5 bg-slate-600 mb-1"></span>
              <span className="block w-5 h-0.5 bg-slate-600 mb-1"></span>
              <span className="block w-5 h-0.5 bg-slate-600"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
