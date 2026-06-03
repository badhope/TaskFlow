// TaskFlow type definitions. All persisted shapes live here so the store,
// components and (eventual) sync layer can be type-checked in one place.

export type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type TaskStatus = 'todo' | 'in-progress' | 'waiting' | 'delegated' | 'completed' | 'cancelled' | 'on-hold';
export type ProjectStatus = 'active' | 'completed' | 'paused' | 'archived';
export type ViewType = 'list' | 'kanban' | 'calendar' | 'timeline' | 'table' | 'gantt' | 'mindmap' | 'time-block';
export type Theme = 'light' | 'dark' | 'system' | 'custom';
export type SubscriptionStatus = 'free' | 'basic' | 'pro' | 'team' | 'enterprise';
export type NotificationType = 'notification' | 'email' | 'sms' | 'push';
export type FilterOperator = 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'in' | 'between' | 'starts-with' | 'ends-with' | 'is-empty' | 'is-not-empty';
export type GoalType = 'quantitative' | 'qualitative' | 'habit';
export type GoalTargetType = 'number' | 'percentage' | 'tasks' | 'time';
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';
export type HabitFrequencyType = 'daily' | 'weekly' | 'monthly';
export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';
export type AttachmentType = 'image' | 'document' | 'audio' | 'video' | 'other';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurrenceEndType = 'never' | 'date' | 'count';
export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'multi-select' | 'checkbox' | 'url';
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';
export type SyncConflictStrategy = 'local' | 'remote' | 'newest' | 'merge' | 'ask';
export type SyncProvider = 'expo' | 'icloud' | 'google-drive' | 'dropbox' | 'onedrive' | 'custom';
export type TemplateType = 'task' | 'project' | 'note' | 'habit' | 'workflow';
export type AutomationTriggerType = 'task-created' | 'task-updated' | 'task-completed' | 'task-overdue' | 'due-date-approaching' | 'scheduled' | 'manual' | 'webhook';
export type AutomationActionType = 'update-field' | 'add-tag' | 'remove-tag' | 'move-project' | 'assign' | 'send-notification' | 'create-subtask' | 'duplicate' | 'archive' | 'webhook' | 'custom';

// Core Task Interface
export interface Task {
  id: string;
  title: string;
  description: string;
  content: string;
  dueDate: Date | null;
  dueTime: Date | null;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  reminderDate: Date | null;
  recurrence: RecurrenceRule | null;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  categoryId: string | null;
  projectId: string | null;
  tags: string[];
  completed: boolean;
  completedAt: Date | null;
  estimatedTime: number | null;
  actualTime: number | null;
  createdAt: Date;
  updatedAt: Date;
  isRecurring: boolean;
  parentTaskId: string | null;
  subtasks: { id: string; title: string; completed: boolean; order: number }[];
  attachments: Attachment[];
  comments: Comment[];
  links: Link[];
  customFields: CustomField[];
  location: Location | null;
  dependencies: string[];
  blockedBy: string[];
  isStarred: boolean;
  isHidden: boolean;
  isArchived: boolean;
  notes: Note[];
  checklist: ChecklistItem[];
  assigneeId: string | null;
  createdBy: string | null;
  order: number;
  version: number;
  isDeleted: boolean;
  deletedAt: Date | null;
}

// Task Related Interfaces
export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
  endType: RecurrenceEndType;
  endDate?: Date;
  endCount?: number;
  exceptions: Date[];
  exceptionsCount: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  uri: string;
  thumbnail?: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  uploadedBy: string | null;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
  mentions: string[];
  likes: number;
  isEdited: boolean;
  parentCommentId: string | null;
  replies: Comment[];
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  favicon: string;
  taskId: string;
  createdAt: Date;
}

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  value: any;
  options?: string[];
  required: boolean;
  defaultValue?: any;
  order: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  contentHtml: string;
  isMarkdown: boolean;
  tags: string[];
  categoryId: string | null;
  projectId: string | null;
  isPinned: boolean;
  isArchived: boolean;
  isLocked: boolean;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  attachments: Attachment[];
  links: Link[];
  taskLinks: string[];
  versionHistory: NoteVersion[];
  createdBy: string | null;
}

