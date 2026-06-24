import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivityCheck_Key {
  id: number;
  __typename?: 'ActivityCheck_Key';
}

export interface ActivityCompletion_Key {
  id: UUIDString;
  __typename?: 'ActivityCompletion_Key';
}

export interface Announcement_Key {
  id: UUIDString;
  __typename?: 'Announcement_Key';
}

export interface AppConfig_Key {
  id: number;
  __typename?: 'AppConfig_Key';
}

export interface Assignment_Key {
  id: UUIDString;
  __typename?: 'Assignment_Key';
}

export interface Attendance_Key {
  studentId: UUIDString;
  date: DateString;
  __typename?: 'Attendance_Key';
}

export interface DDay_Key {
  id: UUIDString;
  __typename?: 'DDay_Key';
}

export interface DeleteActivityCompletionData {
  activityCompletion_delete?: ActivityCompletion_Key | null;
}

export interface DeleteActivityCompletionVariables {
  id: UUIDString;
}

export interface DeleteAnnouncementData {
  announcement_delete?: Announcement_Key | null;
}

export interface DeleteAnnouncementVariables {
  id: UUIDString;
}

export interface DeleteAssignmentData {
  assignment_delete?: Assignment_Key | null;
}

export interface DeleteAssignmentVariables {
  id: UUIDString;
}

export interface DeleteDDayData {
  dDay_delete?: DDay_Key | null;
}

export interface DeleteDDayVariables {
  id: UUIDString;
}

export interface DeletePollData {
  poll_delete?: Poll_Key | null;
}

export interface DeletePollVariables {
  id: UUIDString;
}

export interface DeleteQuickLinkData {
  quickLink_delete?: QuickLink_Key | null;
}

export interface DeleteQuickLinkVariables {
  id: UUIDString;
}

export interface DeleteStudentRecordData {
  studentRecord_delete?: StudentRecord_Key | null;
}

export interface DeleteStudentRecordVariables {
  id: UUIDString;
}

export interface GetAllAppDataData {
  students: ({
    id: UUIDString;
    number?: number | null;
    name?: string | null;
    points: number;
  } & Student_Key)[];
  announcements: ({
    id: UUIDString;
    date: DateString;
    title: string;
    content?: string | null;
    type?: string | null;
  } & Announcement_Key)[];
  assignments: ({
    id: UUIDString;
    dueDate: DateString;
    title: string;
    submissions?: unknown | null;
  } & Assignment_Key)[];
  dDays: ({
    id: UUIDString;
    name: string;
    date: DateString;
  } & DDay_Key)[];
  weeklyPlans: ({
    id: UUIDString;
    weekKey: string;
    day: string;
    period: number;
    subject?: string | null;
    content?: string | null;
  } & WeeklyPlan_Key)[];
  appConfigs: ({
    id: number;
    calendarId1?: string | null;
    calendarId2?: string | null;
    calendarId3?: string | null;
    thermometerGoal?: number | null;
    thermometerReward?: string | null;
  } & AppConfig_Key)[];
  quickLinks: ({
    id: UUIDString;
    title: string;
    url: string;
    icon?: string | null;
    desc?: string | null;
  } & QuickLink_Key)[];
  polls: ({
    id: UUIDString;
    question: string;
    options?: string[] | null;
    votes?: number[] | null;
  } & Poll_Key)[];
  newsletters: ({
    id: UUIDString;
    date: DateString;
    title: string;
    content?: string | null;
    collected: boolean;
  } & Newsletter_Key)[];
  activityChecks: ({
    id: number;
    content?: string | null;
    type?: string | null;
  } & ActivityCheck_Key)[];
  activityCompletions: ({
    id: UUIDString;
    student: {
      id: UUIDString;
    } & Student_Key;
    timestamp: TimestampString;
  } & ActivityCompletion_Key)[];
  studentRecords: ({
    id: UUIDString;
    student: {
      id: UUIDString;
    } & Student_Key;
    type: string;
    content?: string | null;
    category?: string | null;
    date: DateString;
    createdAt: TimestampString;
  } & StudentRecord_Key)[];
}

export interface GetAttendanceByDateData {
  attendances: ({
    student: {
      id: UUIDString;
    } & Student_Key;
    date: DateString;
    status: string;
    note?: string | null;
  })[];
}

export interface GetAttendanceByDateVariables {
  date: DateString;
}

export interface GetAttendanceByMonthData {
  attendances: ({
    student: {
      id: UUIDString;
    } & Student_Key;
    date: DateString;
    status: string;
    note?: string | null;
  })[];
}

export interface GetAttendanceByMonthVariables {
  startDate: DateString;
  endDate: DateString;
}

