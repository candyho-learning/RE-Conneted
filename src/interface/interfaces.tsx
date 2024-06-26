export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  accountCreatedTimestamp: any;
  sessions?: Array<UserSessionDataType>;
  quote: string;
  location: string;
  tags?: Array<string>;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  linkedinLink?: string;
  avatar?: number;
}
export interface AuthContextType {
  isLoggedIn: boolean;
  createAccount: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userId: string;
  isLoading: boolean;
  user: UserType | null;
}

export interface TimeBlock {
  id: number;
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
  createdTimestamp?: any;
  startTime: any;
  timeBlocks: Array<TimeBlock>;
  host: string;
  isTimerActive: boolean;
  backgroundImageUrl: string;
  linkValidPeriod: {
    start: any;
    end: any;
  };
  participantsActivity?: Array<UserActivityType>;
  ended?: boolean;
  currentTimeBlockIndex?: number;
  currentSecondsLeft?: number;
  timerStartState?: string;
}

export interface UserSessionDataType {
  sessionId: string;
  role: string;
}

export interface VideoViewProps {
  isHost: boolean | undefined;
  sessionData: SessionDataType;
}

export interface UnsplashResponse {
  id: string;
  urls: {
    thumb: string;
    full: string;
  };
  user: {
    username: string;
  };
}

export interface BackgroundPickerProps {
  setBackgroundImage: Function;
  backgroundImage: string;
}

export interface GoalTrackerProps {
  sessionId: string;
  userId: string;
  userName: string;
  userLocation?: string;
}

export interface GoalsType {
  task: string;
  id: number;
  isDone: boolean;
}

export interface UserActivityType {
  userName: string;
  userId: string;
  goals?: Array<GoalsType>;
  userLocation?: string;
}

export interface EditableTextProps {
  fieldName: string;
  databaseContent: string;
  userIdParam: string;
  isProfileOwner?: boolean;
}

export interface TagSelectorProps {
  setTags: React.Dispatch<React.SetStateAction<string[]>>; // Function to update the tags
  tags: Array<string>;
  userId: string;
}

export interface ProfileSocialLinksProps {
  userData: UserType;
  hasSocialLinks: boolean;
}

export interface SessionListProps {
  userSessions: Array<SessionDataType>;
  isHosting?: boolean;
  isExpiredSessions?: boolean;
}

export interface BookSessionDialogProps {
  sessionId: string;
  buttonText?: string;
}

export interface CallControlBarProps {
  isHost: boolean | undefined;
  sessionData: SessionDataType;
}
