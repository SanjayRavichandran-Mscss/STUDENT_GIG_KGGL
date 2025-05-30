// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import { Login } from './components/Login/Login';
// import { Registration } from './components/Registration/Registration';
// import {
//   StudentDashboard,
//   StudentProfile,
//   StudentProjectDetail,
//   StudentMyTests,
//   StudentEntryTest,
//   StudentSkillTest,
//   StudentScore,
// } from './components/Dashboard/student_dashboard/Studentdashboard';
// import ProfileUpdate from './components/Dashboard/student_dashboard/ProfileUpdate';
// import {
//   Dash,
//   Dashstudent,
//   Dashproject,
//   DashAllProjects,
//   DashBit,
//   AddQuizzes,
//   AddQuizzesWithAI,
//   AssigningQuizz,
//   TestCreationComponent,
//   AssignTestComponent,
//   Addskillpage,
//   Scorearea,
//   AddBulkQuestionsComponent,
//   ApprovedProjectsComponent,
//   ViewQuestionsComponent
// } from './components/Dashboard/admin_dashboard/AdminDashboard';
// import ForgotPassword from './components/Dashboard/Password/ForgotPassword';
// import HomePage from './components/LandingPage/HomePage';
// import InterviewSchedule from './components/Dashboard/student_dashboard/InterviewSchedule';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/reg" element={<Registration />} />
//         <Route path="/forgot" element={<ForgotPassword />} />
//         <Route element={<ProtectedRoute />}>
//           <Route path="/student/:id" element={<StudentDashboard />} />
//           <Route path="/profile/:id" element={<StudentProfile />} />
//           <Route path="/update/:id" element={<ProfileUpdate />} />
//           <Route path="/detail/:id/:proid/:credits" element={<StudentProjectDetail />} />
//           <Route path="/my-tests/:id" element={<StudentMyTests />} />
//           <Route path="/entry-test/:id" element={<StudentEntryTest />} />
//           <Route path="/score/:id" element={<StudentScore />} />
//           <Route path="/attend-test/:id/:testId/:type" element={<StudentSkillTest />} />
//           <Route path="/quiz/:id/:testId" element={<StudentSkillTest />} />
//           <Route path="/skill-test/:id/:testId" element={<StudentSkillTest />} />
//           <Route path="/interview-details/:id" element={<InterviewSchedule />} />
//           <Route path="/manager/:id" element={<Dash />} />
//           <Route path="/dash/:id" element={<Dash />} />
//           <Route path="/studata/:id" element={<Dashstudent />} />
//           <Route path="/addproject/:id" element={<Dashproject />} />
//           <Route path="/getprojects/:id" element={<DashAllProjects />} />
//           <Route path="/addquestion/:id" element={<AddQuizzes />} />
//           <Route path="/add-quiz/:id" element={<AddQuizzes />} />
//           <Route path="/aiquiz/:id" element={<AddQuizzesWithAI />} />
//           <Route path="/assignquiz/:id" element={<AssigningQuizz />} />
//           <Route path="/create-test/:id" element={<TestCreationComponent />} />
//           <Route path="/assign-test/:id" element={<AssignTestComponent />} />
//           <Route path="/bulk-questions/:id" element={<AddBulkQuestionsComponent />} />
//           <Route path="/approved-projects/:id" element={<ApprovedProjectsComponent />} />
//           <Route path="/bitconfirm/:id" element={<DashBit />} />
//           <Route path="/addskill" element={<Addskillpage />} />
//           <Route path="/studentscore" element={<Scorearea />} />
//           <Route path="/view-questions/:id" element={<ViewQuestionsComponent />} />
//         </Route>
//         <Route path="*" element={<div>404 - Page Not Found</div>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { Login } from './components/Login/Login';
import { Registration } from './components/Registration/Registration';
import {
  StudentDashboard,
  StudentProfile,
  StudentProjectDetail,
  StudentMyTests,
  StudentEntryTest,
  StudentSkillTest,
  StudentScore,
} from './components/Dashboard/student_dashboard/Studentdashboard';
import ProfileUpdate from './components/Dashboard/student_dashboard/ProfileUpdate';
import {
  Dash,
  Dashstudent,
  Dashproject,
  DashAllProjects,
  DashBit,
  AddQuizzes,
  AddQuizzesWithAI,
  AssigningQuizz,
  TestCreationComponent,
  AssignTestComponent,
  Addskillpage,
  Scorearea,
  AddBulkQuestionsComponent,
  ApprovedProjectsComponent,
  ViewQuestionsComponent,
  NonTechStudents,
} from './components/Dashboard/admin_dashboard/AdminDashboard';
import ForgotPassword from './components/Dashboard/Password/ForgotPassword';
import HomePage from './components/LandingPage/HomePage';
import InterviewSchedule from './components/Dashboard/student_dashboard/InterviewSchedule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reg" element={<Registration />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/student/:id" element={<StudentDashboard />} />
          <Route path="/profile/:id" element={<StudentProfile />} />
          <Route path="/update/:id" element={<ProfileUpdate />} />
          <Route path="/detail/:id/:proid/:credits" element={<StudentProjectDetail />} />
          <Route path="/my-tests/:id" element={<StudentMyTests />} />
          <Route path="/entry-test/:id" element={<StudentEntryTest />} />
          <Route path="/score/:id" element={<StudentScore />} />
          <Route path="/attend-test/:id/:testId/:type" element={<StudentSkillTest />} />
          <Route path="/quiz/:id/:testId" element={<StudentSkillTest />} />
          <Route path="/skill-test/:id/:testId" element={<StudentSkillTest />} />
          <Route path="/interview-details/:id" element={<InterviewSchedule />} />
          <Route path="/manager/:id" element={<Dash />} />
          <Route path="/dash/:id" element={<Dash />} />
          <Route path="/studata/:id" element={<Dashstudent />} />
          <Route path="/non-tech-students/:id" element={<NonTechStudents />} />
          <Route path="/addproject/:id" element={<Dashproject />} />
          <Route path="/getprojects/:id" element={<DashAllProjects />} />
          <Route path="/addquestion/:id" element={<AddQuizzes />} />
          <Route path="/add-quiz/:id" element={<AddQuizzes />} />
          <Route path="/aiquiz/:id" element={<AddQuizzesWithAI />} />
          <Route path="/assignquiz/:id" element={<AssigningQuizz />} />
          <Route path="/create-test/:id" element={<TestCreationComponent />} />
          <Route path="/assign-test/:id" element={<AssignTestComponent />} />
          <Route path="/bulk-questions/:id" element={<AddBulkQuestionsComponent />} />
          <Route path="/approved-projects/:id" element={<ApprovedProjectsComponent />} />
          <Route path="/bitconfirm/:id" element={<DashBit />} />
          <Route path="/addskill" element={<Addskillpage />} />
          <Route path="/studentscore" element={<Scorearea />} />
          <Route path="/view-questions/:id" element={<ViewQuestionsComponent />} />
        </Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;