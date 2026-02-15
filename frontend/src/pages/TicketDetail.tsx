import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Filter,
  RefreshCw,
  MoreVertical,
  Paperclip,
  Type,
  Smile,
  AtSign,
  Link2,
  X
} from 'lucide-react';
import type { Ticket } from '../types/index.js';
import api from '../lib/api.js';
import { formatDateTime } from '../lib/utils.js';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replyType, setReplyType] = useState<'public' | 'internal'>('public');
  const [showMacroDropdown, setShowMacroDropdown] = useState(false);

  // Form fields
  const [assignee, setAssignee] = useState('');
  const [tags, setTags] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [loanNumber, setLoanNumber] = useState('');
  const [paymentCycle, setPaymentCycle] = useState('');
  const [columnUsed, setColumnUsed] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [details, setDetails] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get<Ticket>(`/tickets/${id}`);
      setTicket(response.data);
      setPriority(response.data.priority);
    } catch (err: any) {
      console.error('Failed to fetch ticket:', err);
      setError('Failed to load ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      setError('Please enter a reply message');
      return;
    }

    try {
      setError('');
      // TODO: Implement actual reply submission to backend
      // await api.post(`/tickets/${id}/replies`, { content: replyText, type: replyType });
      console.log('Submit reply:', replyText, 'Type:', replyType);
      alert('Reply submitted successfully!');
      setReplyText('');
    } catch (err: any) {
      console.error('Failed to submit reply:', err);
      setError('Failed to submit reply. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-red-600',
      in_progress: 'bg-yellow-600',
      pending: 'bg-blue-600',
      resolved: 'bg-gray-800',
      closed: 'bg-gray-800',
    };
    return colors[status] || 'bg-gray-600';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'resolved' || status === 'closed') return 'Solved';
    return status.replace('_', ' ');
  };

  const getTemplateContent = (templateName: string): string => {
    const customerName = ticket?.requester.username || '[Customer Name]';

    const templates: Record<string, string> = {
      'A. PAYMENT CONFIRMATION': `Dear ${customerName},

Thank you for your payment of $. We have received and processed your payment successfully.

Payment Details:
- Amount: $
- Date:
- Method: E-transfer

If you have any questions, please don't hesitate to contact us.

Best regards,`,

      'A. FINAL PAYMENT': `Dear ${customerName},

This is to confirm that we have received your final payment.

Your account is now fully paid and closed.

Thank you for your business.

Sincerely,`,

      'REMINDER: Overdue Payment': `Dear ${customerName},

To date of this email, your commitment to make a payment towards your outstanding loan from [Payment Due Date] has not been fulfilled.

Overdue Payment: $
by e-transfer to: prestocash@interactransfers.ca

Defaulting on a loan significantly affects your credit score and this will prevent lenders in extending loan or line of credit which will also keep your name on blacklist of defaulters.

It is our policy to refer the matter to METCREDIT Collection Agency for recovery without further notice. Please note that if such action is necessary, you will also be liable for collection costs and interest pursuant to our Terms & Conditions of the signed agreement.

We regret the necessity for this action and urge you to clear up this delinquent account immediately.

(Note: Please disregard if payment has been made. For faster verification and confirmation of payment, kindly send us a proof/screenshot of e-transfer and insert full name in the memo.)

Sincerely,`,

      'A. INSUFFICIENT PAYMENT': `Dear ${customerName},

We have received your payment, however the amount received is insufficient to cover your outstanding balance.

Amount Received: $
Amount Due: $
Shortfall: $

Please send the remaining balance at your earliest convenience.

Thank you,`,

      'A. Collections Notice': `Dear ${customerName},

This is a final notice regarding your overdue account.

If payment is not received within 5 business days, your account will be forwarded to our collections agency.

Please contact us immediately to arrange payment.

Sincerely,`
    };

    return templates[templateName] || '';
  };

  const macros = [
    { name: 'A. PAYMENT CONFIRMATION' },
    { name: 'A. FINAL PAYMENT' },
    { name: 'REMINDER: Overdue Payment' },
    { name: 'A. INSUFFICIENT PAYMENT' },
    { name: 'A. Collections Notice' }
  ];

  const handleApplyMacro = (macroName: string) => {
    const content = getTemplateContent(macroName);
    setReplyText(content);
    setShowMacroDropdown(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading ticket...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-16 bg-blue-900 flex flex-col items-center py-4 space-y-4">
        <button onClick={() => navigate('/')} className="text-white p-2 hover:bg-blue-800 rounded">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-900 font-bold">
            Z
          </div>
        </button>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Notification Bar */}
        <div className="fixed top-0 left-16 right-0 bg-green-50 border-b border-green-200 px-4 py-2 z-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-green-800">
            Ticket <a href="#" className="underline">#{ticket.ticket_number}</a> has been updated.
          </span>
        </div>
        <button className="text-green-800 hover:text-green-900">
          <X className="w-4 h-4" />
        </button>
      </div>

        {/* Ticket Tabs */}
        <div className="fixed top-12 left-16 right-0 bg-white border-b border-gray-200 z-40 flex items-center px-4 space-x-1">
        <div className="flex items-center space-x-2 px-3 py-2 border-t-2 border-blue-500 bg-gray-50 text-sm">
          <span className="truncate max-w-[200px]">
            BankEx ID: 2835726/161... #{ticket.ticket_number}
          </span>
          <button
            onClick={() => navigate('/')}
            className="hover:bg-gray-200 rounded p-0.5"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          + Add
        </button>
      </div>

        {/* Content Area with Ticket Fields, Main Content, and User Info */}
        <div className="flex flex-1 overflow-hidden mt-24">
          {/* Left Sidebar - Ticket Fields */}
          <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Requester */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Requester
            </label>
            <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                {ticket.requester.username[0].toUpperCase()}
              </div>
              <span className="text-sm flex-1">{ticket.requester.username}</span>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Assignee*
              <a href="#" className="text-blue-600 ml-2 text-xs">take it</a>
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Support/Root B.</option>
              <option value="agent1">Agent 1</option>
              <option value="agent2">Agent 2</option>
            </select>
          </div>

          {/* Followers */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Followers (1)
              <a href="#" className="text-blue-600 ml-2 text-xs">follow</a>
            </label>
            <select className="w-full p-2 border border-gray-300 rounded text-sm">
              <option value="">-</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
            <div className="w-full p-2 border border-gray-300 rounded text-sm min-h-[40px] flex flex-wrap gap-1">
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                transfer_consent
                <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
              </span>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 min-w-[100px] outline-none text-xs"
                placeholder="Add tags..."
              />
            </div>
          </div>

          {/* Client Location */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Client Location
            </label>
            <select
              value={clientLocation}
              onChange={(e) => setClientLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">-</option>
              <option value="usa">USA</option>
              <option value="canada">Canada</option>
            </select>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">-</option>
                <option value="question">Question</option>
                <option value="incident">Incident</option>
                <option value="problem">Problem</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Issue Category
            </label>
            <select
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">-</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
            </select>
          </div>

          {/* Loan Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Loan Number
            </label>
            <input
              type="text"
              value={loanNumber}
              onChange={(e) => setLoanNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Payment Cycle */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Payment cycle
            </label>
            <select
              value={paymentCycle}
              onChange={(e) => setPaymentCycle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">-</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          {/* Column Used */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Column used
            </label>
            <select
              value={columnUsed}
              onChange={(e) => setColumnUsed(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">-</option>
            </select>
          </div>

          {/* Review Date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Review Date
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              placeholder="e.g. October 1, 2008"
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded text-white ${getStatusColor(ticket.status)}`}>
                  {getStatusLabel(ticket.status)}
                </span>
                <span className="text-sm text-gray-600">Ticket #{ticket.ticket_number}</span>
                <span className="text-xs px-2 py-1 bg-yellow-200 rounded font-medium">
                  #{ticket.ticket_number}
                </span>
              </div>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Next →
            </button>
          </div>
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
            <span>No organization</span>
            <span>|</span>
            <span>Requester: {ticket.requester.username}</span>
          </div>
        </header>

        {/* Ticket Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            {/* Ticket Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{ticket.subject}</h2>
                <p className="text-sm text-gray-500">Via email</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="space-y-4 mb-6">
              {/* Original Message */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                    {ticket.requester.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{ticket.requester.username}</span>
                      <span className="text-xs text-gray-500">CC ▾</span>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(ticket.created_at)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Via email</div>
                  </div>
                </div>
                <div className="text-sm space-y-2 ml-13">
                  <p>Si vous en recevez plus requ. je place jerous. vizualize employer en cc ema il : <a href="#" className="text-blue-600">notifications@bankex.ca</a></p>
                  <p>Merci,</p>
                  <p>RoseEx</p>
                  <p className="text-gray-600">(BankEx ID: 2751615/16559338)</p>
                  <div className="mt-4 text-xs text-gray-600 space-y-1">
                    <p>Le présent courriel et tout fichier qui y est joint sont réservés à l'usage de ou des destinataires visés et peuvent contenir des renseignements privilégiés, confidentiels ou exclusifs. Si vous n'êtes pas le destinataire visé, nous ne devez pas consulter, diffuser, utiliser ou copier ce courriel ou ses pièces jointes. Veuillez en informer immédiatement l'expéditeur et supprimer ce courriel et toute copie ou pièce jointe de votre système. Merci.</p>
                    <p className="mt-2">FCT offre un chiffrement TLS préférentiel pour assurer la sécurité de ses communications par courriel. Communiquez avec votre administrateur des TI pour vous assurer que vous êtes en mesure de recevoir les courriels en toute sécurité de la part de FCT.</p>
                  </div>

                  {/* Attachment Redacted Notice */}
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                    <strong>Attachment redacted</strong>
                  </div>
                </div>

                {/* Flagged Message Notice */}
                <div className="text-xs text-gray-500 mt-3 ml-13">
                  We flagged this comment because the From and Reply-to in the messages don't match.{' '}
                  <a href="#" className="text-blue-600">Learn more ↗</a>
                </div>
              </div>

              {/* Internal Reply from Agent */}
              <div className="border-l-4 border-gray-300 pl-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium relative">
                    C
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
                      <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">C. Dio</span>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                        Internal
                      </span>
                      <span className="text-xs text-gray-500">less than a minute ago</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>The consumer proposal is deemed to have been annulled on the 1st day of February 2026</p>
                      <p>Wesley Ogar</p>
                      <p>PRI100007041</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Box */}
            <div className={`border border-gray-300 rounded-lg ${replyType === 'internal' ? 'bg-teal-50' : ''}`}>
              <div className={`flex items-center space-x-2 p-3 border-b ${replyType === 'internal' ? 'border-teal-200 bg-teal-100' : 'border-gray-300'}`}>
                <select
                  value={replyType}
                  onChange={(e) => setReplyType(e.target.value as 'public' | 'internal')}
                  className={`text-sm border-none outline-none font-medium ${replyType === 'internal' ? 'bg-teal-100 text-teal-800' : ''}`}
                >
                  <option value="public">Public reply</option>
                  <option value="internal">Internal note</option>
                </select>
                <span className="text-gray-400">→</span>
                <span className="text-sm">To</span>
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                  <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
                  <span className="text-sm">{ticket.requester.username}</span>
                </div>
                <button className="text-sm text-blue-600">CC</button>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-4 border-none outline-none resize-none"
                rows={6}
                placeholder="Type your reply..."
              />
              <div className="flex items-center justify-between p-3 border-t border-gray-300">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Type className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <AtSign className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-300 bg-gray-100 p-4">
          <div className="max-w-4xl flex items-center justify-between">
            {/* Apply Macro Dropdown - Left */}
            <div className="relative">
              <button
                onClick={() => setShowMacroDropdown(!showMacroDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                <span className="text-gray-600">🔍</span>
                <span>Apply macro</span>
                <span className="text-gray-400">▼</span>
              </button>

              {/* Macro Dropdown Menu */}
              {showMacroDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search macros..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="border-t border-gray-200">
                    {macros.map((macro, index) => {
                      const content = getTemplateContent(macro.name);
                      return (
                        <button
                          key={index}
                          onClick={() => handleApplyMacro(macro.name)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm font-medium text-gray-900">{macro.name}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {content.substring(0, 60)}...
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Right */}
            <div className="flex items-center space-x-3">
              <select className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                <option>Stay on ticket</option>
                <option>Go to next ticket</option>
                <option>Go to ticket list</option>
              </select>
              <button
                onClick={handleSubmitReply}
                className="px-6 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 flex items-center space-x-1"
              >
                <span>Submit as Solved</span>
                <span>▼</span>
              </button>
            </div>
          </div>
        </div>
      </main>

          {/* Right Sidebar - User Info & Interaction History */}
          <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* User Info Card */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                {ticket.requester.username[0].toUpperCase()}
              </div>
              <span className="font-medium">{ticket.requester.username}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <a href={`mailto:${ticket.requester.email}`} className="text-blue-600">
                  {ticket.requester.email || `${ticket.requester.username}@example.com`}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Local time</span>
                <span>{new Date().toLocaleString('en-US', {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language</span>
                <span>English (United States)</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <span className="text-gray-600 block mb-2">Notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded p-2 text-sm resize-none"
                  rows={3}
                  placeholder="Add user notes"
                />
              </div>
            </div>
          </div>

          {/* Interaction History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Interaction history</h3>
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 text-gray-500 cursor-pointer" />
                <button className="text-gray-500">−</button>
              </div>
            </div>

            <div className="space-y-2">
              {/* Sample interaction history items */}
              <div className="border-l-4 border-orange-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  BankEx ID: 2835726/16146490 - Bankruptc...
                </div>
                <div className="text-xs text-gray-500">Yesterday 20:42</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status</span>{' '}
                  <span className="text-orange-600">New</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  BankEx ID: 2833871/16135965 - Bankruptc...
                </div>
                <div className="text-xs text-gray-500">Yesterday 11:48</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status</span>{' '}
                  <span className="text-gray-600">Solved</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  BankEx ID: 2828931/16104781 - Bankruptc...
                </div>
                <div className="text-xs text-gray-500">Friday 15:28</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status</span>{' '}
                  <span className="text-gray-600">Solved</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  BankEx ID: 2826016/16086090 - Bankruptc...
                </div>
                <div className="text-xs text-gray-500">Jan 29 11:23</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status</span>{' '}
                  <span className="text-gray-600">Solved</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  BankEx ID: 2823727/16073116 - Bankruptc...
                </div>
                <div className="text-xs text-gray-500">Jan 28 09:15</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status</span>{' '}
                  <span className="text-gray-600">Solved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Apps Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Apps</h3>
              <RefreshCw className="w-4 h-4 text-gray-500 cursor-pointer" />
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">User Data</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-orange-100 p-1 rounded">📋</span>
                  <span className="bg-blue-100 p-1 rounded">📊</span>
                  <span className="bg-gray-100 p-1 rounded">📁</span>
                  <span className="bg-purple-100 p-1 rounded">🔗</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="border border-gray-200 rounded p-2 min-h-[40px]">
              {/* Tags will appear here */}
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Details</h3>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-gray-200 rounded p-2 text-sm resize-none"
              rows={4}
              placeholder=""
            />
          </div>
        </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
