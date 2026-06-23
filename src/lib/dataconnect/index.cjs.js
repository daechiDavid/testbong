const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'dashboard-edu',
  location: 'asia-northeast3'
};
exports.connectorConfig = connectorConfig;

const upsertWeeklyPlanRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertWeeklyPlan', inputVars);
}
upsertWeeklyPlanRef.operationName = 'UpsertWeeklyPlan';
exports.upsertWeeklyPlanRef = upsertWeeklyPlanRef;

exports.upsertWeeklyPlan = function upsertWeeklyPlan(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertWeeklyPlanRef(dcInstance, inputVars));
}
;

const upsertAppConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAppConfig', inputVars);
}
upsertAppConfigRef.operationName = 'UpsertAppConfig';
exports.upsertAppConfigRef = upsertAppConfigRef;

exports.upsertAppConfig = function upsertAppConfig(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAppConfigRef(dcInstance, inputVars));
}
;

const insertDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDDay', inputVars);
}
insertDDayRef.operationName = 'InsertDDay';
exports.insertDDayRef = insertDDayRef;

exports.insertDDay = function insertDDay(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertDDayRef(dcInstance, inputVars));
}
;

const deleteDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDDay', inputVars);
}
deleteDDayRef.operationName = 'DeleteDDay';
exports.deleteDDayRef = deleteDDayRef;

exports.deleteDDay = function deleteDDay(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteDDayRef(dcInstance, inputVars));
}
;

const updateStudentPointsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStudentPoints', inputVars);
}
updateStudentPointsRef.operationName = 'UpdateStudentPoints';
exports.updateStudentPointsRef = updateStudentPointsRef;

exports.updateStudentPoints = function updateStudentPoints(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateStudentPointsRef(dcInstance, inputVars));
}
;

const upsertAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAttendance', inputVars);
}
upsertAttendanceRef.operationName = 'UpsertAttendance';
exports.upsertAttendanceRef = upsertAttendanceRef;

exports.upsertAttendance = function upsertAttendance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAttendanceRef(dcInstance, inputVars));
}
;

const deleteAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAttendance', inputVars);
}
deleteAttendanceRef.operationName = 'DeleteAttendance';
exports.deleteAttendanceRef = deleteAttendanceRef;

exports.deleteAttendance = function deleteAttendance(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAttendanceRef(dcInstance, inputVars));
}
;

const insertStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertStudentRecord', inputVars);
}
insertStudentRecordRef.operationName = 'InsertStudentRecord';
exports.insertStudentRecordRef = insertStudentRecordRef;

exports.insertStudentRecord = function insertStudentRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(insertStudentRecordRef(dcInstance, inputVars));
}
;

const deleteStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStudentRecord', inputVars);
}
deleteStudentRecordRef.operationName = 'DeleteStudentRecord';
exports.deleteStudentRecordRef = deleteStudentRecordRef;

exports.deleteStudentRecord = function deleteStudentRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteStudentRecordRef(dcInstance, inputVars));
}
;

const updatePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePoll', inputVars);
}
updatePollRef.operationName = 'UpdatePoll';
exports.updatePollRef = updatePollRef;

exports.updatePoll = function updatePoll(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePollRef(dcInstance, inputVars));
}
;

const updateNewsletterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateNewsletter', inputVars);
}
updateNewsletterRef.operationName = 'UpdateNewsletter';
exports.updateNewsletterRef = updateNewsletterRef;

exports.updateNewsletter = function updateNewsletter(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateNewsletterRef(dcInstance, inputVars));
}
;

const upsertActivityCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertActivityCompletion', inputVars);
}
upsertActivityCompletionRef.operationName = 'UpsertActivityCompletion';
exports.upsertActivityCompletionRef = upsertActivityCompletionRef;

exports.upsertActivityCompletion = function upsertActivityCompletion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertActivityCompletionRef(dcInstance, inputVars));
}
;

const deleteActivityCompletionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteActivityCompletion', inputVars);
}
deleteActivityCompletionRef.operationName = 'DeleteActivityCompletion';
exports.deleteActivityCompletionRef = deleteActivityCompletionRef;

