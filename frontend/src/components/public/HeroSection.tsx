'use client'

export default function HeroSection() {
  return (
    <div className="relative isolate pt-14">                
        <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
                        Take Control of Your Budget with Budgenix
                    </h1>
                    <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                        Budgenix helps you track expenses, set goals, and master your personal finances effortlessly.
                        Stay on top of your budget with powerful tools and insightful analytics.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="#pricing"
                            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                        >
                            Get Started
                        </a>
                        <a href="#about" className="text-sm/6 font-semibold text-white">
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>                
                <img
                alt="App screenshot"
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
                width={2432}
                height={1442}
                className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"
                />
            </div>
        </div>
    </div>      
  )
}