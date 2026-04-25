import styles from "@/components/ui/Block.module.css";
import { forwardRef } from "react";
import clsx from "clsx";
import Link from "next/link";

const Block = forwardRef(function Block(props, ref) {
	const { as = "button", children, className, disabled, onClick, depth, pressable = false, href, ...rest } = props;

	const style = depth ? { "--neo-depth": `${depth}px` } : {};

	const finalClassName = clsx(
		"neo-brutal",
		pressable && "neo-pressable",
		className
	);

	const isLink = href && !disabled;

	// Determine the component to use.
	// If it's an active link and using a default tag (button/a), we use Link directly
	// as the component to follow Next.js 13+ best practices and avoid nesting <a> tags.
	let Component;
	if (isLink && (as === "button" || as === "a")) {
		Component = Link;
	} else if (href && as === "button") {
		// Use "a" for disabled links or when explicitly requested
		Component = "a";
	} else {
		Component = as;
	}

	// We wrap in a Link component only if we're not using Link as the base Component
	const shouldWrap = isLink && Component !== Link;

	const element = (
		<Component
			{...rest}
			ref={ref}
			className={finalClassName}
			disabled={disabled}
			onClick={onClick}
			// Only pass href if it's the Link component itself or if it's not being wrapped
			{...(href && !shouldWrap ? { href } : {})}
		>
			{children}
		</Component>
	);

	return (
		<div className={clsx(styles.wrapper, disabled && styles.disabled)} style={style}>
			{shouldWrap ? (
				<Link href={href}>
					{element}
				</Link>
			) : (
				element
			)}
		</div>
	);
});

export default Block;
