"use client";

import { Controller, Control } from "react-hook-form";
import { Space } from "antd";
import {
  Input,
  Select,
  Button,
} from "@/components/ui/AntD";
import { Typography } from "antd";
import PresentationsField from "@/components/forms/thursday/PresentationsField";
import { BasicUser, ProductionInput } from "@/components/forms/schemas";
import styles from "@/components/forms/thursday/ProductionForm.module.css";

const { Text } = Typography;

const LOCATIONS = [
  { label: "Pozen Center", value: "Pozen Center" },
  { label: "Studio A", value: "Studio A" },
  { label: "Studio B", value: "Studio B" },
  { label: "Main Hall", value: "Main Hall" },
];

interface ProductionFormProps {
  productionIndex: number;
  control: any;
  users: BasicUser[];
}

export default function ProductionForm({
  productionIndex,
  control,
  users,
}: ProductionFormProps) {
  const producerUsers = users.filter((u) => (u as any).role !== "STAFF");

  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="large">
      <div className={styles.formGrid}>
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Production Name
          </Text>
          <Controller
            control={control}
            name={`productions.${productionIndex}.name`}
            rules={{ required: "Production name is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="Enter production name"
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
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Location
          </Text>
          <Controller
            control={control}
            name={`productions.${productionIndex}.location`}
            rules={{ required: "Location is required" }}
            render={({ field, fieldState }) => (
              <>
                <Select
                  {...field}
                  placeholder="Select location"
                  options={LOCATIONS}
                  allowClear
                  style={{ width: "100%" }}
                  status={fieldState.error ? "error" : ""}
                />
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div>
        <Controller
          control={control}
          name={`productions.${productionIndex}.producers`}
          render={({ field }) => (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <Text strong>Producers & Faculty</Text>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => field.onChange(producerUsers.map((u) => u.id))}
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
                placeholder="Search and select users..."
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  ...producerUsers,
                  ...users.filter(
                    (u) => (field.value ?? []).includes(u.id) && (u as any).role === "STAFF"
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

      <PresentationsField
        productionIndex={productionIndex}
        control={control}
        users={users}
      />
    </Space>
  );
}
