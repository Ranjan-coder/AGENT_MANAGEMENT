// import React, { useState } from 'react';
// import axios from 'axios';

// const UploadCSV = () => {
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setError('Please upload a file');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload-csv', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setSuccess(response.data.message);
//       setError('');
//     } catch (err) {
//       setError(err.response.data.message);
//       setSuccess('');
//     }
//   };

//   return (
//     <div>
//       <h3>Upload CSV</h3>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleFileChange} />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

// export default UploadCSV;




import React, { useState } from 'react';
import axios from 'axios';
import styles from '../Styles/UploadCSV.module.css'; // Importing the modular CSS

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h3>Upload CSV/XLSX File</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}
    </div>
  );
};

export default UploadCSV;
