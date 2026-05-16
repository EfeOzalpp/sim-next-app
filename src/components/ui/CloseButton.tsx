import { CloseOutlined } from "@ant-design/icons";
import Block from "@/components/ui/Block";

interface CloseButtonProps {
  href: string;
}

export default function CloseButton({ href }: CloseButtonProps) {
  return (
    <Block
      as="a"
      href={href}
      pressable
      className="neo-brutal-button"
      aria-label="Close"
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}
    >
      <CloseOutlined style={{ fontSize: "1rem" }} />
    </Block>
  );
}
