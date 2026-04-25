"use client";

import { Controller } from "react-hook-form";
import { Space } from "antd";
import { Card, Input, Select, UserTransfer, Button } from "@/components/ui/AntD";
import { DeleteOutlined } from "@ant-design/icons";
import PresentationsField from "@/components/forms/thursday/PresentationsField";

const LOCATIONS = [
  { label: "Pozen Center", value: "Pozen Center" },
  { label: "Studio A", value: "Studio A" },
  { label: "Studio B", value: "Studio B" },
  { label: "Main Hall", value: "Main Hall" },
  // Add more locations as needed
];

export default function GroupForm({
  groupIndex,
  control,
  users,
  onRemove,
}) {
  return (
    <Card
      size="small"
      title={`Group ${groupIndex + 1}`}
      extra={
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={onRemove}
        >
          Remove Group
        </Button>
      }
    >
      <Space orientation="vertical" style={{ width: "100%" }} size="large">
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Group Name
          </label>
          <Controller
            control={control}
            name={`groups.${groupIndex}.name`}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter group name"
              />
            )}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Location
          </label>
          <Controller
            control={control}
            name={`groups.${groupIndex}.location`}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select location"
                options={LOCATIONS}
                allowClear
              />
            )}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
            Producers & Faculty
          </label>
          <Controller
            control={control}
            name={`groups.${groupIndex}.producers`}
            render={({ field }) => (
              <UserTransfer
                users={users}
                selectedUserKeys={field.value || []}
                setSelectedUserKeys={field.onChange}
              />
            )}
          />
        </div>

        <PresentationsField
          groupIndex={groupIndex}
          control={control}
          users={users}
        />
      </Space>
    </Card>
  );
}
