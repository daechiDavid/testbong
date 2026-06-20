# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetAllAppData*](#getallappdata)
  - [*GetAttendanceByDate*](#getattendancebydate)
  - [*GetAttendanceByMonth*](#getattendancebymonth)
- [**Mutations**](#mutations)
  - [*UpsertWeeklyPlan*](#upsertweeklyplan)
  - [*UpsertAppConfig*](#upsertappconfig)
  - [*InsertDDay*](#insertdday)
  - [*DeleteDDay*](#deletedday)
  - [*UpdateStudentPoints*](#updatestudentpoints)
  - [*UpsertAttendance*](#upsertattendance)
  - [*DeleteAttendance*](#deleteattendance)
  - [*InsertStudentRecord*](#insertstudentrecord)
  - [*DeleteStudentRecord*](#deletestudentrecord)
  - [*UpdatePoll*](#updatepoll)
  - [*UpdateNewsletter*](#updatenewsletter)
  - [*UpsertActivityCompletion*](#upsertactivitycompletion)
  - [*DeleteActivityCompletion*](#deleteactivitycompletion)
  - [*UpsertActivityCheck*](#upsertactivitycheck)
  - [*UpdateStudent*](#updatestudent)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dashboard/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dashboard/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dashboard/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetAllAppData
You can execute the `GetAllAppData` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAllAppData(): QueryPromise<GetAllAppDataData, undefined>;

interface GetAllAppDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllAppDataData, undefined>;
}
export const getAllAppDataRef: GetAllAppDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllAppData(dc: DataConnect): QueryPromise<GetAllAppDataData, undefined>;

interface GetAllAppDataRef {
  ...
  (dc: DataConnect): QueryRef<GetAllAppDataData, undefined>;
}
export const getAllAppDataRef: GetAllAppDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllAppDataRef:
```typescript
const name = getAllAppDataRef.operationName;
console.log(name);
```

### Variables
The `GetAllAppData` query has no variables.
### Return Type
Recall that executing the `GetAllAppData` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllAppDataData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAllAppData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllAppData } from '@dashboard/dataconnect';


// Call the `getAllAppData()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllAppData();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllAppData(dataConnect);

console.log(data.students);
console.log(data.announcements);
console.log(data.assignments);
console.log(data.dDays);
console.log(data.weeklyPlans);
console.log(data.appConfigs);
console.log(data.quickLinks);
console.log(data.polls);
console.log(data.newsletters);
console.log(data.activityChecks);
console.log(data.activityCompletions);
console.log(data.studentRecords);

// Or, you can use the `Promise` API.
getAllAppData().then((response) => {
  const data = response.data;
  console.log(data.students);
  console.log(data.announcements);
  console.log(data.assignments);
  console.log(data.dDays);
  console.log(data.weeklyPlans);
  console.log(data.appConfigs);
  console.log(data.quickLinks);
  console.log(data.polls);
  console.log(data.newsletters);
  console.log(data.activityChecks);
  console.log(data.activityCompletions);
  console.log(data.studentRecords);
});
```

### Using `GetAllAppData`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllAppDataRef } from '@dashboard/dataconnect';


// Call the `getAllAppDataRef()` function to get a reference to the query.
const ref = getAllAppDataRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllAppDataRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.students);
console.log(data.announcements);
console.log(data.assignments);
console.log(data.dDays);
console.log(data.weeklyPlans);
console.log(data.appConfigs);
console.log(data.quickLinks);
console.log(data.polls);
console.log(data.newsletters);
console.log(data.activityChecks);
console.log(data.activityCompletions);
console.log(data.studentRecords);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.students);
  console.log(data.announcements);
  console.log(data.assignments);
  console.log(data.dDays);
  console.log(data.weeklyPlans);
  console.log(data.appConfigs);
  console.log(data.quickLinks);
  console.log(data.polls);
  console.log(data.newsletters);
  console.log(data.activityChecks);
  console.log(data.activityCompletions);
  console.log(data.studentRecords);
});
```

## GetAttendanceByDate
You can execute the `GetAttendanceByDate` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAttendanceByDate(vars: GetAttendanceByDateVariables): QueryPromise<GetAttendanceByDateData, GetAttendanceByDateVariables>;

interface GetAttendanceByDateRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttendanceByDateVariables): QueryRef<GetAttendanceByDateData, GetAttendanceByDateVariables>;
}
export const getAttendanceByDateRef: GetAttendanceByDateRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttendanceByDate(dc: DataConnect, vars: GetAttendanceByDateVariables): QueryPromise<GetAttendanceByDateData, GetAttendanceByDateVariables>;

interface GetAttendanceByDateRef {
  ...
  (dc: DataConnect, vars: GetAttendanceByDateVariables): QueryRef<GetAttendanceByDateData, GetAttendanceByDateVariables>;
}
export const getAttendanceByDateRef: GetAttendanceByDateRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttendanceByDateRef:
```typescript
const name = getAttendanceByDateRef.operationName;
console.log(name);
```

### Variables
The `GetAttendanceByDate` query requires an argument of type `GetAttendanceByDateVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttendanceByDateVariables {
  date: DateString;
}
```
### Return Type
Recall that executing the `GetAttendanceByDate` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttendanceByDateData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttendanceByDateData {
  attendances: ({
    id: UUIDString;
    student: {
      id: UUIDString;
    } & Student_Key;
      date: DateString;
      status: string;
      note?: string | null;
  } & Attendance_Key)[];
}
```
### Using `GetAttendanceByDate`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttendanceByDate, GetAttendanceByDateVariables } from '@dashboard/dataconnect';

// The `GetAttendanceByDate` query requires an argument of type `GetAttendanceByDateVariables`:
const getAttendanceByDateVars: GetAttendanceByDateVariables = {
  date: ..., 
};

// Call the `getAttendanceByDate()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttendanceByDate(getAttendanceByDateVars);
// Variables can be defined inline as well.
const { data } = await getAttendanceByDate({ date: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttendanceByDate(dataConnect, getAttendanceByDateVars);

console.log(data.attendances);

// Or, you can use the `Promise` API.
getAttendanceByDate(getAttendanceByDateVars).then((response) => {
  const data = response.data;
  console.log(data.attendances);
});
```

### Using `GetAttendanceByDate`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttendanceByDateRef, GetAttendanceByDateVariables } from '@dashboard/dataconnect';

// The `GetAttendanceByDate` query requires an argument of type `GetAttendanceByDateVariables`:
const getAttendanceByDateVars: GetAttendanceByDateVariables = {
  date: ..., 
};

// Call the `getAttendanceByDateRef()` function to get a reference to the query.
const ref = getAttendanceByDateRef(getAttendanceByDateVars);
// Variables can be defined inline as well.
const ref = getAttendanceByDateRef({ date: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttendanceByDateRef(dataConnect, getAttendanceByDateVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.attendances);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.attendances);
});
```

## GetAttendanceByMonth
You can execute the `GetAttendanceByMonth` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAttendanceByMonth(vars: GetAttendanceByMonthVariables): QueryPromise<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;

interface GetAttendanceByMonthRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAttendanceByMonthVariables): QueryRef<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;
}
export const getAttendanceByMonthRef: GetAttendanceByMonthRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAttendanceByMonth(dc: DataConnect, vars: GetAttendanceByMonthVariables): QueryPromise<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;

interface GetAttendanceByMonthRef {
  ...
  (dc: DataConnect, vars: GetAttendanceByMonthVariables): QueryRef<GetAttendanceByMonthData, GetAttendanceByMonthVariables>;
}
export const getAttendanceByMonthRef: GetAttendanceByMonthRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAttendanceByMonthRef:
```typescript
const name = getAttendanceByMonthRef.operationName;
console.log(name);
```

### Variables
The `GetAttendanceByMonth` query requires an argument of type `GetAttendanceByMonthVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAttendanceByMonthVariables {
  startDate: DateString;
  endDate: DateString;
}
```
### Return Type
Recall that executing the `GetAttendanceByMonth` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAttendanceByMonthData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAttendanceByMonthData {
  attendances: ({
    id: UUIDString;
    student: {
      id: UUIDString;
    } & Student_Key;
      date: DateString;
      status: string;
      note?: string | null;
  } & Attendance_Key)[];
}
```
### Using `GetAttendanceByMonth`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAttendanceByMonth, GetAttendanceByMonthVariables } from '@dashboard/dataconnect';

// The `GetAttendanceByMonth` query requires an argument of type `GetAttendanceByMonthVariables`:
const getAttendanceByMonthVars: GetAttendanceByMonthVariables = {
  startDate: ..., 
  endDate: ..., 
};

// Call the `getAttendanceByMonth()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAttendanceByMonth(getAttendanceByMonthVars);
// Variables can be defined inline as well.
const { data } = await getAttendanceByMonth({ startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAttendanceByMonth(dataConnect, getAttendanceByMonthVars);

console.log(data.attendances);

// Or, you can use the `Promise` API.
getAttendanceByMonth(getAttendanceByMonthVars).then((response) => {
  const data = response.data;
  console.log(data.attendances);
});
```

### Using `GetAttendanceByMonth`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAttendanceByMonthRef, GetAttendanceByMonthVariables } from '@dashboard/dataconnect';

// The `GetAttendanceByMonth` query requires an argument of type `GetAttendanceByMonthVariables`:
const getAttendanceByMonthVars: GetAttendanceByMonthVariables = {
  startDate: ..., 
  endDate: ..., 
};

// Call the `getAttendanceByMonthRef()` function to get a reference to the query.
const ref = getAttendanceByMonthRef(getAttendanceByMonthVars);
// Variables can be defined inline as well.
const ref = getAttendanceByMonthRef({ startDate: ..., endDate: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAttendanceByMonthRef(dataConnect, getAttendanceByMonthVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.attendances);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.attendances);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertWeeklyPlan
You can execute the `UpsertWeeklyPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertWeeklyPlan(vars: UpsertWeeklyPlanVariables): MutationPromise<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;

interface UpsertWeeklyPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertWeeklyPlanVariables): MutationRef<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;
}
export const upsertWeeklyPlanRef: UpsertWeeklyPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertWeeklyPlan(dc: DataConnect, vars: UpsertWeeklyPlanVariables): MutationPromise<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;

interface UpsertWeeklyPlanRef {
  ...
  (dc: DataConnect, vars: UpsertWeeklyPlanVariables): MutationRef<UpsertWeeklyPlanData, UpsertWeeklyPlanVariables>;
}
export const upsertWeeklyPlanRef: UpsertWeeklyPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertWeeklyPlanRef:
```typescript
const name = upsertWeeklyPlanRef.operationName;
console.log(name);
```

### Variables
The `UpsertWeeklyPlan` mutation requires an argument of type `UpsertWeeklyPlanVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertWeeklyPlanVariables {
  id?: UUIDString | null;
  weekKey: string;
  day: string;
  period: number;
  subject?: string | null;
  content?: string | null;
}
```
### Return Type
Recall that executing the `UpsertWeeklyPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertWeeklyPlanData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertWeeklyPlanData {
  weeklyPlan_upsert: WeeklyPlan_Key;
}
```
### Using `UpsertWeeklyPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertWeeklyPlan, UpsertWeeklyPlanVariables } from '@dashboard/dataconnect';

// The `UpsertWeeklyPlan` mutation requires an argument of type `UpsertWeeklyPlanVariables`:
const upsertWeeklyPlanVars: UpsertWeeklyPlanVariables = {
  id: ..., // optional
  weekKey: ..., 
  day: ..., 
  period: ..., 
  subject: ..., // optional
  content: ..., // optional
};

// Call the `upsertWeeklyPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertWeeklyPlan(upsertWeeklyPlanVars);
// Variables can be defined inline as well.
const { data } = await upsertWeeklyPlan({ id: ..., weekKey: ..., day: ..., period: ..., subject: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertWeeklyPlan(dataConnect, upsertWeeklyPlanVars);

console.log(data.weeklyPlan_upsert);

// Or, you can use the `Promise` API.
upsertWeeklyPlan(upsertWeeklyPlanVars).then((response) => {
  const data = response.data;
  console.log(data.weeklyPlan_upsert);
});
```

### Using `UpsertWeeklyPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertWeeklyPlanRef, UpsertWeeklyPlanVariables } from '@dashboard/dataconnect';

// The `UpsertWeeklyPlan` mutation requires an argument of type `UpsertWeeklyPlanVariables`:
const upsertWeeklyPlanVars: UpsertWeeklyPlanVariables = {
  id: ..., // optional
  weekKey: ..., 
  day: ..., 
  period: ..., 
  subject: ..., // optional
  content: ..., // optional
};

// Call the `upsertWeeklyPlanRef()` function to get a reference to the mutation.
const ref = upsertWeeklyPlanRef(upsertWeeklyPlanVars);
// Variables can be defined inline as well.
const ref = upsertWeeklyPlanRef({ id: ..., weekKey: ..., day: ..., period: ..., subject: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertWeeklyPlanRef(dataConnect, upsertWeeklyPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.weeklyPlan_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.weeklyPlan_upsert);
});
```

## UpsertAppConfig
You can execute the `UpsertAppConfig` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertAppConfig(vars: UpsertAppConfigVariables): MutationPromise<UpsertAppConfigData, UpsertAppConfigVariables>;

interface UpsertAppConfigRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAppConfigVariables): MutationRef<UpsertAppConfigData, UpsertAppConfigVariables>;
}
export const upsertAppConfigRef: UpsertAppConfigRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAppConfig(dc: DataConnect, vars: UpsertAppConfigVariables): MutationPromise<UpsertAppConfigData, UpsertAppConfigVariables>;

interface UpsertAppConfigRef {
  ...
  (dc: DataConnect, vars: UpsertAppConfigVariables): MutationRef<UpsertAppConfigData, UpsertAppConfigVariables>;
}
export const upsertAppConfigRef: UpsertAppConfigRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAppConfigRef:
```typescript
const name = upsertAppConfigRef.operationName;
console.log(name);
```

### Variables
The `UpsertAppConfig` mutation requires an argument of type `UpsertAppConfigVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertAppConfigVariables {
  id: number;
  calendarId1?: string | null;
  calendarId2?: string | null;
  calendarId3?: string | null;
  thermometerGoal?: number | null;
  thermometerReward?: string | null;
}
```
### Return Type
Recall that executing the `UpsertAppConfig` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAppConfigData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAppConfigData {
  appConfig_upsert: AppConfig_Key;
}
```
### Using `UpsertAppConfig`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAppConfig, UpsertAppConfigVariables } from '@dashboard/dataconnect';

// The `UpsertAppConfig` mutation requires an argument of type `UpsertAppConfigVariables`:
const upsertAppConfigVars: UpsertAppConfigVariables = {
  id: ..., 
  calendarId1: ..., // optional
  calendarId2: ..., // optional
  calendarId3: ..., // optional
  thermometerGoal: ..., // optional
  thermometerReward: ..., // optional
};

// Call the `upsertAppConfig()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAppConfig(upsertAppConfigVars);
// Variables can be defined inline as well.
const { data } = await upsertAppConfig({ id: ..., calendarId1: ..., calendarId2: ..., calendarId3: ..., thermometerGoal: ..., thermometerReward: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAppConfig(dataConnect, upsertAppConfigVars);

console.log(data.appConfig_upsert);

// Or, you can use the `Promise` API.
upsertAppConfig(upsertAppConfigVars).then((response) => {
  const data = response.data;
  console.log(data.appConfig_upsert);
});
```

### Using `UpsertAppConfig`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAppConfigRef, UpsertAppConfigVariables } from '@dashboard/dataconnect';

// The `UpsertAppConfig` mutation requires an argument of type `UpsertAppConfigVariables`:
const upsertAppConfigVars: UpsertAppConfigVariables = {
  id: ..., 
  calendarId1: ..., // optional
  calendarId2: ..., // optional
  calendarId3: ..., // optional
  thermometerGoal: ..., // optional
  thermometerReward: ..., // optional
};

// Call the `upsertAppConfigRef()` function to get a reference to the mutation.
const ref = upsertAppConfigRef(upsertAppConfigVars);
// Variables can be defined inline as well.
const ref = upsertAppConfigRef({ id: ..., calendarId1: ..., calendarId2: ..., calendarId3: ..., thermometerGoal: ..., thermometerReward: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAppConfigRef(dataConnect, upsertAppConfigVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appConfig_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appConfig_upsert);
});
```

## InsertDDay
You can execute the `InsertDDay` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertDDay(vars: InsertDDayVariables): MutationPromise<InsertDDayData, InsertDDayVariables>;

interface InsertDDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertDDayVariables): MutationRef<InsertDDayData, InsertDDayVariables>;
}
export const insertDDayRef: InsertDDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertDDay(dc: DataConnect, vars: InsertDDayVariables): MutationPromise<InsertDDayData, InsertDDayVariables>;

interface InsertDDayRef {
  ...
  (dc: DataConnect, vars: InsertDDayVariables): MutationRef<InsertDDayData, InsertDDayVariables>;
}
export const insertDDayRef: InsertDDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertDDayRef:
```typescript
const name = insertDDayRef.operationName;
console.log(name);
```

### Variables
The `InsertDDay` mutation requires an argument of type `InsertDDayVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertDDayVariables {
  name: string;
  date: DateString;
}
```
### Return Type
Recall that executing the `InsertDDay` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertDDayData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertDDayData {
  dDay_insert: DDay_Key;
}
```
### Using `InsertDDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertDDay, InsertDDayVariables } from '@dashboard/dataconnect';

// The `InsertDDay` mutation requires an argument of type `InsertDDayVariables`:
const insertDDayVars: InsertDDayVariables = {
  name: ..., 
  date: ..., 
};

// Call the `insertDDay()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertDDay(insertDDayVars);
// Variables can be defined inline as well.
const { data } = await insertDDay({ name: ..., date: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertDDay(dataConnect, insertDDayVars);

console.log(data.dDay_insert);

// Or, you can use the `Promise` API.
insertDDay(insertDDayVars).then((response) => {
  const data = response.data;
  console.log(data.dDay_insert);
});
```

### Using `InsertDDay`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertDDayRef, InsertDDayVariables } from '@dashboard/dataconnect';

// The `InsertDDay` mutation requires an argument of type `InsertDDayVariables`:
const insertDDayVars: InsertDDayVariables = {
  name: ..., 
  date: ..., 
};

// Call the `insertDDayRef()` function to get a reference to the mutation.
const ref = insertDDayRef(insertDDayVars);
// Variables can be defined inline as well.
const ref = insertDDayRef({ name: ..., date: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertDDayRef(dataConnect, insertDDayVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dDay_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dDay_insert);
});
```

## DeleteDDay
You can execute the `DeleteDDay` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteDDay(vars: DeleteDDayVariables): MutationPromise<DeleteDDayData, DeleteDDayVariables>;

interface DeleteDDayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDDayVariables): MutationRef<DeleteDDayData, DeleteDDayVariables>;
}
export const deleteDDayRef: DeleteDDayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteDDay(dc: DataConnect, vars: DeleteDDayVariables): MutationPromise<DeleteDDayData, DeleteDDayVariables>;

interface DeleteDDayRef {
  ...
  (dc: DataConnect, vars: DeleteDDayVariables): MutationRef<DeleteDDayData, DeleteDDayVariables>;
}
export const deleteDDayRef: DeleteDDayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteDDayRef:
```typescript
const name = deleteDDayRef.operationName;
console.log(name);
```

### Variables
The `DeleteDDay` mutation requires an argument of type `DeleteDDayVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteDDayVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteDDay` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteDDayData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteDDayData {
  dDay_delete?: DDay_Key | null;
}
```
### Using `DeleteDDay`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteDDay, DeleteDDayVariables } from '@dashboard/dataconnect';

// The `DeleteDDay` mutation requires an argument of type `DeleteDDayVariables`:
const deleteDDayVars: DeleteDDayVariables = {
  id: ..., 
};

// Call the `deleteDDay()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteDDay(deleteDDayVars);
// Variables can be defined inline as well.
const { data } = await deleteDDay({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteDDay(dataConnect, deleteDDayVars);

console.log(data.dDay_delete);

// Or, you can use the `Promise` API.
deleteDDay(deleteDDayVars).then((response) => {
  const data = response.data;
  console.log(data.dDay_delete);
});
```

### Using `DeleteDDay`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteDDayRef, DeleteDDayVariables } from '@dashboard/dataconnect';

// The `DeleteDDay` mutation requires an argument of type `DeleteDDayVariables`:
const deleteDDayVars: DeleteDDayVariables = {
  id: ..., 
};

// Call the `deleteDDayRef()` function to get a reference to the mutation.
const ref = deleteDDayRef(deleteDDayVars);
// Variables can be defined inline as well.
const ref = deleteDDayRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteDDayRef(dataConnect, deleteDDayVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.dDay_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.dDay_delete);
});
```

## UpdateStudentPoints
You can execute the `UpdateStudentPoints` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateStudentPoints(vars: UpdateStudentPointsVariables): MutationPromise<UpdateStudentPointsData, UpdateStudentPointsVariables>;

interface UpdateStudentPointsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStudentPointsVariables): MutationRef<UpdateStudentPointsData, UpdateStudentPointsVariables>;
}
export const updateStudentPointsRef: UpdateStudentPointsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStudentPoints(dc: DataConnect, vars: UpdateStudentPointsVariables): MutationPromise<UpdateStudentPointsData, UpdateStudentPointsVariables>;

interface UpdateStudentPointsRef {
  ...
  (dc: DataConnect, vars: UpdateStudentPointsVariables): MutationRef<UpdateStudentPointsData, UpdateStudentPointsVariables>;
}
export const updateStudentPointsRef: UpdateStudentPointsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStudentPointsRef:
```typescript
const name = updateStudentPointsRef.operationName;
console.log(name);
```

### Variables
The `UpdateStudentPoints` mutation requires an argument of type `UpdateStudentPointsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStudentPointsVariables {
  id: UUIDString;
  points: number;
}
```
### Return Type
Recall that executing the `UpdateStudentPoints` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStudentPointsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStudentPointsData {
  student_update?: Student_Key | null;
}
```
### Using `UpdateStudentPoints`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStudentPoints, UpdateStudentPointsVariables } from '@dashboard/dataconnect';

// The `UpdateStudentPoints` mutation requires an argument of type `UpdateStudentPointsVariables`:
const updateStudentPointsVars: UpdateStudentPointsVariables = {
  id: ..., 
  points: ..., 
};

// Call the `updateStudentPoints()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStudentPoints(updateStudentPointsVars);
// Variables can be defined inline as well.
const { data } = await updateStudentPoints({ id: ..., points: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStudentPoints(dataConnect, updateStudentPointsVars);

console.log(data.student_update);

// Or, you can use the `Promise` API.
updateStudentPoints(updateStudentPointsVars).then((response) => {
  const data = response.data;
  console.log(data.student_update);
});
```

### Using `UpdateStudentPoints`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStudentPointsRef, UpdateStudentPointsVariables } from '@dashboard/dataconnect';

// The `UpdateStudentPoints` mutation requires an argument of type `UpdateStudentPointsVariables`:
const updateStudentPointsVars: UpdateStudentPointsVariables = {
  id: ..., 
  points: ..., 
};

// Call the `updateStudentPointsRef()` function to get a reference to the mutation.
const ref = updateStudentPointsRef(updateStudentPointsVars);
// Variables can be defined inline as well.
const ref = updateStudentPointsRef({ id: ..., points: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStudentPointsRef(dataConnect, updateStudentPointsVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.student_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.student_update);
});
```

## UpsertAttendance
You can execute the `UpsertAttendance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertAttendance(vars: UpsertAttendanceVariables): MutationPromise<UpsertAttendanceData, UpsertAttendanceVariables>;

interface UpsertAttendanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertAttendanceVariables): MutationRef<UpsertAttendanceData, UpsertAttendanceVariables>;
}
export const upsertAttendanceRef: UpsertAttendanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertAttendance(dc: DataConnect, vars: UpsertAttendanceVariables): MutationPromise<UpsertAttendanceData, UpsertAttendanceVariables>;

interface UpsertAttendanceRef {
  ...
  (dc: DataConnect, vars: UpsertAttendanceVariables): MutationRef<UpsertAttendanceData, UpsertAttendanceVariables>;
}
export const upsertAttendanceRef: UpsertAttendanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertAttendanceRef:
```typescript
const name = upsertAttendanceRef.operationName;
console.log(name);
```

### Variables
The `UpsertAttendance` mutation requires an argument of type `UpsertAttendanceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertAttendanceVariables {
  id?: UUIDString | null;
  studentId: UUIDString;
  date: DateString;
  status: string;
  note?: string | null;
}
```
### Return Type
Recall that executing the `UpsertAttendance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertAttendanceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertAttendanceData {
  attendance_upsert: Attendance_Key;
}
```
### Using `UpsertAttendance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertAttendance, UpsertAttendanceVariables } from '@dashboard/dataconnect';

// The `UpsertAttendance` mutation requires an argument of type `UpsertAttendanceVariables`:
const upsertAttendanceVars: UpsertAttendanceVariables = {
  id: ..., // optional
  studentId: ..., 
  date: ..., 
  status: ..., 
  note: ..., // optional
};

// Call the `upsertAttendance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertAttendance(upsertAttendanceVars);
// Variables can be defined inline as well.
const { data } = await upsertAttendance({ id: ..., studentId: ..., date: ..., status: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertAttendance(dataConnect, upsertAttendanceVars);

console.log(data.attendance_upsert);

// Or, you can use the `Promise` API.
upsertAttendance(upsertAttendanceVars).then((response) => {
  const data = response.data;
  console.log(data.attendance_upsert);
});
```

### Using `UpsertAttendance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertAttendanceRef, UpsertAttendanceVariables } from '@dashboard/dataconnect';

// The `UpsertAttendance` mutation requires an argument of type `UpsertAttendanceVariables`:
const upsertAttendanceVars: UpsertAttendanceVariables = {
  id: ..., // optional
  studentId: ..., 
  date: ..., 
  status: ..., 
  note: ..., // optional
};

// Call the `upsertAttendanceRef()` function to get a reference to the mutation.
const ref = upsertAttendanceRef(upsertAttendanceVars);
// Variables can be defined inline as well.
const ref = upsertAttendanceRef({ id: ..., studentId: ..., date: ..., status: ..., note: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertAttendanceRef(dataConnect, upsertAttendanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendance_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendance_upsert);
});
```

## DeleteAttendance
You can execute the `DeleteAttendance` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteAttendance(vars: DeleteAttendanceVariables): MutationPromise<DeleteAttendanceData, DeleteAttendanceVariables>;

interface DeleteAttendanceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAttendanceVariables): MutationRef<DeleteAttendanceData, DeleteAttendanceVariables>;
}
export const deleteAttendanceRef: DeleteAttendanceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAttendance(dc: DataConnect, vars: DeleteAttendanceVariables): MutationPromise<DeleteAttendanceData, DeleteAttendanceVariables>;

interface DeleteAttendanceRef {
  ...
  (dc: DataConnect, vars: DeleteAttendanceVariables): MutationRef<DeleteAttendanceData, DeleteAttendanceVariables>;
}
export const deleteAttendanceRef: DeleteAttendanceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAttendanceRef:
```typescript
const name = deleteAttendanceRef.operationName;
console.log(name);
```

### Variables
The `DeleteAttendance` mutation requires an argument of type `DeleteAttendanceVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAttendanceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAttendance` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAttendanceData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAttendanceData {
  attendance_delete?: Attendance_Key | null;
}
```
### Using `DeleteAttendance`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAttendance, DeleteAttendanceVariables } from '@dashboard/dataconnect';

// The `DeleteAttendance` mutation requires an argument of type `DeleteAttendanceVariables`:
const deleteAttendanceVars: DeleteAttendanceVariables = {
  id: ..., 
};

// Call the `deleteAttendance()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAttendance(deleteAttendanceVars);
// Variables can be defined inline as well.
const { data } = await deleteAttendance({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAttendance(dataConnect, deleteAttendanceVars);

console.log(data.attendance_delete);

// Or, you can use the `Promise` API.
deleteAttendance(deleteAttendanceVars).then((response) => {
  const data = response.data;
  console.log(data.attendance_delete);
});
```

### Using `DeleteAttendance`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAttendanceRef, DeleteAttendanceVariables } from '@dashboard/dataconnect';

// The `DeleteAttendance` mutation requires an argument of type `DeleteAttendanceVariables`:
const deleteAttendanceVars: DeleteAttendanceVariables = {
  id: ..., 
};

// Call the `deleteAttendanceRef()` function to get a reference to the mutation.
const ref = deleteAttendanceRef(deleteAttendanceVars);
// Variables can be defined inline as well.
const ref = deleteAttendanceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAttendanceRef(dataConnect, deleteAttendanceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.attendance_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.attendance_delete);
});
```

## InsertStudentRecord
You can execute the `InsertStudentRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
insertStudentRecord(vars: InsertStudentRecordVariables): MutationPromise<InsertStudentRecordData, InsertStudentRecordVariables>;

interface InsertStudentRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertStudentRecordVariables): MutationRef<InsertStudentRecordData, InsertStudentRecordVariables>;
}
export const insertStudentRecordRef: InsertStudentRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertStudentRecord(dc: DataConnect, vars: InsertStudentRecordVariables): MutationPromise<InsertStudentRecordData, InsertStudentRecordVariables>;

interface InsertStudentRecordRef {
  ...
  (dc: DataConnect, vars: InsertStudentRecordVariables): MutationRef<InsertStudentRecordData, InsertStudentRecordVariables>;
}
export const insertStudentRecordRef: InsertStudentRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertStudentRecordRef:
```typescript
const name = insertStudentRecordRef.operationName;
console.log(name);
```

### Variables
The `InsertStudentRecord` mutation requires an argument of type `InsertStudentRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertStudentRecordVariables {
  studentId: UUIDString;
  type: string;
  content?: string | null;
  category?: string | null;
  date: DateString;
}
```
### Return Type
Recall that executing the `InsertStudentRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertStudentRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertStudentRecordData {
  studentRecord_insert: StudentRecord_Key;
}
```
### Using `InsertStudentRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertStudentRecord, InsertStudentRecordVariables } from '@dashboard/dataconnect';

// The `InsertStudentRecord` mutation requires an argument of type `InsertStudentRecordVariables`:
const insertStudentRecordVars: InsertStudentRecordVariables = {
  studentId: ..., 
  type: ..., 
  content: ..., // optional
  category: ..., // optional
  date: ..., 
};

// Call the `insertStudentRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertStudentRecord(insertStudentRecordVars);
// Variables can be defined inline as well.
const { data } = await insertStudentRecord({ studentId: ..., type: ..., content: ..., category: ..., date: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertStudentRecord(dataConnect, insertStudentRecordVars);

console.log(data.studentRecord_insert);

// Or, you can use the `Promise` API.
insertStudentRecord(insertStudentRecordVars).then((response) => {
  const data = response.data;
  console.log(data.studentRecord_insert);
});
```

### Using `InsertStudentRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertStudentRecordRef, InsertStudentRecordVariables } from '@dashboard/dataconnect';

// The `InsertStudentRecord` mutation requires an argument of type `InsertStudentRecordVariables`:
const insertStudentRecordVars: InsertStudentRecordVariables = {
  studentId: ..., 
  type: ..., 
  content: ..., // optional
  category: ..., // optional
  date: ..., 
};

// Call the `insertStudentRecordRef()` function to get a reference to the mutation.
const ref = insertStudentRecordRef(insertStudentRecordVars);
// Variables can be defined inline as well.
const ref = insertStudentRecordRef({ studentId: ..., type: ..., content: ..., category: ..., date: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertStudentRecordRef(dataConnect, insertStudentRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studentRecord_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studentRecord_insert);
});
```

## DeleteStudentRecord
You can execute the `DeleteStudentRecord` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteStudentRecord(vars: DeleteStudentRecordVariables): MutationPromise<DeleteStudentRecordData, DeleteStudentRecordVariables>;

interface DeleteStudentRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStudentRecordVariables): MutationRef<DeleteStudentRecordData, DeleteStudentRecordVariables>;
}
export const deleteStudentRecordRef: DeleteStudentRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStudentRecord(dc: DataConnect, vars: DeleteStudentRecordVariables): MutationPromise<DeleteStudentRecordData, DeleteStudentRecordVariables>;

interface DeleteStudentRecordRef {
  ...
  (dc: DataConnect, vars: DeleteStudentRecordVariables): MutationRef<DeleteStudentRecordData, DeleteStudentRecordVariables>;
}
export const deleteStudentRecordRef: DeleteStudentRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStudentRecordRef:
```typescript
const name = deleteStudentRecordRef.operationName;
console.log(name);
```

### Variables
The `DeleteStudentRecord` mutation requires an argument of type `DeleteStudentRecordVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStudentRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStudentRecord` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStudentRecordData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStudentRecordData {
  studentRecord_delete?: StudentRecord_Key | null;
}
```
### Using `DeleteStudentRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStudentRecord, DeleteStudentRecordVariables } from '@dashboard/dataconnect';

// The `DeleteStudentRecord` mutation requires an argument of type `DeleteStudentRecordVariables`:
const deleteStudentRecordVars: DeleteStudentRecordVariables = {
  id: ..., 
};

// Call the `deleteStudentRecord()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStudentRecord(deleteStudentRecordVars);
// Variables can be defined inline as well.
const { data } = await deleteStudentRecord({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStudentRecord(dataConnect, deleteStudentRecordVars);

console.log(data.studentRecord_delete);

// Or, you can use the `Promise` API.
deleteStudentRecord(deleteStudentRecordVars).then((response) => {
  const data = response.data;
  console.log(data.studentRecord_delete);
});
```

### Using `DeleteStudentRecord`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStudentRecordRef, DeleteStudentRecordVariables } from '@dashboard/dataconnect';

// The `DeleteStudentRecord` mutation requires an argument of type `DeleteStudentRecordVariables`:
const deleteStudentRecordVars: DeleteStudentRecordVariables = {
  id: ..., 
};

// Call the `deleteStudentRecordRef()` function to get a reference to the mutation.
const ref = deleteStudentRecordRef(deleteStudentRecordVars);
// Variables can be defined inline as well.
const ref = deleteStudentRecordRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStudentRecordRef(dataConnect, deleteStudentRecordVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.studentRecord_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.studentRecord_delete);
});
```

## UpdatePoll
You can execute the `UpdatePoll` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updatePoll(vars: UpdatePollVariables): MutationPromise<UpdatePollData, UpdatePollVariables>;

interface UpdatePollRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePollVariables): MutationRef<UpdatePollData, UpdatePollVariables>;
}
export const updatePollRef: UpdatePollRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePoll(dc: DataConnect, vars: UpdatePollVariables): MutationPromise<UpdatePollData, UpdatePollVariables>;

interface UpdatePollRef {
  ...
  (dc: DataConnect, vars: UpdatePollVariables): MutationRef<UpdatePollData, UpdatePollVariables>;
}
export const updatePollRef: UpdatePollRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePollRef:
```typescript
const name = updatePollRef.operationName;
console.log(name);
```

### Variables
The `UpdatePoll` mutation requires an argument of type `UpdatePollVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePollVariables {
  id: UUIDString;
  votes: number[];
}
```
### Return Type
Recall that executing the `UpdatePoll` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePollData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePollData {
  poll_update?: Poll_Key | null;
}
```
### Using `UpdatePoll`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePoll, UpdatePollVariables } from '@dashboard/dataconnect';

// The `UpdatePoll` mutation requires an argument of type `UpdatePollVariables`:
const updatePollVars: UpdatePollVariables = {
  id: ..., 
  votes: ..., 
};

// Call the `updatePoll()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePoll(updatePollVars);
// Variables can be defined inline as well.
const { data } = await updatePoll({ id: ..., votes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePoll(dataConnect, updatePollVars);

console.log(data.poll_update);

// Or, you can use the `Promise` API.
updatePoll(updatePollVars).then((response) => {
  const data = response.data;
  console.log(data.poll_update);
});
```

### Using `UpdatePoll`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePollRef, UpdatePollVariables } from '@dashboard/dataconnect';

// The `UpdatePoll` mutation requires an argument of type `UpdatePollVariables`:
const updatePollVars: UpdatePollVariables = {
  id: ..., 
  votes: ..., 
};

// Call the `updatePollRef()` function to get a reference to the mutation.
const ref = updatePollRef(updatePollVars);
// Variables can be defined inline as well.
const ref = updatePollRef({ id: ..., votes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePollRef(dataConnect, updatePollVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.poll_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.poll_update);
});
```

## UpdateNewsletter
You can execute the `UpdateNewsletter` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateNewsletter(vars: UpdateNewsletterVariables): MutationPromise<UpdateNewsletterData, UpdateNewsletterVariables>;

interface UpdateNewsletterRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNewsletterVariables): MutationRef<UpdateNewsletterData, UpdateNewsletterVariables>;
}
export const updateNewsletterRef: UpdateNewsletterRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateNewsletter(dc: DataConnect, vars: UpdateNewsletterVariables): MutationPromise<UpdateNewsletterData, UpdateNewsletterVariables>;

interface UpdateNewsletterRef {
  ...
  (dc: DataConnect, vars: UpdateNewsletterVariables): MutationRef<UpdateNewsletterData, UpdateNewsletterVariables>;
}
export const updateNewsletterRef: UpdateNewsletterRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateNewsletterRef:
```typescript
const name = updateNewsletterRef.operationName;
console.log(name);
```

### Variables
The `UpdateNewsletter` mutation requires an argument of type `UpdateNewsletterVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateNewsletterVariables {
  id: UUIDString;
  collected: boolean;
}
```
### Return Type
Recall that executing the `UpdateNewsletter` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateNewsletterData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateNewsletterData {
  newsletter_update?: Newsletter_Key | null;
}
```
### Using `UpdateNewsletter`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateNewsletter, UpdateNewsletterVariables } from '@dashboard/dataconnect';

// The `UpdateNewsletter` mutation requires an argument of type `UpdateNewsletterVariables`:
const updateNewsletterVars: UpdateNewsletterVariables = {
  id: ..., 
  collected: ..., 
};

// Call the `updateNewsletter()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateNewsletter(updateNewsletterVars);
// Variables can be defined inline as well.
const { data } = await updateNewsletter({ id: ..., collected: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateNewsletter(dataConnect, updateNewsletterVars);

console.log(data.newsletter_update);

// Or, you can use the `Promise` API.
updateNewsletter(updateNewsletterVars).then((response) => {
  const data = response.data;
  console.log(data.newsletter_update);
});
```

### Using `UpdateNewsletter`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateNewsletterRef, UpdateNewsletterVariables } from '@dashboard/dataconnect';

// The `UpdateNewsletter` mutation requires an argument of type `UpdateNewsletterVariables`:
const updateNewsletterVars: UpdateNewsletterVariables = {
  id: ..., 
  collected: ..., 
};

// Call the `updateNewsletterRef()` function to get a reference to the mutation.
const ref = updateNewsletterRef(updateNewsletterVars);
// Variables can be defined inline as well.
const ref = updateNewsletterRef({ id: ..., collected: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateNewsletterRef(dataConnect, updateNewsletterVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.newsletter_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.newsletter_update);
});
```

## UpsertActivityCompletion
You can execute the `UpsertActivityCompletion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertActivityCompletion(vars: UpsertActivityCompletionVariables): MutationPromise<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;

interface UpsertActivityCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityCompletionVariables): MutationRef<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;
}
export const upsertActivityCompletionRef: UpsertActivityCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertActivityCompletion(dc: DataConnect, vars: UpsertActivityCompletionVariables): MutationPromise<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;

interface UpsertActivityCompletionRef {
  ...
  (dc: DataConnect, vars: UpsertActivityCompletionVariables): MutationRef<UpsertActivityCompletionData, UpsertActivityCompletionVariables>;
}
export const upsertActivityCompletionRef: UpsertActivityCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertActivityCompletionRef:
```typescript
const name = upsertActivityCompletionRef.operationName;
console.log(name);
```

### Variables
The `UpsertActivityCompletion` mutation requires an argument of type `UpsertActivityCompletionVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertActivityCompletionVariables {
  id?: UUIDString | null;
  studentId: UUIDString;
  timestamp: TimestampString;
}
```
### Return Type
Recall that executing the `UpsertActivityCompletion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertActivityCompletionData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertActivityCompletionData {
  activityCompletion_upsert: ActivityCompletion_Key;
}
```
### Using `UpsertActivityCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertActivityCompletion, UpsertActivityCompletionVariables } from '@dashboard/dataconnect';

// The `UpsertActivityCompletion` mutation requires an argument of type `UpsertActivityCompletionVariables`:
const upsertActivityCompletionVars: UpsertActivityCompletionVariables = {
  id: ..., // optional
  studentId: ..., 
  timestamp: ..., 
};

// Call the `upsertActivityCompletion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertActivityCompletion(upsertActivityCompletionVars);
// Variables can be defined inline as well.
const { data } = await upsertActivityCompletion({ id: ..., studentId: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertActivityCompletion(dataConnect, upsertActivityCompletionVars);

console.log(data.activityCompletion_upsert);

// Or, you can use the `Promise` API.
upsertActivityCompletion(upsertActivityCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.activityCompletion_upsert);
});
```

### Using `UpsertActivityCompletion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertActivityCompletionRef, UpsertActivityCompletionVariables } from '@dashboard/dataconnect';

// The `UpsertActivityCompletion` mutation requires an argument of type `UpsertActivityCompletionVariables`:
const upsertActivityCompletionVars: UpsertActivityCompletionVariables = {
  id: ..., // optional
  studentId: ..., 
  timestamp: ..., 
};

// Call the `upsertActivityCompletionRef()` function to get a reference to the mutation.
const ref = upsertActivityCompletionRef(upsertActivityCompletionVars);
// Variables can be defined inline as well.
const ref = upsertActivityCompletionRef({ id: ..., studentId: ..., timestamp: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertActivityCompletionRef(dataConnect, upsertActivityCompletionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityCompletion_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityCompletion_upsert);
});
```

## DeleteActivityCompletion
You can execute the `DeleteActivityCompletion` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteActivityCompletion(vars: DeleteActivityCompletionVariables): MutationPromise<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;

interface DeleteActivityCompletionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityCompletionVariables): MutationRef<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;
}
export const deleteActivityCompletionRef: DeleteActivityCompletionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteActivityCompletion(dc: DataConnect, vars: DeleteActivityCompletionVariables): MutationPromise<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;

interface DeleteActivityCompletionRef {
  ...
  (dc: DataConnect, vars: DeleteActivityCompletionVariables): MutationRef<DeleteActivityCompletionData, DeleteActivityCompletionVariables>;
}
export const deleteActivityCompletionRef: DeleteActivityCompletionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteActivityCompletionRef:
```typescript
const name = deleteActivityCompletionRef.operationName;
console.log(name);
```

### Variables
The `DeleteActivityCompletion` mutation requires an argument of type `DeleteActivityCompletionVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteActivityCompletionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteActivityCompletion` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteActivityCompletionData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteActivityCompletionData {
  activityCompletion_delete?: ActivityCompletion_Key | null;
}
```
### Using `DeleteActivityCompletion`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteActivityCompletion, DeleteActivityCompletionVariables } from '@dashboard/dataconnect';

// The `DeleteActivityCompletion` mutation requires an argument of type `DeleteActivityCompletionVariables`:
const deleteActivityCompletionVars: DeleteActivityCompletionVariables = {
  id: ..., 
};

// Call the `deleteActivityCompletion()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteActivityCompletion(deleteActivityCompletionVars);
// Variables can be defined inline as well.
const { data } = await deleteActivityCompletion({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteActivityCompletion(dataConnect, deleteActivityCompletionVars);

console.log(data.activityCompletion_delete);

// Or, you can use the `Promise` API.
deleteActivityCompletion(deleteActivityCompletionVars).then((response) => {
  const data = response.data;
  console.log(data.activityCompletion_delete);
});
```

### Using `DeleteActivityCompletion`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteActivityCompletionRef, DeleteActivityCompletionVariables } from '@dashboard/dataconnect';

// The `DeleteActivityCompletion` mutation requires an argument of type `DeleteActivityCompletionVariables`:
const deleteActivityCompletionVars: DeleteActivityCompletionVariables = {
  id: ..., 
};

// Call the `deleteActivityCompletionRef()` function to get a reference to the mutation.
const ref = deleteActivityCompletionRef(deleteActivityCompletionVars);
// Variables can be defined inline as well.
const ref = deleteActivityCompletionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteActivityCompletionRef(dataConnect, deleteActivityCompletionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityCompletion_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityCompletion_delete);
});
```

## UpsertActivityCheck
You can execute the `UpsertActivityCheck` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertActivityCheck(vars: UpsertActivityCheckVariables): MutationPromise<UpsertActivityCheckData, UpsertActivityCheckVariables>;

interface UpsertActivityCheckRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertActivityCheckVariables): MutationRef<UpsertActivityCheckData, UpsertActivityCheckVariables>;
}
export const upsertActivityCheckRef: UpsertActivityCheckRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertActivityCheck(dc: DataConnect, vars: UpsertActivityCheckVariables): MutationPromise<UpsertActivityCheckData, UpsertActivityCheckVariables>;

interface UpsertActivityCheckRef {
  ...
  (dc: DataConnect, vars: UpsertActivityCheckVariables): MutationRef<UpsertActivityCheckData, UpsertActivityCheckVariables>;
}
export const upsertActivityCheckRef: UpsertActivityCheckRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertActivityCheckRef:
```typescript
const name = upsertActivityCheckRef.operationName;
console.log(name);
```

### Variables
The `UpsertActivityCheck` mutation requires an argument of type `UpsertActivityCheckVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertActivityCheckVariables {
  id: number;
  content?: string | null;
  type?: string | null;
}
```
### Return Type
Recall that executing the `UpsertActivityCheck` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertActivityCheckData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertActivityCheckData {
  activityCheck_upsert: ActivityCheck_Key;
}
```
### Using `UpsertActivityCheck`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertActivityCheck, UpsertActivityCheckVariables } from '@dashboard/dataconnect';

// The `UpsertActivityCheck` mutation requires an argument of type `UpsertActivityCheckVariables`:
const upsertActivityCheckVars: UpsertActivityCheckVariables = {
  id: ..., 
  content: ..., // optional
  type: ..., // optional
};

// Call the `upsertActivityCheck()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertActivityCheck(upsertActivityCheckVars);
// Variables can be defined inline as well.
const { data } = await upsertActivityCheck({ id: ..., content: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertActivityCheck(dataConnect, upsertActivityCheckVars);

console.log(data.activityCheck_upsert);

// Or, you can use the `Promise` API.
upsertActivityCheck(upsertActivityCheckVars).then((response) => {
  const data = response.data;
  console.log(data.activityCheck_upsert);
});
```

### Using `UpsertActivityCheck`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertActivityCheckRef, UpsertActivityCheckVariables } from '@dashboard/dataconnect';

// The `UpsertActivityCheck` mutation requires an argument of type `UpsertActivityCheckVariables`:
const upsertActivityCheckVars: UpsertActivityCheckVariables = {
  id: ..., 
  content: ..., // optional
  type: ..., // optional
};

// Call the `upsertActivityCheckRef()` function to get a reference to the mutation.
const ref = upsertActivityCheckRef(upsertActivityCheckVars);
// Variables can be defined inline as well.
const ref = upsertActivityCheckRef({ id: ..., content: ..., type: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertActivityCheckRef(dataConnect, upsertActivityCheckVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.activityCheck_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.activityCheck_upsert);
});
```

## UpdateStudent
You can execute the `UpdateStudent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateStudent(vars: UpdateStudentVariables): MutationPromise<UpdateStudentData, UpdateStudentVariables>;

interface UpdateStudentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStudentVariables): MutationRef<UpdateStudentData, UpdateStudentVariables>;
}
export const updateStudentRef: UpdateStudentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStudent(dc: DataConnect, vars: UpdateStudentVariables): MutationPromise<UpdateStudentData, UpdateStudentVariables>;

interface UpdateStudentRef {
  ...
  (dc: DataConnect, vars: UpdateStudentVariables): MutationRef<UpdateStudentData, UpdateStudentVariables>;
}
export const updateStudentRef: UpdateStudentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStudentRef:
```typescript
const name = updateStudentRef.operationName;
console.log(name);
```

### Variables
The `UpdateStudent` mutation requires an argument of type `UpdateStudentVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStudentVariables {
  id: UUIDString;
  name?: string | null;
  number?: number | null;
}
```
### Return Type
Recall that executing the `UpdateStudent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStudentData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStudentData {
  student_update?: Student_Key | null;
}
```
### Using `UpdateStudent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStudent, UpdateStudentVariables } from '@dashboard/dataconnect';

// The `UpdateStudent` mutation requires an argument of type `UpdateStudentVariables`:
const updateStudentVars: UpdateStudentVariables = {
  id: ..., 
  name: ..., // optional
  number: ..., // optional
};

// Call the `updateStudent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStudent(updateStudentVars);
// Variables can be defined inline as well.
const { data } = await updateStudent({ id: ..., name: ..., number: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStudent(dataConnect, updateStudentVars);

console.log(data.student_update);

// Or, you can use the `Promise` API.
updateStudent(updateStudentVars).then((response) => {
  const data = response.data;
  console.log(data.student_update);
});
```

### Using `UpdateStudent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStudentRef, UpdateStudentVariables } from '@dashboard/dataconnect';

// The `UpdateStudent` mutation requires an argument of type `UpdateStudentVariables`:
const updateStudentVars: UpdateStudentVariables = {
  id: ..., 
  name: ..., // optional
  number: ..., // optional
};

// Call the `updateStudentRef()` function to get a reference to the mutation.
const ref = updateStudentRef(updateStudentVars);
// Variables can be defined inline as well.
const ref = updateStudentRef({ id: ..., name: ..., number: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStudentRef(dataConnect, updateStudentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.student_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.student_update);
});
```

