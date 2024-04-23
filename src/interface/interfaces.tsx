export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  accountCreatedTimestamp: any;
  futureSessions?: Array<FutureSessionDataType>;
  quote: string;
  location: string;
  tags?: Array<string>;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  websiteLink?: string;
  linkedinLink?: string;
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
  startTime: any;
  timeBlocks: Array<TimeBlock>;
  host: string;
  isTimerActive: boolean;
  backgroundImageUrl: string;
  participantsActivity?: Array<UserActivityType>;
}

export interface FutureSessionDataType {
  sessionId: string;
  role: string;
  startTime: any;
  sessionName: string;
}

export interface VideoViewProps {
  isHost: boolean | undefined;
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