export interface NoteVersion {
  id: string;
  noteId: string;
  content: string;
  contentHtml: string;
  createdAt: Date;
  authorId: string | null;
  changes: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt: Date | null;
  order: number;
  dueDate: Date | null;
  assigneeId: string | null;
  createdAt: Date;
}

// Project System
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  parentProjectId?: string | null;
  childProjectIds?: string[];
  createdAt: Date;
  updatedAt: Date;
  status: ProjectStatus;
  settings?: ProjectSettings;
  members?: ProjectMember[];
  customFields?: ProjectCustomField[];
  views?: View[];
  taskCount: number;
  completedTaskCount: number;
  progress: number;
  startDate: Date | null;
  dueDate: Date | null;
  ownerId: string | null;
  tags: string[];
  location: Location | null;
}

export interface ProjectSettings {
  defaultView: ViewType;
  taskDefaults: Partial<Task>;
  notifications: NotificationSettings;
  sharing: SharingSettings;
  autoArchive: boolean;
  autoArchiveDays: number;
  defaultPriority: Priority;
  defaultStatus: TaskStatus;
  enableTimeTracking: boolean;
  enableRecurrence: boolean;
  enableChecklist: boolean;
  enableAttachments: boolean;
  enableComments: boolean;
  enableCustomFields: boolean;
}

export interface ProjectMember {
  id: string;
  userId: string;
  role: TeamRole;
  joinedAt: Date;
  permissions: string[];
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canManageSettings: boolean;
}

export interface ProjectCustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  options?: string[];
  required: boolean;
  defaultValue?: any;
  order: number;
  showInList: boolean;
  width: number;
}

// Category System
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  parentCategoryId?: string | null;
  childCategoryIds?: string[];
  isSystem?: boolean;
  isArchived?: boolean;
  taskCount?: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string | null;
}

// Tag System
export interface Tag {
  id: string;
  name: string;
  color: string;
  icon: string;
  isSystem: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
}

export interface TagGroup {
  id: string;
  name: string;
  tags: string[];
  order: number;
  createdAt: Date;
}

// Calendar System
export interface Calendar {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'task' | 'project' | 'holiday' | 'birthday' | 'custom';
  source: 'internal' | 'google' | 'apple' | 'outlook' | 'ical';
  sourceId?: string;
  isVisible: boolean;
  isEditable: boolean;
  isSubscribed: boolean;
  url?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location: Location | null;
  calendarId: string;
  taskId: string | null;
  projectId: string | null;
  color: string;
  isRecurring: boolean;
  recurrence: RecurrenceRule | null;
  reminders: Reminder[];
  attendees: string[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

// Reminder System
export interface Reminder {
  id: string;
  taskId: string;
  eventId?: string;
  type: NotificationType;
  triggerType: 'at-time' | 'before' | 'after';
  beforeMinutes?: number;
  beforeHours?: number;
  beforeDays?: number;
  customTime?: Date;
  isRepeatable: boolean;
  repeatRule?: RepeatRule;
  isEnabled: boolean;
  snoozeCount: number;
  lastSnoozeDate: Date | null;
  snoozeDuration: number;
  notificationSound: string;
  vibrationEnabled: boolean;
  createdAt: Date;
}

export interface RepeatRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[];
  endDate?: Date;
  endCount?: number;
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  badgeEnabled: boolean;
  quietHours: QuietHours;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationChannels: NotificationChannel[];
  taskReminders: boolean;
  projectUpdates: boolean;
  comments: boolean;
  mentions: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  teamUpdates: boolean;
}

export interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  days: number[];
  timezone: string;
}

export interface NotificationChannel {
  id: string;
  type: NotificationType;
  enabled: boolean;
  priority: number;
  filters: string[];
}

