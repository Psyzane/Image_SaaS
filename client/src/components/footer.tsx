import { Images, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Images className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">ImageFlow</h3>
            </div>
            <p className="text-slate-600 max-w-md">
              The fastest way to convert, compress, and resize your images. No uploads required - everything happens in your browser.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Links</h4>
            <ul className="space-y-3 text-slate-600">
              <li><a href="#features" className="hover:text-slate-900 transition-colors font-medium">Features</a></li>
              <li><a href="#contact" className="hover:text-slate-900 transition-colors font-medium">Contact</a></li>
              <li><a href="#privacy" className="hover:text-slate-900 transition-colors font-medium">Privacy</a></li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-slate-900 transition-colors font-medium flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-8 pt-8 text-center">
          <p className="text-slate-600 text-sm">
            © 2024 ImageFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
