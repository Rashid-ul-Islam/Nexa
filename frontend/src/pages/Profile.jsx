import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import { User, Save, BookOpen, MapPin, Award, Compass } from "lucide-react";
import LocationPickerMap from "../components/LocationPickerMap.jsx";

export default function Profile() {
  const { user, token, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fieldsList, setFieldsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [educationLevel, setEducationLevel] = useState("UNDERGRADUATE");
  const [major, setMajor] = useState("");
  const [majorFieldId, setMajorFieldId] = useState("");
  const [university, setUniversity] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [locationCoords, setLocationCoords] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState("ENTRY");
  const [remotePreference, setRemotePreference] = useState("ANY");
  const [selectedSkills, setSelectedSkills] = useState([]);

  // If not logged in, redirect to login
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Load fields & skills taxonomies
  useEffect(() => {
    api.get("/fields").then((res) => setFieldsList(res.data.data || []));
    api.get("/skills").then((res) => setSkillsList(res.data.data || []));
  }, []);

  // Populate form with current user profile
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      const p = user.profile || {};
      setEducationLevel(p.educationLevel || "UNDERGRADUATE");
      setMajor(p.major || "");
      setMajorFieldId(p.majorFieldId || "");
      setUniversity(p.university || "");
      setGraduationYear(p.graduationYear || "");
      setCountry(p.country || "");
      setAddress(p.address || "");
      if (Array.isArray(p.location?.coordinates) && p.location.coordinates.length === 2) {
        setLocationCoords({
          lat: p.location.coordinates[1],
          lng: p.location.coordinates[0],
        });
      } else {
        setLocationCoords(null);
      }
      setExperienceLevel(p.experienceLevel || "ENTRY");
      setRemotePreference(p.remotePreference || "ANY");
      setSelectedSkills(p.skillIds || []);
    }
  }, [user]);

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        displayName,
        educationLevel,
        major,
        majorFieldId: majorFieldId || null,
        university,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        country: country ? country.toUpperCase() : null,
        address,
        location: locationCoords
          ? {
              type: "Point",
              coordinates: [locationCoords.lng, locationCoords.lat],
            }
          : null,
        experienceLevel,
        remotePreference,
        skillIds: selectedSkills,
      };

      const res = await api.put("/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state with refreshed user data
      login(res.data.user, token);
      toast.success("Profile saved successfully!");
    } catch (err) {
      const message =
        err.response?.data?.error?.message || "Failed to update profile.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            <p className="text-sm text-gray-500">
              Customize your profile to unlock accurate, explainable opportunity matching
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          {/* Education Details */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Academic Background
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="UNDERGRADUATE">Undergraduate (Bachelor's)</option>
                  <option value="RECENT_GRADUATE">Recent Graduate</option>
                  <option value="MASTERS">Master's</option>
                  <option value="PHD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study (Discipline)
                </label>
                <select
                  value={majorFieldId}
                  onChange={(e) => setMajorFieldId(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Select Field --</option>
                  {fieldsList.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  University / College Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  placeholder="2027"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Location & Work Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country Code (ISO-2)
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="US, BD, DE, CA"
                  value={country}
                  onChange={(e) => setCountry(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remote Preference
                </label>
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ANY">Flexible / Any</option>
                  <option value="REMOTE">Remote Only</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-Site</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="NONE">No Prior Experience</option>
                  <option value="ENTRY">Entry (under 1 year)</option>
                  <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
                  <option value="ADVANCED">Advanced (3+ years)</option>
                </select>
              </div>
            </div>

            {/* Interactive Leaflet Map Location Picker */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <LocationPickerMap
                coords={locationCoords}
                address={address}
                label="Home Base or Campus Location (For Radius Matching)"
                onChange={({ lat, lng, address: newAddr, countryCode }) => {
                  setLocationCoords({ lat, lng });
                  setAddress(newAddr);
                  if (countryCode && !country) setCountry(countryCode);
                }}
              />
            </div>
          </div>

          {/* Skills Selection */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Technical & Core Skills ({selectedSkills.length} selected)
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Click skills to add or remove them from your profile
            </p>

            <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50">
              {skillsList.map((skill) => {
                const isSelected = selectedSkills.includes(skill._id);
                return (
                  <button
                    key={skill._id}
                    type="button"
                    onClick={() => handleSkillToggle(skill._id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