export interface InsertDDayData {
  dDay_insert: DDay_Key;
}

export interface InsertDDayVariables {
  name: string;
  date: DateString;
}

export interface InsertStudentRecordData {
  studentRecord_insert: StudentRecord_Key;
}

export interface InsertStudentRecordVariables {
  studentId: UUIDString;
  type: string;
  content?: string | null;
  category?: string | null;
  date: DateString;
}

export interface Newsletter_Key {
  id: UUIDString;
  __typename?: 'Newsletter_Key';
}

export interface Poll_Key {
  id: UUIDString;
  __typename?: 'Poll_Key';
}

export interface QuickLink_Key {
  id: UUIDString;
  __typename?: 'QuickLink_Key';
}

export interface StudentRecord_Key {
  id: UUIDString;
  __typename?: 'StudentRecord_Key';
}

export interface Student_Key {
  id: UUIDString;
  __typename?: 'Student_Key';
}

export interface UpdateNewsletterData {
  newsletter_update?: Newsletter_Key | null;
}

export interface UpdateNewsletterVariables {
  id: UUIDString;
  collected: boolean;
}

export interface UpdatePollData {
  poll_update?: Poll_Key | null;
}

export interface UpdatePollVariables {
  id: UUIDString;
  votes: number[];
}

export interface UpdateStudentPointsData {
  student_update?: Student_Key | null;
}

export interface UpdateStudentPointsVariables {
  id: UUIDString;
  points: number;
}

export interface UpsertActivityCheckData {
  activityCheck_upsert: ActivityCheck_Key;
}

export interface UpsertActivityCheckVariables {
  id: number;
  content?: string | null;
  type?: string | null;
}

export interface UpsertActivityCompletionData {
  activityCompletion_upsert: ActivityCompletion_Key;
}

export interface UpsertActivityCompletionVariables {
  id?: UUIDString | null;
  studentId: UUIDString;
  timestamp: TimestampString;
}

export interface UpsertAnnouncementData {
  announcement_upsert: Announcement_Key;
}

export interface UpsertAnnouncementVariables {
  id?: UUIDString | null;
  date: DateString;
  title: string;
  content?: string | null;
  type?: string | null;
}

export interface UpsertAppConfigData {
  appConfig_upsert: AppConfig_Key;
}

export interface UpsertAppConfigVariables {
  id: number;
  calendarId1?: string | null;
  calendarId2?: string | null;
  calendarId3?: string | null;
  thermometerGoal?: number | null;
  thermometerReward?: string | null;
}

export interface UpsertAssignmentData {
  assignment_upsert: Assignment_Key;
}

export interface UpsertAssignmentVariables {
  id?: UUIDString | null;
  dueDate: DateString;
  title: string;
  submissions?: unknown | null;
}

export interface UpsertAttendanceData {
  attendance_upsert: Attendance_Key;
}

export interface UpsertAttendanceVariables {
  studentId: UUIDString;
  date: DateString;
  status: string;
  note?: string | null;
}

export interface UpsertPollData {
  poll_upsert: Poll_Key;
}

export interface UpsertPollVariables {
  id?: UUIDString | null;
  question: string;
  options: string[];
  votes: number[];
}

export interface UpsertQuickLinkData {
  quickLink_upsert: QuickLink_Key;
}

export interface UpsertQuickLinkVariables {
  id?: UUIDString | null;
  title: string;
  url: string;
  icon?: string | null;
  desc?: string | null;
}

export interface UpsertStudentData {
  student_upsert: Student_Key;
}

export interface UpsertStudentVariables {
  id?: UUIDString | null;
  name?: string | null;
  number?: number | null;
  gender?: string | null;
  birthday?: string | null;
  parentPhone?: string | null;
  allergies?: string | null;
  healthNotes?: string | null;
  points?: number | null;
  group?: number | null;
  seatIndex?: number | null;
  aiSummary?: string | null;
}

export interface UpsertWeeklyPlanData {
  weeklyPlan_upsert: WeeklyPlan_Key;
}

export interface UpsertWeeklyPlanVariables {
  id?: UUIDString | null;
  weekKey: string;
  day: string;
  period: number;
  subject?: string | null;
  content?: string | null;
}

export interface WeeklyPlan_Key {
  id: UUIDString;
  __typename?: 'WeeklyPlan_Key';
}

interface UpsertWeeklyPlanRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWeeklyPlanVariables): MutationRef<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertWeeklyPlanVariables): MutationRef<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;
  operationName: string;
}
export const upsertWeeklyPlanRef: UpsertWeeklyPlanRef;

