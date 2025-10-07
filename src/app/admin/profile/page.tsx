'use client';

import AdminProfile from '../../../components/admin/AdminProfile';
import AdminHeader from '../../../components/admin/AdminHeader';

export default function AdminProfilePage() {
  return (
    <div>
      <AdminHeader />
      <div className="p-4">
        <AdminProfile />
      </div>
    </div>
  );
}