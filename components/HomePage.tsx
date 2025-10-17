import React, { FC } from 'react';
import { SparklesIcon, ChartBarIcon, TextSizeIcon, TemplateIcon } from './icons';

interface HomePageProps {
    onGetStarted: () => void;
}

const FeatureCard: FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
        <div className="flex justify-center items-center mb-4">
            <div className="bg-[var(--primary-light)] text-[var(--primary)] rounded-full p-3 [&>svg]:w-6 [&>svg]:h-6">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600">{children}</p>
    </div>
);


const HomePage: FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
            <header className="absolute top-0 left-0 right-0 p-6 z-10">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">
                        Spark Docs <span className="text-[var(--primary)]">Creator</span>
                    </h1>
                </div>
            </header>

            <main className="flex-grow flex flex-col justify-center">
                {/* Hero Section */}
                <section className="text-center py-20 px-4 relative">
                    <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                    <div className="relative container mx-auto">
                        <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                            Craft Your Professional Story, <span className="text-[var(--primary)]">Instantly.</span>
                        </h2>
                        <p className="max-w-3xl mx-auto text-lg text-slate-600 mb-8">
                            Leverage AI to build standout professional documents that open doors. Effortless, intelligent, and tailored to you.
                        </p>
                        <button 
                            onClick={onGetStarted}
                            className="bg-[var(--primary)] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-[var(--primary-hover)] transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-ring)] text-lg"
                        >
                            Create My Document
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white border-y border-slate-200">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">Why Choose Spark Docs?</h2>
                            <p className="text-slate-600 mt-2">Everything you need to achieve your professional goals.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon={<SparklesIcon />} title="AI-Powered Content">
                                Generate compelling content, summaries, and entire documents tailored to your needs.
                            </FeatureCard>
                             <FeatureCard icon={<TemplateIcon />} title="Professional Templates">
                                Choose from modern, classic, and elegant designs to match your style.
                            </FeatureCard>
                             <FeatureCard icon={<ChartBarIcon />} title="Instant Analysis">
                                Get real-time feedback and keyword analysis to optimize your documents.
                            </FeatureCard>
                             <FeatureCard icon={<TextSizeIcon />} title="Easy Customization">
                                Fine-tune fonts, colors, and layouts to create a document that's uniquely yours.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="bg-slate-50 text-center py-6">
                <p className="text-slate-500">&copy; {new Date().getFullYear()} Spark Docs Creator. All rights reserved.</p>
            </footer>
             <style>{`
                .bg-grid-slate-200 {
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e2e8f0'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
                }
             `}</style>
        </div>
    );
};

export default HomePage;