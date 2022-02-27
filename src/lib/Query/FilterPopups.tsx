import { Checkbox, Form } from "semantic-ui-react";
import { useFieldValues } from "../Amcat";
import { AmcatField, AmcatFilter, AmcatIndex, DateFilter } from "../interfaces";
import DatePicker from "./DatePicker";

interface FilterPopupProps {
  index: AmcatIndex;
  field: AmcatField;
  value: AmcatFilter;
  onChange: (value: AmcatFilter) => void;
}

export function filterLabel(field: AmcatField, filter: AmcatFilter, includeName = false) {
  if (field == null) return "";
  const name = includeName ? `${field.name} ` : "";
  if (field.type === "date") {
    if (filter.gte && filter.lte) return `${name}${filter.gte} - ${filter.lte}`;
    if (filter.gte) return `${name}from ${filter.gte}`;
    if (filter.lte) return `${name}until ${filter.lte}`;
  } else {
    if (filter.values && filter.values.length > 2) return `${name}${filter.values.slice(0, 2)},…`;
    if (filter.values && filter.values.length > 0) return `${name}${filter.values}`;
  }

  return `select ${field.name}`;
}

export function FilterPopup({ index, field, value, onChange }: FilterPopupProps) {
  if (field.type === "date") return DateRangePopup({ index, field, value, onChange });
  return KeywordPopup({ index, field, value, onChange });
}

export function KeywordPopup({ index, field, value, onChange }: FilterPopupProps) {
  const values = useFieldValues(index, field.name);
  const selected = value?.values || [];
  if (values === []) return null;
  console.log({ field, values });
  function handleChange(v: string, checked: any) {
    if (checked && !selected.includes(v)) onChange({ values: [...selected, v] });
    if (!checked && selected.includes(v)) onChange({ values: selected.filter((x) => x !== v) });
  }
  return (
    <Form>
      {values.map((v, i) => (
        <>
          <Checkbox
            key={i}
            values={i}
            checked={selected.includes(v)}
            label={v}
            onChange={(_, { checked }) => handleChange(v, checked)}
          />
          <br key={-1 - i} />
        </>
      ))}
    </Form>
  );
}

function date2str(date: Date, ifNone = ""): string {
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + "-" + month + "-" + day;
}

export function DateRangePopup({ value, onChange }: FilterPopupProps) {
  const handleChange = (key: keyof DateFilter, newval: Date) => {
    let result = { ...value };
    if (newval == null) delete result[key];
    else result[key] = date2str(newval);
    onChange(result);
  };
  return (
    <>
      <Form.Field>
        <DatePicker
          label={"from date"}
          value={value.gte}
          onChange={(newval: Date) => handleChange("gte", newval)}
        />
      </Form.Field>
      <Form.Field>
        <DatePicker
          label={"to date"}
          value={value.lte}
          onChange={(newval: Date) => handleChange("lte", newval)}
        />
      </Form.Field>
    </>
  );
}