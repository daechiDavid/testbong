import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'dashboard-edu',
  location: 'asia-northeast3'
};

export const upsertWeeklyPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertWeeklyPlan', inputVars);
}
upsertWeeklyPlanRef.operationName = 'UpsertWeeklyPlan';

export function upsertWeeklyPlan(dcOrVars, vars) {
  return executeMutation(upsertWeeklyPlanRef(dcOrVars, vars));
}

export const upsertAppConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAppConfig', inputVars);
}
upsertAppConfigRef.operationName = 'UpsertAppConfig';

export function upsertAppConfig(dcOrVars, vars) {
  return executeMutation(upsertAppConfigRef(dcOrVars, vars));
}

export const insertDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDDay', inputVars);
}
insertDDayRef.operationName = 'InsertDDay';

export function insertDDay(dcOrVars, vars) {
  return executeMutation(insertDDayRef(dcOrVars, vars));
}

export const deleteDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDDay', inputVars);
}
deleteDDayRef.operationName = 'DeleteDDay';

export function deleteDDay(dcOrVars, vars) {
  return executeMutation(deleteDDayRef(dcOrVars, vars));
}

export const updateStudentPointsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStudentPoints', inputVars);
}
updateStudentPointsRef.operationName = 'UpdateStudentPoints';

export function updateStudentPoints(dcOrVars, vars) {
  return executeMutation(updateStudentPointsRef(dcOrVars, vars));
}

export const upsertAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAttendance', inputVars);
}
upsertAttendanceRef.operationName = 'UpsertAttendance';

export function upsertAttendance(dcOrVars, vars) {
  return executeMutation(upsertAttendanceRef(dcOrVars, vars));
}

export const insertStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertStudentRecord', inputVars);
}
insertStudentRecordRef.operationName = 'InsertStudentRecord';

export function insertStudentRecord(dcOrVars, vars) {
  return executeMutation(insertStudentRecordRef(dcOrVars, vars));
}

export const deleteStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStudentRecord', inputVars);
}
deleteStudentRecordRef.operationName = 'DeleteStudentRecord';

export function deleteStudentRecord(dcOrVars, vars) {
  return executeMutation(deleteStudentRecordRef(dcOrVars, vars));
}

export const updatePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePoll', inputVars);
}
updatePollRef.operationName = 'UpdatePoll';

export function updatePoll(dcOrVars, vars) {
  return executeMutation(updatePollRef(dcOrVars, vars));
}

export const updateNewsletterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateNewsletter', inputVars);
}
updateNewsletterRef.operationName = 'UpdateNewsletter';

export function updateNewsletter(dcOrVars, vars) {
  return executeMutation(updateNewsletterRef(dcOrVars, vars));
}

export const upsertStudentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudent', inputVars);
}
upsertStudentRef.operationName = 'UpsertStudent';

export function upsertStudent(dcOrVars, vars) {
  return executeMutation(upsertStudentRef(dcOrVars, vars));
}

export const upsertQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertQuickLink', inputVars);
}
upsertQuickLinkRef.operationName = 'UpsertQuickLink';

export function upsertQuickLink(dcOrVars, vars) {
  return executeMutation(upsertQuickLinkRef(dcOrVars, vars));
}

export const deleteQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuickLink', inputVars);
}
deleteQuickLinkRef.operationName = 'DeleteQuickLink';

export function deleteQuickLink(dcOrVars, vars) {
  return executeMutation(deleteQuickLinkRef(dcOrVars, vars));
}

export const upsertAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAnnouncement', inputVars);
}
upsertAnnouncementRef.operationName = 'UpsertAnnouncement';

export function upsertAnnouncement(dcOrVars, vars) {
  return executeMutation(upsertAnnouncementRef(dcOrVars, vars));
}

export const deleteAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnnouncement', inputVars);
}
deleteAnnouncementRef.operationName = 'DeleteAnnouncement';

export function deleteAnnouncement(dcOrVars, vars) {
  return executeMutation(deleteAnnouncementRef(dcOrVars, vars));
}

export const upsertAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAssignment', inputVars);
}
upsertAssignmentRef.operationName = 'UpsertAssignment';

export function upsertAssignment(dcOrVars, vars) {
  return executeMutation(upsertAssignmentRef(dcOrVars, vars));
}

export const deleteAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAssignment', inputVars);
}
deleteAssignmentRef.operationName = 'DeleteAssignment';

export function deleteAssignment(dcOrVars, vars) {
  return executeMutation(deleteAssignmentRef(dcOrVars, vars));
}

export const upsertPollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPoll', inputVars);
}
upsertPollRef.operationName = 'UpsertPoll';

export function upsertPoll(dcOrVars, vars) {
  return executeMutation(upsertPollRef(dcOrVars, vars));
}

export const deletePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePoll', inputVars);
}
deletePollRef.operationName = 'DeletePoll';

export function deletePoll(dcOrVars, vars) {
  return executeMutation(deletePollRef(dcOrVars, vars));
}

export const getAllAppDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllAppData');
}
getAllAppDataRef.operationName = 'GetAllAppData';

export function getAllAppData(dc) {
  return executeQuery(getAllAppDataRef(dc));
}

export const getAttendanceByDateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByDate', inputVars);
}
getAttendanceByDateRef.operationName = 'GetAttendanceByDate';

export function getAttendanceByDate(dcOrVars, vars) {
  return executeQuery(getAttendanceByDateRef(dcOrVars, vars));
}

export const getAttendanceByMonthRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByMonth', inputVars);
}
getAttendanceByMonthRef.operationName = 'GetAttendanceByMonth';

export function getAttendanceByMonth(dcOrVars, vars) {
  return executeQuery(getAttendanceByMonthRef(dcOrVars, vars));
}

