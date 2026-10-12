import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import api from "../services/api.js";

// Canonical categories defined directly from Homepage design reference
// Ensures categories ALWAYS show immediately with zero delay or blank state
const EXPLORE_CATEGORIES = [
  {
    title: "Internships",
    description: "Hands-on experience, paid and unpaid",
    slug: "internship",
  },
  {
    title: "Jobs",
    description: "Entry-level and part-time roles",
    slug: "job",
  },
  {
    title: "Scholarships",
    description: "Funding for your education",
    slug: "scholarship",
  },
  {
    title: "Hackathons",
    description: "Build something in a weekend",
    slug: "hackathon",
  },
  {
    title: "Competitions",
    description: "Test your skills against others",
    slug: "competition",
  },
  {
    title: "Fellowships",
    description: "Structured programs with mentorship",
    slug: "fellowship",
  },
  {
    title: "Grants",
    description: "Funding for projects and research",
    slug: "grant",
  },
  {
    title: "Research",
    description: "Labs and programs open to students",
    slug: "research",
  },
  {
    title: "Conferences",
    description: "Events, travel funding and networking",
    slug: "conference",
  },
];

// Showcase sample listings matching Homepage@2x.png design reference
const SHOWCASE_CLOSING_SOON = [
  {
    id: "sample-1",
    tag: "Research · Hybrid - Boston, US",
    matchScore: "71% match",
    title: "Summer Research Fellowship",
    organization: "Northfield Demo University",
    deadlineLabel: "Closing tomorrow",
    deadlineStyle: "bg-amber-50 text-amber-700 border border-amber-200/60",
    verifiedLabel: "Verified 2 days ago",
    verifiedStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    link: "/opportunities?search=Research",
  },
  {
    id: "sample-2",
    tag: "Hackathon · Remote",
    matchScore: "64% match",
    title: "Open Data for Climate Hackathon",
    organization: "Demo Climate Lab",
    deadlineLabel: "Closing in 3 days",
    deadlineStyle: "bg-amber-50 text-amber-700 border border-amber-200/60",
    verifiedLabel: "Reviewed 5 days ago",
    verifiedStyle: "bg-slate-100 text-slate-700 border border-slate-200/60",
    link: "/opportunities?search=Hackathon",
  },
  {
    id: "sample-3",
    tag: "Scholarship · Fully funded",
    matchScore: "58% match",
    title: "Undergraduate STEM Scholarship",
    organization: "Example Foundation",
    deadlineLabel: "Closing in 6 days",
    deadlineStyle: "bg-blue-50 text-blue-700 border border-blue-200/60",
    verifiedLabel: "Verified today",
    verifiedStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    link: "/opportunities?search=Scholarship",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState(EXPLORE_CATEGORIES);

  // Attempt to enrich categories count or slugs from backend API seamlessly
  useEffect(() => {
    api.get("/categories")
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          const apiCats = res.data.data;
          // Merge API data with friendly descriptions
          const merged = EXPLORE_CATEGORIES.map((cat) => {
            const found = apiCats.find(
              (c) => c.slug?.toLowerCase() === cat.slug.toLowerCase()
            );
            return found ? { ...cat, _id: found._id } : cat;
          });
          setCategories(merged);
        }
      })
      .catch(() => {
        // Fallback remains EXPLORE_CATEGORIES
      });
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/opportunities?search=${encodeURIComponent(q)}` : "/opportunities");
  };

  return (
    <div className="w-full bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/90 text-indigo-700 border border-indigo-100 mb-6">
              Opportunity intelligence for students
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-gray-950 leading-[1.08] mb-5">
              Stop missing the <br className="hidden sm:inline" />
              opportunities <br />
              <span className="text-blue-600">meant for you.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-7">
              Internships, scholarships, research, hackathons and more – structured,
              verified and matched to your profile, with every deadline in view.
            </p>

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md flex items-center bg-white border border-gray-200/90 rounded-2xl p-1.5 pl-4 shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all mb-4"
            >
              <input
                type="text"
                placeholder='Try "machine learning", "react" or "scholarship"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-xs sm:text-sm outline-none pr-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Link
                to="/opportunities?sort=deadline"
                className="text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-full px-3.5 py-1.5 transition-colors shadow-2xs"
              >
                Closing this week
              </Link>
              <Link
                to="/opportunities?remote=REMOTE"
                className="text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-full px-3.5 py-1.5 transition-colors shadow-2xs"
              >
                Remote
              </Link>
              <Link
                to="/opportunities?education=UNDERGRADUATE"
                className="text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-full px-3.5 py-1.5 transition-colors shadow-2xs"
              >
                No experience required
              </Link>
              <Link
                to="/opportunities?search=funded"
                className="text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-full px-3.5 py-1.5 transition-colors shadow-2xs"
              >
                Fully funded
              </Link>
            </div>

            {/* Micro footnote */}
            <p className="text-xs text-slate-400">
              Every listing shows where it came from and when a person last checked it.
            </p>
          </div>

          {/* Right Column: Interactive Hero Match Preview Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200/80 shadow-xl p-6 sm:p-7 relative transition-transform hover:-translate-y-0.5 duration-300">
              {/* Card Top: Org info & Match Score Badge */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-xs text-gray-500 font-medium tracking-tight">
                    Brightside Demo Labs · Internship · Remote
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mt-1">
                    Frontend Engineering Internship
                  </h3>
                </div>
                <div className="shrink-0 bg-gray-950 text-white rounded-xl px-3 py-1.5 text-center min-w-[76px]">
                  <div className="text-base sm:text-lg font-black leading-none">88%</div>
                  <div className="text-[10px] text-gray-300 font-normal mt-0.5 tracking-tight">
                    Strong match
                  </div>
                </div>
              </div>

              {/* Urgency & Verification Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Closing in 3 days
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified 2 days ago
                </span>
              </div>

              {/* "Why this matches" Breakdown */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-900 mb-3 tracking-tight">
                  Why this matches
                </h4>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Education requirement matches</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3 of 5 skills match</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Remote preference matches</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-amber-800 font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Opportunity prefers: some experience (under 1 year)</span>
                  </li>
                </ul>
              </div>

              {/* Card Footer Disclaimer */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 text-[11px] text-gray-400 leading-normal">
                A recommendation based on your profile, not an eligibility guarantee. Sample listing - demo data.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "CLOSING SOON" SECTION */}
      <section id="closing-soon" className="border-t border-gray-100 bg-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
                Closing soon
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Don't find a great opportunity the day after it closes.
              </p>
            </div>
            <Link
              to="/opportunities"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 shrink-0"
            >
              Browse all opportunities
            </Link>
          </div>

          {/* 3 Showcase Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SHOWCASE_CLOSING_SOON.map((card) => (
              <Link
                key={card.id}
                to={card.link}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {card.tag}
                    </span>
                    <span className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                      {card.matchScore}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-5">
                    {card.organization}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium ${card.deadlineStyle}`}>
                    <Clock className="w-3 h-3" />
                    {card.deadlineLabel}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium ${card.verifiedStyle}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {card.verifiedLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Sample listings - demo data, not real opportunities.
          </p>
        </div>
      </section>

      {/* 3. "EXPLORE BY CATEGORY" SECTION (FIXED & FULLY VISIBLE) */}
      <section id="categories" className="border-t border-gray-100 bg-[#fafbfe] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
              Explore by category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              It's not just jobs. Every kind of opportunity gets equal footing.
            </p>
          </div>

          {/* 9-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/opportunities?category=${cat.slug}`}
                className="bg-[#f8fafc] border border-slate-200/70 hover:border-blue-400 hover:bg-white hover:shadow-sm rounded-xl p-5 transition-all duration-150 group cursor-pointer block"
              >
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base">
                  {cat.title || cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-normal">
                  {cat.description || "Browse curated listings in this category"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "BUILT FOR DECISIONS, NOT ENDLESS SCROLLING" SECTION */}
      <section id="features" className="border-t border-gray-100 bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              Built for decisions, not endless <br />
              scrolling
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <h3 className="text-blue-600 font-bold text-base mb-2">
                Matches that explain themselves
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See a score and the exact reasons behind it, plus what to add to your profile to improve it.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <h3 className="text-blue-600 font-bold text-base mb-2">
                Trust you can see
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every listing shows its source and when it was last checked. Verified means checked against the source, never guaranteed open.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <h3 className="text-blue-600 font-bold text-base mb-2">
                Deadline-first
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A dashboard for what closes today and this week, plus email reminders before it's too late.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-shadow">
              <h3 className="text-blue-600 font-bold text-base mb-2">
                Track what you apply for
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save, mark Interested, Applied or Interview, and keep notes. We never submit applications for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DARK CALL-TO-ACTION CONTAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-[#0b1329] rounded-3xl p-8 sm:p-12 lg:p-14 text-white shadow-xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
              Tell us about you. See what fits, <br />
              and why.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-lg">
              Build a profile in minutes and get an explainable match score on every opportunity.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                to="/register"
                className="bg-white text-gray-950 hover:bg-slate-100 font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-sm"
              >
                Create your free profile
              </Link>
              <Link
                to="/opportunities"
                className="bg-transparent text-white border border-slate-600 hover:border-slate-400 font-semibold px-6 py-3 rounded-full text-sm transition-all"
              >
                Browse opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-xl text-center md:text-left">
            Opportunity Finder helps you discover and plan. It does not submit applications or guarantee eligibility. Always confirm details on the official source.
          </p>
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/opportunities" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link to="/opportunities" className="hover:text-slate-900 transition-colors">
              Report a listing
            </Link>
            <Link to="/opportunities" className="hover:text-slate-900 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
