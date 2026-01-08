
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_LOGS, INITIAL_STUDENT_DATA } from '../constants';
import { getAISuggestions } from '../services/geminiService';
import { MessageSquare, AlertTriangle, TrendingUp, Activity, ClipboardList, BookOpen, UserCheck, Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [logs] = useState(MOCK_LOGS);
  const [filter, setFilter] = useState('Semua');
  const [selectedStudent] = useState(INITIAL_STUDENT_DATA);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await getAISuggestions('disiplin', selectedStudent.scores.disiplin);
        setSuggestions(res);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [selectedStudent]);

  const filteredLogs = filter === 'Semua' ? logs : logs.filter(l => l.sentiment === filter);

  return (
    <div className="space-y-4 md:space-y-8 pb-10">
      {/* Header Info - Grid 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard icon={<UserCheck className="w-5 h-5 md:w-6 md:h-6" />} label="Total Siswa" value="324" color="indigo" />
        <StatCard icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />} label="Rata-rata" value="84%" color="emerald" />
        <StatCard icon={<AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />} label="Peringatan" value="12" color="rose" />
        <StatCard icon={<Activity className="w-5 h-5 md:w-6 md:h-6" />} label="Log AI" value="89" color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
        {/* Left: Charts & Logs */}
        <div className="xl:col-span-2 space-y-4 md:space-y-8">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Tren Karakter Mingguan</h3>
                <p className="text-slate-500 text-xs md:text-sm">Monitoring perkembangan agregat kelas</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-2 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto">
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
              </select>
            </div>
            <div className="h-60 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedStudent.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}}
                  />
                  <Line type="monotone" dataKey="avgScore" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-500" />
                Logbook AI
              </h3>
              <div className="flex bg-slate-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {['Semua', 'Positif', 'Negatif'].map(s => (
                  <button 
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${filter === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full text-left min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Siswa</th>
                    <th className="pb-4 font-semibold">Kegiatan</th>
                    <th className="pb-4 font-semibold">Sentimen</th>
                    <th className="pb-4 font-semibold text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-xs md:text-sm font-semibold text-slate-700">{log.studentName}</td>
                      <td className="py-4 text-xs md:text-sm text-slate-600 max-w-[150px] md:max-w-none truncate">{log.action}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${log.sentiment === 'Positif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {log.sentiment}
                        </span>
                      </td>
                      <td className="py-4 text-[10px] text-slate-400 text-right">{log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: AI Insights & Alerts */}
        <div className="space-y-4 md:space-y-8">
          <div className="bg-rose-50 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-rose-100 shadow-sm">
            <h3 className="text-base md:text-lg font-bold text-rose-800 flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" />
              Alert Perilaku
            </h3>
            <div className="space-y-3">
              <AlertItem name="Ahmad Faisal" level="Kritis" desc="Perilaku kurang disiplin berulang 3x minggu ini." color="rose" />
              <AlertItem name="Budi Santoso" level="Waspada" desc="Nilai kejujuran menurun drastis baru-baru ini." color="yellow" />
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Saran AI Intervensi
            </h3>
            
            {isLoadingSuggestions ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
                <p className="text-xs text-slate-400">Merumuskan strategi...</p>
              </div>
            ) : suggestions ? (
              <div className="space-y-5">
                <SuggestionSection title="Aktivitas Fisik" content={suggestions.physical} color="indigo" />
                <SuggestionSection title="Permainan" content={suggestions.game} color="emerald" />
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-800 uppercase mb-2">Dialog Reflektif</h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">"{suggestions.reflective}"</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ name, level, desc, color }: { name: string, level: string, desc: string, color: 'rose' | 'yellow' }) => (
  <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm border border-rose-100/50">
    <div className="flex justify-between items-start mb-1">
      <p className="text-xs md:text-sm font-bold text-slate-800">{name}</p>
      <span className={`text-[8px] md:text-[10px] ${color === 'rose' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'} px-2 py-0.5 rounded-full font-bold uppercase`}>{level}</span>
    </div>
    <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2">{desc}</p>
  </div>
);

const SuggestionSection = ({ title, content, color }: { title: string, content: string, color: 'indigo' | 'emerald' }) => (
  <div>
    <h4 className={`text-[10px] font-bold ${color === 'indigo' ? 'text-indigo-600' : 'text-emerald-600'} uppercase mb-1`}>{title}</h4>
    <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic">"{content}"</p>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className={`bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl border ${colors[color]} shadow-sm flex items-center gap-2 md:gap-4 transition-transform active:scale-95`}>
      <div className={`p-2 md:p-3 rounded-lg md:rounded-2xl ${colors[color].split(' ')[0]}`}>{icon}</div>
      <div>
        <p className="text-[10px] md:text-xs font-semibold text-slate-500 truncate">{label}</p>
        <p className="text-lg md:text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
