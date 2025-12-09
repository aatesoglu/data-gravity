import { useState } from 'react';
import { FloatingHeader } from './components/layout/FloatingHeader';
import { FloatingFooter } from './components/layout/FloatingFooter';
import { AnimatedBackground } from './components/effects/AnimatedBackground';
import { GlassCard } from './components/ui/GlassCard';
import { GlowButton } from './components/ui/GlowButton';
import { FileUploadZone } from './components/features/upload/FileUploadZone';
import { ImageUploadZone } from './components/features/vision/ImageUploadZone';
import { AnalysisDashboard } from './components/features/analysis/AnalysisDashboard';
import { ChartRecommendations } from './components/features/recommendations/ChartRecommendations';
import { VisualizationCanvas } from './components/features/canvas/VisualizationCanvas';
import { VisionResults } from './components/features/vision/VisionResults';
import { parseFile, type ParsedData } from './lib/parseData';
import { analyzeDataset, type DatasetAnalysis } from './lib/analyzeData';
import { recommendCharts, type ChartRecommendation } from './lib/recommendations/recommendEngine';
import { analyzeImage, type VisionResult } from './lib/visionService';
import { ChevronRight, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'upload' | 'vision_upload' | 'analyze' | 'vision_result' | 'recommend' | 'visualize'>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataset, setDataset] = useState<ParsedData | null>(null);
  const [analysis, setAnalysis] = useState<DatasetAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<ChartRecommendation[]>([]);
  const [selectedChart, setSelectedChart] = useState<ChartRecommendation | null>(null);
  const [visionResult, setVisionResult] = useState<VisionResult | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const data = await parseFile(file);
      setDataset(data);

      // Artificial delay for "Scanning" effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      const analysisResult = analyzeDataset(data.data, data.columns);
      setAnalysis(analysisResult);

      const recs = recommendCharts(analysisResult);
      setRecommendations(recs);

      setActiveTab('analyze');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to parse file");
    } finally {
      setIsProcessing(false);
    }
  };

  /* New state for side-by-side vision display */
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      // Create a local URL for the uploaded image to display it
      const objectUrl = URL.createObjectURL(file);
      setUploadedImage(objectUrl);

      const result = await analyzeImage(file);
      setVisionResult(result);
      setActiveTab('vision_result');
    } catch (error) {
      console.error("Vision Analysis failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExploreCharts = () => {
    setActiveTab('recommend');
  }

  const handleChartSelect = (rec: ChartRecommendation) => {
    setSelectedChart(rec);
    setActiveTab('visualize');
  }

  const handleVisionVisualize = (chartType: any) => {
    // Construct a recommendation object from the vision result
    const rec: ChartRecommendation = {
      type: chartType,
      score: 100,
      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart (Vision Derived)`,
      description: "Generated based on your uploaded image style.",
      requiredChannels: { // Default assumptions, will be refined by Canvas
        x: 'categorical',
        y: 'numeric'
      }
    };
    handleChartSelect(rec);
  };

  return (
    <div className="min-h-screen text-white relative selection:bg-cyan-500/30">
      <AnimatedBackground />
      <AnimatedBackground />
      <FloatingHeader
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab as any)}
      />

      <main className="relative z-10 container mx-auto px-4 pt-32 pb-24 min-h-screen flex flex-col">

        {/* Hero Section */}
        <AnimatePresence>
          {activeTab === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-gray-400">
                  DATA <span className="text-cyan-400">GRAVITY</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Experience the next generation of data visualization.
                  Upload your datasets or sketches and let our intelligent engine defy gravity.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                <GlassCard
                  className="group cursor-pointer min-h-[300px] flex flex-col items-center justify-center gap-6 border-cyan-500/10 hover:border-cyan-500/50"
                  onClick={() => setActiveTab('upload')}
                >
                  <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Upload className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2 text-white">Upload Dataset</h3>
                    <p className="text-gray-400">CSV, Excel, JSON supported</p>
                  </div>
                  <GlowButton>Select File</GlowButton>
                </GlassCard>

                <GlassCard
                  className="group cursor-pointer min-h-[300px] flex flex-col items-center justify-center gap-6 border-violet-500/10 hover:border-violet-500/50"
                  onClick={() => setActiveTab('vision_upload')}
                >
                  <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <ImageIcon className="w-10 h-10 text-violet-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2 text-white">Scan Image</h3>
                    <p className="text-gray-400">Analyze charts from images</p>
                  </div>
                  <GlowButton variant="secondary">Upload Image</GlowButton>
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Upload Tab */}
        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full relative"
          >
            <GlowButton variant="ghost" className="mb-8 absolute -top-16 left-0" onClick={() => setActiveTab('home')}> <ArrowLeft className="mr-2 w-4 h-4" /> Back</GlowButton>
            <FileUploadZone onFileSelect={handleFileUpload} />
            {isProcessing && (
              <div className="mt-8 text-center">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-cyan-400 animate-pulse">Analyzing Quantum Patterns...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Vision Upload Tab */}
        {activeTab === 'vision_upload' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full relative"
          >
            <GlowButton variant="ghost" className="mb-8 absolute -top-16 left-0" onClick={() => setActiveTab('home')}> <ArrowLeft className="mr-2 w-4 h-4" /> Back</GlowButton>
            <ImageUploadZone onImageSelect={handleImageUpload} />
            {isProcessing && (
              <div className="mt-8 text-center">
                <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-violet-400 animate-pulse">Scanning Visual Structure...</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Vision Result Tab */}
        {activeTab === 'vision_result' && visionResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <GlowButton variant="ghost" onClick={() => setActiveTab('vision_upload')} className="px-3">
                <ArrowLeft className="w-5 h-5" />
              </GlowButton>
              <h2 className="text-xl text-gray-400">Vision Analysis</h2>
            </div>
            <VisionResults
              result={visionResult}
              analysis={analysis}
              data={dataset?.data || []}
              uploadedImage={uploadedImage}
              onVisualize={handleVisionVisualize}
            />
          </motion.div>
        )}

        {activeTab === 'analyze' && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <GlowButton variant="ghost" onClick={() => setActiveTab('upload')} className="px-3">
                <ArrowLeft className="w-5 h-5" />
              </GlowButton>
              <div className="flex-1 flex justify-between items-center">
                <h2 className="text-3xl font-bold">Data Intelligence</h2>
                <GlowButton onClick={handleExploreCharts} className="gap-2">
                  Explore Visualizations <ChevronRight className="w-4 h-4" />
                </GlowButton>
              </div>
            </div>
            <AnalysisDashboard analysis={analysis} data={dataset?.data || []} onVisualize={handleChartSelect} />
          </motion.div>
        )}

        {activeTab === 'recommend' && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <GlowButton variant="ghost" onClick={() => setActiveTab('analyze')} className="px-3">
                <ArrowLeft className="w-5 h-5" />
              </GlowButton>
              <div>
                <h2 className="text-sm text-cyan-400 font-bold tracking-widest uppercase">Step 2</h2>
                <p className="text-gray-400 text-sm">Select a blueprint to generate</p>
              </div>
            </div>
            <ChartRecommendations recommendations={recommendations} onSelect={handleChartSelect} />
          </motion.div>
        )}

        {activeTab === 'visualize' && selectedChart && dataset && analysis && (
          <VisualizationCanvas
            chart={selectedChart}
            data={dataset.data}
            analysis={analysis}
            onBack={() => setActiveTab('recommend')}
          />
        )}

      </main>

      <FloatingFooter />
    </div>
  );
}

export default App;
