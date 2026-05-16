"use client";

import { useState } from "react";
import { Controller, useFieldArray, Control, useWatch } from "react-hook-form";
import { Empty, Space, Typography } from "antd";
import {
  Input,
  Select,
  Collapse,
  Button,
  Modal,
} from "@/components/ui/AntD";
import { DeleteOutlined } from "@ant-design/icons";
import { BasicUser } from "@/components/forms/schemas";

const { Text } = Typography;

interface PresentationsFieldProps {
  productionIndex: number;
  control: any;
  users: BasicUser[];
}

export default function PresentationsField({
  productionIndex,
  control,
  users,
}: PresentationsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `productions.${productionIndex}.presentations`,
  });

  const watchPresentations = useWatch({
    control,
    name: `productions.${productionIndex}.presentations`,
  });

  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);
  const studentUsers = users.filter((u) => (u as any).role === "STUDENT");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <strong style={{ fontSize: "14px" }}>Presentations</strong>
        <Button
          type="primary"
          onClick={() =>
            append({
              name: "",
              presenters: [],
            })
          }
        >
          Add Presentation
        </Button>
      </div>

      {fields.length === 0 ? (
        <Empty
          description="No presentations yet."
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Collapse
          items={fields.map((field: any, pIndex) => {
            const name = watchPresentations?.[pIndex]?.name;
            const label = name
              ? `Presentation ${pIndex + 1}: ${name}`
              : `Unnamed Presentation ${pIndex + 1}`;

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
                <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                  <div>
                    <Text strong style={{ display: "block", marginBottom: "8px" }}>
                      Presentation Name
                    </Text>
                    <Controller
                      control={control}
                      name={`productions.${productionIndex}.presentations.${pIndex}.name`}
                      rules={{ required: "Presentation name is required" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Input
                            {...field}
                            placeholder="Enter presentation name"
                            status={fieldState.error ? "error" : ""}
                          />
                          {fieldState.error && (
                            <Text type="danger">{fieldState.error.message}</Text>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      control={control}
                      name={`productions.${productionIndex}.presentations.${pIndex}.presenters`}
                      render={({ field }) => (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                            <Text strong>Presenters</Text>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => field.onChange(studentUsers.map((u) => u.id))}
                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.8rem", color: "#15803d", fontWeight: 600 }}
                              >
                                Select all
                              </button>
                              <span style={{ color: "#ccc", fontWeight: 300, userSelect: "none" }}>|</span>
                              <button
                                type="button"
                                onClick={() => field.onChange([])}
                                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.8rem", color: "#cf1322", fontWeight: 600 }}
                              >
                                Unselect all
                              </button>
                            </div>
                          </div>
                          <Select
                            {...field}
                            mode="multiple"
                            showSearch
                            maxTagCount={12}
                            maxTagPlaceholder={(omitted) => `+${omitted.length} more users`}
                            placeholder="Search and select presenters..."
                            style={{ width: "100%" }}
                            filterOption={(input, option) =>
                              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                            options={[
                              ...studentUsers,
                              ...users.filter(
                                (u) => (field.value ?? []).includes(u.id) && (u as any).role !== "STUDENT"
                              ),
                            ]
                              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                              .map((u) => ({ value: u.id, label: u.name ?? "Unnamed User" }))}
                            optionRender={(option) => {
                              const isSelected = (field.value ?? []).includes(option.value as string);
                              return (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    flexShrink: 0,
                                    background: isSelected ? "#dcfce7" : "#fff2f0",
                                    color: isSelected ? "#15803d" : "#cf1322",
                                  }}>
                                    {isSelected ? "Selected" : "Unselected"}
                                  </span>
                                  <span style={{ fontWeight: 600 }}>{option.label}</span>
                                </div>
                              );
                            }}
                          />
                        </>
                      )}
                    />
                  </div>
                </Space>
              ),
            };
          })}
        />
      )}

      <Modal
        title="Remove Presentation"
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
        <p><strong>Are you sure you want to remove this presentation?</strong></p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
