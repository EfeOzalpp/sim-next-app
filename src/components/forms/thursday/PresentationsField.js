"use client";

import { Controller, useFieldArray } from "react-hook-form";
import { Space } from "antd";
import { Card, Input, UserTransfer, Collapse, Button } from "@/components/ui/AntD";
import { DeleteOutlined } from "@ant-design/icons";

export default function PresentationsField({
  groupIndex,
  control,
  users,
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `groups.${groupIndex}.presentations`,
  });

  return (
    <Card
      title="Presentations"
      size="small"
      extra={
        <Button
          type="primary"
          size="small"
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
        <p style={{ color: "#999", fontStyle: "italic" }}>
          No presentations yet. Click "Add Presentation" to create one.
        </p>
      ) : (
        <Collapse
          items={fields.map((field, pIndex) => ({
            key: field.id,
            label: `Presentation ${pIndex + 1}: ${field.name || "(unnamed)"}`,
            children: (
              <Space orientation="vertical" style={{ width: "100%" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Presentation Name
                  </label>
                  <Controller
                    control={control}
                    name={`groups.${groupIndex}.presentations.${pIndex}.name`}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter presentation name"
                      />
                    )}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Presenters
                  </label>
                  <Controller
                    control={control}
                    name={`groups.${groupIndex}.presentations.${pIndex}.presenters`}
                    render={({ field }) => (
                      <UserTransfer
                        users={users}
                        selectedUserKeys={field.value || []}
                        setSelectedUserKeys={field.onChange}
                      />
                    )}
                  />
                </div>

                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(pIndex)}
                >
                  Remove Presentation
                </Button>
              </Space>
            ),
          }))}
        />
      )}
    </Card>
  );
}
