"use client";

import React from "react";
import { useFieldArray, Control, useWatch } from "react-hook-form";
import { Empty } from "antd";
import { Card, Button, Collapse } from "@/components/ui/AntD";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
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

  const watchProductions = useWatch({
    control,
    name: "productions",
  });

  return (
    <Card
      title="Productions"
      extra={
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
      }
    >
      {fields.length === 0 ? (
        <Empty
          description="No productions yet."
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Collapse
          items={fields.map((field: any, pIndex) => {
            const name = watchProductions?.[pIndex]?.name;
            const label = name 
              ? `Production ${pIndex + 1}: ${name}`
              : `Unnamed Production ${pIndex + 1}`;
            
            return {
              key: field.id,
              label,
              extra: (
                <DeleteOutlined
                  style={{ color: "#ff4d4f" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(pIndex);
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
    </Card>
  );
}
