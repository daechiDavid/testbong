const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

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
  return executeMutation(upsertWeeklyPlanRef(dcOrVars, vars));
};

const upsertAppConfigRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAppConfig', inputVars);
}
upsertAppConfigRef.operationName = 'UpsertAppConfig';
exports.upsertAppConfigRef = upsertAppConfigRef;

exports.upsertAppConfig = function upsertAppConfig(dcOrVars, vars) {
  return executeMutation(upsertAppConfigRef(dcOrVars, vars));
};

const insertDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertDDay', inputVars);
}
insertDDayRef.operationName = 'InsertDDay';
exports.insertDDayRef = insertDDayRef;

exports.insertDDay = function insertDDay(dcOrVars, vars) {
  return executeMutation(insertDDayRef(dcOrVars, vars));
};

const deleteDDayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteDDay', inputVars);
}
deleteDDayRef.operationName = 'DeleteDDay';
exports.deleteDDayRef = deleteDDayRef;

exports.deleteDDay = function deleteDDay(dcOrVars, vars) {
  return executeMutation(deleteDDayRef(dcOrVars, vars));
};

const updateStudentPointsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStudentPoints', inputVars);
}
updateStudentPointsRef.operationName = 'UpdateStudentPoints';
exports.updateStudentPointsRef = updateStudentPointsRef;

exports.updateStudentPoints = function updateStudentPoints(dcOrVars, vars) {
  return executeMutation(updateStudentPointsRef(dcOrVars, vars));
};

const upsertAttendanceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAttendance', inputVars);
}
upsertAttendanceRef.operationName = 'UpsertAttendance';
exports.upsertAttendanceRef = upsertAttendanceRef;

exports.upsertAttendance = function upsertAttendance(dcOrVars, vars) {
  return executeMutation(upsertAttendanceRef(dcOrVars, vars));
};

const insertStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertStudentRecord', inputVars);
}
insertStudentRecordRef.operationName = 'InsertStudentRecord';
exports.insertStudentRecordRef = insertStudentRecordRef;

exports.insertStudentRecord = function insertStudentRecord(dcOrVars, vars) {
  return executeMutation(insertStudentRecordRef(dcOrVars, vars));
};

const deleteStudentRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStudentRecord', inputVars);
}
deleteStudentRecordRef.operationName = 'DeleteStudentRecord';
exports.deleteStudentRecordRef = deleteStudentRecordRef;

exports.deleteStudentRecord = function deleteStudentRecord(dcOrVars, vars) {
  return executeMutation(deleteStudentRecordRef(dcOrVars, vars));
};

const updatePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePoll', inputVars);
}
updatePollRef.operationName = 'UpdatePoll';
exports.updatePollRef = updatePollRef;

exports.updatePoll = function updatePoll(dcOrVars, vars) {
  return executeMutation(updatePollRef(dcOrVars, vars));
};

const updateNewsletterRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateNewsletter', inputVars);
}
updateNewsletterRef.operationName = 'UpdateNewsletter';
exports.updateNewsletterRef = updateNewsletterRef;

exports.updateNewsletter = function updateNewsletter(dcOrVars, vars) {
  return executeMutation(updateNewsletterRef(dcOrVars, vars));
};

const upsertStudentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertStudent', inputVars);
}
upsertStudentRef.operationName = 'UpsertStudent';
exports.upsertStudentRef = upsertStudentRef;

exports.upsertStudent = function upsertStudent(dcOrVars, vars) {
  return executeMutation(upsertStudentRef(dcOrVars, vars));
};

const upsertQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertQuickLink', inputVars);
}
upsertQuickLinkRef.operationName = 'UpsertQuickLink';
exports.upsertQuickLinkRef = upsertQuickLinkRef;

exports.upsertQuickLink = function upsertQuickLink(dcOrVars, vars) {
  return executeMutation(upsertQuickLinkRef(dcOrVars, vars));
};

const deleteQuickLinkRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteQuickLink', inputVars);
}
deleteQuickLinkRef.operationName = 'DeleteQuickLink';
exports.deleteQuickLinkRef = deleteQuickLinkRef;

exports.deleteQuickLink = function deleteQuickLink(dcOrVars, vars) {
  return executeMutation(deleteQuickLinkRef(dcOrVars, vars));
};

const upsertAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAnnouncement', inputVars);
}
upsertAnnouncementRef.operationName = 'UpsertAnnouncement';
exports.upsertAnnouncementRef = upsertAnnouncementRef;

exports.upsertAnnouncement = function upsertAnnouncement(dcOrVars, vars) {
  return executeMutation(upsertAnnouncementRef(dcOrVars, vars));
};

const deleteAnnouncementRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAnnouncement', inputVars);
}
deleteAnnouncementRef.operationName = 'DeleteAnnouncement';
exports.deleteAnnouncementRef = deleteAnnouncementRef;

exports.deleteAnnouncement = function deleteAnnouncement(dcOrVars, vars) {
  return executeMutation(deleteAnnouncementRef(dcOrVars, vars));
};

const upsertAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertAssignment', inputVars);
}
upsertAssignmentRef.operationName = 'UpsertAssignment';
exports.upsertAssignmentRef = upsertAssignmentRef;

exports.upsertAssignment = function upsertAssignment(dcOrVars, vars) {
  return executeMutation(upsertAssignmentRef(dcOrVars, vars));
};

const deleteAssignmentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAssignment', inputVars);
}
deleteAssignmentRef.operationName = 'DeleteAssignment';
exports.deleteAssignmentRef = deleteAssignmentRef;

exports.deleteAssignment = function deleteAssignment(dcOrVars, vars) {
  return executeMutation(deleteAssignmentRef(dcOrVars, vars));
};

const upsertPollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertPoll', inputVars);
}
upsertPollRef.operationName = 'UpsertPoll';
exports.upsertPollRef = upsertPollRef;

exports.upsertPoll = function upsertPoll(dcOrVars, vars) {
  return executeMutation(upsertPollRef(dcOrVars, vars));
};

const deletePollRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePoll', inputVars);
}
deletePollRef.operationName = 'DeletePoll';
exports.deletePollRef = deletePollRef;

exports.deletePoll = function deletePoll(dcOrVars, vars) {
  return executeMutation(deletePollRef(dcOrVars, vars));
};

const getAllAppDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllAppData');
}
getAllAppDataRef.operationName = 'GetAllAppData';
exports.getAllAppDataRef = getAllAppDataRef;

exports.getAllAppData = function getAllAppData(dc) {
  return executeQuery(getAllAppDataRef(dc));
};

const getAttendanceByDateRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByDate', inputVars);
}
getAttendanceByDateRef.operationName = 'GetAttendanceByDate';
exports.getAttendanceByDateRef = getAttendanceByDateRef;

exports.getAttendanceByDate = function getAttendanceByDate(dcOrVars, vars) {
  return executeQuery(getAttendanceByDateRef(dcOrVars, vars));
};

const getAttendanceByMonthRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAttendanceByMonth', inputVars);
}
getAttendanceByMonthRef.operationName = 'GetAttendanceByMonth';
exports.getAttendanceByMonthRef = getAttendanceByMonthRef;

exports.getAttendanceByMonth = function getAttendanceByMonth(dcOrVars, vars) {
  return executeQuery(getAttendanceByMonthRef(dcOrVars, vars));
};
