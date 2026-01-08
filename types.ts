
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface CharacterScores {
  disiplin: number;
  kejujuran: number;
  kerjaSama: number;
  empati: number;
  tanggungJawab: number;
  kesopanan: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export interface Mission {
  id: string;
  title: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  status: 'Pending' | 'Completed';
  points: number;
}

export interface LogEntry {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  action: string;
  sentiment: 'Positif' | 'Negatif';
  teacherNote?: string;
  category: keyof CharacterScores;
}

export interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
  photo: string;
  interactionCount: number;
  scores: CharacterScores;
  badges: Badge[];
  missions: Mission[];
  weeklyProgress: { day: string; avgScore: number }[];
}

export interface AuthState {
  user: { id: string; name: string; role: UserRole } | null;
}
