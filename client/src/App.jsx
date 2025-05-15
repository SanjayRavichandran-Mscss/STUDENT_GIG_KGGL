import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Registration } from './components/Registration/Registration';
import {
  StudentDashboard,
  StudentProfile,
  StudentProjectDetail,
  StudentAssignedTests,
  StudentEntryTest
} from './components/Dashboard/student_dashboard/Studentdashboard';
import AttendQuiz from './components/Dashboard/student_dashboard/Quiz/AttendQuiz';
import ProfileUpdate from './components/Dashboard/student_dashboard/ProfileUpdate';
import Dash, {
  Dashprofile,
  Dashstudent,
  Dashproject,
  DashAllProjects,
  DashBit,
  AddQuizzes,
  AddQuizzesWithAI,
  AssigningQuizz,
  TestCreationComponent,
  AssignTestComponent
} from './components/Dashboard/admin_dashboard/Dash';
import ForgotPassword from './components/Dashboard/Password/ForgotPassword';
import ResetPassword from './components/Dashboard/Password/ResetPassword';
import HomePage from './components/LandingPage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reg" element={<Registration />} />
        <Route path="/student/:id" element={<StudentDashboard />} />
        <Route path="/quiz/:id/:testId" element={<AttendQuiz />} />
        <Route path="/profile/:id" element={<StudentProfile />} />
        <Route path="/update/:id" element={<ProfileUpdate />} />
        <Route path="/detail/:id/:proid" element={<StudentProjectDetail />} />
        <Route path="/assigned-tests/:id" element={<StudentAssignedTests />} />
        <Route path="/entry-test/:id" element={<StudentEntryTest />} />
        <Route path="/bitconfirm/:id" element={<DashBit />} />
        {/* Admin Routes */}
        <Route path="/manager/:id" element={<Dash />} />
        <Route path="/dash/:id" element={<Dash />} />
        <Route path="/studata/:id" element={<Dashstudent />} />
        <Route path="/addproject/:id" element={<Dashproject />} />
        <Route path="/getprojects/:id" element={<DashAllProjects />} />
        <Route path="/add-quiz/:id" element={<AddQuizzes />} />
        <Route path="/aiquiz/:id" element={<AddQuizzesWithAI />} />
        <Route path="/assignquiz/:id" element={<AssigningQuizz />} />
        <Route path="/create-test/:id" element={<TestCreationComponent />} />
        <Route path="/assign-test/:id" element={<AssignTestComponent />} />
        {/* Forgot Password */}
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;