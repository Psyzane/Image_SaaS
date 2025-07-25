import { 
  ArrowRightLeft, 
  Minimize2, 
  Expand, 
  Shield, 
  Zap, 
  Eye 
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: ArrowRightLeft,
      title: "Format Conversion",
      description: "Convert between JPEG, PNG, WebP, GIF, and BMP formats with automatic input detection.",
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      icon: Minimize2,
      title: "Smart Compression",
      description: "Reduce file sizes while maintaining visual quality with adjustable compression levels.",
      iconBg: "bg-emerald-100",
      iconColor: "text-accent",
    },
    {
      icon: Expand,
      title: "Precise Resizing",
      description: "Resize images to exact dimensions with optional aspect ratio preservation.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All processing happens in your browser. Your images never leave your device.",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant processing with no server uploads or waiting times required.",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      icon: Eye,
      title: "Live Preview",
      description: "See before and after comparisons with real-time preview updates.",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Powerful Image Processing</h3>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Everything you need to work with images, powered by modern web technologies
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
              <div className={`w-12 h-12 ${feature.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`${feature.iconColor} w-6 h-6`} />
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
