"use client"
import { useState } from "react"
import { Calendar, FileText, Video, MapPin, Activity, Pill, User, Bell, ChevronRight, Download } from "lucide-react"

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <>
      <style>{`
        body { margin: 0; background: #f8fafc; color: #1e293b; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; }
        
        .fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; transform: translateY(10px); }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        
        @keyframes fadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border-radius: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      {/* HEADER PATIENT */}
      <div className="bg-blue-600 pb-24 pt-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 150%, #ffffff 0%, transparent 50%)' }}></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Ndamatou <span className="font-light">Connect</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-blue-100 hover:text-white transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-blue-600"></span>
              </button>
              <div className="flex items-center gap-2 bg-white/10 py-1.5 px-3 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/20 transition">
                <div className="w-7 h-7 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  AD
                </div>
                <span className="text-white text-sm font-medium hidden sm:block">Awa Diop</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Bonjour, Awa 👋</h1>
            <p className="text-blue-100 max-w-xl">Bienvenue sur votre portail santé Ndamatou. Votre prochain rendez-vous est dans <strong className="text-white">3 jours</strong>.</p>
          </div>
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-12">
        
        {/* CARTE PROCHAIN RDV */}
        <div className="glass-card p-6 mb-8 fade-in delay-1 bg-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold uppercase">Juin</span>
                <span className="text-xl font-black">18</span>
              </div>
              <div>
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-md mb-1 uppercase tracking-wide">À venir</span>
                <h2 className="text-lg font-bold text-gray-900">Consultation Cardiologie</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <User className="w-4 h-4" /> Dr. Ousmane Ndiaye (Chef de Clinique)
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> Bâtiment B - Étage 2 - Salle 204
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" /> GPS Interne
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition">
                Modifier / Annuler
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* QUICK ACTIONS */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="glass-card p-5 text-left flex flex-col justify-between h-36 group fade-in delay-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Nouveau Rendez-vous</h3>
                <p className="text-xs text-gray-500">Prendre RDV avec un spécialiste</p>
              </div>
            </button>

            <button className="glass-card p-5 text-left flex flex-col justify-between h-36 group fade-in delay-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Téléconsultation</h3>
                <p className="text-xs text-gray-500">Consulter depuis votre domicile</p>
              </div>
            </button>

            <button className="glass-card p-5 text-left flex flex-col justify-between h-36 group fade-in delay-2">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Dossier Médical</h3>
                <p className="text-xs text-gray-500">Historique et documents</p>
              </div>
            </button>

            <button className="glass-card p-5 text-left flex flex-col justify-between h-36 group fade-in delay-2">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Ordonnances (SmartPharma)</h3>
                <p className="text-xs text-gray-500">Traçabilité de vos traitements</p>
              </div>
            </button>
          </div>

          {/* DERNIERS RÉSULTATS */}
          <div className="glass-card p-0 flex flex-col fade-in delay-3 bg-white h-full">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" /> Récents
              </h3>
              <button className="text-blue-600 text-xs font-semibold hover:underline">Tout voir</button>
            </div>
            <div className="p-2 flex-1">
              {[
                { type: 'Prise de sang', date: 'Il y a 2 jours', status: 'Disponible', urgent: false },
                { type: 'Radiographie Thorax', date: '12 Mai 2026', status: 'Visualisé', urgent: false },
                { type: 'Ordonnance', date: '05 Avril 2026', status: 'Archivé', urgent: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.type}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.status === 'Disponible' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        {/* INFO PRATIQUE */}
        <div className="glass-card p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white fade-in delay-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Comment se repérer au Ndamatou ?</h3>
                <p className="text-slate-300 text-sm max-w-xl">Le complexe hospitalier de Touba est immense. Utilisez notre navigateur GPS 3D pour trouver votre chambre ou votre pavillon de consultation instantanément.</p>
              </div>
            </div>
            <button className="w-full md:w-auto bg-white text-slate-900 hover:bg-blue-50 px-6 py-3 rounded-lg text-sm font-bold transition whitespace-nowrap shadow-lg shadow-black/20">
              Lancer le Navigateur
            </button>
          </div>
        </div>

      </main>
    </>
  )
}
