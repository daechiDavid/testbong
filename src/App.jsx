import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import AttendancePage from './pages/AttendancePage'
import LearningPage from './pages/LearningPage'
import CalendarPage from './pages/CalendarPage'
import ToolsPage from './pages/ToolsPage'
import WeeklyPlanPage from './pages/WeeklyPlanPage'
import LinksPage from './pages/LinksPage'
import Toast from './components/common/Toast'

export default function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/weekly" element={<WeeklyPlanPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <Toast />
    </>
  )
}
