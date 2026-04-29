"use client";

import React from "react";
import { Controller, Control } from "react-hook-form";
import { Space } from "antd";
import {
  Card,
  Input,
  Select,
  UserTransfer,
  Button,
} from "@/components/ui/AntD";
import { Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import PresentationsField from "@/components/forms/thursday/PresentationsField";
import { BasicUser, ProductionInput } from "@/components/forms/schemas";

const { Text } = Typography;

const LOCATIONS = [
  { label: "Pozen Center", value: "Pozen Center" },
  { label: "Studio A", value: "Studio A" },
  { label: "Studio B", value: "Studio B" },
  { label: "Main Hall", value: "Main Hall" },
];

interface ProductionFormProps {
  productionIndex: number;
  control: any;
  users: BasicUser[];
}

export default function ProductionForm({
  productionIndex,
  control,
  users,
}: ProductionFormProps) {
  return (
    <Space orientation="vertical" style={{ width: "100%" }} size="large">
      <div>
        <Text strong style={{ display: "block", marginBottom: "8px" }}>
          Production Name
        </Text>
        <Controller
          control={control}
          name={`productions.${productionIndex}.name`}
          rules={{ required: "Production name is required" }}
          render={({ field, fieldState }) => (
            <>
              <Input 
                {...field} 
                placeholder="Enter production name" 
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
          Location
        </Text>
        <Controller
          control={control}
          name={`productions.${productionIndex}.location`}
          rules={{ required: "Location is required" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                placeholder="Select location"
                options={LOCATIONS}
                allowClear
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
          Producers & Faculty
        </Text>
        <Controller
          control={control}
          name={`productions.${productionIndex}.producers`}
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
        productionIndex={productionIndex}
        control={control}
        users={users}
      />
    </Space>
  );
}
