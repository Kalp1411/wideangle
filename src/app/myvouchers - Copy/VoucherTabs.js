'use client';

import { useState } from 'react';

const TABS = ['Active', 'Used', 'Expired'];

const VOUCHERS = {
  Active: [
    { id: 1, logo: '🍟', logoClass: 'sl-mcdo',      name: 'Get 20% off',                          pts: '750 points',   date: 'May 30, 2026 — 12:44 PM' },
    { id: 2, logo: '🍔', logoClass: 'sl-bk',        name: 'Burger King Anyone?',                  pts: '750 points',   date: 'May 30, 2026 — 12:44 PM' },
    { id: 3, logo: '🍗', logoClass: 'sl-kfc',       name: 'Wednesday Special',                    pts: '50 points',    date: 'May 30, 2026 — 12:44 PM' },
    { id: 4, logo: '☕', logoClass: 'sl-starbucks', name: 'Up to 50% off or "Buy 1 Get 1 Free"', pts: '3,750 points', date: 'May 30, 2026 — 12:44 PM' },
    { id: 5, logo: '👟', logoClass: 'sl-nike',      name: 'Uncover Fashion Secrets',              pts: '500 points',   date: 'May 30, 2026 — 12:44 PM' },
    { id: 6, logo: '🍕', logoClass: 'sl-pizahut',   name: 'Pizza Party Anyone? Get..',            pts: '500 points',   date: 'May 30, 2026 — 12:44 PM' },
  ],
  Used: [
    { id: 7, logo: '🍔', logoClass: 'sl-bk',        name: 'Whopper Wednesday Deal',               pts: '300 points',   date: 'Apr 15, 2026 — 08:20 PM' },
    { id: 8, logo: '☕', logoClass: 'sl-starbucks', name: 'Free Tall Latte',                      pts: '1,200 points', date: 'Mar 22, 2026 — 10:05 AM' },
    { id: 9, logo: '🍕', logoClass: 'sl-dominos',   name: 'Buy 1 Get 1 Large Pizza',             pts: '800 points',   date: 'Feb 10, 2026 — 07:30 PM' },
  ],
  Expired: [
    { id: 10, logo: '🍟', logoClass: 'sl-mcdo',     name: 'McSaver Combo — 15% Off',              pts: '400 points',   date: 'Jan 01, 2026 — 11:59 PM' },
    { id: 11, logo: '🍗', logoClass: 'sl-kfc',      name: 'Zinger Box Meal Deal',                 pts: '600 points',   date: 'Dec 31, 2025 — 11:59 PM' },
  ],
};

const EMPTY_MESSAGES = {
  Used:    { icon: '🎫', title: 'No Used Vouchers', subtitle: 'Vouchers you\'ve redeemed will appear here.' },
  Expired: { icon: '⏰', title: 'No Expired Vouchers', subtitle: 'Expired vouchers will be listed here.' },
};

export default function VoucherTabs() {
  const [activeTab, setActiveTab] = useState('Active');

  const vouchers = VOUCHERS[activeTab] ?? [];
  const empty    = EMPTY_MESSAGES[activeTab];

  return (
    <>
      <div className="voucher-header">
        <div className="voucher-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`vtab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
              aria-selected={activeTab === tab}
              role="tab"
            >
              {tab}
              {VOUCHERS[tab].length > 0 && (
                <span className="vtab-count">{VOUCHERS[tab].length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div
        className="voucher-list"
        id={`voucher-${activeTab.toLowerCase()}`}
        role="tabpanel"
        aria-label={`${activeTab} vouchers`}
      >
        {vouchers.length > 0 ? (
          vouchers.map((v) => (
            <a key={v.id} className="voucher-item" href="#">
              <div className={`v-logo ${v.logoClass}`}>{v.logo}</div>
              <div className="v-info">
                <div className="v-name">{v.name}</div>
                <div className="v-pts">{v.pts}</div>
                <div className="v-date">{v.date}</div>
              </div>
              <div className="v-arrow">&rsaquo;</div>
            </a>
          ))
        ) : (
          <div className="voucher-empty">
            <div className="voucher-empty-icon">{empty.icon}</div>
            <div className="voucher-empty-title">{empty.title}</div>
            <div className="voucher-empty-subtitle">{empty.subtitle}</div>
          </div>
        )}
      </div>
    </>
  );
}
