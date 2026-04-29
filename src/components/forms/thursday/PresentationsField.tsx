"use client";

import React from "react";
import { Controller, useFieldArray, Control, useWatch } from "react-hook-form";
import { Empty, Space, Typography } from "antd";
import {
  Card,
  Input,
  UserTransfer,
  Collapse,
  Button,
} from "@/components/ui/AntD";
import { DeleteOutlined } from "@ant-design/icons";
import { BasicUser, ProductionInput } from "@/components/forms/schemas";

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

  return (
    <Card
      title="Presentations"
      size="small"
      extra={
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
      }
    >
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
                  style={{ color: "#ff4d4f" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(pIndex);
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
                    <Text strong style={{ display: "block", marginBottom: "8px" }}>
                      Presenters
                    </Text>
                    <Controller
                      control={control}
                      name={`productions.${productionIndex}.presentations.${pIndex}.presenters`}
                      render={({ field }) => (
                        <UserTransfer
                          users={users}
                          selectedUserKeys={field.value || []}
                          setSelectedUserKeys={field.onChange}
                        />
                      )}
                    />
                  </div>
                </Space>
              ),
            };
          })}
        />
      )}
    </Card>
  );
}
