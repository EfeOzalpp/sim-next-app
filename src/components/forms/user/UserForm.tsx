"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Space, Typography } from "antd";
import {
  Input,
  TextArea,
  Select,
  Card,
  Button,
  Alert,
  Checkbox,
} from "@/components/ui/AntD";
import { transformUserFromAPI } from "@/components/forms/user/user.transformers";
import ImageUpload from "@/components/ui/ImageUpload";
import DeleteButton from "@/components/ui/DeleteButton";
import { handleFormAction } from "@/helpers";
import { UserInput } from "@/components/forms/schemas";

const { Text, Title } = Typography;

interface UserFormProps {
  onSubmit: (data: UserInput) => Promise<any>;
  onRemove?: (user: any) => void;
  user?: any;
  isCurrentUserAdmin?: boolean;
  allSemesters?: any[];
}

export default function UserForm({
  onSubmit,
  onRemove,
  user,
  isCurrentUserAdmin = false,
  allSemesters = [],
}: UserFormProps) {
  const initialValues = transformUserFromAPI(user) || {
    name: "",
    pronouns: "",
    image: "/face.jpg",
    email: "",
    link: "",
    about: "",
    role: "STUDENT",
    semesterIds: allSemesters.length > 0 ? [allSemesters[0].id] : [],
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UserInput>({
    defaultValues: initialValues as any,
  });

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    await handleFormAction(
      () => onSubmit(data),
      setError,
      "An error occurred while saving the user.",
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Photo
            </Text>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageUpload
                  onChange={field.onChange}
                  currentImagePath={field.value}
                />
              )}
            />
            <Text
              type="secondary"
              italic
              style={{ fontSize: "12px", display: "block", marginTop: "4px" }}
            >
              {isCurrentUserAdmin
                ? "You can upload high resolution photos up to 8MB. They will be automatically downsized."
                : "Contact SIM faculty to change your photo."}
            </Text>
          </div>

          {isCurrentUserAdmin && (
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>Role</Text>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={[
                      { value: "STUDENT", label: "Student" },
                      { value: "STAFF", label: "Staff" },
                      { value: "ADMIN", label: "Admin" },
                    ]}
                  />
                )}
              />
            </div>
          )}
        </Space>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Full Name
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="Enter name"
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
            Pronouns
          </Text>
          <Controller
            control={control}
            name="pronouns"
            render={({ field }) => (
              <Input {...field} placeholder="e.g. they/them" />
            )}
          />
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Email Address
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  placeholder="email@example.com"
                  disabled={!isCurrentUserAdmin && user}
                  status={fieldState.error ? "error" : ""}
                />
                {!isCurrentUserAdmin && user && (
                  <Text
                    type="secondary"
                    italic
                    style={{ fontSize: "12px", display: "block" }}
                  >
                    Contact SIM faculty to change your email.
                  </Text>
                )}
                {fieldState.error && (
                  <Text type="danger">{fieldState.error.message}</Text>
                )}
              </>
            )}
          />
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            Link
          </Text>
          <Text
            type="secondary"
            style={{
              fontSize: "12px",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Social media, gallery of your presentations, etc.
          </Text>
          <Controller
            control={control}
            name="link"
            render={({ field }) => (
              <Input {...field} placeholder="https://..." />
            )}
          />
        </div>

        <div>
          <Text strong style={{ display: "block", marginBottom: "8px" }}>
            About
          </Text>
          <Controller
            control={control}
            name="about"
            render={({ field }) => (
              <TextArea
                {...field}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            )}
          />
        </div>

        {isCurrentUserAdmin && allSemesters.length > 0 && (
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Semesters Enrolled
            </Text>
            <Card
              styles={{
                body: {
                  padding: "12px",
                  maxHeight: "200px",
                  overflowY: "auto",
                },
              }}
            >
              <Controller
                control={control}
                name="semesterIds"
                render={({ field }) => (
                  <Checkbox.Group
                    {...field}
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {allSemesters.map((semester) => (
                      <Checkbox key={semester.id} value={semester.id}>
                        {semester.name}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )}
              />
            </Card>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} style={{ width: "100%" }}>
          {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>

        {user && isCurrentUserAdmin && onRemove && (
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
                This permanently removes the data of this user from the database
                altogether. If you want to unlist this user from a semester but
                keep their data in the database, go to the admin dashboard and
                edit the semester instead.
              </Text>
              <DeleteButton
                itemName={user.name + "?"}
                buttonText="Permanently remove User"
                onConfirm={() => onRemove(user)}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
