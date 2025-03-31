import React, { useState } from 'react';

import ResultsChart from '../admin/ResultsChart';
import { AddResultForm } from '../admin/AddResultForm';

interface AdminPageProps {
  editingId: string | null;
  onSuccess: () => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ editingId, onSuccess }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
    onSuccess();
  };

  return (
    <div className="admin-page">
      <AddResultForm
        editingId={editingId}
        onSuccess={handleSuccess}
      />
      <ResultsChart key={refreshKey} />
    </div>
  );
};

export default AdminPage;