export function upsertWeeklyPlan(vars: UpsertWeeklyPlanVariables): MutationPromise<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;
export function upsertWeeklyPlan(dc: DataConnect, vars: UpsertWeeklyPlanVariables): MutationPromise<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;

interface UpsertAppConfigRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAppConfigVariables): MutationRef<UpsertAppConfigData, UpsertAppConfigVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAppConfigVariables): MutationRef<UpsertAppConfigData, UpsertAppConfigVariables>;
  operationName: string;
}
export const upsertAppConfigRef: UpsertAppConfigRef;

export function upsertAppConfig(vars: UpsertAppConfigVariables): MutationPromise<UpsertAppConfigData, UpsertAppConfigVariables>;
export function upsertAppConfig(dc: DataConnect, vars: UpsertAppConfigVariables): MutationPromise<UpsertAppConfigData, UpsertAppConfigVariables>;

interface InsertDDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertDDayVariables): MutationRef<InsertDDayData, InsertDDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertDDayVariables): MutationRef<InsertDDayData, InsertDDayVariables>;
  operationName: string;
}
export const insertDDayRef: InsertDDayRef;

export function insertDDay(vars: InsertDDayVariables): MutationPromise<InsertDDayData, InsertDDayVariables>;
export function insertDDay(dc: DataConnect, vars: InsertDDayVariables): MutationPromise<InsertDDayData, InsertDDayVariables>;

interface DeleteDDayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDDayVariables): MutationRef<DeleteDDayData, DeleteDDayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDDayVariables): MutationRef<DeleteDDayData, DeleteDDayVariables>;
  operationName: string;
}
export const deleteDDayRef: DeleteDDayRef;

export function deleteDDay(vars: DeleteDDayVariables): MutationPromise<DeleteDDayData, DeleteDDayVariables>;
export function deleteDDay(dc: DataConnect, vars: DeleteDDayVariables): MutationPromise<DeleteDDayData, DeleteDDayVariables>;

interface UpdateStudentPointsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStudentPointsVariables): MutationRef<UpdateStudentPointsData, UpdateStudentPointsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStudentPointsVariables): MutationRef<UpdateStudentPointsData, UpdateStudentPointsVariables>;
  operationName: string;
}
export const updateStudentPointsRef: UpdateStudentPointsRef;

export function updateStudentPoints(vars: UpdateStudentPointsVariables): MutationPromise<UpdateStudentPointsData, UpdateStudentPointsVariables>;
export function updateStudentPoints(dc: DataConnect, vars: UpdateStudentPointsVariables): MutationPromise<UpdateStudentPointsData, UpdateStudentPointsVariables>;

interface UpsertAttendanceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAttendanceVariables): MutationRef<UpsertAttendanceData, UpsertAttendanceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAttendanceVariables): MutationRef<UpsertAttendanceData, UpsertAttendanceVariables>;
  operationName: string;
}
export const upsertAttendanceRef: UpsertAttendanceRef;

export function upsertAttendance(vars: UpsertAttendanceVariables): MutationPromise<UpsertAttendanceData, UpsertAttendanceVariables>;
export function upsertAttendance(dc: DataConnect, vars: UpsertAttendanceVariables): MutationPromise<UpsertAttendanceData, UpsertAttendanceVariables>;

interface InsertStudentRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertStudentRecordVariables): MutationRef<InsertStudentRecordData, InsertStudentRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertStudentRecordVariables): MutationRef<InsertStudentRecordData, InsertStudentRecordVariables>;
  operationName: string;
}
export const insertStudentRecordRef: InsertStudentRecordRef;

export function insertStudentRecord(vars: InsertStudentRecordVariables): MutationPromise<InsertStudentRecordData, InsertStudentRecordVariables>;
export function insertStudentRecord(dc: DataConnect, vars: InsertStudentRecordVariables): MutationPromise<InsertStudentRecordData, InsertStudentRecordVariables>;

interface DeleteStudentRecordRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStudentRecordVariables): MutationRef<DeleteStudentRecordData, DeleteStudentRecordVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStudentRecordVariables): MutationRef<DeleteStudentRecordData, DeleteStudentRecordVariables>;
  operationName: string;
}
export const deleteStudentRecordRef: DeleteStudentRecordRef;

export function deleteStudentRecord(vars: DeleteStudentRecordVariables): MutationPromise<DeleteStudentRecordData, DeleteStudentRecordVariables>;
export function deleteStudentRecord(dc: DataConnect, vars: DeleteStudentRecordVariables): MutationPromise<DeleteStudentRecordData, DeleteStudentRecordVariables>;

