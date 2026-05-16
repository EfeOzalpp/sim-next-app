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
	Checkbox as AntCheckbox,
	InputProps,
	SelectProps,
	SwitchProps,
	CardProps,
	DatePickerProps,
	ButtonProps as AntButtonProps,
	TransferProps,
	UploadProps,
	AlertProps,
	CollapseProps,
	ModalProps,
	DividerProps,
	TableProps,
	CheckboxProps,
} from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import Block from "@/components/ui/Block";
import clsx from "clsx";

export interface ButtonProps extends Omit<AntButtonProps, "type"> {
	href?: string;
	type?: AntButtonProps["type"] | "submit";
}

export function Button({ href, onClick, children, type, htmlType, className, ...props }: ButtonProps) {
	const finalHtmlType = htmlType || (type === "submit" ? "submit" : undefined);
	const finalType = type === "submit" ? "primary" : type;

	return (
		<Block 
			as={AntButton} 
			href={href} 
			onClick={onClick as any} 
			htmlType={finalHtmlType} 
			type={finalType as any} 
			className={clsx(!className?.includes("GreyButton") && !className?.includes("neo-green") && !className?.includes("neo-red") && "neo-orange", "neo-brutal-button", className)}
			{...props} 
			pressable={true}
		>
			{children}
		</Block>
	);
}

export function Input(props: InputProps) {
	return (
		<Block as={AntInput} size="large" className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function TextArea(props: any) {
	return (
		<Block as={AntInput.TextArea} size="large" className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function Select(props: SelectProps) {
	return (
		<Block as={AntSelect} size="large" className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function DatePicker(props: DatePickerProps) {
	return (
		<Block as={AntDatePicker} className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function RangePicker(props: RangePickerProps) {
	return (
		<Block as={AntDatePicker.RangePicker} size="large" className="neo-brutal-input" variant="borderless" {...props} pressable={true} />
	);
}

export function Switch(props: SwitchProps) {
	return <AntSwitch {...props} />;
}

export function Alert(props: AlertProps) {
	return <AntAlert className="neo-brutal" style={{ background: "white", color: "inherit" }} {...props} />;
}

export function Collapse(props: CollapseProps) {
	return <AntCollapse className="neo-brutal" style={{ background: "white" }} {...props} />;
}

export function Card({ children, className, ...props }: CardProps) {
	return (
		<div className="neo-brutal" style={{ cursor: "default", background: "white", color: "inherit", fontWeight: "normal" }}>
			<AntCard className={clsx("neo-card", className)} variant="borderless" {...props}>
				{children}
			</AntCard>
		</div>
	);
}

interface UserTransferProps extends Omit<TransferProps<any>, "dataSource" | "targetKeys" | "onChange"> {
	users: any[];
	selectedUserKeys: string[];
	setSelectedUserKeys: (keys: string[]) => void;
}

export function UserTransfer({ users, selectedUserKeys, setSelectedUserKeys, ...props }: UserTransferProps) {
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
			onChange={setSelectedUserKeys as any}
			oneWay
			showSearch
			render={(item) => item.name}
		/>
	);
}

export function Upload(props: UploadProps) {
	return (
		<Block as={AntUpload} {...props} pressable={true} />
	);
}

export function Modal({ children, ...props }: ModalProps) {
	return (
		<AntModal
			{...props}
			modalRender={(modal) => (
				<div className="neo-brutal" style={{ background: "white", padding: 0, borderRadius: "5px" }}>
					{modal}
				</div>
			)}
			okButtonProps={{
				className: "neo-brutal-button neo-pressable neo-orange",
				style: { border: "none" },
				...props.okButtonProps
			}}
			cancelButtonProps={{
				className: "neo-brutal-button neo-pressable neo-orange",
				style: { border: "none" },
				...props.cancelButtonProps
			}}
		>
			{children}
		</AntModal>
	);
}

export function Divider(props: DividerProps) {
	return <AntDivider style={{ borderColor: "#222", borderWidth: "2px", ...props.style }} {...props} />;
}

export function Table(props: TableProps<any>) {
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

export function Checkbox(props: CheckboxProps) {
	return <AntCheckbox {...props} />;
}

Checkbox.Group = AntCheckbox.Group;
