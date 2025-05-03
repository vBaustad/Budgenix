'use client'

import {
  AcademicCapIcon,
  CheckCircleIcon,
  HandRaisedIcon,
  RocketLaunchIcon,
  SparklesIcon,
  //SunIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'

const stats = [
    { label: 'Founded', value: '2024' },
    { label: 'Users budgeting with Budgenix', value: '10,000+' },
    { label: 'Budgets created', value: '25,000+' },
    { label: 'Countries served', value: '20+' },
  ]
  const values = [
    {
      name: 'Be Transparent.',
      description: 'We believe in clarity—no hidden fees, no surprises. Your financial data is yours, always.',
      icon: RocketLaunchIcon,
    },
    {
      name: 'Empower Users.',
      description: 'Our tools are designed to give you full control over your financial journey, no matter your experience level.',
      icon: HandRaisedIcon,
    },
    {
      name: 'Privacy First.',
      description: 'Security and privacy are at the heart of Budgenix. Your data is encrypted and protected.',
      icon: UserGroupIcon,
    },
    {
      name: 'Always Improving.',
      description: 'We constantly refine Budgenix based on your feedback, ensuring it evolves with your needs.',
      icon: AcademicCapIcon,
    },
    {
      name: 'Collaborate & Grow.',
      description: 'Budgeting isn’t always solo—we enable shared budgeting for families and households.',
      icon: SparklesIcon,
    },
    {
      name: 'Keep It Simple.',
      description: 'We cut out complexity so you can focus on what matters: your goals.',
      icon: CheckCircleIcon,
    },
  ]
  export default function AboutSection() {
    return (
        <div id="about">
            <main className="relative isolate">
            {/* Background */}
            <div
            aria-hidden="true"
            className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
            >
            <div
                style={{
                clipPath:
                    'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                }}
                className="aspect-1108/632 w-[69.25rem] flex-none bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-25"
            />
            </div>

            {/* Header section */}
            <div className="px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl pt-24 text-center sm:pt-40">
                <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">Budgeting Made Simple</h1>
                <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
                Budgenix empowers individuals and households to take control of their finances with intuitive tools for tracking expenses, setting goals, and managing budgets effortlessly.
                </p>
            </div>
            </div>

            {/* Content section */}
            <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <div className="grid max-w-xl grid-cols-1 gap-8 text-base/7 text-gray-300 lg:max-w-none lg:grid-cols-2">
                <div>
                    <p>
                      Budgenix is built for real people who want a clear view of their personal finances. Whether you're saving for a dream vacation or simply want to know where your money goes each month, Budgenix makes it easy to stay on track.
                    </p>
                    <p className="mt-8">
                      Our platform simplifies the budgeting process with smart categories, recurring expense tracking, and insightful analytics—so you can make confident financial decisions every day.
                    </p>
                </div>
                <div>
                    <p>
                      With Budgenix, you can set up budgets in minutes, track your spending across multiple accounts, and visualize your progress toward your financial goals. We prioritize simplicity and transparency, ensuring you always know where you stand.
                    </p>
                    <p className="mt-8">
                      Whether you're budgeting solo or managing shared expenses with your household, Budgenix gives you the tools to collaborate, save smarter, and achieve your goals faster.
                    </p>
                </div>
                </div>
                <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mt-28 lg:grid-cols-4">
                {stats.map((stat, statIdx) => (
                    <div key={statIdx} className="flex flex-col-reverse gap-y-3 border-l border-white/20 pl-6">
                    <dt className="text-base/7 text-gray-300">{stat.label}</dt>
                    <dd className="text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                    </div>
                ))}
                </dl>
            </div>
            </div>

            {/* Image section */}
            <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
            <img
                alt=""
                src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2894&q=80"
                className="aspect-9/4 w-full object-cover xl:rounded-3xl"
            />
            </div>

            {/* Values section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">Our Mission & Values</h2>
                <p className="mt-6 text-lg/8 text-gray-300">
                  Budgenix is dedicated to helping people achieve financial clarity and freedom. Our core values guide everything we do.
                </p>
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
                {values.map((value) => (
                <div key={value.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                    <value.icon aria-hidden="true" className="absolute top-1 left-1 size-5 text-indigo-500" />
                    {value.name}
                    </dt>{' '}
                    <dd className="inline">{value.description}</dd>
                </div>
                ))}
            </dl>
            </div>
        </main>
        </div>
    )
}