"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Space, Typography } from "antd";
import { Card, Button, Alert } from "@/components/ui/AntD";
import {
  transformThursdayFromAPI,
  transformThursdayPayload,
} from "@/components/forms/thursday/thursday.transformers";
import ThursdaySection from "@/components/forms/thursday/ThursdaySection";
import ProductionsSection from "@/components/forms/thursday/ProductionsSection";
import DeleteButton from "@/components/ui/DeleteButton";
import { handleFormAction } from "@/helpers";
import {
  BasicUser,
  ProductionInput,
  ThursdayInput,
} from "@/components/forms/schemas";
import { ActionResult } from "@/actions/utilities";

const { Title, Text } = Typography;

interface ThursdayFormValues extends Omit<ThursdayInput, "date"> {
  productions: ProductionInput[];
  semesterId: string | null;
  date: any;
}

interface ThursdayFormProps {
  defaultValues?: any;
  users: BasicUser[];
  semesters: Array<{ id: string; name: string }>;
  thursdayId?: string;
  onSubmit: (data: any) => Promise<ActionResult<any> | any>;
  onRemove?: (data: { id: string }) => void;
  isCurrentUserAdmin?: boolean;
}

export default function ThursdayForm({
  defaultValues,
  users,
  semesters,
  thursdayId,
  onSubmit,
  onRemove,
  isCurrentUserAdmin = false,
}: ThursdayFormProps) {
  // Transform API data into form shape if provided
  const initialValues: ThursdayFormValues = defaultValues
    ? transformThursdayFromAPI(defaultValues)
    : {
        name: "",
        date: "",
        semesterId: semesters?.[0]?.id || null,
        productions: [],
      };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ThursdayFormValues>({
    defaultValues: initialValues as any,
  });

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: ThursdayFormValues) => {
    const payload = transformThursdayPayload(data);
    await handleFormAction(
      () => onSubmit(payload),
      setError,
      "An error occurred while saving Day.",
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
            showIcon
          />
        )}

        <ThursdaySection control={control} semesters={semesters} />
        <ProductionsSection control={control} users={users} />

        <Button type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
          {isSubmitting
            ? "Saving..."
            : thursdayId
              ? "Update Day"
              : "Create Day"}
        </Button>

        {thursdayId && isCurrentUserAdmin && onRemove && (
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
                This permanently removes this Day and all its associated
                productions and presentations from the database.
              </Text>
              <DeleteButton
                itemName={defaultValues.name + "?"}
                buttonText="Permanently remove"
                onConfirm={() => onRemove({ id: thursdayId })}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