interface UpdatePollRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePollVariables): MutationRef<UpdatePollData, UpdatePollVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePollVariables): MutationRef<UpdatePollData, UpdatePollVariables>;
  operationName: string;
}
export const updatePollRef: UpdatePollRef;

export function updatePoll(vars: UpdatePollVariables): MutationPromise<UpdatePollData, UpdatePollVariables>;
export function updatePoll(dc: DataConnect, vars: UpdatePollVariables): MutationPromise<UpdatePollData, UpdatePollVariables>;

interface UpdateNewsletterRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNewsletterVariables): MutationRef<UpdateNewsletterData, UpdateNewsletterVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateNewsletterVariables): MutationRef<UpdateNewsletterData, UpdateNewsletterVariables>;
  operationName: string;
}
export const updateNewsletterRef: UpdateNewsletterRef;

export function updateNewsletter(vars: UpdateNewsletterVariables): MutationPromise<UpdateNewsletterData, UpdateNewsletterVariables>;
export function updateNewsletter(dc: DataConnect, vars: UpdateNewsletterVariables): MutationPromise<UpdateNewsletterData, UpdateNewsletterVariables>;

interface UpsertActivityCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityCompletionVariables): MutationRef<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertActivityCompletionVariables): MutationRef<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;
  operationName: string;
}
export const upsertActivityCompletionRef: UpsertActivityCompletionRef;

export function upsertActivityCompletion(vars: UpsertActivityCompletionVariables): MutationPromise<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;
export function upsertActivityCompletion(dc: DataConnect, vars: UpsertActivityCompletionVariables): MutationPromise<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;

interface DeleteActivityCompletionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityCompletionVariables): MutationRef<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteActivityCompletionVariables): MutationRef<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;
  operationName: string;
}
export const deleteActivityCompletionRef: DeleteActivityCompletionRef;

export function deleteActivityCompletion(vars: DeleteActivityCompletionVariables): MutationPromise<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;
export function deleteActivityCompletion(dc: DataConnect, vars: DeleteActivityCompletionVariables): MutationPromise<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;

interface UpsertActivityCheckRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityCheckVariables): MutationRef<UpsertActivityCheckData, UpsertActivityCheckVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertActivityCheckVariables): MutationRef<UpsertActivityCheckData, UpsertActivityCheckVariables>;
  operationName: string;
}
export const upsertActivityCheckRef: UpsertActivityCheckRef;

export function upsertActivityCheck(vars: UpsertActivityCheckVariables): MutationPromise<UpsertActivityCheckData, UpsertActivityCheckVariables>;
export function upsertActivityCheck(dc: DataConnect, vars: UpsertActivityCheckVariables): MutationPromise<UpsertActivityCheckData, UpsertActivityCheckVariables>;

interface UpsertStudentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpsertStudentVariables): MutationRef<UpsertStudentData, UpsertStudentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpsertStudentVariables): MutationRef<UpsertStudentData, UpsertStudentVariables>;
  operationName: string;
}
export const upsertStudentRef: UpsertStudentRef;

export function upsertStudent(vars?: UpsertStudentVariables): MutationPromise<UpsertStudentData, UpsertStudentVariables>;
export function upsertStudent(dc: DataConnect, vars?: UpsertStudentVariables): MutationPromise<UpsertStudentData, UpsertStudentVariables>;

interface UpsertQuickLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertQuickLinkVariables): MutationRef<UpsertQuickLinkData, UpsertQuickLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertQuickLinkVariables): MutationRef<UpsertQuickLinkData, UpsertQuickLinkVariables>;
  operationName: string;
}
export const upsertQuickLinkRef: UpsertQuickLinkRef;

export function upsertQuickLink(vars: UpsertQuickLinkVariables): MutationPromise<UpsertQuickLinkData, UpsertQuickLinkVariables>;
export function upsertQuickLink(dc: DataConnect, vars: UpsertQuickLinkVariables): MutationPromise<UpsertQuickLinkData, UpsertQuickLinkVariables>;

interface DeleteQuickLinkRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteQuickLinkVariables): MutationRef<DeleteQuickLinkData, DeleteQuickLinkVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteQuickLinkVariables): MutationRef<DeleteQuickLinkData, DeleteQuickLinkVariables>;
  operationName: string;
}
export const deleteQuickLinkRef: DeleteQuickLinkRef;

export function deleteQuickLink(vars: DeleteQuickLinkVariables): MutationPromise<DeleteQuickLinkData, DeleteQuickLinkVariables>;
export function deleteQuickLink(dc: DataConnect, vars: DeleteQuickLinkVariables): MutationPromise<DeleteQuickLinkData, DeleteQuickLinkVariables>;

