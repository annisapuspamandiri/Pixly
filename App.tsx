
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  ThemeType, 
  Language, 
  SubjectType, 
  Gender, 
  Style, 
  AspectRatio, 
  Resolution,
  AppState 
} from './types';
import { THEMES, TRANSLATIONS } from './constants';
import { generateProfessionalContent } from './services/geminiService';

// --- Components ---

interface SectionTitleProps {
  title: string;
  theme: any;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, theme }) => (
  <h2 className={`text-xs font-bold tracking-widest ${theme.secondaryText} mb-3 uppercase`}>
    {title}
  </h2>
);

interface DropZoneProps {
  id: string;
  label: string;
  onUpload: (base64: string) => void;
  preview: string | null;
  theme: any;
}

const DropZone: React.FC<DropZoneProps> = ({ id, label, onUpload, preview, theme }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-6">
      <div 
        className={`relative w-full aspect-video rounded-2xl border-2 border-dashed ${theme.border} flex flex-col items-center justify-center bg-opacity-50 overflow-hidden group cursor-pointer hover:border-opacity-100 transition-all`}
        onClick={() => document.getElementById(id)?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full ${theme.bg} flex items-center justify-center mb-2`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme.secondaryText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className={`text-sm ${theme.secondaryText}`}>Click to upload</span>
          </div>
        )}
        <input 
          id={id}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleChange} 
        />
      </div>
      <p className={`mt-2 text-[10px] text-center uppercase tracking-wider ${theme.secondaryText}`}>{label}</p>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>({
    theme: ThemeType.BlueSky,
    language: Language.English,
    productImage: null,
    backgroundImage: null,
    subjectType: SubjectType.ProductOnly,
    gender: Gender.Female,
    noModel: false,
    additionalPrompt: '',
    style: Style.SoftAesthetic,
    count: 1,
    aspectRatio: AspectRatio.Square,
    resolution: Resolution.HD,
    branding: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const theme = THEMES[state.theme];
  const t = TRANSLATIONS[state.language];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage(t.processing);
    try {
      const images = await generateProfessionalContent({
        productImageBase64: state.productImage,
        backgroundImageBase64: state.backgroundImage,
        subjectType: state.subjectType,
        gender: state.gender,
        noModel: state.noModel,
        additionalPrompt: state.additionalPrompt,
        style: state.style,
        aspectRatio: state.aspectRatio,
      });
      setGeneratedImages(images);
      setStatusMessage(null);
    } catch (error) {
      console.error(error);
      setStatusMessage(t.error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateState = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-500`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${theme.card} border-b ${theme.border} px-6 py-4 flex items-center justify-between shadow-sm`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${theme.accent} rounded-lg flex items-center justify-center text-white font-bold`}>P</div>
          <h1 className="text-xl font-bold tracking-tighter">{t.appName}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={state.language} 
            onChange={(e) => updateState('language', e.target.value as Language)}
            className={`text-xs bg-transparent border-none focus:ring-0 cursor-pointer font-medium uppercase`}
          >
            <option value={Language.English}>EN</option>
            <option value={Language.Indonesian}>ID</option>
            <option value={Language.Malaysian}>MS</option>
          </select>

          <div className="flex gap-1">
            {Object.keys(THEMES).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => updateState('theme', themeKey as ThemeType)}
                className={`w-6 h-6 rounded-full border-2 ${state.theme === themeKey ? 'border-white ring-2 ring-gray-300' : 'border-transparent'}`}
                style={{ backgroundColor: 
                  themeKey === ThemeType.PinkSoft ? '#ec4899' :
                  themeKey === ThemeType.BlueSky ? '#0ea5e9' :
                  themeKey === ThemeType.MidnightBlue ? '#1e1b4b' :
                  themeKey === ThemeType.MaroonMahony ? '#7f1d1d' :
                  '#7c2d12'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            {/* Foto Produk */}
            <section>
              <SectionTitle title={t.productPhoto} theme={theme} />
              <DropZone 
                id="product-upload" 
                label={t.productPhotoSub} 
                onUpload={(val) => updateState('productImage', val)} 
                preview={state.productImage}
                theme={theme}
              />
            </section>

            {/* Tipe Subjek */}
            <section>
              <SectionTitle title={t.subjectType} theme={theme} />
              <div className="flex flex-wrap gap-2">
                {Object.values(SubjectType).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateState('subjectType', type)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${state.subjectType === type ? `${theme.accent} text-white` : `${theme.card} border ${theme.border} opacity-60 hover:opacity-100`}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            {/* Gender Model */}
            <section>
              <SectionTitle title={t.genderModel} theme={theme} />
              <div className="flex gap-4">
                {[Gender.Female, Gender.Male].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={g} 
                      checked={state.gender === g}
                      onChange={() => updateState('gender', g)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 ${state.gender === g ? `${theme.accent.replace('bg-', 'border-')}` : 'border-gray-300'} flex items-center justify-center p-0.5`}>
                      {state.gender === g && <div className={`w-full h-full rounded-full ${theme.accent}`}></div>}
                    </div>
                    <span className={`text-sm ${state.gender === g ? 'font-bold' : 'opacity-40'} group-hover:opacity-100`}>
                      {g === Gender.Female ? t.female : t.male}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* AI Model Toggle */}
            <section>
              <SectionTitle title={t.aiModel} theme={theme} />
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={state.noModel} 
                  onChange={(e) => updateState('noModel', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500" 
                />
                <span className="text-sm font-medium">{t.noModel}</span>
              </label>
            </section>

            {/* Latar */}
            <section>
              <SectionTitle title={t.background} theme={theme} />
              <DropZone 
                id="bg-upload" 
                label={t.backgroundSub} 
                onUpload={(val) => updateState('backgroundImage', val)} 
                preview={state.backgroundImage}
                theme={theme}
              />
            </section>

            {/* Prompt Tambahan */}
            <section>
              <SectionTitle title={t.additionalPrompt} theme={theme} />
              <textarea 
                className={`w-full ${theme.card} border ${theme.border} rounded-2xl p-4 text-sm focus:ring-2 focus:ring-opacity-50 outline-none h-24 placeholder:opacity-50`}
                placeholder={t.additionalPromptPlaceholder}
                value={state.additionalPrompt}
                onChange={(e) => updateState('additionalPrompt', e.target.value)}
              />
            </section>
          </div>

          {/* Settings Side (Sticky) */}
          <div className="lg:col-span-5">
            <div className={`sticky top-24 ${theme.card} border ${theme.border} rounded-3xl p-6 shadow-xl space-y-6`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <SectionTitle title={t.style} theme={theme} />
                  <select 
                    value={state.style} 
                    onChange={(e) => updateState('style', e.target.value as Style)}
                    className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs focus:outline-none font-semibold`}
                  >
                    <option value={Style.SoftAesthetic}>{t.softAesthetic}</option>
                    <option value={Style.Retro}>{t.retro}</option>
                  </select>
                </div>
                <div>
                  <SectionTitle title={t.count} theme={theme} />
                  <input 
                    type="range" min="1" max="10" 
                    value={state.count}
                    onChange={(e) => updateState('count', parseInt(e.target.value))}
                    className="w-full mt-2 accent-pink-500"
                  />
                  <p className="text-[10px] text-right mt-1 font-bold">{state.count} variations</p>
                </div>
              </div>

              <div>
                <SectionTitle title={t.ratio} theme={theme} />
                <div className="flex flex-wrap gap-2">
                  {Object.values(AspectRatio).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => updateState('aspectRatio', ratio)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold border ${state.aspectRatio === ratio ? `${theme.accent} text-white border-transparent` : `${theme.border} opacity-60`}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle title={t.resolution} theme={theme} />
                <div className="flex gap-2">
                  {[Resolution.HD, Resolution.Standard].map((res) => (
                    <button
                      key={res}
                      onClick={() => updateState('resolution', res)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border ${state.resolution === res ? `${theme.accent} text-white border-transparent` : `${theme.border} opacity-60`}`}
                    >
                      {res === Resolution.HD ? t.hd : t.standard}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionTitle title={t.branding} theme={theme} />
                <input 
                  type="text"
                  placeholder={t.brandingLabel}
                  value={state.branding}
                  onChange={(e) => updateState('branding', e.target.value)}
                  className={`w-full bg-transparent border-b ${theme.border} py-2 text-xs focus:outline-none placeholder:opacity-30`}
                />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !state.productImage}
                className={`w-full py-4 rounded-2xl ${theme.accent} text-white font-bold text-sm shadow-lg shadow-pink-500/20 active:scale-95 transition-transform flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{t.processing}</span>
                  </>
                ) : (
                  <span>{t.generate}</span>
                )}
              </button>
              
              {!state.productImage && <p className="text-[10px] text-center opacity-50 italic">Please upload a product photo first</p>}
            </div>
          </div>
        </div>

        {/* Results Area */}
        {(generatedImages.length > 0 || isGenerating) && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Generated Results</h2>
              <span className={`text-xs px-3 py-1 rounded-full ${theme.accent} text-white`}>No Watermark</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isGenerating ? (
                Array.from({ length: 1 }).map((_, idx) => (
                  <div key={idx} className={`aspect-[${state.aspectRatio.replace(':', '/')}] rounded-3xl ${theme.card} border ${theme.border} animate-pulse flex items-center justify-center`}>
                    <p className="text-sm opacity-30">{t.loading}</p>
                  </div>
                ))
              ) : (
                generatedImages.map((img, idx) => (
                  <div key={idx} className="group relative rounded-3xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
                    <img src={img} alt={`Generated content ${idx}`} className="w-full h-auto" />
                    {state.branding && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-40 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                        {state.branding}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <a 
                        href={img} 
                        download={`pixly-content-${idx}.png`}
                        className="bg-white text-black p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-opacity-10 border-black text-center">
        <p className="text-xs opacity-40 font-medium">© 2025 PIXLY - AI CONTENT GENERATOR FOR AFFILIATE</p>
      </footer>
    </div>
  );
}
