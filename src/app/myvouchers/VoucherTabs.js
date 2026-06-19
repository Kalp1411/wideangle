'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPurchasedPerks } from '@/store/dashboardSlice';
import { toast } from 'sonner';

const TABS = ['Active', 'Used', 'Expired'];

const STATUS_MAP = { Active: 'active', Used: 'used', Expired: 'expired' };

const EMPTY_MESSAGES = {
  Active:  { icon: '🎟️', title: 'No Active Vouchers',  subtitle: 'Your active vouchers will appear here.' },
  Used:    { icon: '🎫', title: 'No Used Vouchers',     subtitle: "Vouchers you've redeemed will appear here." },
  Expired: { icon: '⏰', title: 'No Expired Vouchers',  subtitle: 'Expired vouchers will be listed here.' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function VoucherTabs() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('Active');
  const [tabData, setTabData]     = useState({ Active: null, Used: null, Expired: null });
  const [loading, setLoading]     = useState(false);
  const [counts, setCounts]       = useState({ Active: 0, Used: 0, Expired: 0 });

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  async function loadTab(tab) {
    if (tabData[tab] !== null) return;
    setLoading(true);
    try {
      const res = await dispatch(fetchPurchasedPerks(STATUS_MAP[tab])).unwrap();
      const list = Array.isArray(res) ? res : [];
      setTabData((prev) => ({ ...prev, [tab]: list }));
      setCounts((prev) => ({ ...prev, [tab]: list.length }));
    } catch {
      setTabData((prev) => ({ ...prev, [tab]: [] }));
    } finally {
      setLoading(false);
    }
  }

  const vouchers = tabData[activeTab] ?? [];
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
              {counts[tab] > 0 && (
                <span className="vtab-count">{counts[tab]}</span>
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
        {loading ? (
          <div className="voucher-empty">
            <div className="voucher-empty-title">Loading...</div>
          </div>
        ) : vouchers.length > 0 ? (
          vouchers.map((v) => (
            <div key={v.purchase_id} className="voucher-item">
              <div className="v-logo">
                {v.perk_logo ? (
                  <img src={v.perk_logo} alt={v.perk_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <span>{v.perk_name?.[0] ?? '?'}</span>
                )}
              </div>
              <div className="v-info">
                <div className="v-name">{v.perk_name}</div>
                <div className="v-pts">{v.point_cost} points</div>
                <div className="v-date">
                  Purchased: {formatDate(v.purchase_date)}
                  {v.expire_date && ` · Expires: ${formatDate(v.expire_date)}`}
                </div>
                <div className="v-code">Code: <strong>{v.code}</strong></div>
              </div>
              {activeTab === 'Active' && (
                <button
                  onClick={() => { navigator.clipboard.writeText(v.code); toast.success('Code copied!'); }}
                  style={{ padding: '6px 12px', fontSize: '12px', background: '#f28c28', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Copy Code
                </button>
              )}
              <div className="v-arrow">&rsaquo;</div>
            </div>
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