interface UpsertAnnouncementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAnnouncementVariables): MutationRef<UpsertAnnouncementData, UpsertAnnouncementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAnnouncementVariables): MutationRef<UpsertAnnouncementData, UpsertAnnouncementVariables>;
  operationName: string;
}
export const upsertAnnouncementRef: UpsertAnnouncementRef;

export function upsertAnnouncement(vars: UpsertAnnouncementVariables): MutationPromise<UpsertAnnouncementData, UpsertAnnouncementVariables>;
export function upsertAnnouncement(dc: DataConnect, vars: UpsertAnnouncementVariables): MutationPromise<UpsertAnnouncementData, UpsertAnnouncementVariables>;

interface DeleteAnnouncementRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAnnouncementVariables): MutationRef<DeleteAnnouncementData, DeleteAnnouncementVariables>;
  operationName: string;
}
export const deleteAnnouncementRef: DeleteAnnouncementRef;

export function deleteAnnouncement(vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;
export function deleteAnnouncement(dc: DataConnect, vars: DeleteAnnouncementVariables): MutationPromise<DeleteAnnouncementData, DeleteAnnouncementVariables>;

interface UpsertAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAssignmentVariables): MutationRef<UpsertAssignmentData, UpsertAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertAssignmentVariables): MutationRef<UpsertAssignmentData, UpsertAssignmentVariables>;
  operationName: string;
}
export const upsertAssignmentRef: UpsertAssignmentRef;

export function upsertAssignment(vars: UpsertAssignmentVariables): MutationPromise<UpsertAssignmentData, UpsertAssignmentVariables>;
export function upsertAssignment(dc: DataConnect, vars: UpsertAssignmentVariables): MutationPromise<UpsertAssignmentData, UpsertAssignmentVariables>;

interface DeleteAssignmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAssignmentVariables): MutationRef<DeleteAssignmentData, DeleteAssignmentVariables>;
  operationName: string;
}
export const deleteAssignmentRef: DeleteAssignmentRef;

export function deleteAssignment(vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;
export function deleteAssignment(dc: DataConnect, vars: DeleteAssignmentVariables): MutationPromise<DeleteAssignmentData, DeleteAssignmentVariables>;

interface UpsertPollRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertPollVariables): MutationRef<UpsertPollData, UpsertPollVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertPollVariables): MutationRef<UpsertPollData, UpsertPollVariables>;
  operationName: string;
}
export const upsertPollRef: UpsertPollRef;

export function upsertPoll(vars: UpsertPollVariables): MutationPromise<UpsertPollData, UpsertPollVariables>;
export function upsertPoll(dc: DataConnect, vars: UpsertPollVariables): MutationPromise<UpsertPollData, UpsertPollVariables>;

interface DeletePollRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePollVariables): MutationRef<DeletePollData, DeletePollVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePollVariables): MutationRef<DeletePollData, DeletePollVariables>;
  operationName: string;
}
export const deletePollRef: DeletePollRef;

export function deletePoll(vars: DeletePollVariables): MutationPromise<DeletePollData, DeletePollVariables>;
export function deletePoll(dc: DataConnect, vars: DeletePollVariables): MutationPromise<DeletePollData, DeletePollVariables>;

interface GetAllAppDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllAppDataData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllAppDataData, undefined>;
  operationName: string;
}
export const getAllAppDataRef: GetAllAppDataRef;

export function getAllAppData(options?: ExecuteQueryOptions): QueryPromise<GetAllAppDataData, undefined>;
export function getAllAppData(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetAllAppDataData, undefined>;

interface GetAttendanceByDateRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttendanceByDateVariables): QueryRef<GetAttendanceByDateData, GetAttendanceByDateVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttendanceByDateVariables): QueryRef<GetAttendanceByDateData, GetAttendanceByDateVariables>;
  operationName: string;
}
export const getAttendanceByDateRef: GetAttendanceByDateRef;

export function getAttendanceByDate(vars: GetAttendanceByDateVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttendanceByDateData, GetAttendanceByDateVariables>;
export function getAttendanceByDate(dc: DataConnect, vars: GetAttendanceByDateVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttendanceByDateData, GetAttendanceByDateVariables>;

interface GetAttendanceByMonthRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttendanceByMonthVariables): QueryRef<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAttendanceByMonthVariables): QueryRef<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;
  operationName: string;
}
export const getAttendanceByMonthRef: GetAttendanceByMonthRef;

export function getAttendanceByMonth(vars: GetAttendanceByMonthVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;
export function getAttendanceByMonth(dc: DataConnect, vars: GetAttendanceByMonthVariables, options?: ExecuteQueryOptions): QueryPromise<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;

