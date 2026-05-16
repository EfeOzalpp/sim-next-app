"use client";

import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Empty } from "antd";
import { Button, Collapse, Modal } from "@/components/ui/AntD";
import { DeleteOutlined } from "@ant-design/icons";
import ProductionForm from "@/components/forms/thursday/ProductionForm";
import { BasicUser, ProductionInput } from "@/components/forms/schemas";

interface ProductionsSectionProps {
  control: any;
  users: BasicUser[];
}

export default function ProductionsSection({
  control,
  users,
}: ProductionsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productions",
  });

  const watchProductions = useWatch({ control, name: "productions" });
  const thursdayDate = useWatch({ control, name: "date" });

  const formattedDate = thursdayDate
    ? new Date(thursdayDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <strong style={{ fontSize: "14px" }}>Productions</strong>
        <Button
          type="primary"
          onClick={() =>
            append({
              name: "",
              location: "Pozen Center",
              producers: [],
              presentations: [],
            })
          }
        >
          Add Production
        </Button>
      </div>

      {fields.length === 0 ? (
        <Empty
          description="No productions yet."
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Collapse
          defaultActiveKey={fields.map((f: any) => f.id)}
          items={fields.map((field: any, pIndex) => {
            const name = watchProductions?.[pIndex]?.name;
            const displayName = name || `Unnamed Production ${pIndex + 1}`;
            const label = (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                {displayName}{formattedDate && ` (${formattedDate})`}
              </span>
            );

            return {
              key: field.id,
              label,
              extra: (
                <DeleteOutlined
                  style={{ color: "#cf1322" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingRemoveIndex(pIndex);
                  }}
                />
              ),
              children: (
                <ProductionForm
                  productionIndex={pIndex}
                  control={control}
                  users={users}
                />
              ),
            };
          })}
        />
      )}

      <Modal
        title="Remove Production"
        open={pendingRemoveIndex !== null}
        onOk={() => {
          if (pendingRemoveIndex !== null) remove(pendingRemoveIndex);
          setPendingRemoveIndex(null);
        }}
        onCancel={() => setPendingRemoveIndex(null)}
        okText="Confirm Delete"
        okButtonProps={{ className: "neo-brutal-button neo-pressable neo-red", style: { border: "none" } }}
        cancelText="Cancel"
      >
        <p><strong>Are you sure you want to remove this production?</strong></p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
