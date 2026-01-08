
import { Student, UserRole, Badge, Mission, LogEntry } from './types';

export const INITIAL_STUDENT_DATA: Student = {
  id: 'st-001',
  name: 'Ahmad Faisal',
  nis: '202100456',
  class: 'XII-IPA-1',
  photo: 'https://picsum.photos/seed/ahmad/200/200',
  interactionCount: 124,
  scores: {
    disiplin: 85,
    kejujuran: 90,
    kerjaSama: 70,
    empati: 75,
    tanggungJawab: 80,
    kesopanan: 95
  },
  badges: [
    { id: 'b1', name: 'Jujur Berani', icon: '🛡️', unlocked: true, description: 'Menyelesaikan kuis kejujuran tanpa kesalahan' },
    { id: 'b2', name: 'Rekan Tim Hebat', icon: '🤝', unlocked: true, description: 'Menyelesaikan tugas kelompok tepat waktu' },
    { id: 'b3', name: 'Paling Sopan', icon: '✨', unlocked: false, description: 'Mendapat nilai kesopanan 100' }
  ],
  missions: [
    { id: 'm1', title: 'Tugas Refleksi Diri', difficulty: 'Sedang', status: 'Completed', points: 50 },
    { id: 'm2', title: 'Kuis Etika Digital', difficulty: 'Mudah', status: 'Pending', points: 30 },
    { id: 'm3', title: 'Proyek Kerja Sama Tim', difficulty: 'Sulit', status: 'Pending', points: 100 }
  ],
  weeklyProgress: [
    { day: 'Sen', avgScore: 78 },
    { day: 'Sel', avgScore: 82 },
    { day: 'Rab', avgScore: 85 },
    { day: 'Kam', avgScore: 80 },
    { day: 'Jum', avgScore: 88 },
    { day: 'Sab', avgScore: 92 },
    { day: 'Min', avgScore: 90 },
  ]
};

export const MOCK_LOGS: LogEntry[] = [
  { id: 'l1', studentId: 'st-001', studentName: 'Ahmad Faisal', timestamp: new Date(), action: 'Menyelesaikan kuis kejujuran', sentiment: 'Positif', category: 'kejujuran' },
  { id: 'l2', studentId: 'st-001', studentName: 'Ahmad Faisal', timestamp: new Date(Date.now() - 86400000), action: 'Terlambat masuk sesi zoom', sentiment: 'Negatif', category: 'disiplin' },
  { id: 'l3', studentId: 'st-002', studentName: 'Budi Santoso', timestamp: new Date(Date.now() - 172800000), action: 'Membantu teman dalam forum', sentiment: 'Positif', category: 'kerjaSama' },
];
