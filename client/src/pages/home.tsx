import { useState } from "react";
import { Header } from "@/components/header";
import { FileUpload } from "@/components/file-upload";
import { ProcessingPanel } from "@/components/processing-panel";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { ImageFile } from "@/types/image";

export default function Home() {
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
            Transform Images{" "}
            <span className="text-primary">Instantly</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Convert formats, compress files, and resize images with our unified processing tool. All processing happens locally for maximum privacy and speed.
          </p>
        </div>

        {/* File Upload Area */}
        {!uploadedImage && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
            <FileUpload onFileUploaded={handleFileUploaded} />
          </div>
        )}

        {/* Processing Panel */}
        {uploadedImage && (
          <ProcessingPanel
            imageFile={uploadedImage}
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