// View System
export interface View {
  id: string;
  name: string;
  type: ViewType;
  isSystem: boolean;
  isFavorite: boolean;
  projectId: string | null;
  filters: Filter[];
  sortOptions: SortOption[];
  groupBy: GroupByOption | null;
  layout: LayoutSettings;
  colorSchema: string;
  icon: string;
  iconName?: string;
  columns?: string[];
  kanbanColumns?: KanbanColumn[];
  timelineConfig?: TimelineConfig;
  ganttConfig?: GanttConfig;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  isNegated: boolean;
  conjunction: 'and' | 'or';
  order: number;
}

export interface SortOption {
  id: string;
  field: string;
  direction: 'asc' | 'desc';
  priority: number;
}

export type GroupByOption = 'category' | 'project' | 'status' | 'priority' | 'due-date' | 'tag' | 'assignee' | 'date' | 'none';

export interface LayoutSettings {
  density: 'compact' | 'comfortable' | 'spacious';
  cardStyle: 'minimal' | 'detailed' | 'expanded';
  showCompleted: boolean;
  showProgress: boolean;
  showTags: boolean;
  showDueDate: boolean;
  showPriority: boolean;
  showAssignee: boolean;
  showTime: boolean;
  showLocation: boolean;
  compactMode: boolean;
  showArchived: boolean;
  paginationSize: number;
  infiniteScroll: boolean;
}

export interface KanbanColumn {
  id: string;
  title: string;
  statuses: TaskStatus[];
  wipLimit: number | null;
  color: string;
  order: number;
  collapsed: boolean;
}

export interface TimelineConfig {
  showToday: boolean;
  showWeekends: boolean;
  showMilestones: boolean;
  zoomLevel: 'day' | 'week' | 'month';
  dateFormat: string;
}

export interface GanttConfig {
  showToday: boolean;
  showWeekends: boolean;
  showProgress: boolean;
  showDependencies: boolean;
  showCriticalPath: boolean;
  zoomLevel: 'day' | 'week' | 'month' | 'quarter';
  dateFormat: string;
  workDaysOnly: boolean;
}

// User System
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  phone: string | null;
  bio: string;
  timezone: string;
  locale: string;
  language: string;
  theme: Theme;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
  lastLoginAt: Date;
  isPremium: boolean;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: Date | null;
  profileComplete: boolean;
  onboardingComplete: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'app' | 'sms' | 'email' | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface UserPreferences {
  defaultView: ViewType;
  defaultProject: string | null;
  defaultCategory: string | null;
  startDayOfWeek: number;
  workHours: WorkHours;
  notifications: NotificationPreferences;
  integrations: IntegrationSettings;
  shortcuts: KeyboardShortcuts;
  displaySettings: DisplaySettings;
  privacySettings: PrivacySettings;
  languageSettings: LanguageSettings;
  accessibilitySettings: AccessibilitySettings;
  pomodoroSettings: PomodoroSettings;
}

export interface WorkHours {
  enabled: boolean;
  startHour: number;
  endHour: number;
  days: number[];
  timezone: string;
}

export interface IntegrationSettings {
  googleCalendar: boolean;
  appleCalendar: boolean;
  outlookCalendar: boolean;
  slack: boolean;
  teams: boolean;
  github: boolean;
  jira: boolean;
  notion: boolean;
  dropbox: boolean;
  onedrive: boolean;
  googleDrive: boolean;
}

export interface KeyboardShortcuts {
  [key: string]: string;
  quickAdd: string;
  search: string;
  toggleSidebar: string;
  markComplete: string;
  newTask: string;
  newProject: string;
  settings: string;
  help: string;
}

export interface DisplaySettings {
  compactMode: boolean;
  showAnimations: boolean;
  showTooltips: boolean;
  showAvatars: boolean;
  showTaskIcons: boolean;
  showCompletedTasks: boolean;
  showSubtasks: boolean;
  showAttachments: boolean;
  cardDensity: 'compact' | 'comfortable' | 'spacious';
  colorScheme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: number;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'team';
  showEmail: boolean;
  showPhone: boolean;
  showActivity: boolean;
  allowMentions: boolean;
  allowInvites: boolean;
  dataCollection: boolean;
  analytics: boolean;
  biometricLock: boolean;
  autoLockTimeout: number;
}

