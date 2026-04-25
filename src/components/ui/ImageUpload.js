"use client";

import { useState, useEffect } from "react";
import { Upload } from "@/components/ui/AntD";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

export default function ImageUpload({ onChange, currentImagePath = "/face.jpg" }) {
	const [preview, setPreview] = useState(null);
	const [loading, setLoading] = useState(false);

	const MAX_SIZE_MB = 8;
	const TARGET_WIDTH = 400;

	useEffect(() => {
		if (currentImagePath) {
			setPreview(currentImagePath);
		}
	}, [currentImagePath]);

	const beforeUpload = (file) => {
		const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
		if (!isJpgOrPng) {
			return false;
		}
		const isLt8M = file.size / 1024 / 1024 < MAX_SIZE_MB;
		if (!isLt8M) {
			return false;
		}

		setLoading(true);
		const reader = new FileReader();
		reader.onload = (event) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const scale = TARGET_WIDTH / img.width;
				canvas.width = TARGET_WIDTH;
				canvas.height = img.height * scale;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(
					(blob) => {
						const resizedFile = new File([blob], file.name, {
							type: "image/jpeg",
							lastModified: Date.now(),
						});
						setPreview(URL.createObjectURL(resizedFile));
						onChange(resizedFile);
						setLoading(false);
					},
					"image/jpeg",
					0.8
				);
			};
			img.src = event.target.result;
		};
		reader.readAsDataURL(file);

		return false; // Prevent auto upload
	};

	const uploadButton = (
		<div style={{ padding: "20px" }}>
			{loading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload Photo</div>
		</div>
	);

	return (
		<Upload
			listType="picture-card"
			showUploadList={false}
			beforeUpload={beforeUpload}
			style={{ width: 120, height: 120, overflow: "hidden" }}
		>
			{preview ? (
				<img 
					src={preview} 
					alt="avatar" 
					style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} 
				/>
			) : (
				uploadButton
			)}
		</Upload>
	);
}
