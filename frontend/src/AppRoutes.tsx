import { Routes, Route } from "react-router-dom"

import Welcome from './pages/welcome.tsx';
import UsersList from './pages/UsersList.tsx';
import StatusesList from './pages/StatusesList.tsx';
import NewUser from './pages/NewUser.tsx';
import Login from './pages/Login.tsx';
import EditUser from './pages/EditUser.tsx';
import EditStatus from './pages/EditStatus.tsx';
import NewStatus from './pages/NewStatus.tsx';
import ProtectedLayout from './pages/ProtectedLayout.tsx';

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
    </Route>
  </Routes>
)