exports.deleteActivityCompletion = function deleteActivityCompletion(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteActivityCompletionRef(dcInstance, inputVars));
}
;

const upsertActivityCheckRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertActivityCheck', inputVars);
}
upsertActivityCheckRef.operationName = 'UpsertActivityCheck';
exports.upsertActivityCheckRef = upsertActivityCheckRef;

exports.upsertActivityCheck = function upsertActivityCheck(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertActivityCheckRef(dcInstance, inputVars));
}
;

const upsertStudentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudent', inputVars);
}
upsertStudentRef.operationName = 'UpsertStudent';
exports.upsertStudentRef = upsertStudentRef;

exports.upsertStudent = function upsertStudent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars);
  return executeMutation(upsertStudentRef(dcInstance, inputVars));
}
;

const upsertQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertQuickLink', inputVars);
}
upsertQuickLinkRef.operationName = 'UpsertQuickLink';
exports.upsertQuickLinkRef = upsertQuickLinkRef;

exports.upsertQuickLink = function upsertQuickLink(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertQuickLinkRef(dcInstance, inputVars));
}
;

const deleteQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuickLink', inputVars);
}
deleteQuickLinkRef.operationName = 'DeleteQuickLink';
exports.deleteQuickLinkRef = deleteQuickLinkRef;

exports.deleteQuickLink = function deleteQuickLink(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteQuickLinkRef(dcInstance, inputVars));
}
;

const upsertAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAnnouncement', inputVars);
}
upsertAnnouncementRef.operationName = 'UpsertAnnouncement';
exports.upsertAnnouncementRef = upsertAnnouncementRef;

exports.upsertAnnouncement = function upsertAnnouncement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAnnouncementRef(dcInstance, inputVars));
}
;

const deleteAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnnouncement', inputVars);
}
deleteAnnouncementRef.operationName = 'DeleteAnnouncement';
exports.deleteAnnouncementRef = deleteAnnouncementRef;

exports.deleteAnnouncement = function deleteAnnouncement(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAnnouncementRef(dcInstance, inputVars));
}
;

const upsertAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAssignment', inputVars);
}
upsertAssignmentRef.operationName = 'UpsertAssignment';
exports.upsertAssignmentRef = upsertAssignmentRef;

exports.upsertAssignment = function upsertAssignment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertAssignmentRef(dcInstance, inputVars));
}
;

const deleteAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAssignment', inputVars);
}
deleteAssignmentRef.operationName = 'DeleteAssignment';
exports.deleteAssignmentRef = deleteAssignmentRef;

exports.deleteAssignment = function deleteAssignment(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAssignmentRef(dcInstance, inputVars));
}
;

const upsertPollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPoll', inputVars);
}
upsertPollRef.operationName = 'UpsertPoll';
exports.upsertPollRef = upsertPollRef;

exports.upsertPoll = function upsertPoll(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertPollRef(dcInstance, inputVars));
}
;

const deletePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePoll', inputVars);
}
deletePollRef.operationName = 'DeletePoll';
exports.deletePollRef = deletePollRef;

exports.deletePoll = function deletePoll(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deletePollRef(dcInstance, inputVars));
}
;

const getAllAppDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllAppData');
}
getAllAppDataRef.operationName = 'GetAllAppData';
exports.getAllAppDataRef = getAllAppDataRef;

exports.getAllAppData = function getAllAppData(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getAllAppDataRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAttendanceByDateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByDate', inputVars);
}
getAttendanceByDateRef.operationName = 'GetAttendanceByDate';
exports.getAttendanceByDateRef = getAttendanceByDateRef;

exports.getAttendanceByDate = function getAttendanceByDate(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttendanceByDateRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getAttendanceByMonthRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByMonth', inputVars);
}
getAttendanceByMonthRef.operationName = 'GetAttendanceByMonth';
exports.getAttendanceByMonthRef = getAttendanceByMonthRef;

exports.getAttendanceByMonth = function getAttendanceByMonth(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getAttendanceByMonthRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
