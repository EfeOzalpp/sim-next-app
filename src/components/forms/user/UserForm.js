"use client";

import { useForm, Controller } from "react-hook-form";
import { Space, Typography, Divider } from "antd";
import { Input, TextArea, Switch, Card, Button, Alert } from "@/components/ui/AntD";
import { useState } from "react";
import { transformUserFromAPI } from "@/components/forms/user/user.transformers";
import ImageUpload from "@/components/ui/ImageUpload";
import DeleteButton from "@/components/ui/DeleteButton";
import { handleFormAction } from "@/helpers";

const { Text, Title } = Typography;

export default function UserForm({ 
  onSubmit, 
  onRemove, 
  user, 
  isCurrentUserAdmin = false 
}) {
  const initialValues = transformUserFromAPI(user) || {
    name: "",
    pronouns: "",
    image: "/face.jpg",
    email: "",
    link: "",
    about: "",
    admin: false,
  };

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialValues,
  });

  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    await handleFormAction(
      () => onSubmit(data),
      setError,
      "An error occurred while saving the user."
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

        <Card title={user ? "Edit Profile" : "Add New User"}>
          <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>Photo</Text>
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
              <Text type="secondary" italic style={{ fontSize: "12px", display: "block", marginTop: "4px" }}>
                {isCurrentUserAdmin 
                  ? "Admins can upload high resolution photos up to 8MB. They will be automatically downsized."
                  : "Contact SIM faculty to change your photo."
                }
              </Text>
            </div>

            <div>
              <Text strong>Full Name</Text>
              <Controller
                control={control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field, fieldState }) => (
                  <>
                    <Input {...field} placeholder="Enter name" status={fieldState.error ? "error" : ""} />
                    {fieldState.error && <Text type="danger">{fieldState.error.message}</Text>}
                  </>
                )}
              />
            </div>

            <div>
              <Text strong>Pronouns</Text>
              <Controller
                control={control}
                name="pronouns"
                render={({ field }) => <Input {...field} placeholder="e.g. they/them" />}
              />
            </div>

            <div>
              <Text strong>Email Address</Text>
              <Controller
                control={control}
                name="email"
                rules={{ 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
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
                      <Text type="secondary" italic style={{ fontSize: "12px", display: "block" }}>
                        Contact SIM faculty to change your email.
                      </Text>
                    )}
                    {fieldState.error && <Text type="danger">{fieldState.error.message}</Text>}
                  </>
                )}
              />
            </div>

            <div>
              <Text strong>Link</Text>
              <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>
                Social media, gallery of your artwork, etc.
              </Text>
              <Controller
                control={control}
                name="link"
                render={({ field }) => <Input {...field} placeholder="https://..." />}
              />
            </div>

            <div>
              <Text strong>About</Text>
              <Controller
                control={control}
                name="about"
                render={({ field }) => <TextArea {...field} rows={4} placeholder="Tell us about yourself..." />}
              />
            </div>

            {isCurrentUserAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Text strong>Admin Status</Text>
                <Controller
                  control={control}
                  name="admin"
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            )}
          </Space>
        </Card>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          style={{ width: "100%" }}
        >
          {isSubmitting ? "Saving..." : (user ? "Update User" : "Create User")}
        </Button>

        {user && isCurrentUserAdmin && onRemove && (
          <Card 
            title={<Title level={4} type="danger" style={{ margin: 0 }}>Danger Zone</Title>}
            style={{ borderColor: "#ffa39e", backgroundColor: "#fff2f0" }}
          >
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Text>
                This permanently removes the data of this user from the database altogether. 
                If you want to unlist this user from a semester but keep their data in the database, 
                go to the admin dashboard and edit the semester instead.
              </Text>
              <DeleteButton
                itemName="User"
                buttonText="Permanently Remove User"
                onConfirm={() => onRemove(user)}
              />
            </Space>
          </Card>
        )}
      </Space>
    </form>
  );
}
