import { useState } from "react";
import { Header } from "@/components/header";
import { FileUpload } from "@/components/file-upload";
import { ProcessingPanel } from "@/components/processing-panel";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { ImageFile, ProcessingMode } from "@/types/image";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Minimize2 } from "lucide-react";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<ProcessingMode>('convert');
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null);

  const handleFileUploaded = (imageFile: ImageFile) => {
    setUploadedImage(imageFile);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Convert & Compress Images{" "}
            <span className="text-primary">Instantly</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Transform your images with our powerful tools. Convert between formats, compress files, and resize images - all processed locally for maximum privacy.
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200">
            <div className="flex">
              <Button
                variant="ghost"
                className={`flex-1 px-6 py-4 text-center font-medium rounded-none border-b-2 ${
                  currentMode === 'convert'
                    ? 'text-primary border-primary bg-blue-50'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => setCurrentMode('convert')}
              >
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Format Converter
              </Button>
              <Button
                variant="ghost"
                className={`flex-1 px-6 py-4 text-center font-medium rounded-none border-b-2 ${
                  currentMode === 'compress'
                    ? 'text-primary border-primary bg-blue-50'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => setCurrentMode('compress')}
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Compress & Resize
              </Button>
            </div>
          </div>

          {/* File Upload Area */}
          {!uploadedImage && (
            <div className="p-8">
              <FileUpload onFileUploaded={handleFileUploaded} />
            </div>
          )}
        </div>

        {/* Processing Panel */}
        {uploadedImage && (
          <ProcessingPanel
            imageFile={uploadedImage}
            mode={currentMode}
            onRemove={handleRemoveImage}
          />
        )}

        {/* Features Section */}
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
