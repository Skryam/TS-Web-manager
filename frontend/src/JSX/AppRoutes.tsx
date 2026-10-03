import { Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome.tsx';
import UsersList from './pages/user/UsersList.tsx';
import StatusesList from './pages/status/StatusesList.tsx';
import NewUser from './pages/user/NewUser.tsx';
import Login from './pages/Login.tsx';
import EditUser from './pages/user/EditUser.tsx';
import EditStatus from './pages/status/EditStatus.tsx';
import NewStatus from './pages/status/NewStatus.tsx';
import ProtectedLayout from './pages/ProtectedLayout.tsx';
import LabelsList from './pages/label/LabelsList.tsx';
import NewLabel from './pages/label/NewLabel.tsx';
import EditLabel from './pages/label/EditLabel.tsx';
import TasksList from './pages/task/TasksList.tsx';
import NewTask from './pages/task/NewTask.tsx';
import ViewTask from './pages/task/ViewTask.tsx';
import EditTask from './pages/task/EditTask.tsx';
import EditPassword from './pages/user/EditPassword.tsx';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/users" element={<UsersList />} />
    <Route path="/newUser" element={<NewUser />} />
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedLayout />}>
      <Route path="/users/:id/edit" element={<EditUser />} />
      <Route path="/users/:id/edit/password" element={<EditPassword />} />

      <Route path="/statuses" element={<StatusesList />} />
      <Route path="/statuses/create" element={<NewStatus />} />
      <Route path="/statuses/:id/edit" element={<EditStatus />} />

      <Route path="/labels" element={<LabelsList />} />
      <Route path="/labels/create" element={<NewLabel />} />
      <Route path="/labels/:id/edit" element={<EditLabel />} />

      <Route path="/tasks" element={<TasksList />} />
      <Route path="/tasks/create" element={<NewTask />} />
      <Route path="/tasks/:id" element={<ViewTask />} />
      <Route path="/tasks/:id/edit" element={<EditTask />} />
    </Route>
  </Routes>
);
