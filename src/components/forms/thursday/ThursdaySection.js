"use client";

import { Controller } from "react-hook-form";
import { Card, Input, DatePicker, Select } from "@/components/ui/AntD";
import dayjs from "dayjs";

export default function ThursdaySection({ control, semesters }) {
  return (
    <Card title="Day Details">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {semesters && (
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
              Semester
            </label>
            <Controller
              control={control}
              name="semesterId"
              render={({ field }) => (
                <Select
                  {...field}
                  options={semesters.map(s => ({ label: s.name, value: s.id }))}
                  style={{ width: "100%" }}
                  size="large"
                />
              )}
            />
          </div>
        )}
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Day Name
          </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter Day name"
                size="large"
              />
            )}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Date
          </label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(d) =>
                  field.onChange(d ? d.toISOString() : null)
                }
                style={{ width: "100%" }}
                size="large"
              />
            )}
          />
        </div>
      </div>
    </Card>
  );
}
