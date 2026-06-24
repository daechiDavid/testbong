# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertWeeklyPlan, upsertAppConfig, insertDDay, deleteDDay, updateStudentPoints, upsertAttendance, insertStudentRecord, deleteStudentRecord, updatePoll, updateNewsletter } from '@dashboard/dataconnect';


// Operation UpsertWeeklyPlan:  For variables, look at type UpsertWeeklyPlanVars in ../index.d.ts
const { data } = await UpsertWeeklyPlan(dataConnect, upsertWeeklyPlanVars);

// Operation UpsertAppConfig:  For variables, look at type UpsertAppConfigVars in ../index.d.ts
const { data } = await UpsertAppConfig(dataConnect, upsertAppConfigVars);

// Operation InsertDDay:  For variables, look at type InsertDDayVars in ../index.d.ts
const { data } = await InsertDDay(dataConnect, insertDDayVars);

// Operation DeleteDDay:  For variables, look at type DeleteDDayVars in ../index.d.ts
const { data } = await DeleteDDay(dataConnect, deleteDDayVars);

// Operation UpdateStudentPoints:  For variables, look at type UpdateStudentPointsVars in ../index.d.ts
const { data } = await UpdateStudentPoints(dataConnect, updateStudentPointsVars);

// Operation UpsertAttendance:  For variables, look at type UpsertAttendanceVars in ../index.d.ts
const { data } = await UpsertAttendance(dataConnect, upsertAttendanceVars);

// Operation InsertStudentRecord:  For variables, look at type InsertStudentRecordVars in ../index.d.ts
const { data } = await InsertStudentRecord(dataConnect, insertStudentRecordVars);

// Operation DeleteStudentRecord:  For variables, look at type DeleteStudentRecordVars in ../index.d.ts
const { data } = await DeleteStudentRecord(dataConnect, deleteStudentRecordVars);

// Operation UpdatePoll:  For variables, look at type UpdatePollVars in ../index.d.ts
const { data } = await UpdatePoll(dataConnect, updatePollVars);

// Operation UpdateNewsletter:  For variables, look at type UpdateNewsletterVars in ../index.d.ts
const { data } = await UpdateNewsletter(dataConnect, updateNewsletterVars);


```