export interface LanguageSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: number;
  numberFormat: string;
  currency: string;
}

// Accessibility
export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  highContrastMode: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  colorBlindMode: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
  hapticFeedback: boolean;
}

export interface PomodoroSettings {
  enabled: boolean;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  dailyGoal: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  startedAt: Date;
  duration: number;
  completed: boolean;
}

// Goals & Habits
export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  targetType: GoalTargetType;
  targetValue: number;
  currentValue: number;
  period?: GoalPeriod;
  startDate: Date;
  endDate: Date;
  recurrence: GoalRecurrence;
  linkedTasks: string[];
  progress: number;
  isCompleted: boolean;
  completedAt: Date | null;
  milestones: Milestone[];
  rewards: Reward[];
  categoryId: string | null;
  projectId: string | null;
  color: string;
  icon: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export interface GoalRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  days?: number[];
  autoReset: boolean;
  resetTime: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  targetValue: number;
  completed: boolean;
  completedAt: Date | null;
  order: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'achievement' | 'unlock' | 'points';
  icon: string;
  unlocked: boolean;
  unlockedAt: Date | null;
  criteria: string;
  points: number;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetDuration: number | null;
  targetDays: number[];
  reminder: Reminder | null;
  reminderTime?: string;
  streak: number;
  bestStreak: number;
  completedDates?: string[];
  completionHistory: { [date: string]: boolean };
  totalCompletions: number;
  averageDuration: number | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export interface HabitFrequency {
  type: HabitFrequencyType;
  timesPerPeriod: number;
  specificDays?: number[];
}

// Analytics
export interface DashboardStats {
  overview: OverviewStats;
  productivity: ProductivityStats;
  trends: TrendData[];
  categories: CategoryStats[];
  timeUsage: TimeUsageStats;
  goals: GoalProgress[];
  habits: HabitStats[];
}

export interface OverviewStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  todayTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  streak: number;
  bestStreak: number;
  totalProjects: number;
  activeProjects: number;
  totalHabits: number;
  habitsCompletedToday: number;
}

export interface ProductivityStats {
  daily: DateStats[];
  weekly: DateStats[];
  monthly: DateStats[];
  yearly: DateStats[];
  bestDay: { day: number; score: number };
  bestWeek: { week: number; score: number };
  productivityScore: number;
  focusScore: number;
  consistencyScore: number;
}

export interface DateStats {
  date: Date;
  completed: number;
  created: number;
  updated: number;
  deleted: number;
  estimatedTime: number;
  actualTime: number;
  focusScore: number;
  peakHour: number;
}

export interface TrendData {
  period: string;
  completionRate: number;
  tasksCreated: number;
  tasksCompleted: number;
  tasksUpdated: number;
  timeSpent: number;
  productivity: number;
}

export interface CategoryStats {
  categoryId: string;
  categoryName: string;
  taskCount: number;
  completedCount: number;
  completionRate: number;
  estimatedTime: number;
  actualTime: number;
  color: string;
  icon: string;
}

export interface TimeUsageStats {
  byDay: { [key: number]: number };
  byHour: { [key: number]: number };
  byCategory: { [key: string]: number };
  byProject: { [key: string]: number };
  byPriority: { [key: string]: number };
}

export interface GoalProgress {
  id: string;
  name: string;
  type: GoalType;
  target: number;
  current: number;
  period: GoalPeriod;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  progress: number;
  daysRemaining: number;
}

export interface HabitStats {
  id: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  totalCompletions: number;
  averageDuration: number | null;
}

