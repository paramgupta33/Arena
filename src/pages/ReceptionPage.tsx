import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArena, UserEnquiry } from '../context/ArenaContext';
import { ANNOUNCEMENTS } from '../data/arenaData';
import { HelpCircle, Bell, Send, Edit2, Trash2, ShieldCheck, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';

export const ReceptionPage: React.FC = () => {
  const { enquiries, submitEnquiry, updateEnquiry, deleteEnquiry } = useArena();

  // New enquiry form state
  const [type, setType] = useState('General Enquiry');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Edit enquiry modal/inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    submitEnquiry({ type, subject, message });
    setSubject('');
    setMessage('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 3000);
  };

  const handleStartEdit = (enq: UserEnquiry) => {
    setEditingId(enq.id);
    setEditSubject(enq.subject);
    setEditMessage(enq.message);
  };

  const handleSaveEdit = (id: string, originalType: string) => {
    if (!editSubject.trim() || !editMessage.trim()) return;
    updateEnquiry(id, { type: originalType, subject: editSubject, message: editMessage });
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="bg-[#12121e] border border-[#00d4ff]/40 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/arena"
            className="inline-flex items-center gap-1.5 text-xs font-tech text-[#8e8ea0] hover:text-[#00ff88] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Floor Map
          </Link>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00d4ff]" />
            <h1 className="text-xl sm:text-2xl font-heading font-black text-white">RECEPTION & HELPDESK</h1>
          </div>
          <p className="text-xs text-[#8e8ea0] mt-1">
            Submit session enquiries, view parlour announcements, or check gaming guidelines.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-tech text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/30 px-3 py-1.5 rounded">
          <ShieldCheck className="w-4 h-4" /> Front Desk Operational: 24/7
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Enquiry Form + Submitted Enquiries */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Submit Enquiry Form */}
          <div className="bg-[#12121e] border border-[#2a2a3a] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00d4ff]" /> Submit Desk Enquiry or Feedback
            </h2>

            {submittedMessage && (
              <div className="p-3 bg-[#00ff88]/10 border border-[#00ff88]/40 rounded-lg flex items-center gap-2 text-xs font-tech text-[#00ff88]">
                <CheckCircle2 className="w-4 h-4" /> Enquiry logged successfully. Front desk staff will assist you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 font-tech text-xs">
              <div>
                <label className="text-[#8e8ea0] block mb-1">Category:</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full bg-[#08080c] border border-[#2a2a3a] text-white p-2.5 rounded focus:border-[#00d4ff] outline-none"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Booking Issue">Booking Issue / Extension</option>
                  <option value="Hardware / PC Request">Hardware / PC Request</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                </select>
              </div>

              <div>
                <label className="text-[#8e8ea0] block mb-1">Subject / Station ID:</label>
                <input
                  type="text"
                  placeholder="e.g. PC-04 extension request"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#08080c] border border-[#2a2a3a] text-white p-2.5 rounded focus:border-[#00d4ff] outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e8ea0] block mb-1">Message:</label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-[#08080c] border border-[#2a2a3a] text-white p-2.5 rounded focus:border-[#00d4ff] outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00d4ff] hover:bg-[#00b0d4] text-black font-bold rounded uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Message to Reception
              </button>
            </form>
          </div>

          {/* User Submitted Enquiries List */}
          <div className="bg-[#12121e] border border-[#2a2a3a] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00ff88]" /> Your Enquiries ({enquiries.length})
            </h2>

            {enquiries.length === 0 ? (
              <p className="text-xs font-tech text-[#8e8ea0]">No active enquiries.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.map(enq => (
                  <div
                    key={enq.id}
                    className="p-3 bg-[#08080c] border border-[#2a2a3a] rounded-lg space-y-2 text-xs font-tech"
                  >
                    {editingId === enq.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editSubject}
                          onChange={e => setEditSubject(e.target.value)}
                          className="w-full bg-[#12121e] border border-[#00d4ff] p-2 text-white rounded"
                        />
                        <textarea
                          rows={2}
                          value={editMessage}
                          onChange={e => setEditMessage(e.target.value)}
                          className="w-full bg-[#12121e] border border-[#00d4ff] p-2 text-white rounded resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(enq.id, enq.type)}
                            className="px-3 py-1 bg-[#00ff88] text-black font-bold rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-[#2a2a3a] text-white rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00d4ff] font-bold">{enq.id}</span>
                            <span className="bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/30 px-2 py-0.5 rounded text-[10px]">
                              {enq.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#8e8ea0] text-[10px]">{enq.timestamp}</span>
                            <button
                              onClick={() => handleStartEdit(enq)}
                              className="text-[#8e8ea0] hover:text-[#00d4ff]"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteEnquiry(enq.id)}
                              className="text-[#8e8ea0] hover:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-white font-bold">{enq.subject}</div>
                        <p className="text-[#8e8ea0]">{enq.message}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (5 cols): Parlour Announcements & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Announcements Noticeboard */}
          <div className="bg-[#12121e] border border-[#2a2a3a] p-5 rounded-xl space-y-4">
            <h2 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-yellow-400" /> Announcements & Tournaments
            </h2>

            <div className="space-y-3">
              {ANNOUNCEMENTS.map(ann => (
                <div
                  key={ann.id}
                  className="p-3 bg-[#08080c] border border-[#1e1e2d] rounded-lg space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-tech">
                    <span className="text-yellow-400 font-bold">{ann.title}</span>
                    <span className="text-[10px] text-[#8e8ea0]">{ann.date}</span>
                  </div>
                  <p className="text-[#8e8ea0] text-xs mt-1">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Parlour Rules & Code of Conduct */}
          <div className="bg-[#12121e] border border-[#2a2a3a] p-5 rounded-xl space-y-3 text-xs">
            <h2 className="text-base font-heading font-bold text-white">Parlour Guidelines</h2>
            <ul className="space-y-2 text-[#8e8ea0] font-tech list-disc list-inside">
              <li>Keep headsets at moderate volume to respect neighboring players.</li>
              <li>Outside food & beverages are not permitted inside gaming spheres.</li>
              <li>Please notify reception 15 mins before your session expires to extend time.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
