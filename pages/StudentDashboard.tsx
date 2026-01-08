
import React, { useState, useRef, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { INITIAL_STUDENT_DATA } from '../constants';
import { analyzeCharacterQuiz, getCounselingResponse } from '../services/geminiService';
import { 
  Home, 
  ClipboardCheck, 
  User, 
  Target, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Loader2,
  Calendar,
  Activity,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  Bot
} from 'lucide-react';
import { Student } from '../types';

type StudentTab = 'home' | 'test' | 'counseling' | 'profile';

interface StudentDashboardProps {
  userId: string;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

// SUB-COMPONENTS DEFINED OUTSIDE TO PREVENT RE-RENDERING FOCUS ISSUES
const HomeView = ({ student, progressPercentage, radarData }: { student: Student, progressPercentage: number, radarData: any[] }) => (
  <div className="space-y-4 md:space-y-6 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Welcome Banner */}
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-lg overflow-hidden relative">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <h2 className="text-xl md:text-2xl font-bold mb-1">Halo, {student.name.split(' ')[0]}! 👋</h2>
      <p className="text-indigo-100 text-xs md:text-sm opacity-90">Terus kembangkan karakter positifmu hari ini.</p>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
          Progres Misi
        </h3>
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-slate-500">Pencapaian Kurikulum</span>
            <span className="font-bold text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 md:h-3">
            <div className="bg-indigo-600 h-2 md:h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {student.missions.map(mission => (
            <div key={mission.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl md:rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${mission.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-semibold text-slate-700">{mission.title}</p>
                  <p className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-wider font-bold">{mission.difficulty}</p>
                </div>
              </div>
              {mission.status !== 'Completed' && <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col">
        <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-rose-500" />
          Analisis Karakter
        </h3>
        <div className="flex-1 min-h-[200px] md:min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} />
              <Radar name="Skor" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Badges Section */}
    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-base md:text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
        Badge Terkumpul
      </h3>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
        {student.badges.map(badge => (
          <div key={badge.id} className={`p-3 md:p-4 rounded-2xl md:rounded-3xl text-center border transition-all ${badge.unlocked ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
            <div className="text-3xl md:text-4xl mb-2 md:mb-3 transform group-hover:scale-110 transition-transform">{badge.icon}</div>
            <p className="text-[10px] md:text-xs font-bold text-slate-800 truncate">{badge.name}</p>
            <p className="hidden xs:block text-[9px] text-slate-500 mt-1 line-clamp-1">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestView = ({ quizInput, setQuizInput, handleQuizSubmit, isAnalyzing, aiResult }: { quizInput: string, setQuizInput: (v: string) => void, handleQuizSubmit: () => void, isAnalyzing: boolean, aiResult: any }) => (
  <div className="space-y-4 md:space-y-6 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-indigo-50 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-indigo-100">
      <div className="flex items-center gap-3 md:gap-4 mb-6">
        <div className="p-3 md:p-4 bg-indigo-600 rounded-xl md:rounded-2xl text-white shadow-lg">
          <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-indigo-900 leading-tight">Sesi Tes Kepribadian</h3>
          <p className="text-indigo-700/70 text-[10px] md:text-sm">Responmu menentukan perkembangan karaktermu.</p>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-indigo-100 mb-6 shadow-sm">
        <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed italic">
          "Skenario: Temanmu tidak sengaja merusak fasilitas sekolah, namun guru menyalahkan orang lain. Apa tindakanmu?"
        </p>
      </div>

      <textarea
        value={quizInput}
        onChange={(e) => setQuizInput(e.target.value)}
        placeholder="Tuliskan respon jujurmu di sini..."
        className="w-full min-h-[150px] md:min-h-[200px] p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-indigo-100 bg-white focus:border-indigo-500 outline-none resize-none transition-all mb-4 text-sm text-slate-800 shadow-inner"
      />

      <button
        onClick={handleQuizSubmit}
        disabled={isAnalyzing || !quizInput.trim()}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3.5 md:py-4 px-8 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] text-sm md:text-base"
      >
        {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        Analisis Karakter
      </button>

      {aiResult && (
        <div className="mt-6 p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-indigo-200 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-indigo-100 rounded-full shrink-0">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-slate-800 text-sm md:text-lg mb-1 md:mb-2">Feedback AI:</h4>
              <p className="text-slate-600 text-[11px] md:text-sm leading-relaxed">{aiResult.feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const CounselingView = ({ messages, currentMsg, setCurrentMsg, onSend, isTyping }: { messages: { role: 'user' | 'model', text: string }[], currentMsg: string, setCurrentMsg: (v: string) => void, onSend: () => void, isTyping: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[75vh] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-indigo-600 p-3 md:p-4 rounded-t-2xl md:rounded-t-3xl text-white flex items-center gap-3 shadow-md z-10">
        <div className="bg-white/20 p-1.5 md:p-2 rounded-full">
          <HeartHandshake className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className="font-bold text-sm md:text-base">Konseling AI</h3>
          <p className="text-[8px] md:text-[10px] text-indigo-100 opacity-80 uppercase tracking-widest">Sahabat Setiamu</p>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-50 border-x border-slate-100 space-y-4 no-scrollbar scroll-smooth"
      >
        <div className="flex gap-2 max-w-[90%] md:max-w-[85%]">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
          </div>
          <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-xs md:text-sm text-slate-700">
            Halo! Saya konselor virtualmu. Ada yang ingin kamu ceritakan atau keluhkan hari ini? Saya di sini untuk mendengarkan.
          </div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" /> : <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />}
            </div>
            <div className={`p-3 rounded-xl shadow-sm text-xs md:text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 max-w-[90%] md:max-w-[85%]">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-indigo-600" />
            </div>
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-[11px] md:text-sm text-slate-400 italic flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" /> Sedang merespon...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-x border-b border-slate-100 rounded-b-2xl md:rounded-b-3xl shadow-lg flex gap-2">
        <input 
          type="text" 
          value={currentMsg}
          onChange={(e) => setCurrentMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Ceritakan sesuatu..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
        />
        <button 
          onClick={onSend}
          disabled={isTyping || !currentMsg.trim()}
          className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-colors shadow-md active:scale-90"
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

const ProfileView = ({ student, barData }: { student: Student, barData: any[] }) => (
  <div className="space-y-4 md:space-y-6 pb-28 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Identity Card */}
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-24 md:h-32 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      <div className="px-6 md:px-8 pb-6 md:pb-8 text-center sm:text-left sm:flex sm:items-end sm:gap-6 -mt-12 md:-mt-16">
        <img 
          src={student.photo} 
          alt={student.name} 
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl border-4 border-white shadow-xl object-cover mx-auto sm:mx-0" 
        />
        <div className="mt-3 sm:mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">{student.name}</h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">{student.class} • NIS {student.nis}</p>
        </div>
      </div>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl">
          <Calendar className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">Hadir</p>
          <p className="text-base md:text-xl font-bold text-slate-800">98%</p>
        </div>
      </div>
      <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4">
        <div className="p-2 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl md:rounded-2xl">
          <Activity className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <p className="text-[8px] md:text-[10px] text-slate-500 uppercase font-bold tracking-wider">Interaksi</p>
          <p className="text-base md:text-xl font-bold text-slate-800">{student.interactionCount}</p>
        </div>
      </div>
    </div>

    {/* Scores Chart */}
    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4">Detail Skor Karakter</h3>
      <div className="h-56 md:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={80} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} 
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={16}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6">
        {Object.entries(student.scores).map(([key, val]) => (
          <div key={key} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-50">
            <span className="text-[10px] md:text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-xs md:text-sm font-bold text-slate-800">{val}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 py-1.5 md:py-2 px-3 md:px-5 rounded-xl md:rounded-2xl transition-all active:scale-90 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <div className={active ? 'scale-110' : ''}>{icon}</div>
    <span className="text-[9px] md:text-[10px] font-bold">{label}</span>
  </button>
);

const StudentDashboard: React.FC<StudentDashboardProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('home');
  const [student] = useState(INITIAL_STUDENT_DATA);
  
  // State for Personality Test
  const [quizInput, setQuizInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{ feedback: string } | null>(null);

  // State for Counseling
  const [counselingMessages, setCounselingMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [currentCounselingMsg, setCurrentCounselingMsg] = useState('');
  const [isCounselingTyping, setIsCounselingTyping] = useState(false);

  const radarData = [
    { subject: 'Disiplin', A: student.scores.disiplin },
    { subject: 'Kejujuran', A: student.scores.kejujuran },
    { subject: 'Kerja Sama', A: student.scores.kerjaSama },
    { subject: 'Empati', A: student.scores.empati },
    { subject: 'Tanggung Jawab', A: student.scores.tanggungJawab },
    { subject: 'Kesopanan', A: student.scores.kesopanan },
  ];

  const barData = Object.entries(student.scores).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    score: value,
  }));

  const handleQuizSubmit = async () => {
    if (!quizInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeCharacterQuiz(quizInput);
      setAiResult(result);
      setQuizInput(''); // Reset after success if desired, or keep to show response
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCounselingSend = async () => {
    if (!currentCounselingMsg.trim()) return;
    
    const userMsg = currentCounselingMsg;
    setCurrentCounselingMsg('');
    const newHistory = [...counselingMessages, { role: 'user' as const, text: userMsg }];
    setCounselingMessages(newHistory);
    
    setIsCounselingTyping(true);
    try {
      const responseText = await getCounselingResponse(newHistory, userMsg);
      setCounselingMessages(prev => [...prev, { role: 'model' as const, text: responseText }]);
    } catch (error) {
      console.error(error);
      setCounselingMessages(prev => [...prev, { role: 'model' as const, text: "Maaf, sistem sedang mengalami kendala teknis. Mohon coba lagi nanti." }]);
    } finally {
      setIsCounselingTyping(false);
    }
  };

  const progressPercentage = Math.round(
    (student.missions.filter(m => m.status === 'Completed').length / student.missions.length) * 100
  );

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-4 flex flex-col min-h-[calc(100vh-80px)]">
      <div className="flex-1 pt-2 md:pt-4">
        {activeTab === 'home' && <HomeView student={student} progressPercentage={progressPercentage} radarData={radarData} />}
        {activeTab === 'test' && (
          <TestView 
            quizInput={quizInput} 
            setQuizInput={setQuizInput} 
            handleQuizSubmit={handleQuizSubmit} 
            isAnalyzing={isAnalyzing} 
            aiResult={aiResult} 
          />
        )}
        {activeTab === 'counseling' && (
          <CounselingView 
            messages={counselingMessages}
            currentMsg={currentCounselingMsg}
            setCurrentMsg={setCurrentCounselingMsg}
            onSend={handleCounselingSend}
            isTyping={isCounselingTyping}
          />
        )}
        {activeTab === 'profile' && <ProfileView student={student} barData={barData} />}
      </div>

      {/* FIXED BOTTOM NAVIGATION FOR MOBILE */}
      <nav className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl md:rounded-3xl p-1.5 md:p-2 z-50 flex justify-around items-center">
        <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home className="w-5 h-5 md:w-6" />} label="Home" />
        <NavBtn active={activeTab === 'test'} onClick={() => setActiveTab('test')} icon={<ClipboardCheck className="w-5 h-5 md:w-6" />} label="Test" />
        <NavBtn active={activeTab === 'counseling'} onClick={() => setActiveTab('counseling')} icon={<HeartHandshake className="w-5 h-5 md:w-6" />} label="Konsul" />
        <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User className="w-5 h-5 md:w-6" />} label="Profil" />
      </nav>
    </div>
  );
};

export default StudentDashboard;
