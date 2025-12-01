import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import api from './api';

// --- COMPONENTS ---

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      navigate('/dashboard');
    } catch (err) { alert('Invalid credentials'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">MediCore Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
            <input className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                   onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                   onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ total_patients: 0, pending_appointments: 0 });
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]); 
  const [view, setView] = useState('appointments'); 

  const [newPatient, setNewPatient] = useState({ name: '', age: '', contact: '' });
  const [newAppt, setNewAppt] = useState({ patient: '', date: '', reason: '' });
  const [newRecord, setNewRecord] = useState({ patient: '', diagnosis: '', treatment: '' }); 

  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, p, a, r] = await Promise.all([
        api.get('dashboard/stats/'),
        api.get('patients/'),
        api.get('appointments/'),
        api.get('records/')
      ]);
      setStats(s.data); setPatients(p.data); setAppointments(a.data); setRecords(r.data);
    } catch (e) { localStorage.removeItem('access_token'); navigate('/'); }
  };

  const addPatient = async (e) => {
    e.preventDefault();
    await api.post('patients/', newPatient);
    setNewPatient({ name: '', age: '', contact: '' });
    fetchData(); 
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;
    try { await api.delete(`patients/${id}/`); fetchData(); } 
    catch (e) { alert("Permission Denied: Admins Only."); }
  };

  const scheduleAppointment = async (e) => {
    e.preventDefault();
    if (!newAppt.patient) return alert('Select patient');
    await api.post('appointments/', newAppt);
    setNewAppt({ patient: '', date: '', reason: '' });
    fetchData();
  };

  // 1. Mark Appointment as COMPLETED
  const completeAppointment = async (id) => {
    try {
      await api.patch(`appointments/${id}/`, { status: 'COMPLETED' });
      fetchData(); // Refresh to see the green badge
    } catch (e) { alert("Error updating status"); }
  };

  // 2. Cancel (Delete) Appointment
  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.delete(`appointments/${id}/`);
      fetchData();
    } catch (e) { alert("Permission Denied: Only Admins can delete."); }
  };

  const addRecord = async (e) => {
    e.preventDefault();
    if (!newRecord.patient) return alert('Select patient');
    await api.post('records/', newRecord);
    setNewRecord({ patient: '', diagnosis: '', treatment: '' });
    fetchData();
  };

  const logout = () => { localStorage.removeItem('access_token'); navigate('/'); };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600 text-3xl">⚕️</span> MediCore <span className="text-slate-400 font-normal text-sm ml-2">Hospital PMS</span>
          </h1>
          <button onClick={logout} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-blue-100 font-medium mb-1">Total Patients</h3>
            <p className="text-4xl font-bold">{stats.total_patients}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-slate-500 font-medium mb-1">Pending Appointments</h3>
              <p className="text-4xl font-bold text-slate-800">{stats.pending_appointments}</p>
            </div>
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <i className="bi bi-clock-history text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PATIENTS */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="bi bi-person-plus text-indigo-600"></i> Register Patient
              </h3>
              <form onSubmit={addPatient} className="space-y-3">
                <input placeholder="Full Name" className="w-full p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required />
                <div className="flex gap-2">
                  <input placeholder="Age" type="number" className="w-1/3 p-2 bg-slate-50 border rounded-lg outline-none" 
                    value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} required />
                  <input placeholder="Contact" className="w-2/3 p-2 bg-slate-50 border rounded-lg outline-none" 
                    value={newPatient.contact} onChange={e => setNewPatient({...newPatient, contact: e.target.value})} required />
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition">Add Patient</button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[500px] flex flex-col">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Directory</h3>
               <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
                  {patients.map(p => (
                    <div key={p.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center group hover:bg-indigo-50 transition">
                      <div>
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <span className="text-xs bg-white text-slate-500 px-2 py-0.5 rounded shadow-sm border">Age: {p.age}</span>
                      </div>
                      <button onClick={() => deletePatient(p.id)} className="text-red-500 hover:text-red-700 transition p-2 text-sm font-bold">
                        Delete
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WORKSPACE */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[600px]">
              {/* TABS */}
              <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
                <button onClick={() => setView('appointments')} 
                  className={`pb-2 px-1 font-medium transition ${view === 'appointments' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  Appointments
                </button>
                <button onClick={() => setView('records')} 
                  className={`pb-2 px-1 font-medium transition ${view === 'records' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                  Medical Records
                </button>
              </div>

              {view === 'appointments' ? (
                <div className="space-y-6 animate-fade-in">
                  <form onSubmit={scheduleAppointment} className="bg-slate-50 p-4 rounded-xl flex flex-wrap gap-3 items-end">
                     <div className="flex-grow min-w-[200px]">
                        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Patient</label>
                        <select className="w-full p-2 mt-1 border rounded-lg bg-white" 
                          value={newAppt.patient} onChange={e => setNewAppt({...newAppt, patient: e.target.value})} required>
                          <option value="">Select...</option>
                          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     </div>
                     <div className="flex-grow">
                        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date</label>
                        <input type="datetime-local" className="w-full p-2 mt-1 border rounded-lg bg-white" 
                          value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} required />
                     </div>
                     <div className="flex-grow-[2]">
                        <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reason</label>
                        <input placeholder="e.g. Checkup" className="w-full p-2 mt-1 border rounded-lg bg-white" 
                          value={newAppt.reason} onChange={e => setNewAppt({...newAppt, reason: e.target.value})} required />
                     </div>
                     <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-black transition h-[42px]">Book</button>
                  </form>

                  <div className="space-y-3">
                    {appointments.map(a => {
                      // 1. Safe Status Check (Case Insensitive)
                      const statusUpper = a.status ? a.status.toUpperCase() : 'UNKNOWN';
                      const isPending = statusUpper === 'PENDING';
                      const isCompleted = statusUpper === 'COMPLETED';

                      return (
                        <div key={a.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:shadow-md transition bg-white">
                          <div className="flex items-center gap-4">
                              {/* Circle Avatar with Initials */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                {a.patient_name ? a.patient_name[0] : '?'}
                              </div>
                              
                              {/* Name and Date */}
                              <div>
                                <p className="font-bold text-slate-800">{a.patient_name}</p>
                                <p className="text-sm text-slate-500">{new Date(a.date).toLocaleString()}</p>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPending ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                              {a.status}
                            </span>

                            {/* Buttons: Only show if PENDING */}
                            {isPending && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => completeAppointment(a.id)} 
                                  className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold border border-green-200 hover:bg-green-100 transition">
                                  ✓ Finish
                                </button>
                                <button 
                                  onClick={() => cancelAppointment(a.id)} 
                                  className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold border border-red-200 hover:bg-red-100 transition">
                                  ✕ Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                   <form onSubmit={addRecord} className="bg-slate-50 p-4 rounded-xl space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <select className="p-2 border rounded-lg bg-white w-full" 
                            value={newRecord.patient} onChange={e => setNewRecord({...newRecord, patient: e.target.value})} required>
                            <option value="">Select Patient...</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input placeholder="Diagnosis" className="p-2 border rounded-lg bg-white w-full" 
                            value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} required />
                      </div>
                      <textarea placeholder="Prescription / Treatment details..." className="w-full p-2 border rounded-lg bg-white h-20" 
                          value={newRecord.treatment} onChange={e => setNewRecord({...newRecord, treatment: e.target.value})} required />
                      <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 w-full font-medium">Save Record</button>
                   </form>

                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="text-slate-400 text-xs uppercase tracking-wider border-b">
                              <th className="pb-2">Patient</th>
                              <th className="pb-2">Diagnosis</th>
                              <th className="pb-2">Prescription</th>
                              <th className="pb-2 text-right">Date</th>
                           </tr>
                        </thead>
                        <tbody className="text-sm text-slate-600">
                           {records.map(r => (
                              <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                 <td className="py-3 font-medium text-slate-800">{r.patient_name}</td>
                                 <td className="py-3"><span className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold">{r.diagnosis}</span></td>
                                 <td className="py-3 max-w-xs truncate">{r.treatment}</td>
                                 <td className="py-3 text-right text-slate-400">{r.date}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}