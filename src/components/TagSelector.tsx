import { Form } from "react-bootstrap";
import type { Tag } from "../types/post";

type Props = {
  tags: Tag[];
  selectedTags: number[];
  onChange: (tags: number[]) => void;
};

export function TagSelector({
  tags,
  selectedTags,
  onChange,
}: Props) {
  function handleChange(id: number) {
    if (selectedTags.includes(id)) {
      onChange(
        selectedTags.filter((t) => t !== id)
      );
    } else {
      onChange([
        ...selectedTags,
        id,
      ]);
    }
  }

  return (
    <>
      {tags.map((tag) => (
        <Form.Check
          key={tag.id}
          type="checkbox"
          label={tag.name}
          checked={selectedTags.includes(
            tag.id
          )}
          onChange={() =>
            handleChange(tag.id)
          }
        />
      ))}
    </>
  );
}