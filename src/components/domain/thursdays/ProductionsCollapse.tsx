"use client";

import type { ReactNode } from "react";
import { Collapse } from "@/components/ui/AntD";

interface ProductionItem {
  id: string;
  name: string;
  location?: string;
  content: ReactNode;
}

interface ProductionsCollapseProps {
  productions: ProductionItem[];
  formattedDate?: string | null;
}

export default function ProductionsCollapse({ productions, formattedDate }: ProductionsCollapseProps) {
  return (
    <Collapse
      defaultActiveKey={productions.map((p) => p.id)}
      items={productions.map((p) => ({
        key: p.id,
        label: (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.name}</span>
            {p.location && (
              <>
                <span style={{ color: "#bbb", fontWeight: 400, fontSize: "1.05rem" }}>|</span>
                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{p.location}</span>
              </>
            )}
            {formattedDate && (
              <span style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                padding: "0.15rem 0.6rem",
                background: "linear-gradient(#ffa97a, #ffac78)",
                borderRadius: "4px",
                color: "#3d1f05",
              }}>
                {formattedDate}
              </span>
            )}
          </span>
        ),
        children: p.content,
      }))}
    />
  );
}
