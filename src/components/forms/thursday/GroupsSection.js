"use client";

import { useFieldArray, Controller } from "react-hook-form";
import { Space, Empty } from "antd";
import { Card, Button, Collapse } from "@/components/ui/AntD";
import { PlusOutlined } from "@ant-design/icons";
import GroupForm from "@/components/forms/thursday/GroupForm";

export default function GroupsSection({ control, users }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
  });

  return (
    <Card
      title="Groups"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            append({
              name: "",
              location: "",
              producers: [],
              presentations: [],
            })
          }
        >
          Add Group
        </Button>
      }
    >
      {fields.length === 0 ? (
        <Empty
          description="No groups yet"
          style={{ padding: "24px 0" }}
        />
      ) : (
        <Collapse
          items={fields.map((field, gIndex) => ({
            key: field.id,
            label: `Group ${gIndex + 1}: ${field.name || "(unnamed)"}`,
            children: (
              <GroupForm
                groupIndex={gIndex}
                control={control}
                users={users}
                onRemove={() => remove(gIndex)}
              />
            ),
          }))}
        />
      )}
    </Card>
  );
}
