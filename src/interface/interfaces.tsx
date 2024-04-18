export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  accountCreatedTimestamp: null | Date;
  futureSessions?: Array<FutureSessionDataType>;
}
export interface AuthContextType {
  isLoggedIn: boolean;
  createAccount: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userId: string;
  isLoading: boolean;
  user: UserType | null;
}

export interface TimeBlock {
  id?: number;
  type: string;
  duration: number;
}

export interface TimeBlockProps {
  id: number;
  setTimeBlocks: Function;
  timeBlocks: Array<TimeBlock>;
}

export interface SessionDataType {
  sessionId: string;
  sessionName: string;
  startTime: Date;
  timeBlocks: Array<TimeBlock>;
  host: string;
  isTimerActive: boolean;
}

export interface FutureSessionDataType {
  sessionId: string;
  role: string;
  userId: string;
  startTime: Date;
}

export interface VideoViewProps {
  isHost: boolean | undefined;
}
