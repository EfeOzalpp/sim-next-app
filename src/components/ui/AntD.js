"use client";

import {
	Input as AntInput,
	Select as AntSelect,
	Switch as AntSwitch,
	Card as AntCard,
	DatePicker as AntDatePicker,
	Button as AntButton,
	Transfer as AntTransfer,
	Upload as AntUpload,
	Alert as AntAlert,
	Collapse as AntCollapse,
	Modal as AntModal,
	Divider as AntDivider,
	Table as AntTable,
} from "antd";
import Block from "@/components/ui/Block";
import clsx from "clsx";
import Link from "next/link";

export function Button({ href, onClick, children, type, htmlType, ...props }) {
	// Map type="submit" to htmlType="submit" for AntD compatibility
	const finalHtmlType = htmlType || (type === "submit" ? "submit" : undefined);
	const finalType = type === "submit" ? "primary" : type;

	return (
		<Block as={AntButton} href={href} onClick={onClick} htmlType={finalHtmlType} type={finalType} {...props} pressable={true}>
			{children}
		</Block>
	);
}

export function Input(props) {
	return (
		<Block as={AntInput} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function TextArea(props) {
	return (
		<Block as={AntInput.TextArea} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function Select(props) {
	return (
		<Block as={AntSelect} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function DatePicker(props) {
	return (
		<Block as={AntDatePicker} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function RangePicker(props) {
	return (
		<Block as={AntDatePicker.RangePicker} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function Switch(props) {
	return <AntSwitch {...props} />;
}

export function Alert(props) {
	return <AntAlert className="neo-brutal" style={{ background: "white", color: "inherit" }} {...props} />;
}

export function Collapse(props) {
	return <AntCollapse className="neo-brutal" style={{ background: "white" }} {...props} />;
}

export function Card({ children, className, ...props }) {
	return (
		<div className="neo-brutal" style={{ cursor: "default", background: "white", color: "inherit", fontWeight: "normal" }}>
			<AntCard className={clsx("neo-card", className)} variant="borderless" {...props}>
				{children}
			</AntCard>
		</div>
	);
}

export function UserTransfer({ users, selectedUserKeys, setSelectedUserKeys, ...props }) {
	const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
	const usersWithKeys = sortedUsers.map((user) => ({
		...user,
		key: user.id,
	}));

	return (
		<AntTransfer
			className="neo-transfer"
			{...props}
			dataSource={usersWithKeys}
			targetKeys={selectedUserKeys}
			onChange={setSelectedUserKeys}
			oneWay
			showSearch
			render={(item) => item.name}
		/>
	);
}

export function Upload(props) {
	return (
		<Block as={AntUpload} {...props} pressable={true} />
	);
}

export function Modal({ children, ...props }) {
	return (
		<AntModal
			{...props}
			modalRender={(modal) => (
				<div className="neo-brutal" style={{ background: "white", padding: 0, borderRadius: "5px" }}>
					{modal}
				</div>
			)}
			okButtonProps={{ 
				className: "neo-brutal neo-pressable", 
				style: { background: "var(--neo-bg-orange)", border: "none" }, 
				...props.okButtonProps 
			}}
			cancelButtonProps={{ 
				className: "neo-brutal neo-pressable", 
				style: { background: "white", color: "#222", border: "none" }, 
				...props.cancelButtonProps 
			}}
		/>
	);
}

export function Divider(props) {
	return <AntDivider style={{ borderColor: "#222", borderWidth: "2px", ...props.style }} {...props} />;
}

export function Table(props) {
	return (
		<div className="neo-brutal" style={{ background: "white", padding: 0 }}>
			<AntTable
				{...props}
				pagination={false}
				rowClassName={() => "neo-table-row"}
				className={clsx("neo-table", props.className)}
			/>
		</div>
	);
}
