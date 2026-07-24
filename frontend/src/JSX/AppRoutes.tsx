import { Routes, Route } from "react-router-dom"

import Welcome from './pages/Welcome.tsx'
import UsersList from './pages/user/UsersList.tsx';
import StatusesList from './pages/status/StatusesList.tsx';
import NewUser from './pages/user/NewUser.tsx';
import Login from './pages/Login.tsx';
import EditUser from './pages/user/EditUser.tsx';
import EditStatus from './pages/status/EditStatus.tsx';
import NewStatus from './pages/status/NewStatus.tsx';
import ProtectedLayout from './pages/ProtectedLayout.tsx';
import LabelsList from "./pages/label/LabelsList.tsx";
import NewLabel from "./pages/label/NewLabel.tsx";
import EditLabel from "./pages/label/EditLabel.tsx";
import TasksList from "./pages/task/TasksList.tsx";
import NewTask from "./pages/task/NewTask.tsx";
import ViewTask from "./pages/task/ViewTask.tsx";
import EditTask from "./pages/task/EditTask.tsx";

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<Welcome />} />
    <Route path='/users' element={<UsersList />} />
    <Route path='/newUser' element={<NewUser />} />
    <Route path='/login' element={<Login />} />
    <Route element={<ProtectedLayout />}>
      <Route path='/statuses' element={<StatusesList />} />
      <Route path='/editUser/:id' element={<EditUser />} />
      <Route path='/newStatus' element={<NewStatus />} />
      <Route path='/editStatus/:id' element={<EditStatus />} />
      <Route path='/labels' element={<LabelsList />} />
      <Route path='/newLabel' element={<NewLabel />} />
      <Route path='/editLabel/:id' element={<EditLabel />} />
      <Route path='/tasks' element={<TasksList />} />
      <Route path='/newTask' element={<NewTask />} />
      <Route path='/viewTask/:id' element={<ViewTask />} />
      <Route path='/editTask/:id' element={<EditTask />} />
    </Route>
  </Routes>
)