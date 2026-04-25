"use client";

import { useForm, Controller } from "react-hook-form";
import { Space, Typography } from "antd";
import { Input, RangePicker, Card, Button, Alert, UserTransfer } from "@/components/ui/AntD";
import { useState } from "react";
import { transformSemesterFromAPI, transformSemesterPayload } from "@/components/forms/semester/semester.transformers";
import DeleteButton from "@/components/ui/DeleteButton";
import { handleFormAction } from "@/helpers";

const { Text, Title } = Typography;

export default function SemesterForm({ 
  onSubmit, 
  onRemove,
  semester, 
  usersFromCurrentSemester, 
  users,
  isCurrentUserAdmin = false,
}) {
  const initialValues = transformSemesterFromAPI(semester, usersFromCurrentSemester);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues,
  });

  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    const payload = transformSemesterPayload(data);
    await handleFormAction(
      () => onSubmit(payload),
      setError,
      "An error occurred while saving the semester."
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {error && (
          <Alert
            title="Error"
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        <Card title={semester ? "Edit Semester" : "Add New Semester"}>
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>Semester Name</Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Semester name is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="e.g. Fall 2024" status={fieldState.error ? "error" : ""} />
                    {fieldState.error && <Text type="danger">{fieldState.error.message}</Text>}
                  </>
                )}
              />
            </div>

            <div>
              <Text strong>Select Date Range</Text>
              <Controller
                control={control}
                name="dates"
                rules={{ required: "Date range is required" }}
                render={({ field, fieldState }) => (
                  <div style={{ display: 'block' }}>
                    <RangePicker 
                      {...field} 
                      style={{ width: '100%' }}
                      status={fieldState.error ? "error" : ""}
                    />
                    {fieldState.error && <Text type="danger">{fieldState.error.message}</Text>}
                  </div>
                )}
              />
            </div>

            <div>
              <Text strong>Select Users</Text>
              <Controller
                control={control}
                name="users"
                render={({ field }) => (
                  <UserTransfer
                    users={users}
                    selectedUserKeys={field.value}
                    setSelectedUserKeys={(nextTargetKeys) => field.onChange(nextTargetKeys)}
                  />
                )}
              />
            </div>
          </Space>
        </Card>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Saving..." : (semester ? "Update Semester" : "Create Semester")}
        </Button>

        {semester && isCurrentUserAdmin && onRemove && (
          <Card 
            title={<Title level={4} type="danger" style={{ margin: 0 }}>Danger Zone</Title>}
            style={{ borderColor: "#ffa39e", backgroundColor: "#fff2f0" }}
          >
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Text>
                This permanently removes the semester and all its associated days, groups, and presentations from the database.
              </Text>
              <DeleteButton
                itemName="Semester"
                buttonText="Permanently Remove Semester"
                onConfirm={() => onRemove({ id: semester.id })}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
