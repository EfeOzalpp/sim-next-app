"use client";

import { useForm } from "react-hook-form";
import { Space, Typography } from "antd";
import { Card, Button, Alert } from "@/components/ui/AntD";
import { transformThursdayFromAPI, transformThursdayPayload } from "@/components/forms/thursday/thursday.transformers";
import ThursdaySection from "@/components/forms/thursday/ThursdaySection";
import GroupsSection from "@/components/forms/thursday/GroupsSection";
import DeleteButton from "@/components/ui/DeleteButton";
import { useState } from "react";
import { handleFormAction } from "@/helpers";

const { Title, Text } = Typography;

export default function ThursdayForm({
  defaultValues,
  users,
  semesters,
  thursdayId,
  onSubmit,
  onRemove,
  isCurrentUserAdmin = false,
}) {
  // Transform API data into form shape if provided
  const initialValues = defaultValues
    ? transformThursdayFromAPI(defaultValues)
    : {
        name: "",
        date: null,
        semesterId: semesters?.[0]?.id || null,
        groups: [],
      };

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues,
  });

  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    const payload = transformThursdayPayload(data);
    await handleFormAction(
      () => onSubmit(payload),
      setError,
      "An error occurred while saving Day."
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        {error && (
          <Alert
            title="Error"
            description={error}
            type="error"
            closable
            showIcon
          />
        )}

        <ThursdaySection control={control} semesters={semesters} />
        <GroupsSection control={control} users={users} />

        <Button
          type="submit"
          disabled={isSubmitting}
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Saving..." : (thursdayId ? "Update Day" : "Create Day")}
        </Button>

        {thursdayId && isCurrentUserAdmin && onRemove && (
          <Card 
            title={<Title level={4} type="danger" style={{ margin: 0 }}>Danger Zone</Title>}
            style={{ borderColor: "#ffa39e", backgroundColor: "#fff2f0" }}
          >
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Text>
                This permanently removes this Day and all its associated groups and presentations from the database.
              </Text>
              <DeleteButton
                itemName="Day"
                buttonText="Permanently Remove Day"
                onConfirm={() => onRemove({ id: thursdayId })}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
