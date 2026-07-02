import React, { useState } from 'react';

interface TabsProps {
  tabs: { id: string; label: string }[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div>
      <div className="flex border-b border-base-800 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[var(--tenant-accent)] border-b-2 border-[var(--tenant-accent)]'
                : 'text-support-300 hover:text-support-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children(activeTab)}
    </div>
  );
};
