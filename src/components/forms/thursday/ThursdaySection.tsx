"use client";

import { Controller, Control } from "react-hook-form";
import { Card, Input, DatePicker, Select } from "@/components/ui/AntD";
import { Typography } from "antd";
import dayjs from "dayjs";
import { ThursdayInput } from "@/components/forms/schemas";
import styles from "@/components/forms/thursday/ThursdaySection.module.css";

const { Text } = Typography;

interface ThursdaySectionProps {
  control: any;
  semesters?: Array<{ id: string; name: string }>;
}

export default function ThursdaySection({
  control,
  semesters,
}: ThursdaySectionProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className={semesters ? styles.formGrid : undefined}>
        {semesters && (
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Semester
            </Text>
            <Controller
              control={control}
              name="semesterId"
              render={({ field }) => (
                <Select
                  {...field}
                  options={semesters.map((s) => ({ label: s.name, value: s.id }))}
                  style={{ width: "100%" }}
                  size="large"
                />
              )}
            />
          </div>
        )}
        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Day Name
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Day name is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="Enter Day name"
                  size="large"
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
        <Text strong style={{ display: "block", marginBottom: "8px" }}>
          Date
        </Text>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Date is required" }}
          render={({ field, fieldState }) => (
            <>
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(d) =>
                  field.onChange(d && !Array.isArray(d) ? d.toISOString() : null)
                }
                style={{ width: "100%" }}
                size="large"
                format="MMM D, YYYY"
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
  );
}
