"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Space, Typography } from "antd";
import {
  Input,
  RangePicker,
  Select,
  Card,
  Button,
  Alert,
} from "@/components/ui/AntD";
import {
  transformSemesterFromAPI,
  transformSemesterPayload,
} from "@/components/forms/semester/semester.transformers";
import DeleteButton from "@/components/ui/DeleteButton";
import { handleFormAction } from "@/helpers";
import { BasicUser, SemesterInput } from "@/components/forms/schemas";
import { ActionResult } from "@/actions/utilities";

const { Text, Title } = Typography;

interface SemesterFormValues extends Omit<SemesterInput, "dates" | "users"> {
  dates: [any, any] | null;
  users: string[];
}

interface SemesterFormProps {
  onSubmit: (data: any) => Promise<ActionResult<any> | any>;
  onRemove?: (data: { id: string }) => void;
  semester?: any;
  usersFromCurrentSemester?: BasicUser[];
  users: BasicUser[];
  isCurrentUserAdmin?: boolean;
}

export default function SemesterForm({
  onSubmit,
  onRemove,
  semester,
  usersFromCurrentSemester,
  users,
  isCurrentUserAdmin = false,
}: SemesterFormProps) {
  const initialValues = transformSemesterFromAPI(
    semester,
    usersFromCurrentSemester,
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SemesterFormValues>({
    defaultValues: initialValues as any,
  });

  const [error, setError] = useState<string | null>(null);


  const handleFormSubmit = async (data: SemesterFormValues) => {
    const payload = transformSemesterPayload(data);
    await handleFormAction(
      () => onSubmit(payload),
      setError,
      "An error occurred while saving the semester.",
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {error && (
          <Alert
            description={error}
            type="error"
            showIcon
            closable
          />
        )}
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>Semester Name</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Semester name is required" }}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="e.g. Fall 2024"
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
            <Text strong style={{ display: "block", marginBottom: "8px" }}>Select Date Range</Text>
            <Controller
              control={control}
              name="dates"
              rules={{ required: "Date range is required" }}
              render={({ field, fieldState }) => (
                <div style={{ display: "block" }}>
                  <RangePicker
                    {...field}
                    style={{ width: "100%" }}
                    status={fieldState.error ? "error" : ""}
                  />
                  {fieldState.error && (
                    <Text type="danger">{fieldState.error.message}</Text>
                  )}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              control={control}
              name="users"
              render={({ field }) => (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                    <Text strong>Select Users</Text>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => field.onChange(users.map((u) => u.id))}
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
                  options={[...users]
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

        <Button type="submit" disabled={isSubmitting} className="neo-green" style={{ width: "100%" }}>
          {isSubmitting
            ? "Saving..."
            : semester
              ? "Save Changes"
              : "Create Semester"}
        </Button>

        {semester && isCurrentUserAdmin && onRemove && (
          <Card
            title={
              <Title level={4} type="danger" style={{ margin: 0 }}>
                Danger Zone
              </Title>
            }
            style={{ borderColor: "#ffa39e", backgroundColor: "#fff2f0" }}
          >
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Text>
                This permanently removes the semester and all its associated
                days, productions, and presentations from the database.
              </Text>
              <DeleteButton
                itemName={semester.name + "?"}
                buttonText="Permanently remove Semester"
                onConfirm={() => onRemove({ id: semester.id })}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
