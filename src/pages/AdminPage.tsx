import React, { useState } from 'react';

import ResultsChart from '../admin/ResultsChart';
import { AddResultForm } from '../admin/AddResultForm';



const AdminPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="admin-page">
      <AddResultForm
        editingId={null}
        onSuccess={handleSuccess}
      />
      <ResultsChart key={refreshKey} />
    </div>
  );
};

export default AdminPage;