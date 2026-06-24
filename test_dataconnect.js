require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getDataConnect } = require('firebase/data-connect');
const { connectorConfig, upsertAttendance } = require('./src/lib/dataconnect/index.cjs.js');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const dc = getDataConnect(app, connectorConfig);

async function test() {
  try {
    console.log('Testing upsertAttendance...');
    const { getAllAppData } = require('./src/lib/dataconnect/index.cjs.js');
    const { data: allData } = await getAllAppData(dc);
    if (!allData.students || allData.students.length === 0) {
      console.log('No students found');
      return;
    }
    const studentId = allData.students[0].id;
    console.log('Found student:', studentId);

    const res = await upsertAttendance(dc, {
      studentId: studentId,
      date: '2026-06-24',
      status: 'present',
      note: 'test script'
    });
    console.log('Upsert successful:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}

test();
