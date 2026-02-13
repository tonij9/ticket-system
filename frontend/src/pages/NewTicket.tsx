import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, Paperclip, Type, Smile, Link2 } from 'lucide-react';
import api from '../lib/api.js';

export default function NewTicket() {
  const navigate = useNavigate();
  const [requester, setRequester] = useState('Karlie Leeanne Phillips');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [assignee, setAssignee] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [notes, setNotes] = useState('');

  const searchUsers = async (email: string) => {
    if (email.length < 3) {
      setUserSearchResults([]);
      return;
    }
    try {
      const response = await api.get('/users/', { params: { email } });
      setUserSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const handleUserSelect = (user: any) => {
    setRequester(user.username);
    setRequesterEmail(user.email);
    setShowUserSearch(false);
    setUserSearchResults([]);
  };

  const getTemplateContent = (templateName: string): string => {
    const customerName = requester || '[Customer Name]';

    const templates: Record<string, string> = {
      'A. PAYMENT CONFIRMATION': `Dear ${customerName},

Thank you for your payment. We have received and processed your payment successfully.

Payment Details:
- Amount: $
- Date:
- Reference:

Your account has been updated accordingly. If you have any questions regarding this payment, please don't hesitate to contact us.

Best regards,`,

      'A. FINAL PAYMENT': `Dear ${customerName},

This is to confirm receipt of your final payment.

Your loan has been fully paid and your account is now closed. Thank you for your business.

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

We have received your payment, however the amount is insufficient to cover your outstanding balance.

Amount Received: $
Amount Due: $
Outstanding Balance: $

Please send the remaining balance at your earliest convenience to avoid any further action.

Payment can be made via e-transfer to: prestocash@interactransfers.ca

Thank you,`,

      'A. Collections Notice': `Dear ${customerName},

This is a final notice regarding your overdue account.

Outstanding Balance: $
Days Overdue:

If payment is not received within 5 business days, your account will be forwarded to METCREDIT Collection Agency. Additional collection costs and interest will apply.

Please contact us immediately to arrange payment and avoid this action.

Payment can be made via e-transfer to: prestocash@interactransfers.ca

Sincerely,`,

      'Re: Defaulted Loan - Collection Process': `Dear ${customerName},

Your loan account has been in default for [Days] days. We are now initiating the collection process.

Outstanding Balance: $
Late Fees: $
Total Due: $

This is your final opportunity to settle this account before it is referred to our collection agency. Please make payment immediately to avoid further action.

Payment method: E-transfer to prestocash@interactransfers.ca

Sincerely,`,

      'Payment Return Notice - PrestoCash': `Dear ${customerName},

We have been notified that your recent payment has been returned/bounced.

Payment Amount: $
Return Reason:
NSF Fee: $

Your account is now overdue. Please arrange for immediate payment including the NSF fee to bring your account current.

Contact us to discuss payment arrangements.

Thank you,`,

      'PRESTO - Ineligible': `Dear ${customerName},

Thank you for your loan application.

After reviewing your application, we regret to inform you that you are currently ineligible for a loan at this time due to: [Reason]

You may reapply after [Time Period] or once [Condition] is met.

If you have any questions, please contact us.

Sincerely,`
    };

    return templates[templateName] || '';
  };

  const templateNames = [
    'A. PAYMENT CONFIRMATION',
    'A. FINAL PAYMENT',
    'REMINDER: Overdue Payment',
    'A. INSUFFICIENT PAYMENT',
    'A. Collections Notice',
    'Re: Defaulted Loan - Collection Process',
    'Payment Return Notice - PrestoCash',
    'PRESTO - Ineligible'
  ];

  const handleApplyTemplate = (templateName: string) => {
    const content = getTemplateContent(templateName);
    setMessage(content);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post('/tickets/', {
        subject,
        description: message,
        priority: priority || 'medium'
      });
      navigate(`/tickets/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Top Notification Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 flex items-center px-4 space-x-1 h-12">
        <div className="flex items-center space-x-2 px-3 py-2 border-t-2 border-blue-500 bg-gray-50 text-sm">
          <span>New ticket</span>
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

      {/* Left Sidebar */}
      <aside className="w-16 bg-blue-900 flex flex-col items-center py-4 space-y-4 mt-12">
        <button className="text-white p-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-blue-900 font-bold">
            Z
          </div>
        </button>
      </aside>

      {/* Middle Sidebar - Ticket Fields */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto mt-12">
        <div className="p-4">
          <div className="mb-4">
            <span className="text-sm text-gray-600">No organization</span>
            <span className="mx-2">|</span>
            <span className="text-sm">{requester}</span>
            <span className="mx-2">|</span>
            <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded font-medium">New</span>
            <span className="ml-1 text-sm">Ticket</span>
          </div>

          <div className="space-y-4">
            {/* Requester */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Requester
              </label>
              <input
                type="text"
                value={requesterEmail || requester}
                onChange={(e) => {
                  setRequesterEmail(e.target.value);
                  setShowUserSearch(true);
                  searchUsers(e.target.value);
                }}
                onFocus={() => setShowUserSearch(true)}
                placeholder="Search by email or name..."
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />

              {/* User Search Dropdown */}
              {showUserSearch && userSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                  {userSearchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="text-sm font-medium">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}
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
                <option value="">-</option>
                <option value="agent1">Agent 1</option>
                <option value="agent2">Agent 2</option>
              </select>
            </div>

            {/* Followers */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Followers
                <a href="#" className="text-blue-600 ml-2 text-xs">follow</a>
              </label>
              <select className="w-full p-2 border border-gray-300 rounded text-sm">
                <option value="">-</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
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
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">-</option>
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
              </select>
            </div>

            {/* Your most used */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Your most used</h3>
              <div className="space-y-1">
                {templateNames.map((templateName, index) => (
                  <div
                    key={index}
                    onClick={() => handleApplyTemplate(templateName)}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group"
                  >
                    <span className="text-sm text-gray-700">{templateName}</span>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden mt-12">
        {/* Subject Input */}
        <div className="p-6 bg-white border-b border-gray-200">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full text-lg font-medium outline-none border-b-2 border-transparent focus:border-blue-500 pb-2"
          />
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl">
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span>Public reply</span>
                <span>→</span>
                <span>To</span>
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span>{requester}</span>
                </div>
                <button className="text-blue-600">CC</button>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded p-4 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
              rows={12}
              placeholder="Type your message here..."
            />

            <div className="flex items-center space-x-2 mt-3">
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
                <Link2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-300 bg-white p-4">
          <div className="max-w-4xl flex items-center justify-end space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
              <option>Stay on ticket</option>
              <option>Go to next ticket</option>
              <option>Go to ticket list</option>
            </select>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900"
            >
              Submit as New
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - User Info */}
      <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto mt-12">
        <div className="p-4 space-y-6">
          {/* User Info */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium">
                K
              </div>
              <span className="font-medium">Karlie Leeanne Phillips</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <a href="mailto:karieleeanne@hotmail.co..." className="text-blue-600">
                  karieleeanne@hotmail.co...
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Local time</span>
                <span>Fri, 08:27 EST</span>
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
            <h3 className="text-sm font-semibold mb-3">Interaction history</h3>
            <div className="space-y-2">
              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  REMINDER: Your Payment is due Today, Ja...
                </div>
                <div className="text-xs text-gray-500">Yesterday 08:40</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status Solved</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  REMINDER: You have a payment due on Th...
                </div>
                <div className="text-xs text-gray-500">Wednesday 08:41</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status Solved</span>
                </div>
              </div>

              <div className="border-l-4 border-gray-500 pl-3 py-2 cursor-pointer hover:bg-gray-50">
                <div className="text-xs font-medium text-gray-900 truncate">
                  Re: Defaulted Loan - Collection Process bei...
                </div>
                <div className="text-xs text-gray-500">Jan 20 11:24</div>
                <div className="text-xs">
                  <span className="text-gray-600">Status Solved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
