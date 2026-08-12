"use client";

import { useState, type ReactNode } from "react";

type Tab = "info" | "chuong";

type Props = {
  defaultTab?: Tab;
  info: ReactNode;
  chuong: ReactNode;
  chapterCount: number;
};

/** Tab Opennote: text + underline, không pill/nền. State cục bộ (không URL). */
export function NovelDetailTabs({ defaultTab = "info", info, chuong, chapterCount }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <>
      <div className="mb-6 flex gap-6 border-b border-line">
        <TabButton active={tab === "info"} onClick={() => setTab("info")}>
          Thông tin
        </TabButton>
        <TabButton active={tab === "chuong"} onClick={() => setTab("chuong")}>
          Chương ({chapterCount})
        </TabButton>
      </div>

      <div hidden={tab !== "info"}>{info}</div>
      <div hidden={tab !== "chuong"}>{chuong}</div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 pb-2.5 text-sm ${
        active ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink-2"
      }`}
    >
      {children}
    </button>
  );
}