// Automation
export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  isEnabled: boolean;
  isSystem: boolean;
  priority: number;
  executionCount: number;
  lastExecutedAt: Date | null;
  lastError: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export interface AutomationTrigger {
  type: AutomationTriggerType;
  config: any;
  schedule?: CronSchedule;
}

export interface CronSchedule {
  expression: string;
  timezone: string;
  enabled: boolean;
}

export interface AutomationCondition {
  id: string;
  type: 'field' | 'date' | 'status' | 'priority' | 'tag' | 'project' | 'custom' | 'time' | 'user';
  field: string;
  operator: FilterOperator;
  value: any;
  conjunction: 'and' | 'or';
}

export interface AutomationAction {
  id: string;
  type: AutomationActionType;
  config: any;
  delay: number;
  order: number;
}

// Templates
export interface Template {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  thumbnail: string;
  isPublic: boolean;
  isSystem: boolean;
  usageCount: number;
  downloads: number;
  rating: number;
  tags: string[];
  content: any;
  variables: TemplateVariable[];
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
}

export interface TemplateVariable {
  name: string;
  label: string;
  type: CustomFieldType;
  defaultValue: any;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

// Collaboration
export interface Team {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  coverImage: string | null;
  ownerId: string;
  members: TeamMember[];
  projects: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
  isPublic: boolean;
  allowMemberInvite: boolean;
  maxMembers: number;
}

export interface TeamMember {
  id: string;
  userId: string;
  user: User | null;
  role: TeamRole;
  joinedAt: Date;
  lastActiveAt: Date;
  permissions: string[];
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canManageSettings: boolean;
  notifications: NotificationPreferences;
  displayName: string;
  avatar: string | null;
}

export interface TeamSettings {
  inviteLinks: boolean;
  inviteLinkExpiry: Date | null;
  publicProjects: boolean;
  taskAssignment: boolean;
  comments: boolean;
  fileSharing: boolean;
  activityLog: boolean;
  requireApproval: boolean;
  defaultRole: TeamRole;
}

export interface Activity {
  id: string;
  type: 'task' | 'project' | 'comment' | 'member' | 'settings';
  action: string;
  description: string;
  taskId: string | null;
  projectId: string | null;
  userId: string | null;
  user: User | null;
  metadata: any;
  createdAt: Date;
}

// Sync & Backup
export interface SyncConfig {
  enabled: boolean;
  provider: SyncProvider;
  syncInterval: number;
  lastSyncAt: Date | null;
  syncStatus: SyncStatus;
  conflictStrategy: SyncConflictStrategy;
  autoSync: boolean;
  syncOnStart: boolean;
  syncOnEdit: boolean;
  wifiOnly: boolean;
  credentials: any;
}

export interface SyncLog {
  id: string;
  type: 'upload' | 'download' | 'merge' | 'conflict' | 'error';
  status: 'success' | 'error' | 'partial';
  itemCount: number;
  errorMessage: string | null;
  startedAt: Date;
  completedAt: Date;
  duration: number;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  id: string;
  itemId: string;
  itemType: string;
  localVersion: any;
  remoteVersion: any;
  resolution: 'local' | 'remote' | 'newest' | 'merge' | 'manual' | null;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental';
  size: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt: Date | null;
  downloadUrl: string | null;
  expiresAt: Date | null;
  isAutomatic: boolean;
  storage: 'local' | 'cloud' | 'both';
}

// Search
export interface SearchQuery {
  text: string;
  filters: SearchFilter[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  dateRange: { from: Date; to: Date } | null;
  includeArchived: boolean;
  includeCompleted: boolean;
  includeDeleted: boolean;
  limit: number;
  offset: number;
}

export interface SearchFilter {
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface SearchResult {
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  categories: Category[];
  tags: Tag[];
  goals: Goal[];
  habits: Habit[];
  totalCount: number;
  suggestions: string[];
  searchTime: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: SearchQuery;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// AI
export interface AISuggestion {
  id: string;
  type: 'task-suggestion' | 'priority-suggestion' | 'schedule-suggestion' | 'summary' | 'brainstorm' | 'rewrite' | 'analyze';
  title: string;
  content: string;
  confidence: number;
  reason: string;
  isAccepted: boolean;
  isDismissed: boolean;
  createdAt: Date;
  context: any;
}

export interface AIInsight {
  id: string;
  type: 'productivity' | 'patterns' | 'recommendations' | 'predictions';
  title: string;
  description: string;
  data: any;
  confidence: number;
  actionItems: string[];
  createdAt: Date;
}

export interface AICapabilities {
  taskSuggestions: boolean;
  priorityOptimization: boolean;
  scheduleOptimization: boolean;
  meetingAssist: boolean;
  emailAssist: boolean;
  smartSearch: boolean;
  summaryGeneration: boolean;
  taskBreaking: boolean;
  habitCoaching: boolean;
  naturalLanguageProcessing: boolean;
}

// Theme
export interface ThemePreset {
  id: string;
  name: string;
  type: Theme;
  colors: ThemeColors;
  typography: TypographySettings;
  spacing: SpacingSettings;
  borderRadius: BorderRadiusSettings;
  shadows: ShadowSettings;
  isCustom: boolean;
  isSystem: boolean;
  createdAt: Date;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  onPrimary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  border: string;
  borderStrong: string;
  error: string;
  warning: string;
  success: string;
  info: string;
  divider: string;
  overlay: string;
  glassBackground: string;
  glassBorder: string;
  shimmer: string;
  priorities: {
    low: string;
    medium: string;
    high: string;
    urgent: string;
    critical: string;
  };
  status: {
    todo: string;
    'in-progress': string;
    waiting: string;
    delegated: string;
    completed: string;
    cancelled: string;
    'on-hold': string;
  };
  categories: { [key: string]: string };
}

export interface TypographySettings {
  fontFamily: string;
  fontSizeXs: number;
  fontSizeSm: number;
  fontSizeBase: number;
  fontSizeLg: number;
  fontSizeXl: number;
  fontSize2xl: number;
  fontSize3xl: number;
  fontSize4xl: number;
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
  letterSpacingTight: number;
  letterSpacingNormal: number;
  letterSpacingWide: number;
}

export interface SpacingSettings {
  space1: number;
  space2: number;
  space3: number;
  space4: number;
  space5: number;
  space6: number;
  space7: number;
  space8: number;
  space10: number;
  space12: number;
  space16: number;
}

export interface BorderRadiusSettings {
  none: number;
  xs: number;
  sm: number;
  base: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

export interface ShadowSettings {
  none: string;
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  ring: string;
}

// Navigation
export type MainTabParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  CreateTab: undefined;
  AnalyticsTab: undefined;
  SearchTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  TaskDetail: { taskId?: string; mode?: 'view' | 'edit' | 'create' };
  Categories: undefined;
  CategoryDetail: { categoryId?: string };
  Projects: undefined;
  ProjectDetail: { projectId?: string };
  Calendar: undefined;
  Analytics: undefined;
  Search: undefined;
  Goals: undefined;
  GoalDetail: { goalId?: string };
  Habits: undefined;
  HabitDetail: { habitId?: string };
  Notes: undefined;
  NoteDetail: { noteId?: string };
  Settings: undefined;
  Tags: undefined;
  Views: undefined;
  Templates: undefined;
  Automation: undefined;
  AutomationDetail: { ruleId?: string };
  Collaborators: undefined;
  Notifications: undefined;
};

export type CalendarStackParamList = {
  Calendar: undefined;
  CalendarDay: { date?: string };
  TaskDetail: { taskId?: string; mode?: 'view' | 'edit' | 'create' };
};

export type AnalyticsStackParamList = {
  Analytics: undefined;
};

export type SearchStackParamList = {
  Search: undefined;
  TaskDetail: { taskId?: string; mode?: 'view' | 'edit' | 'create' };
  SearchResults: { query?: string };
};

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  TaskDetail: { taskId?: string; mode?: 'view' | 'edit' | 'create' };
  Categories: undefined;
  CategoryDetail: { categoryId?: string };
  Projects: undefined;
  ProjectDetail: { projectId?: string };
  Calendar: undefined;
  CalendarDay: { date?: string };
  Search: undefined;
  Analytics: undefined;
  Goals: undefined;
  GoalDetail: { goalId?: string };
  Habits: undefined;
  HabitDetail: { habitId?: string };
  Notes: undefined;
  NoteDetail: { noteId?: string };
  Settings: undefined;
  UserProfile: undefined;
  TeamSettings: undefined;
  Automation: undefined;
  AutomationDetail: { ruleId?: string };
  Templates: undefined;
  TemplatesDetail: { templateId?: string };
  SearchResults: { query?: string };
  Collaborators: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
  Tags: undefined;
  Views: undefined;
};

// Utility Types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ValidationError[];
  pagination?: PaginationInfo;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SelectOption {
  label: string;
  value: any;
  icon?: string;
  color?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
  label?: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  taskId: string | null;
  color: string;
  isAvailable: boolean;
}

export interface Notification {
  id: string;
  type: 'task' | 'project' | 'comment' | 'mention' | 'reminder' | 'system' | 'collaboration';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  isArchived: boolean;
  actionUrl: string | null;
  createdAt: Date;
}

export interface AppState {
  auth: AuthState;
  tasks: TasksState;
  projects: ProjectsState;
  categories: CategoriesState;
  tags: TagsState;
  views: ViewsState;
  calendar: CalendarState;
  reminders: RemindersState;
  analytics: AnalyticsState;
  goals: GoalsState;
  habits: HabitsState;
  notes: NotesState;
  ai: AIState;
  ui: UIState;
  settings: SettingsState;
  sync: SyncState;
  offline: OfflineState;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: Filter[];
  sortOptions: SortOption[];
}

export interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

export interface TagsState {
  tags: Tag[];
  selectedTag: Tag | null;
  isLoading: boolean;
  error: string | null;
}

export interface ViewsState {
  views: View[];
  activeView: View | null;
  isLoading: boolean;
  error: string | null;
}

export interface CalendarState {
  calendars: Calendar[];
  events: CalendarEvent[];
  selectedDate: Date;
  viewType: 'day' | 'week' | 'month' | 'year';
  isLoading: boolean;
  error: string | null;
}

export interface RemindersState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
}

export interface AnalyticsState {
  dashboard: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface GoalsState {
  goals: Goal[];
  selectedGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
}

export interface HabitsState {
  habits: Habit[];
  selectedHabit: Habit | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  isLoading: boolean;
  error: string | null;
}

export interface AIState {
  suggestions: AISuggestion[];
  insights: AIInsight[];
  capabilities: AICapabilities;
  isProcessing: boolean;
  error: string | null;
}

export interface UIState {
  theme: ThemePreset;
  sidebarOpen: boolean;
  activeModal: string | null;
  activeTab: string;
  searchQuery: string;
  isSearchOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
}

export interface SettingsState {
  userPreferences: UserPreferences;
  teamSettings: TeamSettings | null;
  syncConfig: SyncConfig;
  backupConfig: Backup;
  isLoading: boolean;
  error: string | null;
}

export interface SyncState {
  status: SyncStatus;
  lastSyncAt: Date | null;
  syncLogs: SyncLog[];
  conflicts: SyncConflict[];
  isEnabled: boolean;
  error: string | null;
}

export interface OfflineState {
  isOnline: boolean;
  pendingChanges: any[];
  lastSyncAt: Date | null;
  storageUsed: number;
  storageQuota: number;
}

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  isNegated: boolean;
  conjunction: 'and' | 'or';
}

export interface NotificationSettings {
  taskReminders: boolean;
  projectUpdates: boolean;
  comments: boolean;
  mentions: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface SharingSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowAttachments: boolean;
  allowAssign: boolean;
  linkExpiry: number | null;
  maxMembers: number;
}
