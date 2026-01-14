import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Types
interface VendorFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vendorType: string;
  menuDescription: string;
  selectedDays: string[];
  needsElectricity: boolean;
  specialRequirements: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  available: boolean;
  details?: {
    email?: string;
    name?: string;
  };
}

interface RegistrationResult {
  id: string;
  confirmation_number: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  selected_days: string[];
  needs_electricity: boolean;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

// Icons
const SnowflakeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18M2 12L22 12M2 12L6 8M2 12L6 16M22 12L18 8M22 12L18 16M4.93 4.93L19.07 19.07M4.93 4.93L4.93 9.17M4.93 4.93L9.17 4.93M19.07 19.07L19.07 14.83M19.07 19.07L14.83 19.07M4.93 19.07L19.07 4.93M4.93 19.07L9.17 19.07M4.93 19.07L4.93 14.83M19.07 4.93L14.83 4.93M19.07 4.93L19.07 9.17" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DropletIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Generate confirmation number
const generateConfirmationNumber = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'WF26-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const AppLayout: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<VendorFormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    vendorType: 'food',
    menuDescription: '',
    selectedDays: [],
    needsElectricity: false,
    specialRequirements: '',
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'warning'>('warning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');

  // Status check state
  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [statusCheckEmail, setStatusCheckEmail] = useState('');
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [registrationResults, setRegistrationResults] = useState<RegistrationResult[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Timer state (30 minutes = 1800 seconds)
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [timerActive, setTimerActive] = useState(false);
  const [showTimerWarning, setShowTimerWarning] = useState(false);

  // Pricing
  const VENDOR_FEE_PER_DAY = 81;
  const ELECTRICITY_FEE = 38;

  const eventDays = [
    { id: 'friday', label: 'Friday, Jan 16', hours: '5:00 PM – 10:00 PM' },
    { id: 'saturday', label: 'Saturday, Jan 17', hours: '10:00 AM – 10:00 PM' },
    { id: 'sunday', label: 'Sunday, Jan 18', hours: '11:00 AM – 3:00 PM' },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'zelle',
      name: 'Zelle',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#6D1ED4">
          <path d="M13.559 24h-2.841a.483.483 0 01-.483-.483v-2.765H5.638a.667.667 0 01-.475-1.133l8.478-8.792H5.638a.483.483 0 01-.483-.483V7.579a.483.483 0 01.483-.483h4.597V4.483c0-.267.216-.483.483-.483h2.841c.267 0 .483.216.483.483v2.613h4.597c.267 0 .483.216.483.483v2.765c0 .267-.216.483-.483.483h-4.597v.001l8.003 8.301a.667.667 0 01-.475 1.133h-4.597v2.765a.483.483 0 01-.483.483z"/>
        </svg>
      ),
      available: true,
      details: {
        email: 'Fernandes.joanab@gmail.com',
        name: 'Joana Fernandes',
      },
    },
    {
      id: 'venmo',
      name: 'Venmo',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#3D95CE">
          <path d="M19.5 2.25c.75 1.5 1.125 3 1.125 4.875 0 5.25-4.5 12-8.25 16.875H4.5L2.25 2.25h7.5l1.5 12c1.5-2.625 3-6.375 3-9 0-1.5-.375-2.625-.75-3.375l6-2.625z"/>
        </svg>
      ),
      available: false,
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#00D632">
          <path d="M23.59 3.47A5.1 5.1 0 0020.5.38C17.6-.54 6.4-.54 3.5.38A5.1 5.1 0 00.41 3.47c-.92 2.9-.92 8.96 0 11.86a5.1 5.1 0 003.09 3.09c2.9.92 14.1.92 17 0a5.1 5.1 0 003.09-3.09c.92-2.9.92-8.96 0-11.86zM9.75 15.27l-.78-2.89-2.89-.78 2.89-.78.78-2.89.78 2.89 2.89.78-2.89.78-.78 2.89z"/>
        </svg>
      ),
      available: false,
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#1a365d">
          <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm6 0v8h4v-8h-4zm7 0v8h3v-8h-3zM2 21h20v2H2v-2z"/>
        </svg>
      ),
      available: false,
    },
  ];

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 301 && prev > 300) {
            setShowTimerWarning(true);
          }
          if (prev <= 1) {
            setTimerActive(false);
            showNotificationMsg('Session expired. Please refresh to start again.', 'error');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerActive, timeRemaining]);

  // Start timer when form interaction begins
  useEffect(() => {
    if (currentStep > 1 && !timerActive) {
      setTimerActive(true);
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotal = useCallback(() => {
    const daysCount = formData.selectedDays.length;
    const baseFee = daysCount * VENDOR_FEE_PER_DAY;
    const electricityFee = formData.needsElectricity ? ELECTRICITY_FEE : 0;
    return baseFee + electricityFee;
  }, [formData.selectedDays, formData.needsElectricity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDayToggle = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter((d) => d !== dayId)
        : [...prev.selectedDays, dayId],
    }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const showNotificationMsg = (message: string, type: 'success' | 'error' | 'warning' = 'warning') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handlePaymentSelect = (methodId: string) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (method?.available) {
      setSelectedPayment(methodId);
      if (methodId === 'zelle') {
        setShowPaymentModal(true);
      }
    } else {
      showNotificationMsg('This payment method is not available at this time.', 'warning');
    }
  };

  // Submit registration to database
  const submitRegistration = async () => {
    setIsSubmitting(true);
    const confNumber = generateConfirmationNumber();
    
    try {
      const { data, error } = await supabase
        .from('vendor_registrations')
        .insert({
          confirmation_number: confNumber,
          business_name: formData.businessName,
          contact_name: formData.contactName,
          email: formData.email.toLowerCase(),
          phone: formData.phone,
          license_number: formData.licenseNumber,
          vendor_type: formData.vendorType,
          menu_description: formData.menuDescription || null,
          selected_days: formData.selectedDays,
          needs_electricity: formData.needsElectricity,
          special_requirements: formData.specialRequirements || null,
          total_amount: calculateTotal(),
          payment_status: 'pending',
          payment_method: selectedPayment,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setConfirmationNumber(confNumber);
      setFormSubmitted(true);
      showNotificationMsg('Registration submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting registration:', error);
      showNotificationMsg('Error submitting registration. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check registration status
  const checkRegistrationStatus = async () => {
    if (!statusCheckEmail.trim()) {
      setStatusError('Please enter your email address');
      return;
    }

    setIsCheckingStatus(true);
    setStatusError(null);
    setRegistrationResults([]);

    try {
      const { data, error } = await supabase
        .from('vendor_registrations')
        .select('*')
        .eq('email', statusCheckEmail.toLowerCase().trim())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setRegistrationResults(data);
      } else {
        setStatusError('No registrations found for this email address.');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setStatusError('Error checking registration status. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!selectedPayment) {
        showNotificationMsg('Please select a payment method.', 'warning');
        return;
      }
      await submitRegistration();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.businessName &&
          formData.contactName &&
          formData.email &&
          formData.phone &&
          formData.licenseNumber
        );
      case 2:
        return formData.selectedDays.length > 0;
      case 3:
        return selectedPayment !== null;
      default:
        return false;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      {/* Notification */}
      {showNotification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-slide-in ${
          notificationType === 'success' ? 'bg-green-500 text-white' :
          notificationType === 'error' ? 'bg-red-500 text-white' :
          'bg-amber-500 text-white'
        }`}>
          {notificationType === 'success' ? <CheckIcon /> : <AlertIcon />}
          <span>{notificationMessage}</span>
          <button onClick={() => setShowNotification(false)} className="ml-2 hover:opacity-70">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Timer Warning Modal */}
      {showTimerWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">5 Minutes Remaining!</h3>
            <p className="text-gray-600 mb-6">Your session will expire soon. Please complete your registration.</p>
            <button
              onClick={() => setShowTimerWarning(false)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Registration
            </button>
          </div>
        </div>
      )}

      {/* Status Check Modal */}
      {showStatusCheck && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Check Registration Status</h3>
              <button onClick={() => {
                setShowStatusCheck(false);
                setRegistrationResults([]);
                setStatusCheckEmail('');
                setStatusError(null);
              }} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email address
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={statusCheckEmail}
                  onChange={(e) => setStatusCheckEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && checkRegistrationStatus()}
                />
                <button
                  onClick={checkRegistrationStatus}
                  disabled={isCheckingStatus}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isCheckingStatus ? <LoadingSpinner /> : <SearchIcon />}
                  {isCheckingStatus ? 'Checking...' : 'Check Status'}
                </button>
              </div>
            </div>

            {statusError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700">{statusError}</p>
              </div>
            )}

            {registrationResults.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Your Registrations ({registrationResults.length})</h4>
                {registrationResults.map((reg) => (
                  <div key={reg.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Confirmation Number</p>
                        <p className="text-xl font-bold text-blue-600">{reg.confirmation_number}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(reg.payment_status)}`}>
                        {reg.payment_status.charAt(0).toUpperCase() + reg.payment_status.slice(1)}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Business:</span>
                        <p className="font-medium">{reg.business_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium">{reg.contact_name}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Days:</span>
                        <p className="font-medium">{reg.selected_days.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Amount:</span>
                        <p className="font-medium text-green-600">${reg.total_amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Electricity:</span>
                        <p className="font-medium">{reg.needs_electricity ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment Method:</span>
                        <p className="font-medium">{reg.payment_method || 'N/A'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-500">Submitted:</span>
                        <p className="font-medium">{formatDate(reg.created_at)}</p>
                      </div>
                    </div>
                    {reg.payment_status === 'pending' && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-800 text-sm">
                          <strong>Reminder:</strong> Please complete your payment and send proof to <strong>palmdesertfair@email.com</strong>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Zelle Payment Details</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#6D1ED4">
                  <path d="M13.559 24h-2.841a.483.483 0 01-.483-.483v-2.765H5.638a.667.667 0 01-.475-1.133l8.478-8.792H5.638a.483.483 0 01-.483-.483V7.579a.483.483 0 01.483-.483h4.597V4.483c0-.267.216-.483.483-.483h2.841c.267 0 .483.216.483.483v2.613h4.597c.267 0 .483.216.483.483v2.765c0 .267-.216.483-.483.483h-4.597v.001l8.003 8.301a.667.667 0 01-.475 1.133h-4.597v2.765a.483.483 0 01-.483.483z"/>
                </svg>
                <span className="text-xl font-bold text-purple-800">Zelle</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Send payment to:</label>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                    <EmailIcon />
                    <span className="font-medium flex-1">Fernandes.joanab@gmail.com</span>
                    <button
                      onClick={() => copyToClipboard('Fernandes.joanab@gmail.com', 'email')}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <CopyIcon />
                      {copied === 'email' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Recipient Name:</label>
                  <div className="flex items-center gap-2 bg-white rounded-lg p-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium flex-1">Joana Fernandes</span>
                    <button
                      onClick={() => copyToClipboard('Joana Fernandes', 'name')}
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <CopyIcon />
                      {copied === 'name' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Amount to Send:</label>
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertIcon />
                <div>
                  <p className="font-semibold text-amber-800">Important: Send Payment Proof</p>
                  <p className="text-amber-700 text-sm mt-1">
                    After completing your Zelle payment, please send a screenshot or confirmation to:
                  </p>
                  <button
                    onClick={() => copyToClipboard('palmdesertfair@email.com', 'proof')}
                    className="mt-2 bg-amber-200 text-amber-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-amber-300 transition-colors"
                  >
                    <EmailIcon />
                    palmdesertfair@email.com
                    <CopyIcon />
                    {copied === 'proof' && <span className="text-xs">Copied!</span>}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPaymentModal(false);
                showNotificationMsg('Once payment is made, send proof to palmdesertfair@email.com for confirmation.', 'warning');
              }}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              I've Noted the Payment Details
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-blue-400">
              <SnowflakeIcon />
            </div>
            <span className="text-white font-bold text-xl">Lake Chelan Winterfest</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowStatusCheck(true)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <SearchIcon />
              <span className="hidden sm:inline">Check Status</span>
            </button>
            {timerActive && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining <= 300 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                <ClockIcon />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517299321609-52687d1bc55a?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/50 to-slate-900"></div>
        
        {/* Animated snowflakes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/20 animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            >
              <SnowflakeIcon />
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CalendarIcon />
            January 16-18, 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            2026 Lake Chelan
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Winterfest
            </span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            Join us for the most magical winter celebration in Washington State!
            Register your vendor booth today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <LocationIcon />
              <span>102 East Johnson Avenue, Chelan, WA 98816</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Schedule */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ClockIcon />
                Event Schedule
              </h3>
              <div className="space-y-4">
                {eventDays.map((day) => (
                  <div key={day.id} className="bg-white/5 rounded-xl p-4">
                    <p className="font-semibold text-white">{day.label}</p>
                    <p className="text-blue-300 text-sm">{day.hours}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Vendor Fees</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-white">
                  <span>Booth Fee (per day)</span>
                  <span className="font-bold text-green-400">${VENDOR_FEE_PER_DAY}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <BoltIcon />
                    <span>Electricity</span>
                  </div>
                  <span className="font-bold text-amber-400">${ELECTRICITY_FEE}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <DropletIcon />
                    <span>Water</span>
                  </div>
                  <span className="font-bold text-cyan-400">FREE</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-0.5 text-green-400"><CheckIcon /></div>
                  <span>Valid business/operating license</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-0.5 text-green-400"><CheckIcon /></div>
                  <span>Food vendors: Different menu required (4-5 spots only)</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <div className="mt-0.5 text-green-400"><CheckIcon /></div>
                  <span>Map & setup info sent after payment</span>
                </li>
              </ul>
            </div>

            {/* Food Vendor Notice */}
            <div className="bg-amber-500/20 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30">
              <div className="flex items-start gap-3">
                <div className="text-amber-400"><AlertIcon /></div>
                <div>
                  <h4 className="font-bold text-amber-300">Limited Food Vendor Spaces</h4>
                  <p className="text-amber-200/80 text-sm mt-1">
                    Only 4-5 food vendor spots available. Each vendor must have a different menu. Apply early!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:col-span-2">
            {formSubmitted ? (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h2>
                
                {/* Confirmation Number */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                  <p className="text-sm text-blue-600 mb-2">Your Confirmation Number</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-bold text-blue-700">{confirmationNumber}</p>
                    <button
                      onClick={() => copyToClipboard(confirmationNumber, 'confirmation')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-lg"
                    >
                      <CopyIcon />
                      {copied === 'confirmation' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-blue-600 mt-2">Save this number for your records</p>
                </div>

                <p className="text-gray-600 mb-6">
                  Thank you for registering for Lake Chelan Winterfest 2026!
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 text-left">
                  <h4 className="font-bold text-amber-800 mb-2">Next Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-amber-700">
                    <li>Complete your payment via Zelle to <strong>Fernandes.joanab@gmail.com</strong></li>
                    <li>Send payment proof to <strong>palmdesertfair@email.com</strong></li>
                    <li>Include your confirmation number: <strong>{confirmationNumber}</strong></li>
                    <li>Receive your booth map and loading setup instructions</li>
                  </ol>
                </div>
                <div className="bg-gray-100 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Your Registration Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <span className="text-gray-500">Business:</span>
                      <p className="font-medium">{formData.businessName}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-500">Days:</span>
                      <p className="font-medium">{formData.selectedDays.length} day(s)</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-500">Electricity:</span>
                      <p className="font-medium">{formData.needsElectricity ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-500">Total:</span>
                      <p className="font-bold text-green-600">${calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-center">
                  <button
                    onClick={() => setShowStatusCheck(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <SearchIcon />
                    Check Registration Status
                  </button>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setCurrentStep(1);
                      setSelectedPayment(null);
                      setFormData({
                        businessName: '',
                        contactName: '',
                        email: '',
                        phone: '',
                        licenseNumber: '',
                        vendorType: 'food',
                        menuDescription: '',
                        selectedDays: [],
                        needsElectricity: false,
                        specialRequirements: '',
                      });
                      setTimeRemaining(1800);
                      setTimerActive(false);
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    New Registration
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Progress Steps */}
                <div className="bg-gray-50 px-8 py-6 border-b">
                  <div className="flex items-center justify-between max-w-md mx-auto">
                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              currentStep >= step
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {currentStep > step ? <CheckIcon /> : step}
                          </div>
                          <span className={`hidden sm:block text-sm ${currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                            {step === 1 ? 'Business Info' : step === 2 ? 'Select Days' : 'Payment'}
                          </span>
                        </div>
                        {step < 3 && (
                          <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  {/* Step 1: Business Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your Business Name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Name *
                          </label>
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Your Full Name"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business License Number *
                          </label>
                          <input
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="License #"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vendor Type *
                          </label>
                          <select
                            name="vendorType"
                            value={formData.vendorType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="food">Food Vendor</option>
                            <option value="craft">Craft/Artisan</option>
                            <option value="retail">Retail</option>
                            <option value="service">Service Provider</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {formData.vendorType === 'food' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Menu Description (Required for Food Vendors)
                          </label>
                          <textarea
                            name="menuDescription"
                            value={formData.menuDescription}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Describe your menu items..."
                          />
                          <p className="text-sm text-amber-600 mt-2">
                            Note: Food vendor spaces are limited to 4-5 vendors with different menus.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Select Days */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Days</h2>
                      
                      <div className="space-y-4">
                        {eventDays.map((day) => (
                          <label
                            key={day.id}
                            className={`flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.selectedDays.includes(day.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedDays.includes(day.id)}
                              onChange={() => handleDayToggle(day.id)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div className="ml-4 flex-1">
                              <p className="font-semibold text-gray-900">{day.label}</p>
                              <p className="text-gray-500 text-sm">{day.hours}</p>
                            </div>
                            <span className="font-bold text-blue-600">${VENDOR_FEE_PER_DAY}</span>
                          </label>
                        ))}
                      </div>

                      <div className="border-t pt-6">
                        <label className={`flex items-center p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.needsElectricity
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}>
                          <input
                            type="checkbox"
                            name="needsElectricity"
                            checked={formData.needsElectricity}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex items-center gap-2">
                              <BoltIcon />
                              <p className="font-semibold text-gray-900">Add Electricity</p>
                            </div>
                            <p className="text-gray-500 text-sm">Power hookup for your booth</p>
                          </div>
                          <span className="font-bold text-amber-600">+${ELECTRICITY_FEE}</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Requirements or Notes
                        </label>
                        <textarea
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Any special setup needs, accessibility requirements, etc."
                        />
                      </div>

                      {/* Price Summary */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Price Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Booth Fee ({formData.selectedDays.length} day{formData.selectedDays.length !== 1 ? 's' : ''} × ${VENDOR_FEE_PER_DAY})</span>
                            <span>${formData.selectedDays.length * VENDOR_FEE_PER_DAY}</span>
                          </div>
                          {formData.needsElectricity && (
                            <div className="flex justify-between">
                              <span>Electricity</span>
                              <span>${ELECTRICITY_FEE}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span>Water</span>
                            <span className="text-green-600">FREE</span>
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
                      <p className="text-gray-600 mb-6">Choose your preferred payment method to complete registration.</p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handlePaymentSelect(method.id)}
                            disabled={!method.available}
                            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                              selectedPayment === method.id
                                ? 'border-blue-500 bg-blue-50'
                                : method.available
                                ? 'border-gray-200 hover:border-blue-300'
                                : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            {!method.available && (
                              <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                Coming Soon
                              </span>
                            )}
                            <div className="flex items-center gap-4">
                              {method.icon}
                              <span className="font-semibold text-gray-900">{method.name}</span>
                            </div>
                            {method.available && selectedPayment === method.id && (
                              <div className="mt-3 text-sm text-blue-600">
                                Click to view payment details
                              </div>
                            )}
                          </button>
                        ))}
                      </div>

                      {selectedPayment === 'zelle' && (
                        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                          <div className="flex items-start gap-4">
                            <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 24 24" fill="#6D1ED4">
                              <path d="M13.559 24h-2.841a.483.483 0 01-.483-.483v-2.765H5.638a.667.667 0 01-.475-1.133l8.478-8.792H5.638a.483.483 0 01-.483-.483V7.579a.483.483 0 01.483-.483h4.597V4.483c0-.267.216-.483.483-.483h2.841c.267 0 .483.216.483.483v2.613h4.597c.267 0 .483.216.483.483v2.765c0 .267-.216.483-.483.483h-4.597v.001l8.003 8.301a.667.667 0 01-.475 1.133h-4.597v2.765a.483.483 0 01-.483.483z"/>
                            </svg>
                            <div className="flex-1">
                              <h4 className="font-bold text-purple-800 mb-2">Zelle Payment Selected</h4>
                              <p className="text-purple-700 text-sm mb-3">
                                Send <strong>${calculateTotal().toFixed(2)}</strong> to:
                              </p>
                              <div className="bg-white rounded-lg p-3 mb-3">
                                <p className="font-medium">Fernandes.joanab@gmail.com</p>
                                <p className="text-sm text-gray-600">Joana Fernandes</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowPaymentModal(true)}
                                className="text-purple-600 font-medium hover:text-purple-800 underline"
                              >
                                View Full Payment Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Final Summary */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Registration Summary</h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">Business:</span>
                            <p className="font-medium">{formData.businessName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>
                            <p className="font-medium">{formData.contactName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <p className="font-medium">{formData.email}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="font-medium">{formData.phone}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Days:</span>
                            <p className="font-medium">
                              {formData.selectedDays.map((d) => eventDays.find((e) => e.id === d)?.label.split(',')[0]).join(', ')}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Electricity:</span>
                            <p className="font-medium">{formData.needsElectricity ? 'Yes (+$38)' : 'No'}</p>
                          </div>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-xl">
                          <span>Total Amount Due</span>
                          <span className="text-green-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertIcon />
                          <div>
                            <p className="font-semibold text-amber-800">Payment Confirmation Required</p>
                            <p className="text-amber-700 text-sm mt-1">
                              After completing payment, send proof to <strong>palmdesertfair@email.com</strong> to receive your booth map and setup instructions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    <button
                      type="submit"
                      disabled={!isStepValid() || isSubmitting}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                        isStepValid() && !isSubmitting
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isSubmitting && <LoadingSpinner />}
                      {currentStep === 3 ? (isSubmitting ? 'Submitting...' : 'Complete Registration') : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-white/10 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-blue-400">
                  <SnowflakeIcon />
                </div>
                <span className="text-white font-bold text-xl">Lake Chelan Winterfest</span>
              </div>
              <p className="text-gray-400">
                Join us for the most magical winter celebration in Washington State!
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Event Details</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CalendarIcon />
                  January 16-18, 2026
                </li>
                <li className="flex items-center gap-2">
                  <LocationIcon />
                  102 East Johnson Avenue
                </li>
                <li>Chelan, WA 98816</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <EmailIcon />
                  palmdesertfair@email.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 Lake Chelan Winterfest. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
