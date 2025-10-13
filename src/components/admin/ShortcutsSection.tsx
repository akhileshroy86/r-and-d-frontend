'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const ShortcutsSection: React.FC = () => {
  const shortcuts = [
    { icon: 'pi pi-plus', label: 'Create\nAppointment', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: 'pi pi-bars', label: 'Open Queue\nBoard', bgColor: 'bg-green-50', iconColor: 'text-green-600' },
    { image: 'https://img.icons8.com/fluency/48/add-user-male.png', label: 'Add Walk-In', bgColor: 'bg-orange-50' },
    { image: 'https://img.icons8.com/fluency/48/download.png', label: 'Download\nDay Report', bgColor: 'bg-purple-50' },
    { image: 'https://img.icons8.com/fluency/48/payment-history.png', label: 'Payment\nReconciliation', bgColor: 'bg-blue-50' },
    { image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=100&h=100&fit=crop&crop=center', label: 'Hospital Info', bgColor: 'bg-green-50' },
    { image: 'https://img.icons8.com/fluency/48/settings.png', label: 'Settings', bgColor: 'bg-gray-50' },
    { image: 'https://img.icons8.com/fluency/48/analytics.png', label: 'Analytics\nDashboard', bgColor: 'bg-red-50' }
  ];

  const systemStatus = [
    { name: 'Voice System', status: 'OK', bgColor: 'rgb(246, 247, 247)', textColor: 'rgb(55, 65, 81)', iconColor: 'rgb(34, 197, 94)' },
    { name: 'Queue Engine', status: 'OK', bgColor: 'rgb(237, 248, 241)', textColor: 'rgb(55, 65, 81)', iconColor: 'rgb(34, 197, 94)' },
    { name: 'Payments', status: 'OK', bgColor: 'rgb(245, 253, 247)', textColor: 'rgb(55, 65, 81)', iconColor: 'rgb(34, 197, 94)' },
    { name: 'SMS/Email', status: 'Delayed', bgColor: 'rgb(236, 246, 240)', textColor: 'rgb(55, 65, 81)', iconColor: 'rgb(245, 158, 11)', statusColor: 'rgb(245, 158, 11)' }
  ];

  const alerts = [
    {
      title: 'Subscription Expiring',
      message: 'Your premium plan expires in 7 days',
      action: 'Renew Now',
      bgColor: 'rgb(250, 247, 247)',
      titleColor: 'rgb(220, 38, 38)',
      descColor: 'rgb(107, 114, 128)',
      actionColor: 'rgb(220, 38, 38)',
      borderColor: 'border-left-4 border-red-500'
    },
    {
      title: 'Payment Webhook Failed',
      message: '3 webhook deliveries failed for Razorpay',
      action: 'Check Config',
      bgColor: 'rgb(248, 227, 227)',
      titleColor: 'rgb(234, 88, 12)',
      descColor: 'rgb(107, 114, 128)',
      actionColor: 'rgb(234, 88, 12)',
      borderColor: 'border-left-4 border-orange-500'
    },
    {
      title: 'Doctor Off-Days',
      message: 'Dr. Singh is on leave today - 15 appointments affected',
      action: 'Reschedule',
      bgColor: 'rgb(254, 249, 242)',
      titleColor: 'rgb(37, 99, 235)',
      descColor: 'rgb(107, 114, 128)',
      actionColor: 'rgb(37, 99, 235)',
      borderColor: 'border-left-4 border-blue-500'
    },
    {
      title: 'Payment Dispute',
      message: 'Customer disputed payment for BK4815',
      action: 'Review',
      bgColor: 'rgb(245, 239, 214)',
      titleColor: 'rgb(234, 88, 12)',
      descColor: 'rgb(107, 114, 128)',
      actionColor: 'rgb(234, 88, 12)',
      borderColor: 'border-left-4 border-orange-500'
    }
  ];

  const headerTemplate = () => (
    <div style={{ paddingTop: '12px', paddingLeft: '24px' }}>
      <h3 className="m-0 text-900 font-semibold">Shortcuts & Tools</h3>
      <p className="text-600 text-sm mt-1 mb-0">Quick access to frequently used actions</p>
    </div>
  );

  return (
    <Card header={headerTemplate}>
      {/* Shortcuts Grid */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {shortcuts.map((shortcut, index) => (
          <div key={index} className="border-1 surface-border border-round p-4 text-center cursor-pointer hover:shadow-2 transition-all transition-duration-200" style={{ minWidth: '140px', flex: '1' }}>
            <div className={`w-3rem h-3rem ${shortcut.bgColor} border-round flex align-items-center justify-content-center mx-auto mb-3`}>
              {shortcut.icon ? (
                <i className={`${shortcut.icon} text-xl ${shortcut.iconColor}`}></i>
              ) : (
                <img src={shortcut.image} alt={shortcut.label} className="w-2rem h-2rem" style={{ borderRadius: '4px' }} />
              )}
            </div>
            <div className="text-sm font-medium text-900 line-height-3" style={{ whiteSpace: 'pre-line' }}>{shortcut.label}</div>
          </div>
        ))}
      </div>

      {/* System Status and Alerts */}
      <div className="flex gap-4">
        {/* System Status */}
        <div style={{ width: '50%' }}>
          <div className="bg-white border-1 surface-border border-round p-4">
            <div className="flex align-items-center justify-content-between mb-4">
              <h4 className="text-900 font-semibold m-0">System Status</h4>
              <div className="flex align-items-center gap-2">
                <span className="text-xs text-600">All systems operational</span>
                <div className="w-0.5rem h-0.5rem bg-green-500 border-circle"></div>
              </div>
            </div>
            <div className="flex flex-column gap-3">
              {systemStatus.map((system, index) => (
                <div key={index} className="flex align-items-center justify-content-between py-2" style={{ backgroundColor: system.bgColor }}>
                  <div className="flex align-items-center gap-3">
                    <div className="w-0.75rem h-0.75rem border-circle" style={{ backgroundColor: system.iconColor }}></div>
                    <span className="font-medium" style={{ color: system.textColor }}>{system.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: system.statusColor || system.textColor }}>{system.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div style={{ width: '50%' }}>
          <div className="bg-white border-1 surface-border border-round p-4">
            <div className="flex align-items-center justify-content-between mb-4">
              <h4 className="text-900 font-semibold m-0">Active Alerts</h4>
              <span className="text-xs text-600">{alerts.length} active</span>
            </div>
            <div className="flex flex-column gap-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-3 ${alert.borderColor} border-round`} style={{ backgroundColor: alert.bgColor }}>
                  <div className="flex align-items-start justify-content-between">
                    <div className="flex-1">
                      <div className="font-semibold mb-1 text-sm" style={{ color: alert.titleColor }}>{alert.title}</div>
                      <div className="text-xs mb-2" style={{ color: alert.descColor }}>{alert.message}</div>
                    </div>
                    <Button 
                      label={alert.action}
                      className="p-button-text p-button-sm"
                      style={{ color: alert.actionColor }}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShortcutsSection;