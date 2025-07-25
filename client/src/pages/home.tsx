import { useState } from "react";
import { Header } from "@/components/header";
import { FileUpload } from "@/components/file-upload";
import { BatchUpload } from "@/components/batch-upload";
import { ProcessingPanel } from "@/components/processing-panel";
import { BatchProcessor } from "@/components/batch-processor";
import { FeaturesSection } from "@/components/features-section";
import { Footer } from "@/components/footer";
import { ImageFile, ProcessingSettings } from "@/types/image";
import { Button } from "@/components/ui/button";
import { Image, Images } from "lucide-react";

type ProcessingMode = 'single' | 'batch';

export default function Home() {
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('single');
  const [uploadedImage, setUploadedImage] = useState<ImageFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<ImageFile[]>([]);
  const [batchSettings, setBatchSettings] = useState<ProcessingSettings>({
    outputFormat: 'jpeg',
    quality: 75,
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    filters: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      vintage: false,
      sharpen: 0,
    },
    watermark: {
      enabled: false,
      text: 'Watermark',
      opacity: 50,
      position: 'bottom-right',
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      angle: 0,
    },
  });

  const handleFileUploaded = (imageFile: ImageFile) => {
    setUploadedImage(imageFile);
  };

  const handleFilesUploaded = (imageFiles: ImageFile[]) => {
    setUploadedFiles(imageFiles);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
  };

  const handleRemoveFiles = () => {
    setUploadedFiles([]);
  };

  const switchToMode = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    setUploadedImage(null);
    setUploadedFiles([]);
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
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Convert formats, compress files, resize images, apply filters, and add watermarks. All processing happens locally for maximum privacy and speed.
          </p>

          {/* Processing Mode Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button
              variant={processingMode === 'single' ? 'default' : 'outline'}
              onClick={() => switchToMode('single')}
              className={processingMode === 'single' 
                ? "bg-primary text-white hover:bg-blue-600" 
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }
            >
              <Image className="w-4 h-4 mr-2" />
              Single Image
            </Button>
            <Button
              variant={processingMode === 'batch' ? 'default' : 'outline'}
              onClick={() => switchToMode('batch')}
              className={processingMode === 'batch' 
                ? "bg-primary text-white hover:bg-blue-600" 
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }
            >
              <Images className="w-4 h-4 mr-2" />
              Batch Processing
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <div className="max-w-4xl mx-auto mb-8">
          {processingMode === 'single' ? (
            !uploadedImage ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <FileUpload onFileUploaded={handleFileUploaded} />
              </div>
            ) : (
              <ProcessingPanel 
                imageFile={uploadedImage} 
                onRemove={handleRemoveImage}
              />
            )
          ) : (
            uploadedFiles.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <BatchUpload onFilesUploaded={handleFilesUploaded} />
              </div>
            ) : (
              <BatchProcessor
                files={uploadedFiles}
                settings={batchSettings}
                onRemove={handleRemoveFiles}
              />
            )
          )}
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-white rounded-2xl shadow-lg border border-slate-200 mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Get in Touch</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
          <div className="max-w-md mx-auto text-center">
            <p className="text-slate-600 mb-4">
              Send us an email and we'll get back to you as soon as possible.
            </p>
            <a 
              href="mailto:hello@imageflow.app" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="py-16 mt-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Your Privacy Matters</h3>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-4">100% Client-Side Processing</h4>
                <p className="text-slate-600 leading-relaxed">
                  All image processing happens directly in your browser. Your images are never uploaded to our servers, 
                  ensuring complete privacy and security. What happens on your device, stays on your device.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-4">No Data Collection</h4>
                <p className="text-slate-600 leading-relaxed">
                  We don't track, store, or analyze your images or personal data. No cookies, no analytics, 
                  no third-party trackers. Your creative work remains completely private.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-4">Open Source</h4>
                <p className="text-slate-600 leading-relaxed">
                  Our codebase is transparent and open for inspection. You can verify our privacy claims 
                  and even run the application locally if desired.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-4">Secure by Design</h4>
                <p className="text-slate-600 leading-relaxed">
                  Built with modern web security standards. All processing uses secure browser APIs 
                  with no external dependencies for image manipulation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
